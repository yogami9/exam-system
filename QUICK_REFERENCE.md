# 🚀 Quick Reference Card - Windows Users

## 📥 First Time Setup (Copy-Paste Commands)

### 1. Open VS Code Terminal (Ctrl + `)

### 2. Install Dependencies
```bash
npm install
pip install pymongo
```

### 3. Update .env.local
Replace `MONGODB_URI` with your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://bipsadmin:YOUR_PASSWORD@bips-exam-cluster.xxxxx.mongodb.net/bips_exam_system?retryWrites=true&w=majority
```

### 4. Initialize Database
```bash
python setup_mongodb_complete.py
```

### 5. Start Development Server
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🌐 MongoDB Atlas Quick Setup

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster**: Click "Build a Database" → M0 FREE
3. **Create user**: Security → Database Access → Add User
   - Username: `bipsadmin`
   - Password: (autogenerate and SAVE IT)
4. **Allow access**: Security → Network Access → Allow Access from Anywhere
5. **Get connection**: Database → Connect → Connect your application
   - Copy the string
   - Replace `<password>` with your password
   - Add `/bips_exam_system` before `?`

---

## 📤 Deploy to Vercel (Copy-Paste)

### Push to GitHub First
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bips-exam-system.git
git push -u origin main
```

### Deploy via Vercel Website
1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables in Settings:
   - `MONGODB_URI` = (your Atlas connection string)
   - `ADMIN_USERNAME` = admin
   - `ADMIN_PASSWORD` = BIPS2025Secure!
   - `JWT_SECRET` = (random string)
   - `NEXTAUTH_URL` = https://your-project.vercel.app
4. Redeploy

---

## 🔑 Default Access

### Local Development
- **Student Portal**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `BIPS2025Secure!`

### Production (After Vercel Deployment)
- **Student Portal**: https://your-project.vercel.app
- **Admin Login**: https://your-project.vercel.app/admin
  - Username: `admin`
  - Password: (whatever you set in Vercel env variables)

---

## 🛠️ Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Git
```bash
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to GitHub
```

### Troubleshooting
```bash
# Port already in use
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Re-install dependencies
rm -rf node_modules
npm install

# Reset database
python setup_mongodb_complete.py
```

---

## 📊 Quick MongoDB Atlas Checks

### View Your Data
1. Go to https://cloud.mongodb.com
2. Click "Database" → "Browse Collections"
3. You'll see:
   - `questions` (100 items)
   - `submissions` (student exams)
   - `students` (registered students)
   - `admins` (admin users)

### Check Connections
1. Go to "Metrics" tab
2. View active connections
3. Monitor operations per second

---

## 🔍 Where to Find Things

### Files
- Questions: `setup_mongodb_complete.py`
- Environment: `.env.local`
- Student page: `app/page.tsx`
- Exam page: `app/exam/page.tsx`
- Admin page: `app/admin/page.tsx`
- API routes: `app/api/`

### Settings
- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/YOUR_USERNAME/bips-exam-system

---

## ⚠️ Important Notes

### Before Going Live
- [ ] Change admin password in Vercel
- [ ] Use strong JWT_SECRET
- [ ] Test everything thoroughly
- [ ] Enable MongoDB backups

### Security
- Never commit `.env.local` to GitHub (already in .gitignore)
- Keep MongoDB password secure
- Change default admin password
- Restrict MongoDB IP access in production

### Support
- Full guide: `WINDOWS_SETUP.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Main docs: `README.md`

---

## 🆘 Emergency Fixes

### Can't connect to MongoDB
```bash
# Check your connection string in .env.local
# Verify password is correct
# Check MongoDB Atlas Network Access
```

### Vercel deployment failed
```bash
# Check environment variables in Vercel
# Check build logs in Vercel dashboard
# Verify all dependencies in package.json
```

### Questions not loading
```bash
# Re-run database setup
python setup_mongodb_complete.py
```

---

## 📱 Test Checklist

- [ ] Homepage loads
- [ ] Can start exam
- [ ] Questions appear (100 total)
- [ ] Timer works
- [ ] Violations detected (try tab switch)
- [ ] Can submit exam
- [ ] Results show correctly
- [ ] Admin login works
- [ ] Submissions visible in admin
- [ ] Statistics calculate correctly

---

## 💡 Pro Tips

1. **Use MongoDB Compass** (GUI) to view database:
   - Download: https://www.mongodb.com/products/compass
   - Connect with your Atlas URI

2. **Vercel Auto-deploys**: Every push to GitHub = automatic deployment

3. **Check Logs**: Vercel → Functions → View logs for errors

4. **Custom Domain**: Add in Vercel → Settings → Domains

5. **Backups**: Enable in MongoDB Atlas → Backup tab

---

**Keep this card handy!** 📌

Print or save for quick reference during setup and deployment.
