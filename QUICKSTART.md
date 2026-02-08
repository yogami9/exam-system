# 🚀 Quick Start Guide - BIPS Exam System

## Prerequisites
✅ Node.js 18+ installed
✅ MongoDB installed and running
✅ Python 3 installed

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Python MongoDB Driver
```bash
pip install pymongo --break-system-packages
# or
pip3 install pymongo
```

### 3. Start MongoDB
**Ubuntu/Linux:**
```bash
sudo systemctl start mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

### 4. Initialize Database
```bash
python3 setup_mongodb_complete.py
```

### 5. Start the Application
```bash
npm run dev
```

### 6. Access the System
- **Student Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## Default Admin Credentials
- **Username**: admin
- **Password**: BIPS2025Secure!

## Test the System

### As a Student:
1. Go to http://localhost:3000
2. Enter any name and admission number
3. Agree to terms and start the exam
4. Answer questions and submit
5. View your auto-graded results

### As an Admin:
1. Go to http://localhost:3000/admin
2. Login with credentials above
3. View submissions, results, and violations

## Troubleshooting

### MongoDB Won't Start?
```bash
# Check status
sudo systemctl status mongod

# View logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart
sudo systemctl restart mongod
```

### Port 3000 Already in Use?
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Database Not Initializing?
```bash
# Connect to MongoDB and drop database
mongosh
use bips_exam_system
db.dropDatabase()
exit

# Re-run setup script
python3 setup_mongodb_complete.py
```

## Key Features to Test

1. **Security Features**:
   - Try switching tabs (you'll get a violation warning)
   - Try copying text (prevented)
   - Try right-clicking (disabled)
   - After 2 violations, you'll be banned

2. **Timer**: 2-hour countdown with warnings at 10 and 5 minutes

3. **Auto-grading**: Scores calculated immediately after submission

4. **Admin Dashboard**: 
   - View all submissions
   - See statistics
   - Review violation reports

## Production Deployment

Before deploying to production:

1. **Update `.env.local`**:
   - Change admin password
   - Use strong JWT secret
   - Update MongoDB URI for production

2. **Build the application**:
   ```bash
   npm run build
   npm start
   ```

3. **Set up MongoDB backups**

4. **Configure reverse proxy** (nginx/Apache)

5. **Enable HTTPS**

## Support

For issues:
1. Check the main README.md
2. Review troubleshooting section
3. Check MongoDB and Next.js logs

---

**Ready to go!** 🎓
