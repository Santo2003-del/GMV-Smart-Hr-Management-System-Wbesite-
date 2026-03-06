# VPS Deployment Guide - Smart HRMS

Follow these steps to resolve the **502 Bad Gateway** and get your live site running perfectly.

## 1. Environment Configuration (.env)

### Backend (.env on VPS)
Location: `Backend/.env`
```env
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=your_production_mongodb_uri

# Redis (Set to false if you don't have Redis installed on VPS)
USE_REDIS=false
DISABLE_RATE_LIMIT=false

# Security
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES=7d

# Super Admin
SUPER_ADMIN_EMAIL=SuperAdmin@gmv.com
SUPER_ADMIN_PASSWORD=your_secure_password

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=reportsinsider@gmail.com
SMTP_PASS=your_gmail_app_password
```

### Frontend (.env on VPS)
Location: `frontend/.env`
```env
REACT_APP_API_URL=https://smarthrms.cloud/api
```
> [!IMPORTANT]
> Since you are using a domain, the API URL MUST use `https`.

## 2. Resolving 502 & Cleaning Processes

Your PM2 currently has duplicate processes (`smarthrms` and `hrms-backend`) which are fighting for the same port. Follow this exactly:

### Step 1: Clean PM2
```bash
pm2 delete all
pm2 save
```

### Step 2: Start Only the New Backend
```bash
cd /var/www/smarthrms/Backend
pm2 start server.js --name "hrms-backend"
pm2 save
```

### Step 3: Check for Errors
If you still see 502, run this and look for the error message (like "MongoDB Connection Error"):
```bash
pm2 logs hrms-backend --lines 50
```

---

## 3. Important Notes
- **MongoDB**: Make sure your `MONGO_URI` in `Backend/.env` is correct. If the backend can't connect to the database, it won't start, and you will get a 502 error.
- **Port**: Nginx expects the server on port 5000. Ensure `PORT=5000` is in your `Backend/.env`.
