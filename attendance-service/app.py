# ============================================================================
# app.py — face-recognition service (matching-only, no attendance/DB writes
# beyond reading enrolled vectors). Two real endpoints: /verify (1-to-1
# punch check) and /enroll (compute-only, for registering a new face).
#
# NestJS owns every actual write to RawPunches / FaceVerificationAttempts /
# EmployeeFaceVectors — this service only ever reads and computes.
# ============================================================================
 
from fastapi import FastAPI, File, UploadFile, Form
from typing import List
import face_recognition
import numpy as np
import cv2
import base64
import time
from db_config import get_db_connection
 
app = FastAPI()
 
FACE_MATCH_TOLERANCE = 0.48
EXPECTED_VECTOR_DIMENSION = 128
MODEL_VERSION = "dlib-face-recognition-v1"
 
# TIGHTENED from 0.55 — a confirmed false accept on 2026-08-13
# (FaceVerificationAttempts.ID 65: two different employees, distance
# 0.478, matched at the old 0.55 tolerance) showed 0.55 was too loose.
# dlib's own commonly-cited default is 0.6, so 0.55 was already stricter
# than default and still let this through; 0.48 would have correctly
# rejected that exact case. Combined with the full-resolution re-encoding
# and multi-frame consensus below, not just a threshold change on its own.
 
# Mechanical conversion of the distance tolerance above into a 0-100
# percentage, purely so FaceVerificationAttempts.ConfidenceScore /
# ThresholdUsed stay mathematically consistent with this service's own
# matching logic. NOT necessarily the number your team would pick if asked
# "what % confidence should we require" as a standalone decision — worth
# confirming with whoever owns that call, separately from this default.
THRESHOLD_PERCENT = round((1 - FACE_MATCH_TOLERANCE) * 100, 2)  # 45.00
 
# Eye Aspect Ratio (EAR) liveness settings — EAR stays roughly constant
# (~0.25-0.35) while eyes are open, and dips sharply (below ~0.20) for a
# moment during a real blink. A static photo held up to the camera produces
# the same EAR every frame, physically incapable of producing this dip.
EAR_CLOSED_THRESHOLD = 0.21
MIN_EAR_VARIATION = 0.06
 
# ── Enrollment quality gate ──────────────────────────────────────────────
# Rejects individual captures that are clearly poor quality BEFORE they
# ever become a stored template — a bad reference template increases
# false-accept risk independent of anything else in the matching pipeline.
 
# A detected face bounding box narrower than this fraction of the frame
# width means the person is too far from the camera / poorly framed.
MIN_FACE_WIDTH_FRACTION = 0.15
 
# Laplacian variance is a standard, well-established blur metric: it
# measures how much edge detail is present. A sharp, in-focus image has
# lots of high-frequency edge content (high variance); a blurry image has
# smoothed-out edges (low variance).
#
# LOWERED again — real testing showed a genuine capture (frame 0, the
# easiest "Front" angle) scoring 26.1, just barely under the previous
# 30.0 line. That's too close a margin for normal capture variance.
# Giving real captures more headroom rather than sitting right on the
# edge of rejecting a perfectly usable frame.
BLUR_VARIANCE_THRESHOLD = 20.0
 
 
def is_face_too_small(location: tuple[int, int, int, int], frame_width: int) -> bool:
    top, right, bottom, left = location
    face_width = right - left
    return (face_width / frame_width) < MIN_FACE_WIDTH_FRACTION
 
 
def is_blurry(frame_rgb: np.ndarray) -> tuple[bool, float]:
    """Returns (is_blurry, variance) — the variance is returned too so the
    caller can log real observed values for threshold calibration."""
    gray = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance < BLUR_VARIANCE_THRESHOLD, variance
 
 
def eye_aspect_ratio(eye_points: list[tuple[int, int]]) -> float:
    """Standard 6-point EAR formula."""
    p1, p2, p3, p4, p5, p6 = [np.array(p) for p in eye_points]
    vertical_1 = np.linalg.norm(p2 - p6)
    vertical_2 = np.linalg.norm(p3 - p5)
    horizontal = np.linalg.norm(p1 - p4)
    if horizontal == 0:
        return 0.0
    return (vertical_1 + vertical_2) / (2.0 * horizontal)
 
 
