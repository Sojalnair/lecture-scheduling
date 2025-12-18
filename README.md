
A comprehensive lecture scheduling system with admin and instructor panels, featuring real-time conflict detection and course management.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [System Architecture](#system-architecture)
- [API Reference](#api-reference)
- [Conflict Detection](#conflict-detection)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### Admin Panel
- *Instructor Management*
  - View complete list of instructors
  - Display instructor details (name, email)
  - Track number of lectures assigned per instructor

- *Course Management*
  - Create new courses with detailed information
  - Edit existing course details
  - Delete courses (with cascade deletion of schedules)
  - Course attributes:
    - Name
    - Level (Beginner, Intermediate, Advanced)
    - Description
    - Image URL (optional)

- *Lecture Scheduling*
  - Add multiple lecture batches per course
  - Assign lectures to specific instructors
  - Set date and time for each lecture
  - Real-time conflict detection
  - Visual warning for scheduling conflicts

- *Schedule Overview*
  - View all scheduled lectures in a sortable table
  - Filter by course, instructor, or date
  - Delete individual schedules

### Instructor Panel
- View personalized schedule
- See all assigned lectures with:
  - Course name
  - Batch information
  - Date and time
  - Organized by instructor

### Conflict Detection System
- *Prevents double-booking*: No instructor can be assigned to multiple lectures on the same date
- *Real-time validation*: Warns admin before creating conflicting schedules
- *Visual feedback*: Red warning banner when conflict is detected

---

## 🛠️ Tech Stack

- *Frontend Framework*: React 18.x
- *UI Library*: Tailwind CSS
- *Icons*: Lucide React
- *State Management*: React Hooks (useState)
- *Build Tool*: Modern bundler (Vite/Create React App compatible)

---

## 📦 Installation

### Prerequisites
- Node.js 14.x or higher
- npm or yarn package manager

### Step 1: Clone the Repository
bash
git clone https://github.com/ideamagix/lecture-scheduling.git
cd lecture-scheduling


### Step 2: Install Dependencies
bash
npm install
# or
yarn install


### Step 3: Install Required Packages
bash
npm install lucide-react


### Step 4: Start Development Server
bash
npm start
# or
yarn start


The application will open at http://localhost:3000

---

## 📖 Usage Guide

### For Administrators

#### 1. Adding a Course
1. Navigate to the *Admin Panel*
2. Click *"Add Course"* button
3. Fill in the course details:
   - Course Name (required)
   - Level (required)
   - Description (required)
   - Image URL (optional)
4. Click *"Save"*

#### 2. Editing a Course
1. Locate the course card
2. Click the *Edit icon* (pencil)
3. Modify the details
4. Click *"Update"*

#### 3. Scheduling a Lecture
1. Find the course you want to schedule
2. Click *"Add Lecture"* on the course card
3. Fill in the schedule form:
   - Batch Name
   - Select Instructor
   - Choose Date
   - Set Time
4. The system will automatically check for conflicts
5. If no conflicts exist, click *"Schedule Lecture"*

#### 4. Handling Conflicts
When scheduling a lecture, if the selected instructor is already assigned to another lecture on the same date:
- A *red warning banner* will appear
- The message will indicate: "Warning: This instructor already has a lecture scheduled on this date!"
- You can either:
  - Choose a different date
  - Select a different instructor
  - Cancel the current schedule

#### 5. Viewing All Schedules
1. Scroll to the *"All Scheduled Lectures"* section
2. View the complete table with:
   - Course name
   - Batch information
   - Assigned instructor
   - Date and time
3. Delete individual schedules using the trash icon

### For Instructors

#### Viewing Your Schedule
1. Switch to the *Instructor Panel*
2. Find your name in the list
3. View all your assigned lectures with complete details

---

## 🏗️ System Architecture

### Component Structure

LectureSchedulingModule
├── Header (Navigation & Branding)
├── Admin Panel
│   ├── Instructor List
│   ├── Course Management
│   │   ├── Course Form (Add/Edit)
│   │   └── Course Cards
│   ├── Lecture Scheduling
│   │   └── Batch Form
│   └── Schedule Table
└── Instructor Panel
    └── Instructor Schedule Views


### Data Models

#### Instructor
javascript
{
  id: number,
  name: string,
  email: string
}


#### Course
javascript
{
  id: number,
  name: string,
  level: string,
  description: string,
  image: string,
  batches: Schedule[]
}


#### Schedule
javascript
{
  id: number,
  courseId: number,
  courseName: string,
  batchName: string,
  instructorId: number,
  instructorName: string,
  date: string, // ISO format (YYYY-MM-DD)
  time: string  // HH:MM format
}


---

## 🔧 API Reference

### State Management Functions

#### checkScheduleConflict(instructorId, date)
Checks if an instructor already has a lecture scheduled on a specific date.

*Parameters:*
- instructorId (number): The ID of the instructor
- date (string): Date in ISO format (YYYY-MM-DD)

*Returns:* boolean
- true if conflict exists
- false if no conflict

*Example:*
javascript
const hasConflict = checkScheduleConflict(1, '2025-01-15');


#### addCourse()
Creates a new course or updates an existing one.

*Validation:*
- Name, Level, and Description are required
- Prevents submission if fields are empty

#### addBatch()
Schedules a new lecture batch with conflict detection.

*Validation:*
- All fields must be filled
- Checks for scheduling conflicts
- Alerts user if conflict detected

#### deleteCourse(courseId)
Deletes a course and all associated schedules.

*Parameters:*
- courseId (number): The ID of the course to delete

*Cascade Effect:*
- Removes all lecture schedules associated with the course

---

## 🚨 Conflict Detection

### How It Works

The conflict detection system follows these rules:

1. *One Lecture Per Day Rule*
   - An instructor can only have ONE lecture scheduled per day
   - The system ignores time when checking conflicts
   - Date comparison is done in YYYY-MM-DD format

2. *Pre-emptive Validation*
   - Conflicts are checked BEFORE saving
   - Visual warning displayed in real-time
   - Admin must resolve conflict before proceeding

3. *Algorithm*
javascript
const checkScheduleConflict = (instructorId, date) => {
  return schedules.some(schedule => 
    schedule.instructorId === instructorId && 
    schedule.date === date
  );
};


### Example Scenarios

#### ✅ Valid Schedule

Instructor: Dr. Sarah Johnson
Date: January 15, 2025, 10:00 AM
Status: ✓ No conflicts


#### ❌ Conflict Detected

Instructor: Dr. Sarah Johnson
Existing: January 15, 2025, 10:00 AM (Course A)
New: January 15, 2025, 2:00 PM (Course B)
Status: ✗ Conflict! Same instructor, same date


#### ✅ No Conflict

Instructor: Dr. Sarah Johnson
Existing: January 15, 2025, 10:00 AM (Course A)
New: January 16, 2025, 10:00 AM (Course B)
Status: ✓ Different dates - OK


---

## 🎨 UI/UX Features

### Design Principles
- *Clean & Modern*: Minimalist interface with focus on functionality
- *Intuitive Navigation*: Clear panel switching between Admin and Instructor views
- *Visual Feedback*: Color-coded alerts and status indicators
- *Responsive Design*: Works on desktop, tablet, and mobile devices

### Color Scheme
- *Primary*: Indigo (#4F46E5)
- *Secondary*: Orange (#F97316) & Purple (#9333EA)
- *Success*: Green (#16A34A)
- *Warning*: Red (#DC2626)
- *Neutral*: Gray shades

### Interactive Elements
- Hover effects on cards and buttons
- Smooth transitions
- Form validation with error messages
- Confirmation dialogs for destructive actions

---

## 🔐 Data Persistence

Currently, the application uses *in-memory state management* with React hooks. Data is not persisted across page refreshes.

### Backend Integration Guide

To add persistence, implement these backend endpoints:

javascript
// GET all instructors
GET /api/instructors

// GET all courses
GET /api/courses

// POST new course
POST /api/courses
Body: { name, level, description, image }

// PUT update course
PUT /api/courses/:id
Body: { name, level, description, image }

// DELETE course
DELETE /api/courses/:id

// GET all schedules
GET /api/schedules

// POST new schedule
POST /api/schedules
Body: { courseId, batchName, instructorId, date, time }

// DELETE schedule
DELETE /api/schedules/:id

// GET schedules by instructor
GET /api/schedules/instructor/:instructorId

// GET conflict check
GET /api/schedules/conflict?instructorId=X&date=YYYY-MM-DD


---


## 🐛 Known Issues

1. *Data Persistence*: Data is lost on page refresh (requires backend integration)
2. *Time Conflicts*: System only checks date conflicts, not time conflicts within the same day
3. *Timezone*: No timezone handling for international schedules

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow React best practices
- Maintain consistent indentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.






