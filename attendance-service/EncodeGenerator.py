import cv2
import face_recognition
import pickle
import os
 
print("Starting encoding process...")
 
# 1. Path to your employee images folder
folderPath = 'images'
pathList = os.listdir(folderPath)
imgList = []
employeeIds = []
 
# 2. Read images and extract their Employee IDs from the file names
for path in pathList:
    # This reads the actual image file
    img = cv2.imread(os.path.join(folderPath, path))
    imgList.append(img)
   
    # This grabs just the number (e.g., '1001' from '1001.jpg')
    studentId = os.path.splitext(path)[0]
    employeeIds.append(studentId)
    print(f"Loaded image for ID: {studentId}")
 
print("Images successfully loaded. Finding faces and encoding...")
 
# 3. Loop through all images to generate facial feature numbers
def findEncodings(imagesList):
    encodeList = []
    for img in imagesList:
        # OpenCV reads images in BGR format, but face_recognition library needs RGB format
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
       
        # Find the facial features
        encodings = face_recognition.face_encodings(img_rgb)
       
        if len(encodings) > 0:
            encodeList.append(encodings[0])
        else:
            print("WARNING: A face could not be detected in one of your images. Make sure it's a clear portrait!")
           
    return encodeList
 
# 4. Run the encoding function
encodeListKnown = findEncodings(imgList)
# Pair the face data with the matching Employee IDs
encodeListKnownWithIds = [encodeListKnown, employeeIds]
 
print("Encoding complete! Saving data to a file...")
 
# 5. Save the processed face data into a file called 'EncodeFile.p'
with open("EncodeFile.p", "wb") as f:
    pickle.dump(encodeListKnownWithIds, f)
 
print("File 'EncodeFile.p' successfully created and saved!")