# PERFORMANCE — running dlib's detector at full webcam resolution (often
# 1280x720+) is unnecessarily expensive; detector cost scales with pixel
# area. Downscaling to a fixed working width before detection is a
# standard, low-risk speedup for face_recognition pipelines. EAR (used for
# liveness) is a ratio, so it's unaffected by scale. Matching accuracy at
# this width is still well within normal working range for this library.
DETECTION_MAX_WIDTH = 480
 
 
def resize_for_detection(frame_rgb: np.ndarray) -> tuple[np.ndarray, float]:
    """Returns (downscaled_frame, scale_factor). scale_factor is what you
    multiply a location found on the small frame by, to get the
    corresponding location on the ORIGINAL full-resolution frame."""
    h, w = frame_rgb.shape[:2]
    if w <= DETECTION_MAX_WIDTH:
        return frame_rgb, 1.0
    scale_down = DETECTION_MAX_WIDTH / float(w)
    new_size = (DETECTION_MAX_WIDTH, int(h * scale_down))
    small = cv2.resize(frame_rgb, new_size, interpolation=cv2.INTER_AREA)
    scale_up = 1.0 / scale_down  # multiply small-frame coords by this to get original coords
    return small, scale_up
 
 
def scale_location(location: tuple[int, int, int, int], scale: float) -> tuple[int, int, int, int]:
    """face_recognition locations are (top, right, bottom, left) in pixels."""
    top, right, bottom, left = location
    return (
        int(round(top * scale)),
        int(round(right * scale)),
        int(round(bottom * scale)),
        int(round(left * scale)),
    )
 
 
def prepare_frames(frames_rgb: list[np.ndarray]) -> list[dict]:
    """Runs face detection EXACTLY ONCE per frame, on a downscaled copy,
    and hands that same result to both the liveness check and the
    matching step below — instead of each one independently re-detecting
    the face from scratch (previously up to 2x full-resolution detection
    passes per frame).
 
    ACCURACY FIX — also carries the ORIGINAL full-resolution frame plus
    locations mapped back up to that resolution. Liveness (EAR) is a
    ratio, unaffected by scale, so it still uses the small copy. But the
    actual identity MATCH now runs on full detail — using the downscaled
    copy for that step was quietly throwing away facial detail on exactly
    the computation that decides "is this really you"."""
    prepared = []
    for frame in frames_rgb:
        small, scale = resize_for_detection(frame)
        locations_small = face_recognition.face_locations(small)
        locations_original = [scale_location(loc, scale) for loc in locations_small]
        prepared.append({
            "original": frame,
            "small": small,
            "locations": locations_small,
            "locations_original": locations_original,
        })
    return prepared
 
 
def check_liveness(prepared_frames: list[dict]) -> bool:
    """True only if the eyes in this sequence show a genuine
    open -> closed -> open pattern, not a constant, unchanging EAR."""
    ear_sequence = []
 
    for entry in prepared_frames:
        if not entry["locations"]:
            continue
        # Passing known locations skips face_landmarks()'s own internal
        # detection pass — this is the main duplicate-work fix.
        landmarks_list = face_recognition.face_landmarks(entry["small"], face_locations=entry["locations"])
        if not landmarks_list:
            continue
        landmarks = landmarks_list[0]
        if "left_eye" not in landmarks or "right_eye" not in landmarks:
            continue
        left_ear = eye_aspect_ratio(landmarks["left_eye"])
        right_ear = eye_aspect_ratio(landmarks["right_eye"])
        ear_sequence.append((left_ear + right_ear) / 2.0)
 
    if len(ear_sequence) < 5:
        return False  # too few usable frames to say anything meaningful
 
    variation = max(ear_sequence) - min(ear_sequence)
    had_a_closed_moment = min(ear_sequence) < EAR_CLOSED_THRESHOLD
    return variation >= MIN_EAR_VARIATION and had_a_closed_moment
 
 
def decode_frames(files: list[bytes]) -> list[np.ndarray]:
    frames_rgb = []
    for contents in files:
        np_array = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        if frame is not None:
            frames_rgb.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    return frames_rgb
 
 
