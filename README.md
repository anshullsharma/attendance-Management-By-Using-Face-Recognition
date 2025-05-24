# 🎯 Attendance Management System – Face Recognition Based 🧠🎓

> **Modern AI-powered solution** to automate attendance with face recognition. Built with **React.js** for the frontend and **Python (Flask/FastAPI)** for the backend.

---

## 📌 Overview

This **Attendance Management System** uses **Face Recognition** technology to track student attendance. 

🔧 **Tech Stack**:
- 🎨 Frontend: React + Tailwind CSS
- 🧠 Backend: Python (Flask or FastAPI) + OpenCV
- 💾 Data: MySQL / SQLite / CSV

---

## 🚀 Features

✅ Face recognition-based attendance tracking  
✅ Secure user authentication (Login/Register)  
✅ 🎓 Student Dashboard to view attendance records  
✅ 🤝 Help & Support module  
✅ 📁 Export attendance data to CSV

---

## 🧾 Project Structure

attendance-management-system/
├── backend/ # Python backend
│ ├── app.py # API server
│ ├── face_recognition.py
│ ├── database.py
│ ├── data.py
│ ├── student.py
│ ├── attendance.py
│ ├── register.py
│ ├── login.py
│ ├── helpsupport.py
│ ├── assets/
│ │ ├── haarcascade_frontalface_default.xml
│ │ └── chatbot.jpg
│ ├── data/
│ │ ├── aniket.csv
│ │ └── attendance.csv
│ └── requirements.txt
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ ├── index.js
│ │ └── App.css
│ ├── package.json
│ └── tailwind.config.js
└── README.md


---

## ⚙️ Prerequisites

- 🐍 Python 3.8+
- 🟩 Node.js 16+
- 🛢️ MySQL or SQLite
- 📷 Webcam for facial recognition
- 🧠 OpenCV installed

---

## 🧰 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/attendance-management-system.git
cd attendance-management-system

2️⃣ Backend Setup
cd backend
pip install -r requirements.txt

🔧 Configure your database in app.py
DATABASE_CONFIG = {
    'host': 'localhost',
    'database': 'your_database_name',
    'user': 'your_username',
    'password': 'your_password'
}


▶️ Run the backend server:
python app.py
Backend runs at: http://localhost:5000


3️⃣ Frontend Setup
cd frontend
npm install
npm start
Frontend runs at: http://localhost:3000


🧑‍🏫 Using the Application
📲 Register or Login

📸 Capture your face for attendance

📊 View attendance in the dashboard

📤 Export your attendance data

📦 Dependencies
🔙 Backend
Flask or FastAPI

OpenCV

MySQL Connector or SQLite

See backend/requirements.txt

🖥️ Frontend
React 18

Tailwind CSS

See frontend/package.json

🤝 Contributing
Fork the repository 🍴

Create your feature branch: git checkout -b feature/your-feature

Commit changes: git commit -m "Add your feature"

Push to GitHub: git push origin feature/your-feature

Open a Pull Request 🚀

📝 License
This project is licensed under the MIT License – see the LICENSE file for details.
