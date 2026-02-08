# 📦 Deployment Guide - BIPS Exam System

This guide covers deploying the BIPS Exam System to production environments.

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Set up MongoDB Atlas** (Required for Vercel)
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for development)

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.local`

5. **Deploy**
```bash
vercel --prod
```

### Option 2: VPS (Ubuntu Server)

#### Prerequisites
- Ubuntu 20.04+ server
- Root or sudo access
- Domain name (optional but recommended)

#### Step 1: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Verify installation
```

#### Step 2: Install MongoDB
```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 3: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

#### Step 4: Deploy Application
```bash
# Clone/upload your project
cd /var/www/
sudo git clone <your-repo> exam-system
cd exam-system

# Install dependencies
sudo npm install

# Build the application
sudo npm run build

# Set up environment variables
sudo nano .env.local
# Add your production values

# Initialize database
python3 setup_mongodb_complete.py

# Start with PM2
pm2 start npm --name "bips-exam" -- start
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx
```bash
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/exam-system
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/exam-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Set up SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Step 7: Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Option 3: Docker Deployment

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/bips_exam_system
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=BIPS2025Secure!
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7.0
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

#### Deploy with Docker
```bash
docker-compose up -d
```

## Security Checklist for Production

### 1. Environment Variables
- [ ] Change admin password from default
- [ ] Use strong, unique JWT_SECRET
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Secure MongoDB connection string

### 2. MongoDB Security
- [ ] Enable authentication
- [ ] Create database-specific users
- [ ] Use strong passwords
- [ ] Enable firewall rules
- [ ] Regular backups

```bash
# Enable MongoDB authentication
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "StrongPassword123!",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})
```

### 3. Application Security
- [ ] Enable HTTPS/SSL
- [ ] Set secure headers
- [ ] Configure CORS properly
- [ ] Rate limiting on API routes
- [ ] Input validation
- [ ] SQL injection prevention (using Mongoose helps)

### 4. Server Security
- [ ] Configure firewall
- [ ] Disable root SSH login
- [ ] Use SSH keys
- [ ] Keep system updated
- [ ] Monitor logs

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 5. Monitoring & Backups
- [ ] Set up error logging
- [ ] Monitor server resources
- [ ] Database backups
- [ ] Application monitoring

```bash
# Set up MongoDB daily backups
sudo crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * mongodump --out /backup/mongodb/$(date +\%Y-\%m-\%d)
```

## Performance Optimization

### 1. Enable Caching
```javascript
// next.config.js
module.exports = {
  // ... other config
  images: {
    domains: ['your-domain.com'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. Database Indexing
Already configured in setup script, but verify:
```javascript
// Check indexes
mongosh
use bips_exam_system
db.submissions.getIndexes()
db.questions.getIndexes()
```

### 3. MongoDB Connection Pooling
Already configured in `lib/mongodb.ts`

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs bips-exam
pm2 restart bips-exam
```

### MongoDB Monitoring
```bash
mongosh
use bips_exam_system
db.stats()
db.submissions.stats()
```

## Backup Strategy

### Automated Daily Backups
```bash
#!/bin/bash
# /usr/local/bin/backup-exam-db.sh

BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p $BACKUP_DIR

mongodump \
  --uri="mongodb://localhost:27017/bips_exam_system" \
  --out="$BACKUP_DIR/$DATE"

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: $DATE"
```

Make it executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-exam-db.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-exam-db.sh
```

## Troubleshooting Production Issues

### Application Won't Start
```bash
pm2 logs bips-exam --lines 100
```

### Database Connection Issues
```bash
sudo systemctl status mongod
sudo tail -f /var/log/mongodb/mongod.log
```

### High Memory Usage
```bash
pm2 restart bips-exam
free -h
```

### Nginx Errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## Rollback Procedure

If deployment fails:
```bash
pm2 stop bips-exam
cd /var/www/exam-system
git checkout <previous-commit>
npm install
npm run build
pm2 restart bips-exam
```

## Health Check Endpoint

Add to your application:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

Monitor it:
```bash
curl https://your-domain.com/api/health
```

## Support & Maintenance

### Regular Tasks
- **Daily**: Check logs, monitor disk space
- **Weekly**: Review violation reports, check backups
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Full system audit

### Log Locations
- Application: `pm2 logs bips-exam`
- Nginx: `/var/log/nginx/`
- MongoDB: `/var/log/mongodb/mongod.log`
- System: `/var/log/syslog`

---

**Ready for Production! 🚀**
