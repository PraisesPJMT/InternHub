# InternHub API

A comprehensive Node.js Express application for managing students and supervisors with JWT authentication, file uploads to Cloudflare R2, and email notifications via Resend.

## Features

- 🔐 JWT Authentication (Access & Refresh Tokens)
- 👥 Two User Types: Students and Supervisors
- 👑 Admin Role Management
- 📧 Email Notifications (Welcome, OTP, Onboarding)
- 🖼️ Profile Images & Signatures (Cloudflare R2)
- 🏫 Faculty & Department Management
- 🔒 Secure Password Reset with OTP
- ✅ Input Validation with Zod
- 🛡️ Security Best Practices (Helmet, CORS, Rate Limiting)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Storage:** Cloudflare R2 (S3-compatible)
- **Email Service:** Resend
- **Validation:** Zod
- **File Upload:** Multer

## Project Structure

```
internhub/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── supervisorController.js
│   │   └── facultyDepartmentController.js
│   ├── db/
│   │   ├── schema.js
│   │   ├── index.js
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   └── migrations/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── supervisorRoutes.js
│   │   └── facultyDepartmentRoutes.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── email.js
│   │   └── storage.js
│   └── server.js
├── .env.example
├── package.json
├── drizzle.config.js
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Resend API Key
- Cloudflare R2 Account (optional for file uploads)

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd internhub

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/internhub

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key

# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-cloudflare-access-key-id
CLOUDFLARE_SECRET_ACCESS_KEY=your-cloudflare-secret-access-key
CLOUDFLARE_BUCKET_NAME=internhub-uploads
CLOUDFLARE_PUBLIC_URL=https://your-bucket-url.r2.dev

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# OTP Configuration
OTP_EXPIRY_MINUTES=10
```

### 4. Database Setup

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

This will create:
- 5 Faculties (Engineering, Science, Arts, Medicine, Law)
- 17 Departments across different faculties
- 1 Admin user with credentials:
  - Email: dev.praises+admin@gmail.com
  - Password: Password1!

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup/student` | Student registration | No |
| POST | `/api/auth/signin` | User login | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/forgot-password` | Request password reset OTP | No |
| POST | `/api/auth/verify-otp` | Verify OTP | No |
| POST | `/api/auth/reset-password` | Reset password with OTP | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/onboarding/supervisor` | Complete supervisor onboarding | No |

### User Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get current user profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| PUT | `/api/users/change-password` | Change password | Yes |
| POST | `/api/users/profile-image` | Upload profile image | Yes |
| DELETE | `/api/users/profile-image` | Delete profile image | Yes |
| POST | `/api/users/signature` | Upload signature | Yes |
| DELETE | `/api/users/signature` | Delete signature | Yes |

### Supervisors (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/supervisors` | Create supervisor | Admin |
| GET | `/api/supervisors` | Get all supervisors | Admin |
| GET | `/api/supervisors/:id` | Get supervisor by ID | Admin |
| PUT | `/api/supervisors/:id` | Update supervisor | Admin |
| DELETE | `/api/supervisors/:id` | Delete supervisor | Admin |
| POST | `/api/supervisors/:id/resend-onboarding` | Resend onboarding email | Admin |

### Faculties

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/faculties` | Get all faculties | No |
| GET | `/api/faculties/:id` | Get faculty by ID | No |
| POST | `/api/faculties` | Create faculty | Admin |
| PUT | `/api/faculties/:id` | Update faculty | Admin |
| DELETE | `/api/faculties/:id` | Delete faculty | Admin |

### Departments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/departments` | Get all departments | No |
| GET | `/api/departments/:id` | Get department by ID | No |
| POST | `/api/departments` | Create department | Admin |
| PUT | `/api/departments/:id` | Update department | Admin |
| DELETE | `/api/departments/:id` | Delete department | Admin |

## User Flows

### Student Registration Flow

1. Student signs up with email, password, matric number, and student number
2. System creates user account and sends verification OTP
3. Student verifies email with OTP
4. Student can now log in and access the platform

### Supervisor Onboarding Flow

1. Admin creates supervisor account with email and basic info
2. System generates onboarding token and sends email with setup link
3. Supervisor clicks link and sets their password
4. Supervisor account is activated and can now log in

### Password Reset Flow

1. User requests password reset with email
2. System sends OTP to email
3. User verifies OTP
4. User sets new password with verified OTP
5. All existing sessions are invalidated

## Database Schema

### Users Table
- Core user information (email, name, phone, role)
- Faculty and Department references
- Profile image and signature URLs
- Account status flags

### Students Table
- Links to Users table
- Matric number
- Student number

### Supervisors Table
- Links to Users table
- Admin flag
- Onboarding token and expiry

### Faculties Table
- Faculty name and code
- Description

### Departments Table
- Department name and code
- Faculty reference
- Description

### Refresh Tokens Table
- Stores valid refresh tokens
- User reference
- Expiry timestamp

### OTPs Table
- Email and OTP code
- Type (email_verification, password_reset)
- Expiry timestamp
- Used flag

## Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT with separate access and refresh tokens
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- OTP expiry (configurable, default 10 minutes)
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Input validation with Zod
- SQL injection protection via Drizzle ORM

## File Upload

Files are uploaded to Cloudflare R2 (S3-compatible storage):

- **Profile Images:** Stored in `profiles/` folder
- **Signatures:** Stored in `signatures/` folder
- **Max File Size:** 5MB
- **Allowed Formats:** JPEG, PNG, GIF, WebP
- Old files are automatically deleted when new ones are uploaded

## Email Templates

The system sends emails for:

1. **Welcome Email** - After successful registration
2. **OTP Email** - For email verification and password reset
3. **Supervisor Onboarding** - With setup link
4. **Password Reset Success** - Confirmation email

## Development

### Running Drizzle Studio

```bash
npm run db:studio
```

This opens a web interface to view and manage your database.

### Database Migrations

```bash
# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate
```

## Testing

Test the API using tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

Example login request:

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev.praises+admin@gmail.com",
    "password": "Password1!"
  }'
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong, random secrets for JWT tokens
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use environment variables for all sensitive data
6. Set up database backups
7. Monitor error logs
8. Configure proper rate limiting
9. Use a process manager (PM2, systemd)

## License

ISC

## Support

For issues or questions, please open an issue on the repository.