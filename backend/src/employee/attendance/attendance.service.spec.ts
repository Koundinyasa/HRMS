// attendance.service.spec.ts
//
// Automated regression tests for AttendanceService — GENERAL SHIFT ONLY,
// per current priority (night-shift/rotational deliberately excluded,
// same scope boundary used throughout today's manual testing).
//
// WHY THIS EXISTS: every verification done today (geofence, accuracy,
// LatestPunchOverall, CaptureSource labeling, the InTime/OutTime bug) was
// manual — a real person doing a real punch and reading a real log. That
// caught real bugs, including one in a fix that looked correct on paper
// (LatestPunchOverall's first version). But manual testing only protects
// against regression for as long as someone remembers to re-run it by
// hand. These tests encode today's confirmed-correct behaviors so a
// future code change that breaks any of them fails a test run
// immediately, not silently, in production, days later.
//
// SETUP NOTE: DatabaseService and HttpService are mocked — these tests
// never touch a real database or the real Python service. They test
// AttendanceService's own decision logic in isolation.

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AttendanceService } from './attendance.service';
import { DatabaseService } from '../../database/database.service';

// ── Minimal mssql-shaped mock ────────────────────────────────────────────
// Chains .input(...).input(...).query(...)/.execute(...) the same way the
// real mssql library does, but returns whatever recordset we tell it to,
// per-test — so we can simulate "this employee's last punch was X" without
// a real database.
function makeMockPool(
  queryResult: any = { recordset: [] },
  execResult: any = { recordset: [] },
) {
  const request: any = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn().mockResolvedValue(queryResult),
    execute: jest.fn().mockResolvedValue(execResult),
  };
  return { request: jest.fn().mockReturnValue(request), _request: request };
}

