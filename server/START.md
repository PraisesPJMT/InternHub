# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE internhub;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update the database URL:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/internhub
```

**Minimum required configuration:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/internhub
JWT_ACCESS_SECRET=change-this-to-a-random-string
JWT_REFRESH_SECRET=change-this-to-another-random-string
```

### 4. Run Migrations and Seed

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Start the Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 6. Test the API

**Login as Admin:**

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev.praises+admin@gmail.com",
    "password": "Password1!"
  }'
```

You'll receive access and refresh tokens. Use the access token for authenticated requests.

---

## Common Tasks

### Create a Student Account

```bash
curl -X POST http://localhost:5000/api/auth/signup/student \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Password1!",
    "firstName": "John",
    "lastName": "Doe",
    "matricNumber": "MAT2024001",
    "studentNumber": "STU2024001",
    "facultyId": "<faculty_id_from_database>",
    "departmentId": "<department_id_from_database>"
  }'
```

### Get All Faculties (No Auth Required)

```bash
curl http://localhost:5000/api/faculties
```

### Get User Profile (Requires Auth)

```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <your_access_token>"
```

### Create a Supervisor (Admin Only)

```bash
curl -X POST http://localhost:5000/api/supervisors \
  -H "Authorization: Bearer <admin_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supervisor@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "facultyId": "<faculty_id>",
    "departmentId": "<department_id>",
    "isAdmin": false
  }'
```

---

## Optional Services Setup

### Resend Email (Optional)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env`:
```env
RESEND_API_KEY=re_your_api_key
```

### Cloudflare R2 Storage (Optional)

1. Create a Cloudflare account
2. Set up R2 bucket
3. Generate access keys
4. Add to `.env`:
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET_NAME=internhub-uploads
CLOUDFLARE_PUBLIC_URL=https://your-bucket.r2.dev
```

5. Install AWS SDK:
```bash
npm install @aws-sdk/client-s3
```

---

## Troubleshooting

### Database Connection Error

Make sure PostgreSQL is running and the credentials in `.env` are correct.

### Port Already in Use

Change the port in `.env`:
```env
PORT=3000
```

### JWT Errors

Make sure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`.

### Email Not Sending

Email functionality requires Resend API key. Without it, the app will log errors but continue to function.

### File Upload Not Working

File upload requires AWS SDK and Cloudflare R2 configuration. Install the SDK:
```bash
npm install @aws-sdk/client-s3
```

---

## Development Workflow

1. Make changes to code
2. Server auto-reloads (using nodemon)
3. Test endpoints
4. Check logs for errors

### View Database

```bash
npm run db:studio
```

This opens Drizzle Studio in your browser to view and edit database records.

---

## Production Deployment

### Environment Variables

Set these in production:

```env
NODE_ENV=production
DATABASE_URL=<production_database_url>
JWT_ACCESS_SECRET=<strong_random_secret>
JWT_REFRESH_SECRET=<strong_random_secret>
RESEND_API_KEY=<your_resend_key>
FRONTEND_URL=<your_frontend_url>
```

### Start Server

```bash
npm start
```

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start src/server.js --name internhub
pm2 save
pm2 startup
```

---

## Default Admin Credentials

**Email:** dev.praises+admin@gmail.com  
**Password:** Password1!

**⚠️ Change these credentials in production!**

---

## Next Steps

1. Review the [API Documentation](./API_DOCUMENTATION.md)
2. Check out the [README](./README.md) for detailed information
3. Explore the database schema in `src/db/schema.js`
4. Customize email templates in `src/utils/email.js`

---

## Support

For issues, check:
- Database connection
- Environment variables
- Server logs
- API documentation

Happy coding! 🚀