from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import os
import cv2
import numpy as np
from PIL import Image
import csv
import io
import logging
import base64
from io import BytesIO

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# In-memory set to track marked attendance in the current session
marked_attendance = set()

# Directory for training data
DATA_DIR = r"D:\PROJECTS\Major Project\Python-FYP-Face-Recognition-Attendence-System-master\Python-FYP-Face-Recognition-Attendence-System-master\data"

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            user='root',
            password='1234567890',
            host='localhost',
            database='facerecognizer',
            port=3306
        )
        logger.info("Database connection successful")
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise e

# API to handle login
@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        logger.debug("Received login request")
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        logger.debug(f"Login attempt with email: {email}")

        if not email or not password:
            logger.warning("Invalid credentials: email or password missing")
            return jsonify({"message": "Invalid credentials", "status": 401})

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM regteach WHERE UPPER(email)=UPPER(%s) AND password=%s",
            (email, password)
        )
        row = cursor.fetchone()
        logger.debug(f"Database query result: {row}")
        conn.close()

        if row:
            logger.info("Login successful")
            return jsonify({"message": "Login successful", "status": 200})
        else:
            logger.warning("Invalid username or password")
            return jsonify({"message": "Invalid Username or Password", "status": 401})
    except Exception as e:
        logger.error(f"Error in /api/login: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to fetch user details by email
@app.route('/api/user', methods=['GET'])
def get_user():
    try:
        email = request.args.get('email')
        if not email:
            logger.warning("Get user failed: email parameter missing")
            return jsonify({"message": "email parameter is required", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT fname, lname, email, contact_no, securityQ, securityA FROM regteach WHERE email=%s", (email,))
        user = cursor.fetchone()
        conn.close()

        if user:
            logger.info(f"User details fetched for email: {email}")
            return jsonify({"user": user, "status": 200})
        else:
            logger.warning(f"User not found for email: {email}")
            return jsonify({"message": "User not found", "status": 404})
    except Exception as e:
        logger.error(f"Error in /api/user: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to check if email exists (for forget password)
@app.route('/api/check-email', methods=['POST'])
def check_email():
    try:
        data = request.get_json()
        email = data.get('email')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM regteach WHERE email=%s", (email,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return jsonify({'exists': True, "status": 200})
        else:
            return jsonify({'exists': False, "status": 404})
    except Exception as e:
        logger.error(f"Error in /api/check-email: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to reset password
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        email = data.get('email')
        security_question = data.get('securityQuestion')
        security_answer = data.get('securityAnswer')
        new_password = data.get('newPassword')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM regteach WHERE email=%s AND securityQ=%s AND securityA=%s",
            (email, security_question, security_answer)
        )
        row = cursor.fetchone()

        if row:
            cursor.execute(
                "UPDATE regteach SET password=%s WHERE email=%s",
                (new_password, email)
            )
            conn.commit()
            conn.close()
            return jsonify({'message': 'Password reset successful', "status": 200})
        else:
            conn.close()
            return jsonify({'message': 'Incorrect security answer', "status": 400})
    except Exception as e:
        logger.error(f"Error in /api/reset-password: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to handle registration
@app.route('/api/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        fname = data.get('fname')
        lname = data.get('lname')
        cnum = data.get('cnum')
        email = data.get('email')
        ssq = data.get('ssq')
        sa = data.get('sa')
        pwd = data.get('pwd')

        if not all([fname, lname, cnum, email, ssq, sa, pwd]):
            logger.warning("Registration failed: All fields are required")
            return jsonify({"message": "All fields are required", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM regteach WHERE email=%s", (email,))
        row = cursor.fetchone()

        if row:
            conn.close()
            logger.warning(f"Registration failed: User with email {email} already exists")
            return jsonify({"message": "User already exists, please try another email", "status": 400})

        cursor.execute(
            "INSERT INTO regteach (fname, lname, contact_no, email, securityQ, securityA, password) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (fname, lname, cnum, email, ssq, sa, pwd)
        )
        conn.commit()
        conn.close()
        logger.info(f"Registration successful for email: {email}")
        return jsonify({"message": "Registration successful", "status": 200})
    except Exception as e:
        logger.error(f"Error in /api/register: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to train the dataset
@app.route('/api/train', methods=['POST'])
def train():
    try:
        if not os.path.exists(DATA_DIR):
            logger.error(f"Dataset directory '{DATA_DIR}' not found")
            return jsonify({'message': f"Dataset directory '{DATA_DIR}' not found", "status": 400})

        paths = [os.path.join(DATA_DIR, file) for file in os.listdir(DATA_DIR) if file.endswith('.jpg')]
        faces = []
        ids = []

        for image_path in paths:
            try:
                img = Image.open(image_path).convert('L')
                imageNp = np.array(img, 'uint8')
                parts = os.path.basename(image_path).split('.')
                if len(parts) != 4 or not parts[1]:
                    logger.error(f"Invalid filename format: {image_path}")
                    continue
                student_id = int(parts[1])

                faces.append(imageNp)
                ids.append(student_id)
            except Exception as e:
                logger.error(f"Skipping image: {image_path}, Reason: {e}")
                continue

        if len(faces) == 0 or len(ids) == 0:
            logger.warning("No valid training data found")
            return jsonify({'message': 'No valid training data found. Please ensure images are present and named correctly.', "status": 400})

        ids = np.array(ids)

        clf = cv2.face.LBPHFaceRecognizer_create()
        clf.train(faces, ids)
        clf.write("classifier.xml")

        logger.info("Training Dataset Completed")
        return jsonify({'message': 'Training Dataset Completed!', "status": 200})
    except Exception as e:
        logger.error(f"Error in /api/train: {str(e)}")
        return jsonify({'message': str(e), "status": 500})

# API to recognize a face
@app.route('/api/recognize-face', methods=['POST'])
def recognize_face():
    try:
        data = request.get_json()
        image_data = data.get('image')

        if not image_data:
            logger.warning("No image data provided for face recognition")
            return jsonify({"message": "No image data provided", "status": 400})

        # Decode the base64 image
        base64_string = image_data.split(',')[1]
        image_bytes = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_bytes)).convert('L')  # Convert to grayscale
        image_np = np.array(image, 'uint8')

        # Load the face cascade classifier
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        if face_cascade.empty():
            logger.error("Failed to load face cascade classifier")
            return jsonify({"message": "Failed to load face cascade classifier", "status": 500})

        # Detect faces
        faces = face_cascade.detectMultiScale(image_np, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces) == 0:
            logger.warning("No faces detected in the image")
            return jsonify({"message": "No faces detected", "status": 404})

        # Load the trained model
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        try:
            recognizer.read("classifier.xml")
        except Exception as e:
            logger.error(f"Failed to load classifier.xml: {str(e)}")
            return jsonify({"message": "Face recognition model not trained. Please train the model first.", "status": 400})

        # Recognize the face
        for (x, y, w, h) in faces:
            face_roi = image_np[y:y+h, x:x+w]
            label, confidence = recognizer.predict(face_roi)
            logger.debug(f"Recognized face with label: {label}, confidence: {confidence}")

            # Confidence threshold (adjust as needed)
            if confidence < 100:  # Lower confidence means better match
                return jsonify({"student_id": str(label), "confidence": confidence, "status": 200})
            else:
                logger.warning(f"Face recognized but confidence too low: {confidence}")
                return jsonify({"message": "Unknown face (low confidence)", "status": 404})

        return jsonify({"message": "No recognizable face found", "status": 404})
    except Exception as e:
        logger.error(f"Error in /api/recognize-face: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to mark attendance
@app.route('/api/mark-attendance', methods=['POST'])
def mark_attendance():
    global marked_attendance
    try:
        data = request.get_json()
        simulated_student_id = data.get('student_id', '1')

        if simulated_student_id in marked_attendance:
            logger.warning(f"Attendance already marked for Student ID {simulated_student_id} in this session")
            return jsonify({"message": f"Attendance already marked for Student ID {simulated_student_id} in this session", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Name, Roll_No, Department FROM student WHERE Student_ID=%s", (simulated_student_id,))
        result = cursor.fetchone()
        conn.close()

        if not result:
            logger.warning("Unknown Face Detected")
            return jsonify({"message": "Unknown Face Detected", "status": 404})

        name, roll, department = result
        now = datetime.now()
        date_string = now.strftime("%Y-%m-%d")
        time_string = now.strftime("%H:%M:%S")

        csv_file = "aniket.csv"
        if os.path.exists(csv_file):
            with open(csv_file, "r") as f:
                lines = f.readlines()
                for line in lines:
                    if line.startswith(f"{simulated_student_id},{name},{roll},{department},{date_string}"):
                        marked_attendance.add(simulated_student_id)
                        logger.warning(f"Attendance already marked for {name} (ID: {simulated_student_id}) today")
                        return jsonify({"message": f"Attendance already marked for {name} (ID: {simulated_student_id}) today!", "status": 400})

        with open(csv_file, "a") as f:
            f.write(f"{simulated_student_id},{name},{roll},{department},{date_string},{time_string}\n")
        marked_attendance.add(simulated_student_id)

        logger.info(f"Attendance marked for {name} (ID: {simulated_student_id})")
        return jsonify({
            "message": f"Attendance marked for {name} (ID: {simulated_student_id})",
            "student": {"id": simulated_student_id, "name": name, "roll": roll, "department": department},
            "status": 200
        })
    except Exception as e:
        logger.error(f"Error in /api/mark-attendance: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to clear session attendance
@app.route('/api/clear-session', methods=['POST'])
def clear_session():
    global marked_attendance
    marked_attendance.clear()
    logger.info("Session cleared")
    return jsonify({"message": "Session cleared", "status": 200})

# API to fetch attendance records
@app.route('/api/attendance', methods=['GET'])
def fetch_attendance():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM stdattendance")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        logger.info("Fetched attendance records")
        return jsonify({
            "attendance": [
                {
                    "id": row[0],
                    "roll_no": row[1],
                    "name": row[2],
                    "time": row[3],
                    "date": row[4],
                    "status": row[5]
                } for row in data
            ],
            "status": 200
        })
    except Exception as e:
        logger.error(f"Error in /api/attendance: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to update attendance record
@app.route('/api/attendance/<id>', methods=['PUT'])
def update_attendance(id):
    try:
        data = request.get_json()
        required_fields = ['roll_no', 'name', 'time', 'date', 'status']
        if not all(field in data for field in required_fields):
            logger.warning("Update attendance failed: All fields are required")
            return jsonify({"message": "All fields are required", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE stdattendance SET std_roll_no=%s, std_name=%s, std_time=%s, std_date=%s, std_attendance=%s
            WHERE std_id=%s
            """,
            (
                data['roll_no'], data['name'], data['time'], data['date'], data['status'], id
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Attendance updated for ID: {id}")
        return jsonify({"message": "Attendance updated successfully", "status": 200})
    except Exception as e:
        logger.error(f"Error in /api/attendance/<id> (PUT): {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to delete attendance record
@app.route('/api/attendance/<id>', methods=['DELETE'])
def delete_attendance(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM stdattendance WHERE std_id=%s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Attendance deleted for ID: {id}")
        return jsonify({"message": "Attendance deleted successfully", "status": 200})
    except Exception as e:
        logger.error(f"Error in /api/attendance/<id> (DELETE): {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to import CSV
@app.route('/api/import-csv', methods=['POST'])
def import_csv():
    try:
        data = request.get_json()
        csv_data = data.get('csv_data', [])
        if not csv_data:
            logger.warning("Import CSV failed: No data provided")
            return jsonify({"message": "No data provided", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor()
        for row in csv_data:
            cursor.execute(
                """
                INSERT INTO stdattendance (std_id, std_roll_no, std_name, std_time, std_date, std_attendance)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    std_roll_no=%s, std_name=%s, std_time=%s, std_date=%s, std_attendance=%s
                """,
                (
                    row[0], row[1], row[2], row[3], row[4], row[5],
                    row[1], row[2], row[3], row[4], row[5]
                )
            )
        conn.commit()
        cursor.close()
        conn.close()
        logger.info("CSV imported successfully")
        return jsonify({"message": "CSV imported successfully", "status": 200})
    except Exception as e:
        logger.error(f"Error in /api/import-csv: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to export CSV
@app.route('/api/export-csv', methods=['GET'])
def export_csv():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM stdattendance")
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        if not data:
            logger.warning("Export CSV failed: No data found to export")
            return jsonify({"message": "No data found to export", "status": 400})

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Std-ID", "Roll.No", "Std-Name", "Time", "Date", "Attend-status"])
        for row in data:
            writer.writerow(row)

        output.seek(0)
        logger.info("CSV exported successfully")
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='attendance_export.csv'
        )
    except Exception as e:
        logger.error(f"Error in /api/export-csv: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to add a new student
@app.route('/api/students', methods=['POST'])
def add_student():
    try:
        data = request.get_json()
        logger.debug(f"Received data for adding student: {data}")
        required_fields = [
            'student_id', 'name', 'department', 'course', 'year', 'semester',
            'division', 'gender', 'dob', 'phone', 'address', 'roll_no',
            'email', 'teacher', 'photo_sample'
        ]
        if not all(field in data for field in required_fields):
            missing_fields = [field for field in required_fields if field not in data]
            logger.warning(f"Add student failed: Missing fields - {missing_fields}")
            return jsonify({"message": f"All fields are required. Missing: {', '.join(missing_fields)}", "status": 400})

        os.makedirs(DATA_DIR, exist_ok=True)

        # Handle the photo
        photo = data.get('photo')
        if photo and data['photo_sample'] == 'Yes':
            base64_string = photo.split(',')[1]
            image_data = base64.b64decode(base64_string)
            # Save multiple images per student
            index = 1
            photo_path = os.path.join(DATA_DIR, f"user.{data['student_id']}.{index}.jpg")
            while os.path.exists(photo_path):
                index += 1
                photo_path = os.path.join(DATA_DIR, f"user.{data['student_id']}.{index}.jpg")
            with open(photo_path, 'wb') as f:
                f.write(image_data)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO student (Student_ID, Name, Department, Course, Year, Semester, Division, Gender, DOB, Phone_No, Address, Roll_No, Email, Teacher_Name, PhotoSample, Photo)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                data['student_id'], data['name'], data['department'], data['course'],
                data['year'], data['semester'], data['division'], data['gender'],
                data['dob'], data['phone'], data['address'], data['roll_no'],
                data['email'], data['teacher'], data['photo_sample'], data.get('photo')
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Student added successfully: {data['student_id']}")
        return jsonify({"message": "Student added successfully", "status": 200})
    except mysql.connector.Error as e:
        logger.error(f"Database error in /api/students (POST): {str(e)}")
        if '1062' in str(e):
            return jsonify({"message": f"Student ID {data.get('student_id')} already exists. Please use a different ID.", "status": 400})
        return jsonify({"message": f"Error: {str(e)}", "status": 500})
    except Exception as e:
        logger.error(f"Error in /api/students (POST): {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to fetch all students
@app.route('/api/students', methods=['GET'])
def fetch_students():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM student")
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        logger.info("Fetched all students")
        return jsonify({
            "students": [
                {
                    "student_id": s[0], "name": s[1], "department": s[2], "course": s[3],
                    "year": s[4], "semester": s[5], "division": s[6], "gender": s[7],
                    "dob": s[8], "phone": s[9], "address": s[10], "roll_no": s[11],
                    "email": s[12], "teacher": s[13], "photo_sample": s[14], "photo": s[15]
                } for s in students
            ],
            "status": 200
        })
    except Exception as e:
        logger.error(f"Error in /api/students (GET): {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to check if a student_id exists
@app.route('/api/students/check-id', methods=['GET'])
def check_student_id():
    try:
        student_id = request.args.get('student_id')
        if not student_id:
            logger.warning("Check student ID failed: student_id parameter missing")
            return jsonify({"message": "student_id parameter is required", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM student WHERE Student_ID = %s", (student_id,))
        student = cursor.fetchone()
        cursor.close()
        conn.close()
        logger.debug(f"Check student ID {student_id}: {'Found' if student else 'Not found'}")
        if student:
            return jsonify({'status': 200, 'exists': True, 'student': student})
        return jsonify({'status': 200, 'exists': False})
    except Exception as e:
        logger.error(f"Error in /api/students/check-id: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to update a student
@app.route('/api/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    try:
        data = request.get_json()
        logger.debug(f"Received data for updating student {student_id}: {data}")
        required_fields = [
            'name', 'department', 'course', 'year', 'semester',
            'division', 'gender', 'dob', 'phone', 'address', 'roll_no',
            'email', 'teacher', 'photo_sample'
        ]
        if not all(field in data for field in required_fields):
            missing_fields = [field for field in required_fields if field not in data]
            logger.warning(f"Update student failed: Missing fields - {missing_fields}")
            return jsonify({"message": f"All fields are required. Missing: {', '.join(missing_fields)}", "status": 400})

        os.makedirs(DATA_DIR, exist_ok=True)

        # Handle the photo
        photo = data.get('photo')
        if photo and data['photo_sample'] == 'Yes':
            base64_string = photo.split(',')[1]
            image_data = base64.b64decode(base64_string)
            # Save multiple images per student
            index = 1
            photo_path = os.path.join(DATA_DIR, f"user.{student_id}.{index}.jpg")
            while os.path.exists(photo_path):
                index += 1
                photo_path = os.path.join(DATA_DIR, f"user.{student_id}.{index}.jpg")
            with open(photo_path, 'wb') as f:
                f.write(image_data)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE student SET Name=%s, Department=%s, Course=%s, Year=%s, Semester=%s,
            Division=%s, Gender=%s, DOB=%s, Phone_No=%s, Address=%s, Roll_No=%s,
            Email=%s, Teacher_Name=%s, PhotoSample=%s, Photo=%s
            WHERE Student_ID=%s
            """,
            (
                data['name'], data['department'], data['course'], data['year'],
                data['semester'], data['division'], data['gender'], data['dob'],
                data['phone'], data['address'], data['roll_no'], data['email'],
                data['teacher'], data['photo_sample'], data.get('photo'), student_id
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Student updated successfully: {student_id}")
        return jsonify({"message": "Student updated successfully", "status": 200})
    except mysql.connector.Error as e:
        logger.error(f"Database error in /api/students/<student_id> (PUT): {str(e)}")
        if '1062' in str(e):
            return jsonify({"message": f"Student ID {student_id} is already taken by another student. Please use a different ID.", "status": 400})
        return jsonify({"message": f"Error: {str(e)}", "status": 500})
    except Exception as e:
        logger.error(f"Error in /api/students/<student_id> (PUT): {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to delete a student
@app.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM student WHERE Student_ID=%s", (student_id,))
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Student deleted successfully: {student_id}")
        return jsonify({"message": "Student deleted successfully", "status": 200})
    except Exception as e:
        logger.error(f"Error in /api/students/<student_id> (DELETE): {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

# API to search students by roll number
@app.route('/api/students/search', methods=['GET'])
def search_students():
    try:
        roll_no = request.args.get('roll_no')
        if not roll_no:
            logger.warning("Search students failed: Roll number is required")
            return jsonify({"message": "Roll number is required", "status": 400})

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM student WHERE Roll_No=%s", (roll_no,))
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        logger.info(f"Searched students with roll_no: {roll_no}")
        return jsonify({
            "students": [
                {
                    "student_id": s[0], "name": s[1], "department": s[2], "course": s[3],
                    "year": s[4], "semester": s[5], "division": s[6], "gender": s[7],
                    "dob": s[8], "phone": s[9], "address": s[10], "roll_no": s[11],
                    "email": s[12], "teacher": s[13], "photo_sample": s[14], "photo": s[15]
                } for s in students
            ],
            "status": 200
        })
    except Exception as e:
        logger.error(f"Error in /api/students/search: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}", "status": 500})

if __name__ == '__main__':
    app.run(debug=True, port=5000)