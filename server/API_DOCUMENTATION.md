# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require a valid JWT access token. Include it in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional, for validation errors
}
```

---

## Authentication Endpoints

### Student Signup

**POST** `/auth/signup/student`

Register a new student account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "Password1!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "matricNumber": "MAT123456",
  "studentNumber": "STU123456",
  "facultyId": "uuid",
  "departmentId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Sign In

**POST** `/auth/signin`

Authenticate a user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password1!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "isEmailVerified": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Refresh Token

**POST** `/auth/refresh-token`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
    }
  }
}
```

### Forgot Password

**POST** `/auth/forgot-password`

Request a password reset OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### Verify OTP

**POST** `/auth/verify-otp`

Verify the OTP sent to email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### Reset Password

**POST** `/auth/reset-password`

Set a new password using verified OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPassword1!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Logout

**POST** `/auth/logout`

Invalidate the refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Supervisor Onboarding

**POST** `/auth/onboarding/supervisor`

Complete supervisor account setup.

**Request Body:**
```json
{
  "token": "onboarding_token_from_email",
  "password": "Password1!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account setup completed successfully"
}
```

---

## User Profile Endpoints

All endpoints require authentication.

### Get Profile

**GET** `/users/profile`

Get current user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+2348012345678",
    "role": "student",
    "facultyId": "uuid",
    "departmentId": "uuid",
    "profileImage": "https://...",
    "signature": "https://...",
    "isEmailVerified": true,
    "matricNumber": "MAT123456",
    "studentNumber": "STU123456",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile

**PUT** `/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+2348087654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+2348087654321"
  }
}
```

### Change Password

**PUT** `/users/change-password`

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPassword1!",
  "newPassword": "NewPassword1!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Upload Profile Image

**POST** `/users/profile-image`

Upload or update profile image.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `image`
- Max file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP

**Response:**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "profileImage": "https://r2.cloudflarestorage.com/..."
  }
}
```

### Delete Profile Image

**DELETE** `/users/profile-image`

Remove profile image.

**Response:**
```json
{
  "success": true,
  "message": "Profile image deleted successfully"
}
```

### Upload Signature

**POST** `/users/signature`

Upload or update signature.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `signature`
- Max file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP

**Response:**
```json
{
  "success": true,
  "message": "Signature updated successfully",
  "data": {
    "signature": "https://r2.cloudflarestorage.com/..."
  }
}
```

### Delete Signature

**DELETE** `/users/signature`

Remove signature.

**Response:**
```json
{
  "success": true,
  "message": "Signature deleted successfully"
}
```

---

## Supervisor Management (Admin Only)

All endpoints require authentication and admin privileges.

### Create Supervisor

**POST** `/supervisors`

Create a new supervisor account.

**Request Body:**
```json
{
  "email": "supervisor@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "facultyId": "uuid",
  "departmentId": "uuid",
  "isAdmin": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supervisor created successfully. Onboarding email sent.",
  "data": {
    "id": "uuid",
    "email": "supervisor@example.com",
    "firstName": "Jane",
    "lastName": "Doe"
  }
}
```

### Get All Supervisors

**GET** `/supervisors`

Retrieve all supervisors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "supervisor@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "phone": "+2348012345678",
      "facultyId": "uuid",
      "departmentId": "uuid",
      "isActive": true,
      "isEmailVerified": true,
      "isAdmin": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Supervisor by ID

**GET** `/supervisors/:id`

Get a specific supervisor's details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "supervisor@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+2348012345678",
    "facultyId": "uuid",
    "departmentId": "uuid",
    "profileImage": "https://...",
    "signature": "https://...",
    "isActive": true,
    "isEmailVerified": true,
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Supervisor

**PUT** `/supervisors/:id`

Update supervisor information.

**Request Body:**
```json
{
  "firstName": "Janet",
  "lastName": "Doe",
  "phone": "+2348087654321",
  "isAdmin": true,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supervisor updated successfully"
}
```

### Delete Supervisor

**DELETE** `/supervisors/:id`

Delete a supervisor account.

**Response:**
```json
{
  "success": true,
  "message": "Supervisor deleted successfully"
}
```

### Resend Onboarding Email

**POST** `/supervisors/:id/resend-onboarding`

Resend the onboarding email to a supervisor.

**Response:**
```json
{
  "success": true,
  "message": "Onboarding email sent successfully"
}
```

---

## Faculty Endpoints

### Get All Faculties

**GET** `/faculties`

Retrieve all faculties (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Faculty of Engineering",
      "code": "ENG",
      "description": "Engineering and Technology Programs",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Faculty by ID

**GET** `/faculties/:id`

Get a specific faculty with its departments.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Faculty of Engineering",
    "code": "ENG",
    "description": "Engineering and Technology Programs",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "departments": [
      {
        "id": "uuid",
        "name": "Computer Engineering",
        "code": "CPE",
        "facultyId": "uuid"
      }
    ]
  }
}
```

### Create Faculty (Admin Only)

**POST** `/faculties`

Create a new faculty.

**Request Body:**
```json
{
  "name": "Faculty of Agriculture",
  "code": "AGR",
  "description": "Agricultural Sciences"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Faculty created successfully",
  "data": {
    "id": "uuid",
    "name": "Faculty of Agriculture",
    "code": "AGR",
    "description": "Agricultural Sciences"
  }
}
```

### Update Faculty (Admin Only)

**PUT** `/faculties/:id`

Update faculty information.

**Request Body:**
```json
{
  "name": "Faculty of Agricultural Sciences",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Faculty updated successfully",
  "data": {
    "id": "uuid",
    "name": "Faculty of Agricultural Sciences",
    "code": "AGR",
    "description": "Updated description"
  }
}
```

### Delete Faculty (Admin Only)

**DELETE** `/faculties/:id`

Delete a faculty (only if it has no departments).

**Response:**
```json
{
  "success": true,
  "message": "Faculty deleted successfully"
}
```

---

## Department Endpoints

### Get All Departments

**GET** `/departments`

Retrieve all departments (public endpoint).

**Query Parameters:**
- `facultyId` (optional): Filter by faculty ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Computer Engineering",
      "code": "CPE",
      "facultyId": "uuid",
      "description": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Department by ID

**GET** `/departments/:id`

Get a specific department.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Computer Engineering",
    "code": "CPE",
    "facultyId": "uuid",
    "description": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Department (Admin Only)

**POST** `/departments`

Create a new department.

**Request Body:**
```json
{
  "name": "Software Engineering",
  "code": "SWE",
  "facultyId": "uuid",
  "description": "Software Development and Engineering"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": "uuid",
    "name": "Software Engineering",
    "code": "SWE",
    "facultyId": "uuid",
    "description": "Software Development and Engineering"
  }
}
```

### Update Department (Admin Only)

**PUT** `/departments/:id`

Update department information.

**Request Body:**
```json
{
  "name": "Software and Systems Engineering",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "id": "uuid",
    "name": "Software and Systems Engineering",
    "code": "SWE",
    "facultyId": "uuid",
    "description": "Updated description"
  }
}
```

### Delete Department (Admin Only)

**DELETE** `/departments/:id`

Delete a department.

**Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15-minute window per IP address.

When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```