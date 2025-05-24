import React, { useState, useEffect, useRef } from 'react';

function Attendance({ onBack }) {
  const [formData, setFormData] = useState({
    id: '',
    roll_no: '',
    name: '',
    time: '',
    date: '',
    status: '', // Changed default to empty string to avoid "Status" ambiguity
  });

  const [csvData, setCsvData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance');
      const data = await response.json();
      console.log('Fetched attendance data:', data); // Debug log
      if (data.status === 200) {
        setAttendanceData(data.attendance || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Failed to fetch attendance data. Please check the console for details.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setFormData({
      id: '',
      roll_no: '',
      name: '',
      time: '',
      date: '',
      status: '',
    });
  };

  const handleImportCsv = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please select a CSV file to import!');
      return;
    }

    if (file.type !== 'text/csv') {
      alert('Please upload a valid CSV file!');
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.trim().split(',')).filter(row => row.length >= 6);
        if (rows.length === 0) {
          alert('No valid CSV data found in the file!');
          setIsProcessing(false);
          return;
        }

        console.log('Imported CSV data:', rows); // Debug log
        setCsvData(rows);

        const response = await fetch('http://localhost:5000/api/import-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv_data: rows }),
        });
        const data = await response.json();
        alert(data.message);
        if (data.status === 200) {
          fetchAttendance();
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        alert('Failed to read the CSV file. Please check the console for details.');
        console.error('Error reading CSV file');
        setIsProcessing(false);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Failed to import CSV. Please check the console for details.');
      setIsProcessing(false);
    }
  };

  const handleExportCsv = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/export-csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_export.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('CSV exported successfully!');
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please check the console for details.');
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handleUpdateCsv = async () => {
    const requiredFields = ['id', 'roll_no', 'name', 'time', 'date', 'status'];
    if (requiredFields.some(field => !formData[field])) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
      if (data.status === 200) {
        fetchAttendance();
        handleReset();
      }
    } catch (error) {
      console.error('Error updating CSV:', error);
      alert('Failed to update CSV. Please check the console for details.');
    }
  };

  const handleUpdate = async () => {
    const requiredFields = ['id', 'roll_no', 'name', 'time', 'date', 'status'];
    if (requiredFields.some(field => !formData[field])) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
      if (data.status === 200) {
        fetchAttendance();
        handleReset();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please check the console for details.');
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      alert('Please select an attendance record to delete!');
      return;
    }

    if (!window.confirm('Do you want to delete this attendance record?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${formData.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      alert(data.message);
      if (data.status === 200) {
        fetchAttendance();
        handleReset();
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      alert('Failed to delete attendance. Please check the console for details.');
    }
  };

  const handleCsvRowClick = (row) => {
    setFormData({
      id: row[0] || '',
      roll_no: row[1] || '',
      name: row[2] || '',
      time: row[3] || '',
      date: row[4] || '',
      status: row[5] || '',
    });
  };

  const handleAttendanceRowClick = (row) => {
    setFormData({
      id: row.id || '',
      roll_no: row.roll_no || '',
      name: row.name || '',
      time: row.time || '',
      date: row.date || '',
      status: row.status || '',
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="min-h-screen p-8 relative"
      style={{
        backgroundImage: 'url(/images/bb.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-4 flex justify-between items-center rounded-b-2xl shadow-lg">
          <button onClick={onBack} className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back Home
          </button>
          <h1 className="text-3xl font-bold font-['Montserrat',_sans-serif] tracking-wide">
            Welcome to Attendance Panel
          </h1>
          <div className="w-12 h-12"></div>
        </div>

        <div className="bg-gray-100 p-6 rounded-2xl shadow-xl mt-6">
          <div className="flex space-x-6">
            {/* Left Section: Form and CSV Table */}
            <div className="w-1/2 bg-gray-800 p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-white mb-6">Student Details</h2>

              {/* Form */}
              <div className="border border-gray-600 p-6 mb-6 rounded-xl bg-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-sm font-medium text-gray-300">Student ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-500 rounded-lg text-white bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-gray-400"
                      placeholder="Enter Student ID"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-sm font-medium text-gray-300">Roll No</label>
                    <input
                      type="text"
                      name="roll_no"
                      value={formData.roll_no}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-500 rounded-lg text-white bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-gray-400"
                      placeholder="Enter Roll No"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-sm font-medium text-gray-300">Student Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-500 rounded-lg text-white bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-gray-400"
                      placeholder="Enter Student Name"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-sm font-medium text-gray-300">Time</label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-500 rounded-lg text-white bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-gray-400"
                      placeholder="Enter Time (e.g., 10:00 AM)"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-sm font-medium text-gray-300">Date</label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-500 rounded-lg text-white bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm placeholder-gray-400"
                      placeholder="Enter Date (e.g., 2025-05-07)"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-gray-700 px-1 text-sm font-medium text-gray-300">Attendance Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-500 rounded-lg text-white bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CSV Table */}
              <div className="border border-gray-600 p-6 rounded-xl bg-gray-700 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="border border-gray-500 p-3 text-left">Std-ID</th>
                      <th className="border border-gray-500 p-3 text-left">Roll.No</th>
                      <th className="border border-gray-500 p-3 text-left">Std-Name</th>
                      <th className="border border-gray-500 p-3 text-left">Time</th>
                      <th className="border border-gray-500 p-3 text-left">Date</th>
                      <th className="border border-gray-500 p-3 text-left">Attend-status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="border border-gray-500 p-3 text-gray-200 text-center">
                          No CSV data available
                        </td>
                      </tr>
                    ) : (
                      csvData.map((row, index) => (
                        <tr
                          key={index}
                          onClick={() => handleCsvRowClick(row)}
                          className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-blue-800 transition-all`}
                        >
                          <td className="border border-gray-500 p-3 text-gray-200">{row[0] || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row[1] || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row[2] || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row[3] || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row[4] || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                row[5] === 'Present' ? 'bg-green-700 text-green-200' : row[5] === 'Absent' ? 'bg-red-700 text-red-200' : 'bg-gray-600 text-gray-200'
                              }`}
                            >
                              {row[5] || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportCsv}
                accept=".csv"
                className="hidden"
              />

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={triggerFileInput} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Import CSV
                </button>
                <button onClick={handleExportCsv} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Export CSV
                </button>
                <button onClick={handleUpdateCsv} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Update
                </button>
                <button onClick={handleReset} className="flex items-center bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 hover:scale-105 transition-all shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Reset
                </button>
                {isProcessing && (
                  <div className="w-64 bg-gray-500 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: MySQL Table */}
            <div className="w-1/2 bg-gray-800 p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-white mb-6">Student Details</h2>

              {/* MySQL Table */}
              <div className="border border-gray-600 p-6 rounded-xl bg-gray-700 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="border border-gray-500 p-3 text-left">Std-ID</th>
                      <th className="border border-gray-500 p-3 text-left">Roll.No</th>
                      <th className="border border-gray-500 p-3 text-left">Std-Name</th>
                      <th className="border border-gray-500 p-3 text-left">Time</th>
                      <th className="border border-gray-500 p-3 text-left">Date</th>
                      <th className="border border-gray-500 p-3 text-left">Attend-status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="border border-gray-500 p-3 text-gray-200 text-center">
                          No attendance data available
                        </td>
                      </tr>
                    ) : (
                      attendanceData.map((row, index) => (
                        <tr
                          key={row.id}
                          onClick={() => handleAttendanceRowClick(row)}
                          className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-blue-800 transition-all`}
                        >
                          <td className="border border-gray-500 p-3 text-gray-200">{row.id || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row.roll_no || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row.name || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row.time || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">{row.date || '-'}</td>
                          <td className="border border-gray-500 p-3 text-gray-200">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                                row.status === 'Present' ? 'bg-green-700 text-green-200' : row.status === 'Absent' ? 'bg-red-700 text-red-200' : 'bg-gray-600 text-gray-200'
                              }`}
                            >
                              {row.status || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button onClick={handleUpdate} className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Update
                </button>
                <button onClick={handleDelete} className="flex items-center bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 hover:scale-105 transition-all shadow-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M5 7h14m-9 3v8m4-8v8"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;