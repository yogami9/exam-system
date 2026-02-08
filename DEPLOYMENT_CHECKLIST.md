# ✅ Windows Deployment Checklist

Follow this step-by-step checklist to deploy your BIPS Exam System.

## Part 1: Local Setup (30 minutes)

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] VS Code installed
- [ ] Python 3 installed
- [ ] Git installed

### Extract & Setup
- [ ] Extract exam-system.zip to a folder (e.g., C:\Projects\exam-system)
- [ ] Open folder in VS Code
- [ ] Open terminal in VS Code (Ctrl + `)
- [ ] Run: `npm install`
- [ ] Run: `pip install pymongo`

## Part 2: MongoDB Atlas Setup (15 minutes)

### Create Account & Cluster
- [ ] Sign up at https://www.mongodb.com/cloud/atlas
- [ ] Create a FREE M0 cluster
- [ ] Name it: `bips-exam-cluster`
- [ ] Choose AWS and a region close to you

### Configure Database Access
- [ ] Go to Security → Database Access
- [ ] Add New Database User
- [ ] Username: `bipsadmin`
- [ ] Click "Autogenerate Secure Password"
- [ ] **SAVE PASSWORD**: __________________ (write it down!)
- [ ] Set role: "Read and write to any database"

### Configure Network Access
- [ ] Go to Security → Network Access
- [ ] Add IP Address
- [ ] Click "Allow Access from Anywhere"
- [ ] Confirm

### Get Connection String
- [ ] Go to Database → Connect
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<password>` with your saved password
- [ ] Add `/bips_exam_system` before the `?` in the URL

Example:
```
mongodb+srv://bipsadmin:YOUR_PASSWORD@bips-exam-cluster.xxxxx.mongodb.net/bips_exam_system?retryWrites=true&w=majority
```

## Part 3: Configure Environment Variables

### Update .env.local
- [ ] Open `.env.local` in VS Code
- [ ] Replace `MONGODB_URI` with your Atlas connection string
- [ ] Verify `ADMIN_USERNAME=admin`
- [ ] Verify `ADMIN_PASSWORD=BIPS2025Secure!`
- [ ] Save file (Ctrl + S)

### Your .env.local should look like:
```env
MONGODB_URI=mongodb+srv://bipsadmin:YOUR_PASSWORD@bips-exam-cluster.xxxxx.mongodb.net/bips_exam_system?retryWrites=true&w=majority
ADMIN_USERNAME=admin
ADMIN_PASSWORD=BIPS2025Secure!
JWT_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Part 4: Initialize Database (5 minutes)

### Run Setup Script
- [ ] In VS Code terminal, run: `python setup_mongodb_complete.py`
- [ ] Wait for success message
- [ ] Verify you see: "✅ DATABASE SETUP COMPLETED SUCCESSFULLY!"
- [ ] Should show: "Questions loaded: 100"

## Part 5: Test Locally (10 minutes)

### Start Development Server
- [ ] Run: `npm run dev`
- [ ] Open browser: http://localhost:3000
- [ ] Verify homepage loads

### Test as Student
- [ ] Enter name: "Test Student"
- [ ] Enter admission: "TEST001"
- [ ] Agree to terms
- [ ] Click "Start Exam"
- [ ] Verify 100 questions load
- [ ] Try switching tabs (should get violation warning)
- [ ] Answer a few questions
- [ ] Submit exam
- [ ] Verify results page shows

### Test as Admin
- [ ] Go to: http://localhost:3000/admin
- [ ] Login: `admin` / `BIPS2025Secure!`
- [ ] Verify you see the submission
- [ ] Check Statistics tab
- [ ] Check Violations tab
- [ ] Logout

### Stop Server
- [ ] Press Ctrl + C in terminal

## Part 6: Deploy to Vercel (20 minutes)

### Create Vercel Account
- [ ] Go to https://vercel.com/signup
- [ ] Sign up with GitHub (recommended)

### Push to GitHub (Recommended)
- [ ] Go to https://github.com/new
- [ ] Create repository: `bips-exam-system`
- [ ] Don't initialize with README
- [ ] In VS Code terminal:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bips-exam-system.git
git push -u origin main
```

### Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"
- [ ] Click "Deploy" (will fail - that's OK)

### Add Environment Variables in Vercel
- [ ] Go to Project Settings → Environment Variables
- [ ] Add these variables (copy from your .env.local):

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| MONGODB_URI | Your Atlas connection string | Production, Preview, Development |
| ADMIN_USERNAME | admin | Production, Preview, Development |
| ADMIN_PASSWORD | BIPS2025Secure! | Production, Preview, Development |
| JWT_SECRET | random-secret-here | Production, Preview, Development |
| NEXTAUTH_URL | https://your-project.vercel.app | Production |

- [ ] Click "Save" for each variable

### Redeploy
- [ ] Go to Deployments tab
- [ ] Click "Redeploy" on latest deployment
- [ ] Wait for deployment to complete
- [ ] Should see "Ready" status

## Part 7: Test Production (10 minutes)

### Test Deployment
- [ ] Click "Visit" to open your live site
- [ ] Test as student (create new exam)
- [ ] Test as admin (view submission)
- [ ] Verify everything works

### Security Check
- [ ] MongoDB Atlas shows connections
- [ ] No errors in Vercel logs
- [ ] Admin login works
- [ ] Exam submission works
- [ ] Results display correctly

## Part 8: Production Checklist

### Before Going Live
- [ ] Change ADMIN_PASSWORD in Vercel env variables
- [ ] Generate strong JWT_SECRET (use https://generate-secret.vercel.app)
- [ ] Update NEXTAUTH_URL to your Vercel domain
- [ ] Test exam flow completely
- [ ] Test admin dashboard completely
- [ ] Enable MongoDB Atlas backups

### Optional but Recommended
- [ ] Add custom domain in Vercel
- [ ] Restrict MongoDB Atlas IP access to Vercel IPs only
- [ ] Set up error monitoring
- [ ] Create admin documentation
- [ ] Train staff on admin dashboard

## 🎉 You're Live!

Your exam system is now deployed at:
**https://your-project.vercel.app**

Admin access:
- URL: https://your-project.vercel.app/admin
- Username: admin
- Password: (the one you set in Vercel)

## 📝 Important URLs

- **Your Live Site**: https://your-project.vercel.app
- **Admin Dashboard**: https://your-project.vercel.app/admin
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub Repo**: https://github.com/YOUR_USERNAME/bips-exam-system

## 🆘 Need Help?

If you get stuck:
1. Check WINDOWS_SETUP.md for detailed instructions
2. Check error messages in:
   - VS Code terminal (local)
   - Vercel deployment logs (production)
   - MongoDB Atlas logs
3. Common issues are in the Troubleshooting section

---

**Remember**: 
- Save your MongoDB password!
- Save your Vercel project URL!
- Change default admin password before real exams!

Good luck! 🚀