def get_active_vectors_for_employee(employee_id: str) -> list[tuple[int, np.ndarray]]:
    """GALLERY LOOKUP — returns ALL of this employee's active, compatible
    templates as (FaceVectorID, vector) pairs, not just one blended
    vector. The ID is carried alongside so /verify can report exactly
    which template produced the winning match, instead of leaving
    FaceVerificationAttempts.FaceVectorID always NULL."""
    conn = get_db_connection()
    if conn is None:
        return []
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT ID, FaceVector, VectorDimension
            FROM EmployeeFaceVectors
            WHERE EmployeeID = ? AND IsActive = 1
        """, employee_id)
        rows = cursor.fetchall()
        cursor.close()
 
        vectors = []
        for face_vector_id, face_vector_bytes, vector_dimension in rows:
            if vector_dimension != EXPECTED_VECTOR_DIMENSION:
                print(f"WARNING: {employee_id} has a stored template with {vector_dimension} "
                      f"dimensions, expected {EXPECTED_VECTOR_DIMENSION}. Skipping it.")
                continue
            vectors.append((face_vector_id, np.frombuffer(face_vector_bytes, dtype=np.float64)))
        return vectors
    finally:
        conn.close()
 
 
@app.post("/verify")
async def verify_face(
    employeeId: str = Form(...),
    frames: List[UploadFile] = File(...),
):
    """1-to-1 punch verification: is the person in front of the camera
    really the employee who's logged in? Returns everything NestJS needs
    to log a full FaceVerificationAttempts row, whatever the outcome."""
    t_start = time.perf_counter()
 
    known_vectors = get_active_vectors_for_employee(employeeId)
    if not known_vectors:
        return {"verified": False, "noVectorOnFile": True}
    t_vector_lookup = time.perf_counter()
 
    file_bytes = [await f.read() for f in frames]
    t_read = time.perf_counter()
    frames_rgb = decode_frames(file_bytes)
    t_decoded = time.perf_counter()
 
    if not frames_rgb:
        return {
            "verified": False,
            "matchResult": "Error",
            "livenessCheckPassed": False,
            "confidenceScore": 0.0,
            "thresholdUsed": THRESHOLD_PERCENT,
        }
 
    # Detection now happens ONCE per frame here, on a downscaled copy —
    # both the liveness check and the matching step below reuse this same
    # result instead of each re-detecting the face from scratch.
    prepared = prepare_frames(frames_rgb)
    t_prepared = time.perf_counter()
 
    liveness_passed = check_liveness(prepared)
    t_liveness = time.perf_counter()
 
    if not liveness_passed:
        print(f"[TIMING] vectorLookup={t_vector_lookup-t_start:.2f}s read={t_read-t_vector_lookup:.2f}s cv2decode={t_decoded-t_read:.2f}s prepare={t_prepared-t_decoded:.2f}s "
              f"liveness={t_liveness-t_prepared:.2f}s total={t_liveness-t_start:.2f}s (stopped at liveness)")
        return {
            "verified": False,
            "livenessFailed": True,
            "matchResult": "LivenessFailed",
            "livenessCheckPassed": False,
            "confidenceScore": 0.0,
            "thresholdUsed": THRESHOLD_PERCENT,
        }
 
    # GALLERY MATCHING — for each live frame, compute its distance to
    # EVERY template in the employee's gallery and keep only the closest
    # one, ALONG WITH which template (FaceVectorID) produced it. This is
    # what makes multiple enrollment angles actually useful: a live frame
    # at a slight angle should reasonably match its closest gallery
    # counterpart, not be forced to match a single blended average that
    # represents no real pose well.
    candidate_results: list[tuple[float, int]] = []  # (distance, FaceVectorID)
    gallery_vectors = [v for _, v in known_vectors]
    gallery_ids = [vid for vid, _ in known_vectors]
    for entry in reversed(prepared):
        if len(candidate_results) >= 3:
            break
        if not entry["locations_original"]:
            continue
        encodings = face_recognition.face_encodings(
            entry["original"], known_face_locations=[entry["locations_original"][0]]
        )
        if encodings:
            distances_to_gallery = face_recognition.face_distance(gallery_vectors, encodings[0])
            best_index = int(np.argmin(distances_to_gallery))
            candidate_results.append((float(distances_to_gallery[best_index]), gallery_ids[best_index]))
    t_encoded = time.perf_counter()
 
    if not candidate_results:
        print(f"[TIMING] vectorLookup={t_vector_lookup-t_start:.2f}s read={t_read-t_vector_lookup:.2f}s cv2decode={t_decoded-t_read:.2f}s prepare={t_prepared-t_decoded:.2f}s "
              f"liveness={t_liveness-t_prepared:.2f}s encode={t_encoded-t_liveness:.2f}s "
              f"total={t_encoded-t_start:.2f}s (no encoding found)")
        return {
            "verified": False,
            "matchResult": "Error",
            "livenessCheckPassed": True,
            "confidenceScore": 0.0,
            "thresholdUsed": THRESHOLD_PERCENT,
        }
 
    # Two complementary mechanisms at work: gallery matching (above) finds
    # each frame's BEST match across all enrolled angles; multi-frame
    # consensus (here) requires multiple LIVE frames to independently
    # agree before accepting — so neither one unlucky live frame, nor one
    # generously-matching gallery template alone, can decide the outcome.
    # With 3 frames evaluated, at least 2 must independently clear the
    # tolerance. With only 2 available, both must agree (less evidence
    # available, held to a stricter bar). With only 1 available (sparse
    # detection — poor lighting, etc.), that single frame decides.
    passing = [(d, vid) for d, vid in candidate_results if d <= FACE_MATCH_TOLERANCE]
    if len(candidate_results) >= 3:
        matched = len(passing) >= 2
    elif len(candidate_results) == 2:
        matched = len(passing) == 2
    else:
        matched = len(passing) == 1
 
    # Reported confidence is the AVERAGE across every frame actually
    # evaluated (not just the passing ones) — represents overall certainty
    # across the consensus, not just the best-case single frame.
    all_distances = [d for d, _ in candidate_results]
    avg_distance = sum(all_distances) / len(all_distances)
    confidence_percent = round(max(0.0, (1 - avg_distance)) * 100, 2)
 
    # NEW — which specific gallery template gets the credit for this
    # match, for FaceVerificationAttempts.FaceVectorID. Picked as the ID
    # behind the single closest-matching passing frame (the strongest
    # piece of evidence), and only set at all when the punch actually
    # matched — a rejected attempt has no real "matched template" to
    # attribute, even though something was numerically closest.
    matched_face_vector_id = None
    if matched and passing:
        matched_face_vector_id = min(passing, key=lambda x: x[0])[1]
 
    employee_name = None
    if matched:
        conn = get_db_connection()
        if conn is not None:
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT FullName FROM Employee WHERE EmployeeID = ?", employeeId)
                row = cursor.fetchone()
                employee_name = row[0] if row else None
                cursor.close()
            finally:
                conn.close()
    t_total = time.perf_counter()
 
    print(f"[TIMING] vectorLookup={t_vector_lookup-t_start:.2f}s read={t_read-t_vector_lookup:.2f}s cv2decode={t_decoded-t_read:.2f}s prepare={t_prepared-t_decoded:.2f}s "
          f"liveness={t_liveness-t_prepared:.2f}s encode={t_encoded-t_liveness:.2f}s "
          f"total={t_total-t_start:.2f}s frames={len(frames_rgb)} "
          f"consensus={len(passing)}/{len(candidate_results)} distances={[round(d, 3) for d, _ in candidate_results]} "
          f"matchedFaceVectorId={matched_face_vector_id}")
 
    return {
        "verified": matched,
        "employeeName": employee_name,
        "matchResult": "Matched" if matched else "NoMatch",
        "livenessCheckPassed": True,
        "confidenceScore": confidence_percent,
        "thresholdUsed": THRESHOLD_PERCENT,
        "matchedFaceVectorId": matched_face_vector_id,
    }
 
 
@app.post("/enroll/check-frame")
async def check_enrollment_frame(frame: UploadFile = File(...)):
    """Lightweight, SINGLE-frame quality check for live feedback during
    enrollment — fires once per step, right after each capture. Runs the
    same detection + quality gate as /enroll, but deliberately skips
    computing the actual face encoding (not needed for a quality check,
    and keeps this fast enough to call once per step without slowing
    down the capture flow).
 
    This is NOT the source of truth — the real /enroll call at the end
    re-validates every photo properly and is what actually saves
    anything. This endpoint only exists to tell the employee "that one
    looked good" or "too blurry, try that angle again" immediately,
    instead of finding out only after all 5 steps are done."""
    contents = await frame.read()
    np_array = np.frombuffer(contents, np.uint8)
    decoded = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    if decoded is None:
        return {"passed": False, "reason": "unreadable", "message": "Couldn't read that photo. Please try again."}
 
    frame_rgb = cv2.cvtColor(decoded, cv2.COLOR_BGR2RGB)
    locations = face_recognition.face_locations(frame_rgb)
    if not locations:
        return {"passed": False, "reason": "no_face", "message": "No face detected — make sure you're facing the camera."}
 
    location = locations[0]
    frame_width = frame_rgb.shape[1]
 
    if is_face_too_small(location, frame_width):
        return {"passed": False, "reason": "too_small", "message": "Move a little closer to the camera."}
 
    blurry, _variance = is_blurry(frame_rgb)
    if blurry:
        return {"passed": False, "reason": "blurry", "message": "Too blurry — hold still and try again."}
 
    return {"passed": True, "reason": None, "message": "Captured clearly."}
 
 
@app.post("/enroll")
async def enroll_face(frames: List[UploadFile] = File(...)):
    """Computes a face vector from each enrollment photo INDIVIDUALLY —
    does NOT blend them into one average. Each capture that passes the
    quality gate becomes its own separate template in the returned list,
    for NestJS to save as its own row via USP_EnrollEmployeeFaceVector
    (called once per template). Does NOT write to the database itself.
 
    ANGLE LABELS — the frontend names each uploaded file after its
    capture step (e.g. "front.jpg", "right.jpg"). Deliberately decoding
    files one at a time here (not via the shared decode_frames helper,
    which silently drops any frame that fails to decode) so each frame
    stays explicitly paired with its own filename — a single corrupt
    upload can't misalign every label after it."""
    labeled_frames: list[tuple[str | None, np.ndarray]] = []
    for f in frames:
        contents = await f.read()
        np_array = np.frombuffer(contents, np.uint8)
        decoded = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        if decoded is None:
            continue
        frame_rgb = cv2.cvtColor(decoded, cv2.COLOR_BGR2RGB)
        angle_label = f.filename.rsplit(".", 1)[0] if f.filename else None
        labeled_frames.append((angle_label, frame_rgb))
 
    if not labeled_frames:
        return {"success": False, "message": "Couldn't read any of the captured photos. Please try again."}
 
    vectors: list[dict] = []  # each: {"angleLabel": str | None, "vectorBase64": str}
    rejected_too_small = 0
    rejected_blurry = 0
    rejected_no_face = 0
 
    for i, (angle_label, frame) in enumerate(labeled_frames):
        locations = face_recognition.face_locations(frame)
        if not locations:
            rejected_no_face += 1
            print(f"[ENROLL DEBUG] frame {i} ({angle_label}): no face detected")
            continue
 
        location = locations[0]
        frame_width = frame.shape[1]
        top, right, bottom, left = location
        face_width_fraction = (right - left) / frame_width
 
        # QUALITY GATE — reject before this capture ever becomes a stored
        # template. A blurry or poorly-framed reference template makes
        # every future verification against it less reliable, independent
        # of the match threshold itself.
        if is_face_too_small(location, frame_width):
            rejected_too_small += 1
            print(f"[ENROLL DEBUG] frame {i} ({angle_label}): face too small (width fraction={face_width_fraction:.3f}, "
                  f"need >= {MIN_FACE_WIDTH_FRACTION})")
            continue
 
        blurry, variance = is_blurry(frame)
        if blurry:
            rejected_blurry += 1
            print(f"[ENROLL DEBUG] frame {i} ({angle_label}): too blurry (variance={variance:.1f}, "
                  f"need >= {BLUR_VARIANCE_THRESHOLD})")
            continue
 
        print(f"[ENROLL DEBUG] frame {i} ({angle_label}): PASSED (face width fraction={face_width_fraction:.3f}, "
              f"blur variance={variance:.1f})")
 
        encodings = face_recognition.face_encodings(frame, known_face_locations=[location])
        if encodings:
            vector_bytes = encodings[0].astype(np.float64).tobytes()
            vectors.append({
                "angleLabel": angle_label,
                "vectorBase64": base64.b64encode(vector_bytes).decode("ascii"),
            })
 
    # Same minimum as before (2 usable captures) — now applied to how many
    # INDIVIDUAL templates passed the quality gate, not how many went into
    # a blend.
    if len(vectors) < 2:
        reasons = []
        if rejected_no_face:
            reasons.append(f"{rejected_no_face} had no detectable face")
        if rejected_too_small:
            reasons.append(f"{rejected_too_small} were too far from the camera")
        if rejected_blurry:
            reasons.append(f"{rejected_blurry} were too blurry")
        detail = f" ({', '.join(reasons)})" if reasons else ""
        return {
            "success": False,
            "message": f"Only got {len(vectors)} of {len(labeled_frames)} usable photos{detail}. "
                       f"Please try again with better lighting, facing the camera directly, and hold still.",
        }
 
    return {
        "success": True,
        "vectors": vectors,
        "vectorDimension": EXPECTED_VECTOR_DIMENSION,
        "modelVersion": MODEL_VERSION,
    }
 