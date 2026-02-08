# 🪟 Windows Setup Guide - VS Code + Vercel + MongoDB Atlas

Complete guide for setting up the BIPS Exam System on Windows with Visual Studio Code, deploying to Vercel, and using MongoDB Atlas.

## 📋 Prerequisites

### Required Software
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- ✅ **Git** - [Download](https://git-scm.com/download/win)
- ✅ **Python 3** - [Download](https://www.python.org/downloads/)

### Required Accounts
- ✅ **Vercel Account** - [Sign up free](https://vercel.com/signup)
- ✅ **MongoDB Atlas** - [Sign up free](https://www.mongodb.com/cloud/atlas/register)
- ✅ **GitHub Account** - [Sign up](https://github.com/join) (optional but recommended)

---

## 🚀 Step-by-Step Setup

### Step 1: Extract the Project

1. **Extract exam-system.zip**
   - Right-click `exam-system.zip`
   - Click "Extract All..."
   - Choose a location (e.g., `C:\Projects\exam-system`)

2. **Open in VS Code**
   - Open VS Code
   - Click `File` → `Open Folder`
   - Navigate to the extracted `exam-system` folder
   - Click `Select Folder`

### Step 2: Install Dependencies

1. **Open Terminal in VS Code**
   - Press `` Ctrl + ` `` (backtick)
   - Or: `Terminal` → `New Terminal`

2. **Install Node.js packages**
   ```bash
   npm install
   ```
   
   Wait for installation to complete (2-3 minutes)

3. **Install Python MongoDB driver**
   ```bash
   pip install pymongo
   ```

### Step 3: Set Up MongoDB Atlas (Cloud Database)

#### 3.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Click **"Build a Database"**
4. Select **"M0 FREE"** tier
5. Choose a cloud provider (AWS recommended)
6. Select a region close to you
7. Name your cluster: `bips-exam-cluster`
8. Click **"Create"**

#### 3.2 Create Database User

1. In the Security → Database Access section
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `bipsadmin`
5. Click **"Autogenerate Secure Password"** (save this!)
6. Select **"Read and write to any database"**
7. Click **"Add User"**

**⚠️ IMPORTANT**: Save your password! Example: `Abc123XyzDEF456`

#### 3.3 Set Up Network Access

1. Go to Security → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

⚠️ **Production Note**: Later, add only Vercel's IP ranges for security

#### 3.4 Get Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Click **"Connect your application"**
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://bipsadmin:<password>@bips-exam-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end:
   ```
   mongodb+srv://bipsadmin:Abc123XyzDEF456@bips-exam-cluster.xxxxx.mongodb.net/bips_exam_system?retryWrites=true&w=majority
   ```

### Step 4: Configure Environment Variables

1. **Open `.env.local` in VS Code**
2. **Replace the MongoDB URI** with your Atlas connection string:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://bipsadmin:YOUR_PASSWORD@bips-exam-cluster.xxxxx.mongodb.net/bips_exam_system?retryWrites=true&w=majority

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=BIPS2025Secure!

# JWT Secret (generate a random string for production)
JWT_SECRET=your-secret-key-change-this-in-production

# Next Auth URL (update for production)
NEXTAUTH_URL=http://localhost:3000
```

3. **Save the file** (`Ctrl + S`)

### Step 5: Initialize Database with Questions

1. **In VS Code Terminal**, run:
   ```bash
   python setup_mongodb_complete.py
   ```

2. **You should see**:
   ```
   ✅ Successfully connected to MongoDB
   ✓ Created questions collection
   ✓ Inserted 100 questions
   ✓ Admin user created successfully
   ```

3. **If you get an error**, check:
   - MongoDB URI is correct
   - Password has no special characters that need encoding
   - Network access is set to "Allow Access from Anywhere"

### Step 6: Test Locally

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   - Go to: `http://localhost:3000`
   
3. **Test as Student**:
   - Enter any name and admission number
   - Check the exam works
   - Try switching tabs (you should get violations)
   - Submit the exam

4. **Test as Admin**:
   - Go to: `http://localhost:3000/admin`
   - Username: `admin`
   - Password: `BIPS2025Secure!`
   - View submissions and results

5. **Stop the server** when done testing:
   - Press `Ctrl + C` in the terminal

---

## 🌐 Deploy to Vercel

### Step 1: Prepare for Deployment

1. **Create `.gitignore`** (already included) - verify it contains:
   ```
   /node_modules
   /.next
   .env*.local
   ```

2. **Create a GitHub repository** (recommended):
   - Go to [GitHub](https://github.com/new)
   - Create a new repository: `bips-exam-system`
   - Don't initialize with README

3. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BIPS Exam System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bips-exam-system.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Website (Easier)

1. **Go to [Vercel](https://vercel.com)**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Click **"Import Project"**
5. Select your `bips-exam-system` repository
6. Click **"Import"**

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

### Step 3: Configure Environment Variables on Vercel

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **"Settings"**
   - Click **"Environment Variables"**

2. **Add these variables**:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | `mongodb+srv://bipsadmin:YOUR_PASSWORD@...` |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | `BIPS2025Secure!` |
   | `JWT_SECRET` | `generate-random-secret-here` |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` |

3. **Click "Save"** for each variable

### Step 4: Redeploy

1. Click **"Deployments"**
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete

### Step 5: Test Production

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Test the exam system**
3. **Test admin dashboard**: `https://your-project.vercel.app/admin`

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'mongodb'"

**Solution**:
```bash
npm install
```

### Issue: "Failed to connect to MongoDB"

**Solutions**:
1. Check your MongoDB URI is correct
2. Verify password doesn't have special characters
3. Check Network Access in MongoDB Atlas
4. Make sure database name is included in URI

### Issue: Python command not found

**Solution**:
- Make sure Python is installed
- Try using `py` instead of `python`:
  ```bash
  py setup_mongodb_complete.py
  ```

### Issue: Port 3000 already in use

**Solution**:
1. **Find process**:
   ```bash
   netstat -ano | findstr :3000
   ```
2. **Kill process**:
   ```bash
   taskkill /PID <PID_NUMBER> /F
   ```
3. **Or use different port**:
   ```bash
   $env:PORT=3001; npm run dev
   ```

### Issue: Vercel deployment fails

**Solutions**:
1. Check all environment variables are set
2. Make sure `.env.local` is in `.gitignore`
3. Check build logs in Vercel dashboard
4. Ensure `package.json` has all dependencies

---

## 📱 Recommended VS Code Extensions

Install these for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **ESLint**
5. **MongoDB for VS Code**

Install via: `Ctrl + Shift + X` → Search → Install

---

## 🔒 Security Checklist for Production

Before going live:

- [ ] Change `ADMIN_PASSWORD` in Vercel environment variables
- [ ] Generate strong `JWT_SECRET` (use: https://generate-secret.vercel.app)
- [ ] Update `NEXTAUTH_URL` to your Vercel domain
- [ ] Restrict MongoDB Atlas IP access to Vercel IPs only
- [ ] Enable MongoDB Atlas backups
- [ ] Set up custom domain (optional)
- [ ] Test all features in production

---

## 📊 MongoDB Atlas Tips

### View Your Data

1. **In MongoDB Atlas**:
   - Go to **"Database"**
   - Click **"Browse Collections"**
   - You'll see:
     - `questions` (100 exam questions)
     - `submissions` (student answers)
     - `students` (student list)
     - `admins` (admin users)

### Enable Backups

1. Go to **"Backup"** tab
2. Enable **"Cloud Backup"**
3. Configure retention policy

### Monitor Usage

1. Go to **"Metrics"** tab
2. View database operations
3. Check storage usage

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (optional):
   - In Vercel Dashboard → Domains
   - Add your custom domain
   - Update DNS settings

2. **Monitor Application**:
   - Check Vercel Analytics
   - Monitor MongoDB Atlas metrics
   - Review error logs

3. **Regular Backups**:
   - MongoDB Atlas auto-backups (if enabled)
   - Export exam data periodically

4. **Update Questions**:
   - Modify `setup_mongodb_complete.py`
   - Run script again to update database
   - Or use MongoDB Atlas UI to edit directly

---

## 🆘 Getting Help

### Check Logs

**Local Development**:
- Check VS Code terminal for errors
- Look for red error messages

**Production (Vercel)**:
- Go to Vercel Dashboard
- Click **"Functions"** → View logs
- Click **"Deployments"** → View build logs

### Common Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## ✅ Success Checklist

You're ready when:

- [x] Project opens in VS Code
- [x] `npm install` completed successfully
- [x] MongoDB Atlas cluster created
- [x] Database initialized with 100 questions
- [x] Runs locally on http://localhost:3000
- [x] Admin login works
- [x] Student exam works
- [x] Deployed to Vercel
- [x] Production URL works
- [x] Environment variables set on Vercel

---

## 🎉 You're All Set!

Your BIPS Exam System is now running on:
- **Local**: http://localhost:3000
- **Production**: https://your-project.vercel.app

**Admin Access**: 
- URL: `/admin`
- Username: `admin`
- Password: `BIPS2025Secure!`

Happy examining! 🎓

---

**Need Help?** Check the main README.md or create an issue on GitHub.
