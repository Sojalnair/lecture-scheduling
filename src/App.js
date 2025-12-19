import React, { useState } from 'react';
import { 
  Calendar, Users, BookOpen, Plus, Trash2, Edit2, 
  Save, X, LogOut, Lock, User, AlertCircle 
} from 'lucide-react';

// Mock database of users for authentication
const MOCK_USERS = [
  { username: 'admin', password: 'password123', role: 'admin', name: 'Admin User' },
  { username: 'sarah', password: 'password123', role: 'instructor', name: 'Dr. Sarah Johnson', id: 1 },
  { username: 'michael', password: 'password234', role: 'instructor', name: 'Prof. Michael Chen', id: 2 }
];

const LectureSchedulingModule = () => {
  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(null); // null = not logged in
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // --- APP STATE ---
  const [activePanel, setActivePanel] = useState('admin');
  const [instructors, setInstructors] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.j@ideamagix.com' },
    { id: 2, name: 'Prof. Michael Chen', email: 'michael.c@ideamagix.com' },
    { id: 3, name: 'Dr. Emily Davis', email: 'emily.d@ideamagix.com' }
  ]);
  
  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [courseForm, setCourseForm] = useState({
    name: '', level: '', description: '', image: ''
  });
  
  const [batchForm, setBatchForm] = useState({
    courseId: null, batchName: '', instructorId: null, date: '', time: ''
  });

  // --- AUTHENTICATION HANDLERS ---

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // 1. Variable Constraint Check (Input Validation)
    if (loginForm.username.trim().length < 3) {
      setLoginError('Username must be at least 3 characters long.');
      return;
    }
    if (loginForm.password.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }

    // 2. Credential Check
    const foundUser = MOCK_USERS.find(
      u => u.username === loginForm.username && u.password === loginForm.password
    );

    if (foundUser) {
      setUser(foundUser);
      // Role Constraint: If instructor, force them to instructor panel
      if (foundUser.role === 'instructor') {
        setActivePanel('instructor');
      } else {
        setActivePanel('admin');
      }
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActivePanel('admin');
    setLoginError('');
  };

  // --- EXISTING LOGIC HANDLERS ---

  const checkScheduleConflict = (instructorId, date) => {
    return schedules.some(schedule => 
      schedule.instructorId === instructorId && schedule.date === date
    );
  };

  const addCourse = () => {
    if (!courseForm.name || !courseForm.level || !courseForm.description) {
      alert('Please fill all required fields');
      return;
    }

    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id ? { ...c, ...courseForm } : c
      ));
      setEditingCourse(null);
    } else {
      const newCourse = {
        id: Date.now(),
        ...courseForm,
        batches: []
      };
      setCourses([...courses, newCourse]);
    }
    
    setCourseForm({ name: '', level: '', description: '', image: '' });
    setShowCourseForm(false);
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name,
      level: course.level,
      description: course.description,
      image: course.image
    });
    setShowCourseForm(true);
  };

  const deleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
      setSchedules(schedules.filter(s => s.courseId !== courseId));
    }
  };

  const addBatch = () => {
    if (!batchForm.courseId || !batchForm.batchName || !batchForm.instructorId || !batchForm.date || !batchForm.time) {
      alert('Please fill all fields');
      return;
    }

    if (checkScheduleConflict(batchForm.instructorId, batchForm.date)) {
      alert('Schedule conflict! This instructor is already assigned to another lecture on this date.');
      return;
    }

    const course = courses.find(c => c.id === batchForm.courseId);
    const instructor = instructors.find(i => i.id === batchForm.instructorId);
    
    const newSchedule = {
      id: Date.now(),
      courseId: batchForm.courseId,
      courseName: course.name,
      batchName: batchForm.batchName,
      instructorId: batchForm.instructorId,
      instructorName: instructor.name,
      date: batchForm.date,
      time: batchForm.time
    };

    setSchedules([...schedules, newSchedule]);
    setCourses(courses.map(c => 
      c.id === batchForm.courseId 
        ? { ...c, batches: [...(c.batches || []), newSchedule] }
        : c
    ));
    
    setBatchForm({ courseId: null, batchName: '', instructorId: null, date: '', time: '' });
    setShowBatchForm(false);
  };

  const deleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    }
  };

  const getInstructorSchedules = (instructorId) => {
    return schedules.filter(s => s.instructorId === instructorId);
  };

  // --- RENDER: LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
              <span className="text-orange-500">idea</span>
              <span className="text-purple-600">magix</span>
            </div>
            <p className="text-gray-500">Lecture Scheduling Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Sign In
            </button>

            <div className="text-xs text-gray-400 text-center mt-4">
              <p>Demo Admin: admin / password123</p>
              <p>Demo Instructor: sarah / password123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold">
                <span className="text-orange-500">idea</span>
                <span className="text-purple-600">magix</span>
              </div>
              <div className="hidden md:block text-sm text-gray-600 ml-4 border-l border-gray-300 pl-4">
                Online Lecture Scheduling Module
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right mr-2 hidden md:block">
                <div className="text-sm font-bold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              
              {/* Role Constraint Check: Only Admin can toggle panels */}
              {user.role === 'admin' && (
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActivePanel('admin')}
                    className={`px-4 py-2 rounded-md text-sm transition ${
                      activePanel === 'admin'
                        ? 'bg-white text-indigo-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => setActivePanel('instructor')}
                    className={`px-4 py-2 rounded-md text-sm transition ${
                      activePanel === 'instructor'
                        ? 'bg-white text-indigo-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Instructor
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition border border-red-100"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activePanel === 'admin' ? (
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">Instructors</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {instructors.map(instructor => (
                  <div key={instructor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="font-semibold text-gray-800">{instructor.name}</div>
                    <div className="text-sm text-gray-600">{instructor.email}</div>
                    <div className="text-xs text-indigo-600 mt-2">
                      {schedules.filter(s => s.instructorId === instructor.id).length} lectures assigned
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
                </div>
                <button
                  onClick={() => {
                    setShowCourseForm(true);
                    setEditingCourse(null);
                    setCourseForm({ name: '', level: '', description: '', image: '' });
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus size={20} />
                  Add Course
                </button>
              </div>

              {showCourseForm && (
                <div className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                  <h3 className="font-semibold mb-4 text-gray-800">
                    {editingCourse ? 'Edit Course' : 'New Course'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Course Name"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Level (e.g., Beginner, Intermediate)"
                      value={courseForm.level}
                      onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                      rows="3"
                    />
                    <input
                      type="text"
                      placeholder="Image URL (optional)"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={addCourse}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <Save size={18} />
                      {editingCourse ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCourseForm(false);
                        setEditingCourse(null);
                        setCourseForm({ name: '', level: '', description: '', image: '' });
                      }}
                      className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{course.name}</h3>
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mt-1">
                          {course.level}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCourse(course)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {(course.batches || []).length} batch(es)
                      </span>
                      <button
                        onClick={() => {
                          setShowBatchForm(true);
                          setBatchForm({ ...batchForm, courseId: course.id });
                        }}
                        className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                      >
                        Add Lecture
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {courses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No courses added yet. Click "Add Course" to get started.
                </div>
              )}
            </div>

            {showBatchForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="font-semibold mb-4 text-gray-800 text-xl">Schedule New Lecture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Batch Name"
                    value={batchForm.batchName}
                    onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={batchForm.instructorId || ''}
                    onChange={(e) => setBatchForm({ ...batchForm, instructorId: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={batchForm.date}
                    onChange={(e) => setBatchForm({ ...batchForm, date: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="time"
                    value={batchForm.time}
                    onChange={(e) => setBatchForm({ ...batchForm, time: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {batchForm.instructorId && batchForm.date && checkScheduleConflict(batchForm.instructorId, batchForm.date) && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
                    ⚠️ Warning: This instructor already has a lecture scheduled on this date!
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={addBatch}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Save size={18} />
                    Schedule Lecture
                  </button>
                  <button
                    onClick={() => {
                      setShowBatchForm(false);
                      setBatchForm({ courseId: null, batchName: '', instructorId: null, date: '', time: '' });
                    }}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">All Scheduled Lectures</h2>
              </div>
              {schedules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Instructor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {schedules.sort((a, b) => new Date(a.date) - new Date(b.date)).map(schedule => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{schedule.courseName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{schedule.batchName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{schedule.instructorName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(schedule.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{schedule.time}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No lectures scheduled yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Instructor Schedules</h2>
            </div>
            
            {/* If logged in as Instructor, only show their schedule */}
            {user.role === 'instructor' ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-indigo-50">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Your Schedule ({user.name})</h3>
                {/* For demo purposes, we are mapping the logged in user to ID 1 (Sarah) */}
                {(() => {
                  const mySchedules = getInstructorSchedules(1); // Hardcoded to 1 for demo
                  return mySchedules.length > 0 ? (
                    <table className="w-full bg-white rounded-lg overflow-hidden">
                       <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Course</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Batch</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mySchedules.map(schedule => (
                           <tr key={schedule.id} className="hover:bg-gray-50">
                             <td className="px-4 py-2">{schedule.courseName}</td>
                             <td className="px-4 py-2">{schedule.batchName}</td>
                             <td className="px-4 py-2">{new Date(schedule.date).toLocaleDateString()}</td>
                             <td className="px-4 py-2">{schedule.time}</td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <div className="text-gray-500 italic">No lectures assigned to you.</div>
                })()}
              </div>
            ) : (
              // Admin sees all instructors
              <div className="space-y-6">
                {instructors.map(instructor => {
                  const instructorSchedules = getInstructorSchedules(instructor.id);
                  return (
                    <div key={instructor.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">{instructor.name}</h3>
                      {instructorSchedules.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Course</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Batch</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {instructorSchedules.sort((a, b) => new Date(a.date) - new Date(b.date)).map(schedule => (
                                <tr key={schedule.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm text-gray-800">{schedule.courseName}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{schedule.batchName}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">
                                    {new Date(schedule.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{schedule.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No lectures assigned</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureSchedulingModule;