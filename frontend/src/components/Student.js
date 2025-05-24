import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

function Student({ onBack }) {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    department: 'Select Department',
    course: 'Select Course',
    year: 'Select Year',
    semester: 'Select Semester',
    division: 'A',
    gender: 'Male',
    dob: '',
    phone: '',
    address: '',
    roll_no: '',
    email: '',
    teacher: '',
    photo_sample: 'No',
  });

  const [originalStudentId, setOriginalStudentId] = useState(''); // Store the original student_id
  const [students, setStudents] = useState([]);
  const [searchRollNo, setSearchRollNo] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      const data = await response.json();
      if (data.status === 200) {
        setStudents(data.students);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students. Please check the console for details.');
    }
  };

  const checkStudentIdExists = async (student_id, excludeId = null) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/check-id?student_id=${student_id}`);
      const data = await response.json();
      if (data.status === 200) {
        const exists = data.exists;
        if (exists) {
          // If excludeId is provided and matches the existing student_id, return false (no conflict)
          const existingStudent = data.student;
          if (excludeId && existingStudent.student_id === excludeId) {
            return false;
          }
          return true; // Conflict: student_id exists for another student
        }
      }
      return false; // No conflict: student_id does not exist
    } catch (error) {
      console.error('Error checking student ID:', error);
      alert('Failed to check student ID. Please check the console for details.');
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateDob = (dob) => {
    if (!dob) return false; // Check if DOB is empty
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dobRegex.test(dob);
  };

  const handleAdd = async () => {
    const requiredFields = [
      'student_id', 'name', 'department', 'course', 'year', 'semester',
      'division', 'gender', 'dob', 'phone', 'address', 'roll_no', 'email', 'teacher',
    ];
    if (requiredFields.some(field => !formData[field] || formData[field].includes('Select'))) {
      alert('Please fill all fields!');
      return;
    }

    if (!validateDob(formData.dob)) {
      alert('Please enter DOB in the format YYYY-MM-DD (e.g., 2000-05-15)!');
      return;
    }

    const idExists = await checkStudentIdExists(formData.student_id);
    if (idExists) {
      alert(`Student ID ${formData.student_id} already exists. Please use a different ID.`);
      return;
    }

    const dataToSend = { ...formData, photo: capturedPhoto || null };
    console.log('Sending data to backend:', dataToSend);

    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      alert(data.message);

      if (data.status === 200) {
        fetchStudents();
        handleReset();
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please check the console for details.');
    }
  };

  const handleUpdate = async () => {
    if (!formData.student_id) {
      alert('Please select a student to update!');
      return;
    }

    if (!validateDob(formData.dob)) {
      alert('Please enter DOB in the format YYYY-MM-DD (e.g., 2000-05-15)!');
      return;
    }

    // Only check for student_id conflict if the student_id has been changed
    if (formData.student_id !== originalStudentId) {
      const idExists = await checkStudentIdExists(formData.student_id, originalStudentId);
      if (idExists) {
        alert(`Student ID ${formData.student_id} is already taken by another student. Please use a different ID.`);
        return;
      }
    }

    const dataToSend = { ...formData, photo: capturedPhoto || null };
    console.log('Sending update data to backend:', dataToSend);

    try {
      const response = await fetch(`http://localhost:5000/api/students/${originalStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      alert(data.message);

      if (data.status === 200) {
        fetchStudents();
        handleReset();
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert(`Failed to update student: ${error.message}. Please check the console for details.`);
    }
  };

  const handleDelete = async () => {
    if (!formData.student_id) {
      alert('Please select a student to delete!');
      return;
    }

    if (!window.confirm('Do you want to delete this student?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/students/${formData.student_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message);

      if (data.status === 200) {
        fetchStudents();
        handleReset();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please check the console for details.');
    }
  };

  const handleReset = () => {
    setFormData({
      student_id: '',
      name: '',
      department: 'Select Department',
      course: 'Select Course',
      year: 'Select Year',
      semester: 'Select Semester',
      division: 'A',
      gender: 'Male',
      dob: '',
      phone: '',
      address: '',
      roll_no: '',
      email: '',
      teacher: '',
      photo_sample: 'No',
    });
    setOriginalStudentId(''); // Reset the original student_id
    setCapturedPhoto(null);
  };

  const handleSearch = async () => {
    if (!searchRollNo) {
      alert('Please enter a roll number to search!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/search?roll_no=${searchRollNo}`);
      const data = await response.json();
      if (data.status === 200) {
        setStudents(data.students);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      alert('Failed to search students. Please check the console for details.');
    }
  };

  const handleRowClick = (student) => {
    setFormData(student);
    setOriginalStudentId(student.student_id); // Store the original student_id
    setCapturedPhoto(student.photo || null);
  };

  const handleTakePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedPhoto(imageSrc);
      console.log('Photo captured successfully:', imageSrc.substring(0, 50) + '...');
    } else {
      alert('Failed to capture photo. Please ensure the camera is accessible.');
    }
  };

  const handleDeletePhoto = () => {
    setCapturedPhoto(null);
    console.log('Photo deleted');
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8 relative"
      style={{
        backgroundImage: 'url(/images/bb.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center rounded-2xl shadow-lg space-y-4 sm:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm sm:text-base"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back Home
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-['Montserrat',_sans-serif] tracking-wide text-center">
            Welcome to Student Panel
          </h1>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg sm:text-xl font-semibold text-gray-700">👤</span>
          </div>
        </div>

        <div className="bg-gray-100 p-4 sm:p-6 rounded-2xl shadow-xl mt-6">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Left Section: Form */}
            <div className="w-full md:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200 mb-6">Student Details</h2>
              <div className="border border-gray-600 p-4 sm:p-6 mb-6 rounded-xl bg-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-blue-200 mb-4">Current Course</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    >
                      <option>Select Department</option>
                      <option>Computer</option>
                      <option>IT</option>
                      <option>Civil</option>
                      <option>Mechanical</option>
                      <option>Electrical</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Course</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    >
                      <option>Select Course</option>
                      <option>SE</option>
                      <option>FE</option>
                      <option>TE</option>
                      <option>BE</option>
                      <option>MS</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Year</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    >
                      <option>Select Year</option>
                      <option>2017-21</option>
                      <option>2018-22</option>
                      <option>2019-23</option>
                      <option>2020-24</option>
                      <option>2021-25</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Semester</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    >
                      <option>Select Semester</option>
                      <option>Semester-1</option>
                      <option>Semester-2</option>
                      <option>Semester-3</option>
                      <option>Semester-4</option>
                      <option>Semester-5</option>
                      <option>Semester-6</option>
                      <option>Semester-7</option>
                      <option>Semester-8</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border border-gray-600 p-4 sm:p-6 rounded-xl bg-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-blue-200 mb-4">Class Student Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Student ID</label>
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Student Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Class Division</label>
                    <select
                      name="division"
                      value={formData.division}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                      <option>E</option>
                      <option>F</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Roll No</label>
                    <input
                      type="text"
                      name="roll_no"
                      value={formData.roll_no}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Others</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">DOB</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-xs sm:text-sm font-medium text-gray-200">Teacher Name</label>
                    <input
                      type="text"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      className="w-full p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
                  <label className="flex items-center text-gray-200 text-sm sm:text-base">
                    <input
                      type="radio"
                      name="photo_sample"
                      value="Yes"
                      checked={formData.photo_sample === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Take Photo Sample
                  </label>
                  <label className="flex items-center text-gray-200 text-sm sm:text-base">
                    <input
                      type="radio"
                      name="photo_sample"
                      value="No"
                      checked={formData.photo_sample === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    No Photo Sample
                  </label>
                </div>
                {formData.photo_sample === 'Yes' && (
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-200 mb-4">Capture Photo</h3>
                    <div className="flex flex-col items-center">
                      {!capturedPhoto ? (
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width={280}
                          height={210}
                          videoConstraints={{
                            facingMode: 'user',
                          }}
                          className="rounded-lg border border-gray-600 shadow-sm w-full max-w-[280px] h-auto"
                        />
                      ) : (
                        <img
                          src={capturedPhoto}
                          alt="Captured Photo"
                          className="w-full max-w-[280px] h-auto object-cover rounded-lg border border-gray-600 shadow-sm"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleAdd}
                  className="bg-teal-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                >
                  Save
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-teal-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-red-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                >
                  Delete
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                >
                  Reset
                </button>
                {formData.photo_sample === 'Yes' && (
                  <>
                    <button
                      onClick={handleTakePhoto}
                      className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                    >
                      Take Pic
                    </button>
                    <button
                      onClick={handleDeletePhoto}
                      className="bg-red-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-red-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                    >
                      Delete Pic
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Right Section: Table */}
            <div className="w-full md:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-200 mb-6">Student Details</h2>
              <div className="border border-gray-600 p-4 sm:p-6 mb-6 rounded-xl bg-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-blue-200 mb-4">Search System</h3>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <select
                    className="p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                  >
                    <option>Roll-No</option>
                  </select>
                  <input
                    type="text"
                    value={searchRollNo}
                    onChange={(e) => setSearchRollNo(e.target.value)}
                    className="flex-1 p-2 sm:p-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-sm sm:text-base"
                    placeholder="Enter Roll No to Search"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-teal-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                  >
                    Search
                  </button>
                  <button
                    onClick={fetchStudents}
                    className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-sm text-sm sm:text-base"
                  >
                    Show All
                  </button>
                </div>
              </div>
              <div className="border border-gray-600 p-4 sm:p-6 rounded-xl bg-gray-700 overflow-x-auto">
                <table className="w-full border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">ID</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Name</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Dep</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Course</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Year</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Sem</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Div</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Gender</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">DOB</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Phone</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Address</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Roll-No</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Email</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Teacher</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Photo</th>
                      <th className="border border-gray-600 p-2 sm:p-3 text-left text-xs sm:text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={student.student_id}
                        onClick={() => handleRowClick(student)}
                        className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-blue-600 transition-all`}
                      >
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.student_id}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.name}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.department}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.course}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.year}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.semester}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.division}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.gender}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.dob}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.phone}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.address}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.roll_no}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.email}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.teacher}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">{student.photo ? 'Yes' : 'No'}</td>
                        <td className="border border-gray-600 p-2 sm:p-3 text-gray-200 text-xs sm:text-sm">
                          <span className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${student.year.includes('2021-25') ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            {student.year.includes('2021-25') ? 'Active' : 'Graduated'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Responsive Styles */}
      <style>
        {`
          /* Touch-friendly hover effect for mobile */
          @media (hover: none) {
            .hover\\:scale-105:hover {
              transform: scale(1); /* Disable scaling on touch devices */
            }
            .hover\\:bg-teal-700:hover,
            .hover\\:bg-blue-700:hover,
            .hover\\:bg-red-700:hover,
            .hover\\:bg-gray-700:hover,
            .hover\\:bg-blue-600:hover {
              background-color: inherit; /* Prevent background change on touch */
            }
            button:active {
              transform: scale(0.95); /* Add a slight press effect on tap */
              background-color: rgba(59, 130, 246, 0.2); /* Add a subtle feedback on tap */
            }
            tr:hover {
              background-color: inherit; /* Disable hover effect on table rows for touch devices */
            }
          }

          /* Ensure buttons are touch-friendly */
          button {
            min-width: 44px;
            min-height: 44px;
            touch-action: manipulation; /* Improve touch responsiveness */
          }

          /* Adjust webcam size for mobile */
          @media (max-width: 640px) {
            .webcam-container {
              width: 100% !important;
              max-width: 280px !important;
              height: auto !important;
            }
          }

          /* Smooth scrolling for mobile */
          html {
            scroll-behavior: smooth;
          }

          /* Ensure table is readable on mobile */
          table {
            font-size: 12px;
          }
          @media (min-width: 640px) {
            table {
              font-size: 14px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Student;