# BIPS Technical College - Online Exam System

A secure, feature-rich online examination system built with Next.js, TypeScript, Tailwind CSS, and MongoDB. This system includes advanced security features like violation tracking, auto-banning, and fullscreen enforcement.

---

## ✅ **MONGODB ATLAS PRE-CONFIGURED!**

**Good news!** This project is already connected to MongoDB Atlas. You don't need to set up a local MongoDB or create an Atlas account - everything is ready to go!

**What's Configured:**
- ✅ MongoDB Atlas cluster connection
- ✅ Database: `bips_exam_system`
- ✅ Connection string in `.env.local`
- ✅ 100 exam questions ready to load

**Quick Start (3 commands):**
```bash
npm install                           # Install dependencies
pip install pymongo python-dotenv    # Install Python packages
python setup_mongodb_complete.py     # Load exam questions into database
npm run dev                          # Start the app
```

**→ See [START_HERE.md](START_HERE.md) for complete setup guide**

---

## 🎯 Features

### Student Features
- **Secure Exam Taking**: 100 multiple-choice questions
- **Real-time Timer**: 2-hour countdown with warnings
- **Security Monitoring**:
  - Tab switching detection
  - Copy/paste prevention
  - Right-click disabled
  - Keyboard shortcuts blocked
  - Fullscreen enforcement
  - Automatic banning after 2 violations
- **Auto-grading**: Immediate scoring upon submission
- **Results Display**: View scores and grades

### Admin Features
- **Dashboard**: Overview of all submissions
- **Statistics**: Real-time exam statistics and analytics
- **Violation Tracking**: Detailed security violation reports
- **Results Management**: View and manage all exam results
- **Secure Login**: SHA-256 hashed password authentication

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Icons**: React Icons
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **Python 3** (for database initialization) - [Download here](https://www.python.org/)
- ✅ **npm** or yarn package manager (comes with Node.js)

**Note:** MongoDB is already configured via Atlas - no local installation needed!

## 🚀 Installation & Setup

### Quick Setup (Recommended)

**Windows:**
```bash
# Double-click setup.bat or run in terminal:
setup.bat
```

**Mac/Linux:**
```bash
# Make executable and run:
chmod +x setup.sh
./setup.sh
```

### Manual Setup

### 1. Extract the Project

Extract the ZIP file and open the folder in your code editor (VS Code recommended).

### 2. Install Dependencies

```bash
# Node.js dependencies
npm install

# Python dependencies for database initialization
pip install pymongo python-dotenv
# Or on Mac/Linux:
pip3 install pymongo python-dotenv
```

### 3. Verify MongoDB Connection (Optional)

Test your MongoDB Atlas connection:

```bash
python test_connection.py
```

You should see:
```
✅ SUCCESS! Connected to MongoDB Atlas
```

### 4. Initialize Database

Load the 100 exam questions into MongoDB:

```bash
python setup_mongodb_complete.py
```

This will:
- Connect to MongoDB Atlas
- Create collections (questions, students, submissions, admins)
- Load 100 CNA exam questions
- Create admin account

**Note:** The connection string is already configured in `.env.local` - no changes needed!

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

**Admin Login:**
- URL: `http://localhost:3000/admin`
- Username: `admin`
- Password: `BIPS2025Secure!`

## 📱 Usage

### For Students

1. Navigate to `http://localhost:3000`
2. Enter your full name and admission number
3. Agree to exam security terms
4. Click "Start Exam"
5. Answer all 100 multiple-choice questions
6. Submit your exam
7. View your results

**Important Security Rules:**
- Do NOT switch tabs or minimize browser
- Do NOT copy or paste
- Do NOT right-click
- Stay in fullscreen mode
- After 2 violations, you will be automatically banned

### For Administrators

1. Navigate to `http://localhost:3000/admin`
2. Login with credentials:
   - Username: `admin`
   - Password: `BIPS2025Secure!`
3. View submissions, results, and violation reports

## 🔧 Database Structure

### Collections

#### 1. questions
```javascript
{
  question_number: Number,
  question_text: String,
  options: [String],
  correct_answer: Number,
  marks: Number,
  section: String
}
```

#### 2. submissions
```javascript
{
  student_name: String,
  admission_number: String,
  start_time: Date,
  end_time: Date,
  time_taken: String,
  answers: Map<String, Number>,
  violations: [{ timestamp: Date, violation: String }],
  banned_during_exam: Boolean,
  violation_summary: {
    tab_switches: Number,
    copy_attempts: Number,
    paste_attempts: Number,
    total_violations: Number
  },
  marked_score: Number,
  grade: String,
  marked_by: String,
  marked_date: Date,
  submitted_at: Date
}
```

#### 3. students
```javascript
{
  admission_number: String (unique),
  full_name: String,
  registered_at: Date
}
```

#### 4. admins
```javascript
{
  username: String (unique),
  password: String (SHA-256 hashed),
  role: String,
  created_at: Date
}
```

## 📁 Project Structure

```
exam-system/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts
│   │   ├── questions/
│   │   │   └── route.ts
│   │   └── submissions/
│   │       └── route.ts
│   ├── admin/
│   │   └── page.tsx
│   ├── exam/
│   │   └── page.tsx
│   ├── results/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── models/
│   │   └── index.ts
│   └── mongodb.ts
├── setup_mongodb.py
├── .env.local
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

1. **Anti-Cheating Measures**:
   - Tab switch detection
   - Copy/paste prevention
   - Context menu (right-click) disabled
   - Keyboard shortcuts blocked
   - Fullscreen enforcement
   - Window blur detection

2. **Violation Tracking**:
   - Each violation is logged with timestamp
   - Automatic ban after 2 violations
   - Detailed violation reports for admins

3. **Data Security**:
   - Password hashing (SHA-256)
   - Correct answers not exposed to frontend
   - Session-based authentication

## 🎨 Grading System

- **A Grade**: 70% - 100% (70-100 marks)
- **B Grade**: 60% - 69% (60-69 marks)
- **C Grade**: 50% - 59% (50-59 marks)
- **D Grade**: 40% - 49% (40-49 marks)
- **F Grade**: Below 40% (0-39 marks)

## 🔄 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection failed":
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use

If port 3000 is already in use:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Not Initializing

If the setup script fails:
```bash
# Drop the database and retry
mongosh
use bips_exam_system
db.dropDatabase()
exit

# Run setup script again
python3 setup_mongodb.py
```

## 📝 Admin Credentials

**Default Admin Login:**
- Username: `admin`
- Password: `BIPS2025Secure!`

⚠️ **Important**: Change these credentials in production!

## 🔮 Future Enhancements

- [ ] Email notifications for results
- [ ] Export results to Excel/PDF
- [ ] Question bank management UI
- [ ] Bulk student registration
- [ ] Proctoring via webcam
- [ ] Timer synchronization across tabs
- [ ] Analytics dashboard

## 📄 License

This project is created for BIPS Technical College - Auxiliary Nurse Department.

## 👥 Support

For issues or questions:
- Check the troubleshooting section
- Review MongoDB and Next.js documentation
- Contact the system administrator

---

**Built with ❤️ for BIPS Technical College**