describe('AttendanceService — General Shift', () => {
  let service: AttendanceService;
  let mockDbService: Partial<DatabaseService>;
  let mockHttpService: Partial<HttpService>;
  let mockPool: ReturnType<typeof makeMockPool>;

  beforeEach(async () => {
    mockPool = makeMockPool();
    mockDbService = {
      connect: jest.fn().mockResolvedValue(mockPool),
    };
    mockHttpService = {
      post: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: DatabaseService, useValue: mockDbService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─────────────────────────────────────────────────────────────────────
  // isCurrentlyPunchedIn() — via checkFaceRegistered(), its public entry
  // point. This is the exact logic behind the "Punch In / Punch Out"
  // button state.
  // ─────────────────────────────────────────────────────────────────────
  describe('isCurrentlyPunchedIn (general shift day-reset behavior)', () => {
    it('shows "punched in" when last punch was an IN earlier TODAY', async () => {
      const todayIn = new Date();
      todayIn.setHours(9, 0, 0, 0);

      mockPool._request.query
        .mockResolvedValueOnce({ recordset: [] }) // face-registered check
        .mockResolvedValueOnce({
          recordset: [{ PunchType: 60, PunchTimestamp: todayIn }],
        }) // getLastPunch
        .mockResolvedValueOnce({ recordset: [{ IsNightShift: false }] }); // employeeShiftCrossesMidnight

      const result = await service.checkFaceRegistered('EMP001');
      expect(result.punchedIn).toBe(true);
    });

    it('RESETS to "not punched in" when last punch was an IN on a PREVIOUS day (general shift) — the exact bug fixed weeks ago', async () => {
      const yesterdayIn = new Date();
      yesterdayIn.setDate(yesterdayIn.getDate() - 1);
      yesterdayIn.setHours(10, 0, 0, 0);

      mockPool._request.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({
          recordset: [{ PunchType: 60, PunchTimestamp: yesterdayIn }],
        })
        .mockResolvedValueOnce({ recordset: [{ IsNightShift: false }] }); // confirmed general shift

      const result = await service.checkFaceRegistered('EMP001');
      expect(result.punchedIn).toBe(false); // must reset — this is THE core fix from weeks ago
    });

    it('shows "not punched in" when last punch was an OUT, regardless of when', async () => {
      mockPool._request.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({
          recordset: [{ PunchType: 61, PunchTimestamp: new Date() }],
        })
        .mockResolvedValueOnce({ recordset: [{ IsNightShift: false }] });

      const result = await service.checkFaceRegistered('EMP001');
      expect(result.punchedIn).toBe(false);
    });

    it('shows "not punched in" when the employee has never punched at all', async () => {
      mockPool._request.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({ recordset: [] }); // getLastPunch finds nothing

      const result = await service.checkFaceRegistered('EMP001');
      expect(result.punchedIn).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────────
  // punch() — the mandatory-location gate. Confirmed live today across
  // the full geofence/accuracy matrix; these lock in the pure early-return
  // behavior so it can't silently regress.
  // ─────────────────────────────────────────────────────────────────────
  describe('punch() — mandatory location gate', () => {
    it('rejects immediately if latitude is missing, before touching the DB or Python service', async () => {
      const result = await service.punch(
        'EMP001',
        [],
        undefined,
        78.4,
        'TestDevice',
      );
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/location is required/i);
      expect(mockHttpService.post).not.toHaveBeenCalled(); // proves it never even tried face verification
    });

    it('rejects immediately if longitude is missing', async () => {
      const result = await service.punch(
        'EMP001',
        [],
        17.4,
        undefined,
        'TestDevice',
      );
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/location is required/i);
    });
  });

  // ─────────────────────────────────────────────────────────────────────
  // punch() — the accuracy gate. Confirmed live today (Test 3, Test 5):
  // >200m rejects, <=200m proceeds. Recalibrated from an original guess
  // of 100 after real laptop Wi-Fi-positioning data showed 100 was too
  // tight — these tests protect that calibrated value from being
  // silently reverted or re-broken.
  // ─────────────────────────────────────────────────────────────────────
  describe('punch() — accuracy gate (calibrated threshold: 200m)', () => {
    it('rejects a punch with accuracy worse than 200m', async () => {
      const result = await service.punch(
        'EMP001',
        [],
        17.4,
        78.4,
        'TestDevice',
        250,
      );
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/precise enough/i);
      expect(mockHttpService.post).not.toHaveBeenCalled();
    });

    it('does NOT reject at exactly the threshold (200m) — only strictly worse', async () => {
      // This test will proceed past the accuracy gate and hit verifyFace(),
      // so we need a minimal mock for the Python call to not blow up.
      (mockHttpService.post as jest.Mock).mockReturnValue(
        throwError(() => ({ code: 'ECONNREFUSED' })), // service down is fine — we're only checking it GOT PAST the accuracy gate
      );
      const result = await service.punch(
        'EMP001',
        [],
        17.4,
        78.4,
        'TestDevice',
        200,
      );
      // If it were wrongly rejected for accuracy, message would mention "precise enough".
      // Instead it should reach the "service unavailable" branch.
      expect(result.message).not.toMatch(/precise enough/i);
    });

    it('does not reject when accuracy is undefined (not sent by an older frontend build)', async () => {
      (mockHttpService.post as jest.Mock).mockReturnValue(
        throwError(() => ({ code: 'ECONNREFUSED' })),
      );
      const result = await service.punch(
        'EMP001',
        [],
        17.4,
        78.4,
        'TestDevice',
        undefined,
      );
      expect(result.message).not.toMatch(/precise enough/i);
    });
  });

  // ─────────────────────────────────────────────────────────────────────
  // getRecentPunches() — CaptureSource label mapping. Confirmed live
  // today with a real "Face Recognition" punch. These lock in the FULL
  // mapping table against Mst_AttendanceCaptureSource, not just the one
  // value we happened to test live.
  // ─────────────────────────────────────────────────────────────────────
  describe('getRecentPunches() — CaptureSource label mapping', () => {
    const cases: Array<[number, string]> = [
      [1, 'Biometric'],
      [2, 'GPS'],
      [3, 'Face Recognition'], // confirmed live today
      [4, 'QR'],
      [5, 'Web'],
      [6, 'Mobile App'],
      [7, 'Manual Regularization'], // confirmed correct in DB by TL's fix
    ];

    it.each(cases)(
      'maps CaptureSource=%i to "%s"',
      async (captureSource, expectedLabel) => {
        mockPool._request.query.mockResolvedValueOnce({
          recordset: [
            {
              PunchType: 60,
              PunchTimestamp: new Date(),
              PunchLocation: 'Test Location',
              CaptureSource: captureSource,
            },
          ],
        });

        const result = await service.getRecentPunches('EMP001');
        expect(result.punches[0].mode).toBe(expectedLabel);
      },
    );

    it('falls back to "Unknown" for an unrecognized CaptureSource value, rather than crashing', async () => {
      mockPool._request.query.mockResolvedValueOnce({
        recordset: [
          {
            PunchType: 60,
            PunchTimestamp: new Date(),
            PunchLocation: 'Test Location',
            CaptureSource: 999, // deliberately not in the map
          },
        ],
      });

      const result = await service.getRecentPunches('EMP001');
      expect(result.punches[0].mode).toBe('Unknown');
    });
  });

  // ─────────────────────────────────────────────────────────────────────
  // determineNextPunchType() — indirectly, via two consecutive checks.
  // Confirms IN/OUT never disagrees with isCurrentlyPunchedIn(), since
  // today's fix made determineNextPunchType() just delegate to it rather
  // than run its own separate check (the two used to be able to disagree
  // — this test locks in that they structurally can't anymore).
  // ─────────────────────────────────────────────────────────────────────
  describe('determineNextPunchType — consistency with isCurrentlyPunchedIn', () => {
    it('a general-shift employee with a forgotten IN from a PREVIOUS day gets a fresh IN, not OUT', async () => {
      const yesterdayIn = new Date();
      yesterdayIn.setDate(yesterdayIn.getDate() - 1);

      // Mocks for the full punch() flow: mandatory-location passes,
      // accuracy passes, then determineNextPunchType's internal DB calls.
      // Mocks in the ACTUAL order punch() calls them: resolveEmployeeLocation
      // and findMatchingGeoFence happen FIRST, then getLastPunch/
      // employeeShiftCrossesMidnight happen afterward, inside
      // determineNextPunchType(). My first version of this test had these
      // reversed, which silently fed each mock the wrong shape of data.
      mockPool._request.query
        .mockResolvedValueOnce({ recordset: [{ CompanyID: 1, BranchID: 1 }] }) // resolveEmployeeLocation
        .mockResolvedValueOnce({
          recordset: [
            { ID: 1, Latitude: 17.4, Longitude: 78.4, RadiusMeters: 500 },
          ],
        }) // findMatchingGeoFence — fence at the test coordinates
        .mockResolvedValueOnce({
          recordset: [{ PunchType: 60, PunchTimestamp: yesterdayIn }],
        }) // getLastPunch
        .mockResolvedValueOnce({ recordset: [{ IsNightShift: false }] }); // employeeShiftCrossesMidnight

      (mockHttpService.post as jest.Mock).mockReturnValue(
        of({
          data: {
            verified: true,
            employeeName: 'Test Employee',
            matchResult: 'Matched',
            livenessCheckPassed: true,
            confidenceScore: 90,
          },
        }),
      );

      mockPool._request.execute.mockResolvedValue({ recordset: [] }); // USP_RecordFaceVerificationPunch

      const result = await service.punch(
        'EMP001',
        [{} as any],
        17.4,
        78.4,
        'TestDevice',
        50,
      );
      expect(result.action).toBe('IN'); // NOT 'OUT' — this is the exact behavior fixed weeks ago
    });
  });
});
