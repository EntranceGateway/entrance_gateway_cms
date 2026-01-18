# Entrance Gateway API Documentation

## Base Information

- **Base URL**: `http://localhost:8080/api/v1`
- **API Version**: v1
- **Server Port**: 8080
- **Authentication**: JWT Bearer Token
- **Date**: January 9, 2026

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Admin APIs](#admin-apis)
4. [Audit Logs APIs](#audit-logs-apis)
5. [Category APIs](#category-apis)
6. [Course APIs](#course-apis)
7. [College APIs](#college-apis)
8. [Training APIs](#training-apis)
9. [Syllabus APIs](#syllabus-apis)
10. [Note APIs](#note-apis)
11. [MCQ Question APIs](#mcq-question-apis)
12. [Question Set APIs](#question-set-apis)
13. [Quiz Attempt APIs](#quiz-attempt-apis)
14. [Old Question Collection APIs](#old-question-collection-apis)
15. [Advertisement APIs](#advertisement-apis)
16. [Dashboard APIs](#dashboard-apis)
17. [Blog APIs](#blog-apis)
18. [Contact Us APIs](#contact-us-apis)
19. [Notice APIs](#notice-apis)

---

## Authentication APIs

### 1. User Login
**Endpoint**: `POST /api/v1/auth/login`  
**Authentication**: None  
**Description**: Login for both users and admins. Returns access token and refresh token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Login Successful as USER",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890-1a2b3c4d-5e6f-7890-abcd-ef1234567890",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| userId | Long | User's unique identifier |
| accessToken | String | JWT access token (expires in 15 minutes) |
| refreshToken | String | Refresh token for obtaining new access tokens (expires in 7 days) |
| tokenType | String | Token type (always "Bearer") |
| expiresIn | Long | Access token expiration time in seconds |

---

### 2. User Registration
**Endpoint**: `POST /api/v1/auth/user/register`  
**Authentication**: None  
**Description**: Register a new user account (OTP will be sent to email)

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890"
}
```

**Response**:
```json
{
  "message": "Success and OTP sent",
  "data": null
}
```

---

### 3. Admin Registration
**Endpoint**: `POST /api/v1/auth/admin/register`  
**Authentication**: None  
**Description**: Register a new admin account

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "adminPassword123",
  "fullName": "Admin User"
}
```

**Response**:
```json
{
  "message": "Success",
  "data": {
    "adminId": 1,
    "email": "admin@example.com",
    "fullName": "Admin User"
  }
}
```

---

### 4. Verify OTP
**Endpoint**: `POST /api/v1/auth/user/verify-otp`  
**Authentication**: None  
**Description**: Verify email with OTP after registration

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "message": "OTP verified successfully",
  "data": {
    "userId": 1,
    "email": "newuser@example.com",
    "verified": true
  }
}
```

---

### 5. Refresh Token
**Endpoint**: `POST /api/v1/auth/refresh-token`  
**Authentication**: None  
**Description**: Get a new access token using a valid refresh token

**Request Body**:
```json
{
  "refreshToken": "uuid-string-refresh-token"
}
```

**Response**:
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "uuid-string-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

**Error Response** (Invalid/Expired Token):
```json
{
  "error": "Refresh token has expired. Please login again."
}
```

---

### 6. Revoke Refresh Token
**Endpoint**: `POST /api/v1/auth/revoke-token`  
**Authentication**: None  
**Description**: Revoke a specific refresh token (useful for logout from specific devices)

**Request Body**:
```json
{
  "refreshToken": "uuid-string-refresh-token"
}
```

**Response**:
```json
{
  "message": "Refresh token revoked successfully",
  "data": null
}
```

---

### 7. Logout
**Endpoint**: `POST /api/v1/auth/logout`  
**Authentication**: Required  
**Description**: Logout current user session. Optionally provide refresh token to revoke it.

**Request Body** (Optional):
```json
{
  "refreshToken": "uuid-string-refresh-token"
}
```

**Response**:
```json
{
  "message": "Logout successful",
  "data": null
}
```

---

## User APIs

### 1. Get User Details
**Endpoint**: `GET /api/v1/user/me`  
**Authentication**: Required (USER)  
**Description**: Get current logged-in user details

**Response**:
```json
{
  "message": "User details fetched successfully",
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+1234567890"
  }
}
```

---

### 2. Change Password
**Endpoint**: `POST /api/v1/user/change-password`  
**Authentication**: Required (USER)  
**Description**: Change password for the currently authenticated user

**Request Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response**:
```json
{
  "message": "Password changed successfully",
  "data": null
}
```

**Error Responses**:
- `400 Bad Request` - Passwords don't match or new password same as current
- `401 Unauthorized` - Current password is incorrect

---

### 3. Forgot Password (Request OTP)
**Endpoint**: `POST /api/v1/user/forgot-password`  
**Authentication**: None  
**Description**: Request a password reset OTP. OTP will be sent to the registered email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "message": "Password reset OTP sent to your email",
  "data": null
}
```

**Error Responses**:
- `404 Not Found` - No account found with this email
- `400 Bad Request` - Account not verified
- `429 Too Many Requests` - Too many OTP requests

**Notes**:
- OTP expires in 2 minutes
- Maximum 3 OTP requests per minute

---

### 4. Reset Password (with OTP)
**Endpoint**: `POST /api/v1/user/reset-password`  
**Authentication**: None  
**Description**: Reset password using OTP received via email

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response**:
```json
{
  "message": "Password reset successfully",
  "data": null
}
```

**Error Responses**:
- `400 Bad Request` - Invalid/expired OTP or passwords don't match
- `404 Not Found` - User not found
- `429 Too Many Requests` - Too many failed OTP attempts

### 5. Update Profile
**Endpoint**: `PUT /api/v1/user/{id}/update-profile`
**Authentication**: Required (USER)
**Description**: Update user profile details.

**Request Body**:
```json
{
  "fullName": "John Updated",
  "phoneNumber": "9876543210"
}
```

**Response**:
```json
{
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

## Admin APIs

### 1. Get Admin Details
**Endpoint**: `GET /api/v1/admin/me`  
**Authentication**: Required (ADMIN)  
**Description**: Get current logged-in admin details

**Response**:
```json
{
  "message": "Admin details fetched successfully",
  "data": {
    "adminId": 1,
    "email": "admin@example.com",
    "fullName": "Admin User"
  }
}
```

---

## Audit Logs APIs

> **Note**: All Audit Log endpoints require SUPER_ADMIN authentication.

### 1. Get All Audit Logs
**Endpoint**: `GET /api/v1/audit-logs`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve all audit logs with pagination and sorting

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number (0-based) |
| size | int | 20 | Page size |
| sortBy | string | timestamp | Field to sort by |
| sortDir | string | desc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "Audit logs retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "adminEmail": "admin@example.com",
        "adminName": "Admin User",
        "adminRole": "SUPER_ADMIN",
        "action": "CREATE",
        "entityType": "Blog",
        "entityId": "550e8400-e29b-41d4-a716-446655440000",
        "description": "CREATE operation on Blog with ID: 550e8400-e29b-41d4-a716-446655440000",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "requestUri": "/api/v1/blogs",
        "requestMethod": "POST",
        "responseStatus": 201,
        "timestamp": "2026-01-07T14:30:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "pageNumber": 0,
    "pageSize": 20,
    "last": false
  }
}
```

---

### 2. Get Audit Log by ID
**Endpoint**: `GET /api/v1/audit-logs/{id}`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve a specific audit log by its ID

**Response**:
```json
{
  "message": "Audit log retrieved successfully",
  "data": {
    "id": 1,
    "adminEmail": "admin@example.com",
    "adminName": "Admin User",
    "adminRole": "ADMIN",
    "action": "UPDATE",
    "entityType": "Course",
    "entityId": "550e8400-e29b-41d4-a716-446655440000",
    "description": "UPDATE operation on Course with ID: 550e8400-e29b-41d4-a716-446655440000",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "requestUri": "/api/v1/courses/550e8400-e29b-41d4-a716-446655440000",
    "requestMethod": "PUT",
    "responseStatus": 200,
    "timestamp": "2026-01-07T14:30:00"
  }
}
```

---

### 3. Get Audit Logs by Admin Email
**Endpoint**: `GET /api/v1/audit-logs/by-admin`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve all audit logs for a specific admin

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Admin email address |
| page | int | No | Page number (default: 0) |
| size | int | No | Page size (default: 20) |
| sortBy | string | No | Sort field (default: timestamp) |
| sortDir | string | No | Sort direction (default: desc) |

---

### 4. Get Audit Logs by Action Type
**Endpoint**: `GET /api/v1/audit-logs/by-action`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve audit logs filtered by action type

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| action | enum | Yes | Action type (see available actions below) |

**Available Actions**:
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `LOGOUT` - User logout
- `CREATE` - Create operation
- `UPDATE` - Update operation
- `DELETE` - Delete operation
- `PASSWORD_CHANGE` - Password change
- `ROLE_CHANGE` - Role modification
- `TOKEN_REFRESH` - Token refresh
- `TOKEN_REVOKE` - Token revocation

---

### 5. Get Audit Logs by Entity Type
**Endpoint**: `GET /api/v1/audit-logs/by-entity`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve audit logs filtered by entity type

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| entityType | string | Yes | Entity type (Blog, Course, College, Admin, User, etc.) |

---

### 6. Get Audit Logs by Date Range
**Endpoint**: `GET /api/v1/audit-logs/by-date-range`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve audit logs within a specific date range

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | datetime | Yes | Start date (ISO format: yyyy-MM-ddTHH:mm:ss) |
| endDate | datetime | Yes | End date (ISO format: yyyy-MM-ddTHH:mm:ss) |

**Example**: `GET /api/v1/audit-logs/by-date-range?startDate=2026-01-01T00:00:00&endDate=2026-01-07T23:59:59`

---

### 7. Get Login Attempts
**Endpoint**: `GET /api/v1/audit-logs/login-attempts`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Retrieve all login attempts (success and failed) for security monitoring

**Response includes**:
- Successful login attempts
- Failed login attempts with reason
- IP addresses
- Timestamps

---

### 8. Get Available Action Types
**Endpoint**: `GET /api/v1/audit-logs/actions`  
**Authentication**: Required (SUPER_ADMIN)  
**Description**: Get list of all available audit action types

**Response**:
```json
{
  "message": "Available audit actions",
  "data": [
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "LOGOUT",
    "CREATE",
    "UPDATE",
    "DELETE",
    "PASSWORD_CHANGE",
    "ROLE_CHANGE",
    "TOKEN_REFRESH",
    "TOKEN_REVOKE"
  ]
}
```

---

## Category APIs

### 1. Get All Categories (Paginated)
**Endpoint**: `GET /api/v1/categories`  
**Authentication**: None  
**Description**: Get paginated list of all categories with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | categoryName | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "Categories fetched successfully",
  "data": {
    "content": [
      {
        "categoryId": "uuid",
        "categoryName": "Mathematics",
        "description": "Math category"
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Category by ID
**Endpoint**: `GET /api/v1/categories/{id}`  
**Authentication**: None  
**Description**: Get a specific category by ID

**Response**:
```json
{
  "message": "Category fetched successfully",
  "data": {
    "categoryId": "uuid",
    "categoryName": "Mathematics",
    "description": "Math category"
  }
}
```

---

### 3. Create Category
**Endpoint**: `POST /api/v1/categories`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Create a new category

**Request Body**:
```json
{
  "categoryName": "Science",
  "description": "Science category"
}
```

**Response**:
```json
{
  "message": "Category created successfully",
  "data": {
    "categoryId": "uuid",
    "categoryName": "Science",
    "description": "Science category"
  }
}
```

---

### 4. Update Category
**Endpoint**: `PUT /api/v1/categories/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing category

**Request Body**:
```json
{
  "categoryName": "Updated Science",
  "description": "Updated description"
}
```

**Response**:
```json
{
  "message": "Category updated successfully",
  "data": {
    "categoryId": "uuid",
    "categoryName": "Updated Science",
    "description": "Updated description"
  }
}
```

---

### 5. Delete Category
**Endpoint**: `DELETE /api/v1/categories/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a category

**Response**:
```json
{
  "message": "Category deleted successfully",
  "data": null
}
```

---

## Course APIs

### 1. Get All Courses (Paginated)
**Endpoint**: `GET /api/v1/courses`  
**Authentication**: None  
**Description**: Get paginated list of all courses with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | courseName | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of courses",
  "data": {
    "content": [
      {
        "courseId": "uuid",
        "courseName": "Computer Science",
        "affiliation": "TU",
        "duration": "4 years",
        "colleges": []
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Course by ID
**Endpoint**: `GET /api/v1/courses/{id}`  
**Authentication**: None  
**Description**: Get a specific course by ID

**Response**:
```json
{
  "message": "Course details",
  "data": {
    "courseId": "uuid",
    "courseName": "Computer Science",
    "affiliation": "TU",
    "duration": "4 years",
    "colleges": []
  }
}
```

---

### 3. Create Course
**Endpoint**: `POST /api/v1/courses`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Create a new course

**Request Body**:
```json
{
  "courseName": "Information Technology",
  "affiliation": "TU",
  "duration": "4 years",
  "collegeId": "uuid"
}
```

**Response**:
```json
{
  "message": "Course created successfully",
  "data": {
    "courseId": "uuid",
    "courseName": "Information Technology",
    "affiliation": "TU",
    "duration": "4 years"
  }
}
```

---

### 4. Update Course
**Endpoint**: `PUT /api/v1/courses/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing course

**Request Body**:
```json
{
  "courseName": "Updated IT",
  "affiliation": "PU",
  "duration": "3 years"
}
```

**Response**:
```json
{
  "message": "Course updated successfully",
  "data": {
    "courseId": "uuid",
    "courseName": "Updated IT",
    "affiliation": "PU",
    "duration": "3 years"
  }
}
```

---

### 5. Delete Course
**Endpoint**: `DELETE /api/v1/courses/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a course

**Response**:
```json
{
  "message": "Course deleted successfully",
  "data": null
}
```

---

### 6. Get Courses by Affiliation
**Endpoint**: `GET /api/v1/courses/by-affiliation`  
**Authentication**: None  
**Description**: Get courses filtered by affiliation with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| affiliation | string | required | Affiliation name |
| page | int | 0 | Page number |
| size | int | 10 | Page size |

**Response**:
```json
{
  "message": "affiliated with TU",
  "data": {
    "content": [],
    "totalElements": 20,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 7. Get Colleges by Course
**Endpoint**: `GET /api/v1/courses/colleges/by-courses`  
**Authentication**: None  
**Description**: Get colleges offering a specific course

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| courseId | UUID | required | Course ID |
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | courseName | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "College for: {courseId}",
  "data": {
    "content": [],
    "totalElements": 15,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 8. Get Full Syllabus by Course ID
**Endpoint**: `GET /api/v1/courses/full-syllabus/{courseId}`  
**Authentication**: None  
**Description**: Get complete syllabus for a course

**Response**:
```json
{
  "message": "Full syllabus for course: {courseId}",
  "data": []
}
```

---

## College APIs

### 1. Get All Colleges (Paginated)
**Endpoint**: `GET /api/v1/colleges`  
**Authentication**: None  
**Description**: Get paginated list of all colleges with sorting options.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number (0-based) |
| size | int | 10 | Page size |
| sortBy | string | collegeName | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of colleges",
  "data": {
    "content": [
      {
        "collegeId": 1,
        "collegeName": "Harvard University",
        "location": "Cambridge, MA",
        "affiliation": "FOREIGN_UNIVERSITY",
        "website": "https://harvard.edu",
        "contact": "+1 1234567890",
        "email": "info@harvard.edu",
        "description": "Leading research university...",
        "establishedYear": "1636",
        "collegeType": "PRIVATE",
        "priority": "HIGH",
        "logoName": "logo_uuid.jpg",
        "collegePictureName": ["pic1.jpg", "pic2.jpg"],
        "courses": []
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
    "pageNumber": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get College by ID
**Endpoint**: `GET /api/v1/colleges/{id}`  
**Authentication**: None  
**Description**: Get details of a specific college by its ID.

**Path Variables**:
| Variable | Type | Description |
|----------|------|-------------|
| id | Long | College ID |

**Response**:
```json
{
  "message": "College details for id: 1",
  "data": {
    "collegeId": 1,
    "collegeName": "Harvard University",
    "location": "Cambridge, MA",
    "affiliation": "FOREIGN_UNIVERSITY",
    "website": "https://harvard.edu",
    "contact": "+1 1234567890",
    "email": "info@harvard.edu",
    "description": "Leading research university...",
    "establishedYear": "1636",
    "collegeType": "PRIVATE",
    "priority": "HIGH",
    "logoName": "logo_uuid.jpg",
    "collegePictureName": ["pic1.jpg", "pic2.jpg"],
    "courses": []
  }
}
```

---

### 3. Create College
**Endpoint**: `POST /api/v1/colleges`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: `multipart/form-data`  
**Description**: Create a new college. Requires details JSON and image files.

**Request Parts**:
1. **college** (JSON Object):
   ```json
   {
     "collegeName": "MIT",
     "location": "Cambridge, MA",
     "affiliation": "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY", 
     "priority": "HIGH",
     "website": "https://mit.edu",
     "contact": "+1 9876543210",
     "email": "admissions@mit.edu",
     "description": "Massachusetts Institute of Technology...",
     "establishedYear": "1861",
     "collegeType": "PRIVATE"
   }
   ```
   > **Note**: `affiliation` values: `NEB`, `TRIBHUVAN_UNIVERSITY`, `POKHARA_UNIVERSITY`, `KATHMANDU_UNIVERSITY`, `PURWANCHAL_UNIVERSITY`, `MID_WESTERN_UNIVERSITY`, `FAR_WESTERN_UNIVERSITY`, `LUMBINI_UNIVERSITY`, `CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY`.
   > **Note**: `collegeType` values: `PRIVATE`, `COMMUNITY`, `GOVERNMENT`.
   > **Note**: `priority` values: `HIGH`, `MEDIUM`, `LOW`.

2. **logo** (File): Image file for college logo.
3. **images** (List<File>): List of image files for college gallery.

**Response**:
```json
{
  "message": "success",
  "data": {
    "collegeId": 2,
    "collegeName": "MIT",
    "location": "Cambridge, MA",
    ...
  }
}
```

---

### 4. Update College
**Endpoint**: `PUT /api/v1/colleges/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: `multipart/form-data`  
**Description**: Update an existing college. Similar structure to Create College.

**Path Variables**:
| Variable | Type | Description |
|----------|------|-------------|
| id | Long | College ID |

**Request Parts**:
*   `college` (JSON):
    ```json
    {
      "collegeName": "Updated MIT",
      "location": "Cambridge, MA, USA",
      "affiliation": "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY",
      "priority": "HIGH",
      "website": "https://mit.edu/updated",
      "contact": "+1 5555555555",
      "email": "updated.info@mit.edu",
      "description": "Updated description for MIT...",
      "establishedYear": "1861",
      "collegeType": "PRIVATE"
    }
    ```
*   `logo` (File, Optional): New logo to replace existing.
*   `images` (List<File>, Optional): New images to replace existing.

**Response**:
```json
{
  "message": "success",
  "data": { ... }
}
```

---

### 5. Delete College
**Endpoint**: `DELETE /api/v1/colleges/{id}`  
**Authentication**: Required (Authenticated User)  
**Description**: Delete a college permanently.

**Response**:
```json
{
  "message": "College deleted with id: 1",
  "data": null
}
```

---

### 6. Search Colleges
**Endpoint**: `GET /api/v1/colleges/search`  
**Authentication**: None  
**Description**: Search colleges by name keyword.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | String | Yes | Keyword to search in college name |
| page | int | No | Page number (default: 0) |
| size | int | No | Page size (default: 10) |
| sortBy | string | No | Sort field (default: collegeName) |
| sortDir | string | No | Sort direction (default: asc) |

**Response**:
```json
{
  "message": "Search results MIT",
  "data": { ... }
}
```

---

### 7. Add Course to College
**Endpoint**: `POST /api/v1/colleges/{collegeId}/courses/{courseId}`  
**Authentication**: Required (Authenticated User)  
**Description**: Link an existing course to a college.

**Path Variables**:
| Variable | Type | Description |
|----------|------|-------------|
| collegeId | Long | College ID |
| courseId | Long | Course ID |

**Response**:
```json
{
  "message": "Course with id: {courseId} added to college with id: {collegeId}",
  "data": ...
}
```

---

### 8. Remove Course from College
**Endpoint**: `DELETE /api/v1/colleges/{collegeId}/courses/{courseId}`  
**Authentication**: Required (Authenticated User)  
**Description**: Unlink a course from a college.

**Path Variables**:
| Variable | Type | Description |
|----------|------|-------------|
| collegeId | Long | College ID |
| courseId | Long | Course ID |

**Response**:
```json
{
  "message": "Course with id: {courseId} removed from college with id: {collegeId}",
  "data": ...
}
```

---

### 9. Get Colleges by Course
**Endpoint**: `GET /api/v1/colleges/by-course/{courseId}`  
**Authentication**: None  
**Description**: Get all colleges that offer a specific course.

**Path Variables**:
| Variable | Type | Description |
|----------|------|-------------|
| courseId | Long | Course ID |

**Response**:
```json
{
  "message": "Colleges offering course: {courseId}",
  "data": [
    {
      "collegeId": 1,
      "collegeName": "Harvard University",
      ...
    }
  ]
}
```

---

## Training APIs

### 1. Get All Trainings (Paginated)
**Endpoint**: `GET /api/v1/trainings`  
**Authentication**: None  
**Description**: Get paginated list of all trainings with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | trainingStatus | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of trainings",
  "data": {
    "content": [
      {
        "trainingId": "uuid",
        "trainingName": "Java Programming",
        "trainingStatus": "ACTIVE",
        "duration": "3 months"
      }
    ],
    "totalElements": 30,
    "totalPages": 3,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Training by ID
**Endpoint**: `GET /api/v1/trainings/{id}`  
**Authentication**: None  
**Description**: Get a specific training by ID

**Response**:
```json
{
  "message": "Training details for id: {id}",
  "data": {
    "trainingId": "uuid",
    "trainingName": "Java Programming",
    "trainingStatus": "ACTIVE",
    "duration": "3 months"
  }
}
```

---

### 3. Create Training
**Endpoint**: `POST /api/v1/trainings`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Create a new training

**Request Body**:
```json
{
  "trainingName": "Python Programming",
  "trainingStatus": "ACTIVE",
  "duration": "2 months",
  "description": "Complete Python course"
}
```

**Response**:
```json
{
  "message": "success",
  "data": {
    "trainingId": "uuid",
    "trainingName": "Python Programming",
    "trainingStatus": "ACTIVE"
  }
}
```

---

### 4. Update Training
**Endpoint**: `PUT /api/v1/trainings/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing training

**Response**:
```json
{
  "message": "Training updated with id: {id}",
  "data": null
}
```

---

### 5. Delete Training
**Endpoint**: `DELETE /api/v1/trainings/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a training

**Response**:
```json
{
  "message": "Training deleted with id: {id}",
  "data": null
}
```

---

## Syllabus APIs

### 1. Get All Syllabuses (Paginated)
**Endpoint**: `GET /api/v1/syllabus`  
**Authentication**: None  
**Description**: Get paginated list of all syllabuses with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | syllabusTitle | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of syllabus",
  "data": {
    "content": [
      {
        "syllabusId": "uuid",
        "syllabusTitle": "Data Structures",
        "semester": 3,
        "subjectName": "DSA",
        "fileName": "syllabus.pdf"
      }
    ],
    "totalElements": 60,
    "totalPages": 6,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Syllabus by ID
**Endpoint**: `GET /api/v1/syllabus/{id}`  
**Authentication**: None  
**Description**: Get a specific syllabus by ID

**Response**:
```json
{
  "message": "Syllabus details for id: {id}",
  "data": {
    "syllabusId": "uuid",
    "syllabusTitle": "Data Structures",
    "semester": 3,
    "subjectName": "DSA"
  }
}
```

---

### 3. Create Syllabus
**Endpoint**: `POST /api/v1/syllabus`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: multipart/form-data  
**Description**: Create a new syllabus with file upload

**Request Body** (multipart/form-data):
- `syllabus` (JSON):
```json
{
  "syllabusTitle": "Database Systems",
  "semester": 4,
  "subjectName": "DBMS",
  "courseId": "uuid"
}
```
- `file` (file): Syllabus PDF file

**Response**:
```json
{
  "message": "success",
  "data": {
    "syllabusId": "uuid",
    "syllabusTitle": "Database Systems",
    "semester": 4
  }
}
```

---

### 4. Update Syllabus
**Endpoint**: `PUT /api/v1/syllabus/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update syllabus metadata

**Request Body**:
```json
{
  "syllabusTitle": "Updated Database Systems",
  "semester": 4,
  "subjectName": "DBMS"
}
```

**Response**:
```json
{
  "message": "Syllabus updated with id: {id}",
  "data": {}
}
```

---

### 5. Update Syllabus File
**Endpoint**: `PUT /api/v1/syllabus/{id}/file`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: multipart/form-data  
**Description**: Update syllabus PDF file

**Request Body** (multipart/form-data):
- `file` (file): New syllabus PDF file

**Response**:
```json
{
  "message": "Syllabus file updated with id: {id}",
  "data": {}
}
```

---

### 6. Delete Syllabus
**Endpoint**: `DELETE /api/v1/syllabus/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a syllabus

**Response**:
```json
{
  "message": "Syllabus deleted with id: {id}",
  "data": null
}
```

---

### 7. Download Syllabus File
**Endpoint**: `GET /api/v1/syllabus/{id}/file`  
**Authentication**: None  
**Description**: Download/View syllabus PDF file

**Response**: PDF file (Content-Type: application/pdf)

---

### 8. Get Syllabus by Affiliation and Course
**Endpoint**: `GET /api/v1/syllabus/by-affiliation/by-course`  
**Authentication**: None  
**Description**: Get syllabus filtered by affiliation and course with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| affiliation | Affiliation | required | Affiliation (TU, PU, etc.) |
| courseName | string | required | Course name |
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | syllabusTitle | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "Syllabus for affiliation: {affiliation} and course: {courseName}",
  "data": {
    "content": [],
    "totalElements": 10,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "last": true
  }
}
```

---

### 9. Get Syllabus by Affiliation, Course and Semester
**Endpoint**: `GET /api/v1/syllabus/by-affiliation/by-course/semester`  
**Authentication**: None  
**Description**: Get syllabus filtered by affiliation, course and semester with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| affiliation | Affiliation | required | Affiliation |
| courseName | string | required | Course name |
| semester | int | required | Semester number |
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | syllabusTitle | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "Syllabus for affiliation: {affiliation} and course: {courseName} and semester: {semester}",
  "data": {
    "content": [],
    "totalElements": 5,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "last": true
  }
}
```

---

### 10. Get Syllabus by Course ID
**Endpoint**: `GET /api/v1/syllabus/course/courseId`  
**Authentication**: None  
**Description**: Get syllabus by course ID with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| courseId | UUID | required | Course ID |
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | syllabusTitle | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "Syllabus for courseId: {courseId}",
  "data": {
    "content": [],
    "totalElements": 8,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "last": true
  }
}
```

---

## Note APIs

### 1. Get All Notes (Paginated)
**Endpoint**: `GET /api/v1/notes`  
**Authentication**: None  
**Description**: Get paginated list of all notes with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | noteName | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of notes",
  "data": {
    "content": [
      {
        "noteId": "uuid",
        "noteName": "Chapter 1 Notes",
        "fileName": "note.pdf",
        "syllabusId": "uuid"
      }
    ],
    "totalElements": 45,
    "totalPages": 5,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Note by ID
**Endpoint**: `GET /api/v1/notes/{id}`  
**Authentication**: None  
**Description**: Get a specific note by ID

**Response**:
```json
{
  "message": "note found with {id}",
  "data": {
    "noteId": "uuid",
    "noteName": "Chapter 1 Notes",
    "fileName": "note.pdf"
  }
}
```

---

### 3. Create Note
**Endpoint**: `POST /api/v1/notes`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: multipart/form-data  
**Description**: Create a new note with file upload

**Request Body** (multipart/form-data):
- `note` (JSON):
```json
{
  "noteName": "Algorithm Notes",
  "description": "Complete algorithm guide",
  "syllabusId": "uuid"
}
```
- `file` (file): Note PDF file

**Response**:
```json
{
  "message": "Note created successfully",
  "data": {
    "noteId": "uuid",
    "noteName": "Algorithm Notes"
  }
}
```

---

### 4. Update Note
**Endpoint**: `PUT /api/v1/notes/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update note metadata

**Request Body**:
```json
{
  "noteName": "Updated Algorithm Notes",
  "description": "Updated description"
}
```

**Response**:
```json
{
  "message": "Note updated with id: {id}",
  "data": {}
}
```

---

### 5. Update Note File
**Endpoint**: `PUT /api/v1/notes/{id}/file`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: multipart/form-data  
**Description**: Update note file

**Request Body** (multipart/form-data):
- `file` (file): New note file

**Response**:
```json
{
  "message": "Note File Updated with id {id}",
  "data": {}
}
```

---

### 6. Delete Note
**Endpoint**: `DELETE /api/v1/notes/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a note

**Response**:
```json
{
  "message": "Note deleted with id: {id}",
  "data": null
}
```

---

### 7. Download Note File
**Endpoint**: `GET /api/v1/notes/getNotefile/{noteId}`  
**Authentication**: None  
**Description**: Download/View note file

**Response**: PDF/Image file

---

### 8. Get Notes by Course Name
**Endpoint**: `GET /api/v1/notes/{courseName}/notes`  
**Authentication**: None  
**Description**: Get all notes for a specific course

**Response**:
```json
{
  "message": "List of notes for course: {courseName}",
  "data": []
}
```

---

### 9. Get Notes by Course, Semester and Affiliation
**Endpoint**: `GET /api/v1/notes/getNotesBy/courseName/semester/affiliation`  
**Authentication**: None  
**Description**: Get notes filtered by course, semester and affiliation with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| courseName | string | required | Course name |
| semester | int | required | Semester number |
| affiliation | Affiliation | required | Affiliation |
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | noteName | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "List of notes for course: {courseName} and semester: {semester}",
  "data": {
    "content": [],
    "totalElements": 12,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 10. Get Notes by Note Name
**Endpoint**: `GET /api/v1/notes/noteName/{noteName}`  
**Authentication**: None  
**Description**: Search notes by name

**Response**:
```json
{
  "message": "List of notes for note name: {noteName}",
  "data": {}
}
```

---

### 11. Get Notes by Syllabus Title
**Endpoint**: `GET /api/v1/notes/syllabusTitle/{syllabusTitle}`  
**Authentication**: None  
**Description**: Get notes by syllabus title

**Response**:
```json
{
  "message": "List of notes for syllabus title: {syllabusTitle}",
  "data": {}
}
```

---

## MCQ Question APIs

### 1. Get All Questions (Paginated)
**Endpoint**: `GET /api/v1/questions`  
**Authentication**: None  
**Description**: Get paginated list of all MCQ questions with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | category.categoryName | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "success",
  "data": {
    "content": [
      {
        "questionId": "uuid",
        "question": "What is polymorphism?",
        "correctAnswerIndex": 2,
        "category": {},
        "options": []
      }
    ],
    "totalElements": 150,
    "totalPages": 15,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Question by ID
**Endpoint**: `GET /api/v1/questions/id`  
**Authentication**: None  
**Description**: Get a specific MCQ question by ID

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Question ID |

**Response**:
```json
{
  "message": "success",
  "data": {
    "questionId": "uuid",
    "question": "What is polymorphism?",
    "options": []
  }
}
```

---

### 3. Create Question
**Endpoint**: `POST /api/v1/questions`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Content-Type**: multipart/form-data  
**Description**: Create a new MCQ question with optional images

**Request Body** (multipart/form-data):
- Question data (form fields):
  - `question`: Question text
  - `categoryId`: UUID
  - `questionSetId`: UUID
  - `correctAnswerIndex`: int
  - `options`: JSON array of options
- `imageFile` (file, optional): Question image
- `optionImageFiles` (files, optional): Option images

**Response**:
```json
{
  "message": "created successfully",
  "data": {
    "questionId": "uuid",
    "question": "What is polymorphism?"
  }
}
```

---

### 4. Update Question
**Endpoint**: `PUT /api/v1/questions/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing question

**Request Body**:
```json
{
  "question": "Updated question text",
  "correctAnswerIndex": 1,
  "options": []
}
```

**Response**:
```json
{
  "message": "updated successfully",
  "data": {}
}
```

---

### 5. Delete Question
**Endpoint**: `DELETE /api/v1/questions/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a question

**Response**:
```json
{
  "message": "{id} Deleted Successfully",
  "data": null
}
```

---

### 6. Get Questions by Question Set
**Endpoint**: `GET /api/v1/questions/set/{questionSetId}`  
**Authentication**: None  
**Description**: Get all questions for a specific question set with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | question | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "Questions for set",
  "data": {
    "content": [],
    "totalElements": 25,
    "totalPages": 3,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

## Question Set APIs

### 1. Get All Question Sets (Paginated)
**Endpoint**: `GET /api/v1/question-sets`  
**Authentication**: None  
**Description**: Get paginated list of all question sets with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | setName | Field to sort by |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "success",
  "data": {
    "content": [
      {
        "questionSetId": "uuid",
        "setName": "Java Basics",
        "price": 99.99,
        "courseId": "uuid"
      }
    ],
    "totalElements": 40,
    "totalPages": 4,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Question Set by ID
**Endpoint**: `GET /api/v1/question-sets/{id}`  
**Authentication**: None  
**Description**: Get a specific question set by ID

**Response**:
```json
{
  "message": "success",
  "data": {
    "questionSetId": "uuid",
    "setName": "Java Basics",
    "price": 99.99
  }
}
```

---

### 3. Create Question Set
**Endpoint**: `POST /api/v1/question-sets`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Create a new question set

**Request Body**:
```json
{
  "setName": "Python Advanced",
  "price": 149.99,
  "courseId": "uuid",
  "description": "Advanced Python topics"
}
```

**Response**:
```json
{
  "message": "set created successfully",
  "data": {
    "questionSetId": "uuid",
    "setName": "Python Advanced"
  }
}
```

---

### 4. Update Question Set
**Endpoint**: `PUT /api/v1/question-sets/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing question set

**Request Body**:
```json
{
  "setName": "Updated Python Advanced",
  "price": 129.99
}
```

**Response**:
```json
{
  "message": "set updated successfully",
  "data": {}
}
```

---

### 5. Delete Question Set
**Endpoint**: `DELETE /api/v1/question-sets/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a question set

**Response**:
```json
{
  "message": "Deleted successfully",
  "data": null
}
```

---

### 6. Get Free Question Sets
**Endpoint**: `GET /api/v1/question-sets/free`  
**Authentication**: None  
**Description**: Get all free question sets (price = 0) with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | categoryName | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "free sets",
  "data": {
    "content": [],
    "totalElements": 8,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "last": true
  }
}
```

---

### 7. Get Question Sets by Course
**Endpoint**: `GET /api/v1/question-sets/course/{courseId}`  
**Authentication**: None  
**Description**: Get all question sets for a specific course with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | setName | Field to sort by |
| sortDir | string | asc | Sort direction |

**Response**:
```json
{
  "message": "McqQuestion sets for course",
  "data": {
    "content": [],
    "totalElements": 12,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

## Quiz Attempt APIs

### 1. Get All Quiz Attempts (Paginated)
**Endpoint**: `GET /api/v1/quiz-attempts`  
**Authentication**: None  
**Description**: Get paginated list of all quiz attempts with caching

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortDir | string | asc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of Quiz attempts",
  "data": {
    "content": [
      {
        "attemptId": "uuid",
        "userId": "uuid",
        "questionSetId": "uuid",
        "score": 85,
        "totalQuestions": 100
      }
    ],
    "totalElements": 200,
    "totalPages": 20,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Quiz Attempt by ID
**Endpoint**: `GET /api/v1/quiz-attempts/{id}`  
**Authentication**: None  
**Description**: Get a specific quiz attempt by ID

**Response**:
```json
{
  "message": "success",
  "data": {
    "attemptId": "uuid",
    "score": 85,
    "totalQuestions": 100
  }
}
```

---

### 3. Attempt Question Set
**Endpoint**: `POST /api/v1/quiz-attempts`  
**Authentication**: Required (USER)  
**Description**: Submit answers for a question set

**Request Body**:
```json
{
  "questionSetId": "uuid",
  "questionAnswers": [
    {
      "questionId": "uuid",
      "selectedOption": "0"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Quiz Attempt Sucessfully",
  "data": {
    "total": 100,
    "correctCount": 85,
    "percentage": 85.0
  }
}
```

---

### 4. Delete Quiz Attempt
**Endpoint**: `DELETE /api/v1/quiz-attempts/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a quiz attempt

**Response**:
```json
{
  "message": "{id} Deleted successfully",
  "data": null
}
```

---

### 5. Get User Quiz Attempts
**Endpoint**: `GET /api/v1/quiz-attempts/user`  
**Authentication**: Required (USER)  
**Description**: Get all quiz attempts by current logged-in user

**Response**:
```json
{
  "message": "success",
  "data": []
}
```

---

## Old Question Collection APIs

### 1. Upload Old Question (Admin/Super Admin)
**Endpoint**: `POST /api/v1/old-question-collections`  
**Authentication**: Required (`ADMIN` or `SUPER_ADMIN`)  
**Content-Type**: `multipart/form-data`  
**Description**: Upload a new old question with metadata and PDF.

**Request Parts**:
- `data` (application/json):
```json
{
  "setName": "Final Exam 2024",
  "description": "Optional details",
  "year": 2024,
  "syllabusId": 10,
  "courseId": 5
}
```
- `file` (file, required): PDF file of the old question.

**Response**:
```json
{
  "message": "success",
  "data": {
    "id": 42,
    "setName": "Final Exam 2024",
    "description": "Optional details",
    "year": 2024,
    "pdfFilePath": "uploads/old-questions/final-2024.pdf",
    "syllabusId": 10,
    "subject": "Data Structures",
    "courseName": "BSc CSIT",
    "affiliation": "TU"
  }
}
```

---

### 2. Get Semesters by Course
**Endpoint**: `GET /api/v1/old-question-collections/course/{courseId}/semesters`  
**Authentication**: None  
**Description**: List distinct semesters for a course.

**Response**:
```json
[1, 2, 3, 4, 5, 6, 7, 8]
```

---

### 3. Get Subjects by Semester
**Endpoint**: `GET /api/v1/old-question-collections/course/{courseId}/semester/{semester}/subjects`  
**Authentication**: None  
**Description**: List subjects for a course semester.

**Response**:
```json
[
  {
    "syllabusId": 10,
    "subject": "Data Structures"
  }
]
```

---

### 4. Get Old Questions by Syllabus
**Endpoint**: `GET /api/v1/old-question-collections/syllabus/{syllabusId}`  
**Authentication**: None  
**Description**: Fetch all old questions for a syllabus.

**Response**:
```json
[
  {
    "id": 42,
    "setName": "Final Exam 2024",
    "description": "Optional details",
    "year": 2024,
    "pdfFilePath": "uploads/old-questions/final-2024.pdf",
    "syllabusId": 10,
    "subject": "Data Structures",
    "courseName": "BSc CSIT",
    "affiliation": "TU"
  }
]
```

---

### 5. Filter Old Questions
**Endpoint**: `GET /api/v1/old-question-collections/filter`  
**Authentication**: None  
**Description**: Filter by course name (required), semester, year, and affiliation with pagination/sorting.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseName | string | Yes | Course name filter |
| semester | int | No | Semester number |
| year | int | No | Year |
| page | int | No | Default 0 |
| size | int | No | Default 10 |
| sortBy | string | No | Default `year` |
| sortDir | string | No | `asc` or `desc`, default `desc` |

**Request Body** (optional): `Affiliation` enum value when filtering by affiliation.

**Response**:
```json
{
  "content": [
    {
      "id": 42,
      "setName": "Final Exam 2024",
      "description": "Optional details",
      "year": 2024,
      "pdfFilePath": "uploads/old-questions/final-2024.pdf",
      "syllabusId": 10,
      "subject": "Data Structures",
      "courseName": "BSc CSIT",
      "affiliation": "TU"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 10,
  "last": true
}
```

---

### 6. View Old Question PDF
**Endpoint**: `GET /api/v1/old-question-collections/view/{id}`  
**Authentication**: None  
**Description**: Stream the PDF inline (`application/pdf`).

---

### 7. Search Old Questions
**Endpoint**: `GET /api/v1/old-question-collections/search`  
**Authentication**: None  
**Description**: Search by course name, syllabus name, year, set name, semester, and affiliation with pagination/sorting.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseName | string | No | Course name filter |
| syllabusName | string | No | Syllabus title filter |
| year | long | No | Year filter |
| setName | string | No | Set name (supports partial match) |
| semester | int | No | Semester number |
| affiliation | string | No | `Affiliation` enum |
| page | int | No | Default 0 |
| size | int | No | Default 10 |
| sortBy | string | No | Default `year` |
| sortDir | string | No | `asc` or `desc`, default `desc` |

**Response**: Same structure as Filter Old Questions.

---

### 8. Get All Old Questions (Admin/Super Admin)
**Endpoint**: `GET /api/v1/old-question-collections`  
**Authentication**: Required (`ADMIN` or `SUPER_ADMIN`)  
**Description**: Paginated list of all old questions.

**Query Parameters**: `page` (default 0), `size` (default 10), `sortBy` (default `year`), `sortDir` (`asc`/`desc`, default `desc`)

**Response**: Same structure as Filter Old Questions.

---

### 9. Delete Old Question (Admin/Super Admin)
**Endpoint**: `DELETE /api/v1/old-question-collections/{id}`  
**Authentication**: Required (`ADMIN` or `SUPER_ADMIN`)  
**Description**: Delete an old question collection.

**Response**:
```json
{
  "message": "Old Question Collection deleted with id: {id}",
  "data": null
}
```

---

### 10. Update Old Question (Admin/Super Admin)
**Endpoint**: `PUT /api/v1/old-question-collections/{id}`  
**Authentication**: Required (`ADMIN` or `SUPER_ADMIN`)  
**Content-Type**: `multipart/form-data`  
**Description**: Update metadata and optionally replace the PDF.

**Request Parts**:
- `data` (application/json): Same fields as Upload Old Question.
- `file` (file, optional): New PDF file.

**Response**:
```json
{
  "message": "success",
  "data": {
    "id": 42,
    "setName": "Final Exam 2024",
    "description": "Optional details",
    "year": 2024,
    "pdfFilePath": "uploads/old-questions/final-2024.pdf",
    "syllabusId": 10,
    "subject": "Data Structures",
    "courseName": "BSc CSIT",
    "affiliation": "TU"
  }
}
```

---

## Advertisement APIs

### 1. Get Ads (Paginated)
**Endpoint**: `GET /api/v1/ads`  
**Authentication**: None  
**Description**: Get paginated list of all advertisements with caching.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |

**Response**:
```json
{
  "message": "List of ads",
  "data": {
    "content": [
      {
        "adId": 123,
        "title": "Summer Sale",
        "banner": "Sale Banner Text",
        "position": "TOP",
        "status": "PUBLISHED",
        "images": ["url1", "url2"]
      }
    ],
    "totalElements": 20,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Create Advertisement
**Endpoint**: `POST /api/v1/ads`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Create a new advertisement. Requires `multipart/form-data`.

**Request Parameters (Multipart)**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | Yes | Ad title |
| banner | String | Yes | Ad banner text/name |
| position | String | Yes | Ad Position (horizontal_1, horizontal_2, horizontal_3, vertical_1, vertical_2, vertical_3, vertical_4) |
| images | List<File> | Yes | List of image files |
| priority | String | No | LOW, MEDIUM, HIGH, URGENT (Default: LOW) |
| status | String | No | DRAFT, PUBLISHED, ARCHIVED, SCHEDULED (Default: DRAFT) |
| startDate | Date | No | Start Date (YYYY-MM-DD) |
| endDate | Date | No | End Date (YYYY-MM-DD) |
| maxImpressions | Integer | No | Max impressions limit |
| maxClicks | Integer | No | Max clicks limit |
| costPerClick | Double | No | Cost per click |
| costPerImpression | Double | No | Cost per impression |
| totalBudget | Double | No | Total budget |
| targetAudience | String | No | Target audience description |
| tags | String | No | Comma-separated tags |
| isActive | Boolean | No | Active status (Default: true) |
| createdBy | String | Yes | Creator name/ID |
| notes | String | No | Internal notes |
| targetLocation | String | No | Geographical targeting |
| targetDevices | String | No | Device targeting |
| displaySchedule | String | No | Schedule details |
| weight | Integer | No | Display weight (Default: 1) |
| trackingPixel | String | No | Tracking pixel URL |
| utmParameters | String | No | UTM parameters |

**Response**:
```json
{
  "message": "Ad created successfully",
  "data": { ... }
}
```

---

### 3. Update Advertisement
**Endpoint**: `PUT /api/v1/ads/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing advertisement. Requires `multipart/form-data`.

**Request Parameters**: Same as Create Advertisement.

---

### 4. Delete Advertisement
**Endpoint**: `DELETE /api/v1/ads/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete an advertisement by ID.

**Response**:
```json
{
  "message": "Ad deleted with id: {id}",
  "data": null
}
```









## Dashboard APIs

### 1. Get Course Quiz Statistics
**Endpoint**: `GET /api/v1/dashboard/course/{courseId}/stats`  
**Authentication**: Bearer Token (ADMIN, SUPER_ADMIN)  
**Description**: Get quiz statistics for a specific course

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseId | Long | Yes | Course ID |

**Response**:
```json
{
  "message": "Course quiz statistics",
  "data": {
    "courseId": 1,
    "courseName": "MBBS Entrance",
    "totalQuizzes": 5,
    "totalAttempts": 150,
    "totalUniqueUsers": 45,
    "averageScore": 72.5,
    "quizStatistics": [
      {
        "quizId": 1,
        "quizName": "Set A",
        "totalQuestions": 100,
        "totalAttempts": 30,
        "uniqueUsers": 15,
        "averageScore": 75.0,
        "highestScore": 95.0,
        "lowestScore": 45.0,
        "passRate": 80.0
      }
    ]
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| courseId | Long | Course identifier |
| courseName | String | Name of the course |
| totalQuizzes | int | Total number of quizzes in the course |
| totalAttempts | int | Total quiz attempts across all quizzes |
| totalUniqueUsers | int | Number of unique users who attempted |
| averageScore | double | Average score percentage |
| quizStatistics | List | List of individual quiz statistics |

---

### 2. Get Course User Rankings
**Endpoint**: `GET /api/v1/dashboard/course/{courseId}/rankings`  
**Authentication**: Bearer Token (ADMIN, SUPER_ADMIN)  
**Description**: Get user rankings for a specific course

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseId | Long | Yes | Course ID |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | int | No | 10 | Maximum number of rankings to return |

**Response**:
```json
{
  "message": "User rankings for course",
  "data": [
    {
      "rank": 1,
      "userId": 5,
      "fullName": "John Doe",
      "email": "john@example.com",
      "totalScore": 95,
      "totalAttempts": 100,
      "averageScore": 95.0
    },
    {
      "rank": 2,
      "userId": 8,
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "totalScore": 88,
      "totalAttempts": 100,
      "averageScore": 88.0
    }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| rank | int | User's rank position |
| userId | Long | User identifier |
| fullName | String | User's full name |
| email | String | User's email |
| totalScore | int | Total correct answers |
| totalAttempts | int | Total questions attempted |
| averageScore | double | Average score percentage |

---

### 3. Get Quiz Statistics
**Endpoint**: `GET /api/v1/dashboard/quiz/{quizId}/stats`  
**Authentication**: Bearer Token (ADMIN, SUPER_ADMIN)  
**Description**: Get statistics for a specific quiz

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| quizId | Long | Yes | Quiz (Question Set) ID |

**Response**:
```json
{
  "message": "Quiz statistics",
  "data": {
    "quizId": 1,
    "quizName": "Set A",
    "totalQuestions": 100,
    "totalAttempts": 500,
    "uniqueUsers": 50,
    "averageScore": 72.5,
    "highestScore": 98.0,
    "lowestScore": 25.0,
    "passRate": 75.0
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| quizId | Long | Quiz identifier |
| quizName | String | Name of the quiz |
| totalQuestions | int | Number of questions in quiz |
| totalAttempts | int | Total attempts on this quiz |
| uniqueUsers | int | Number of unique users |
| averageScore | double | Average score percentage |
| highestScore | double | Highest score percentage achieved |
| lowestScore | double | Lowest score percentage achieved |
| passRate | double | Percentage of users who passed (>=40%) |

---

### 4. Get Quiz User Rankings
**Endpoint**: `GET /api/v1/dashboard/quiz/{quizId}/rankings`  
**Authentication**: Bearer Token (ADMIN, SUPER_ADMIN)  
**Description**: Get user rankings for a specific quiz

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| quizId | Long | Yes | Quiz (Question Set) ID |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | int | No | 10 | Maximum number of rankings to return |

**Response**:
```json
{
  "message": "User rankings for quiz",
  "data": [
    {
      "rank": 1,
      "userId": 5,
      "fullName": "John Doe",
      "email": "john@example.com",
      "totalScore": 95,
      "totalAttempts": 100,
      "averageScore": 95.0
    }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| rank | int | User's rank position |
| userId | Long | User identifier |
| fullName | String | User's full name |
| email | String | User's email |
| totalScore | int | Total correct answers |
| totalAttempts | int | Total questions attempted |
| averageScore | double | Average score percentage |

---

### 5. Get Current User Stats
**Endpoint**: `GET /api/v1/dashboard/user/stats`  
**Authentication**: Bearer Token (Any authenticated user)  
**Description**: Get statistics for the currently authenticated user

**Response**:
```json
{
  "message": "User statistics",
  "data": {
    "userId": 1,
    "fullName": "John Doe",
    "totalQuizzesAttempted": 10,
    "totalCorrectAnswers": 850,
    "totalQuestionsAttempted": 1000,
    "overallAccuracy": 85.0
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| userId | Long | User identifier |
| fullName | String | User's full name |
| totalQuizzesAttempted | int | Number of quizzes attempted |
| totalCorrectAnswers | int | Total correct answers |
| totalQuestionsAttempted | int | Total questions attempted |
| overallAccuracy | double | Overall accuracy percentage |

---

### 6. Get Current User Course Rank
**Endpoint**: `GET /api/v1/dashboard/user/course/{courseId}/rank`  
**Authentication**: Bearer Token (Any authenticated user)  
**Description**: Get the current user's rank for a specific course

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseId | Long | Yes | Course ID |

**Response**:
```json
{
  "message": "User rank for course",
  "data": {
    "courseId": 1,
    "courseName": "MBBS Entrance",
    "rank": 5,
    "totalParticipants": 100,
    "totalScore": 85,
    "totalAttempts": 100,
    "averageScore": 85.0
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| courseId | Long | Course identifier |
| courseName | String | Name of the course |
| rank | int | User's rank (0 if not participated) |
| totalParticipants | int | Total participants in the course |
| totalScore | int | User's total correct answers |
| totalAttempts | int | User's total questions attempted |
| averageScore | double | User's average score percentage |

---

## Blog APIs

### 1. Get All Blogs
**Endpoint**: `GET /api/v1/blogs`
**Authentication**: None
**Description**: Get paginated list of all blogs.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | createdDate | Field to sort by |
| sortDir | string | desc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of blogs",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Exam Prep Tips",
        "description": "How to prepare effectively...",
        "image": "url-to-image"
      }
    ],
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

### 2. Get Blog by ID
**Endpoint**: `GET /api/v1/blogs/{id}`
**Authentication**: None
**Description**: Get a specific blog by ID.

**Response**:
```json
{
  "message": "Blog details for id: 1",
  "data": {
    "id": 1,
    "title": "Exam Prep Tips",
    "content": "Full content...",
    "contactEmail": "author@example.com"
  }
}
```

---

### 3. Create Blog
**Endpoint**: `POST /api/v1/blogs`
**Authentication**: Required (ADMIN/SUPER_ADMIN)
**Description**: Create a new blog post. Requires `multipart/form-data`.

**Request Parameters (Multipart)**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | Yes | Blog title |
| content | String | Yes | Blog content |
| image | File | No | Blog image file |
| contactEmail | String | No | Contact email |
| contactPhone | String | No | Contact phone |
| metaTitle | String | No | SEO Meta Title |
| metaDescription | String | No | SEO Meta Description |
| keywords | String | No | SEO Keywords |

**Response**:
```json
{
   "message": "Blog created",
   "data": { ... }
}
```

---

### 4. Update Blog
**Endpoint**: `PUT /api/v1/blogs/{id}`
**Authentication**: Required (ADMIN/SUPER_ADMIN)
**Description**: Update an existing blog. Requires `multipart/form-data`.

**Request Parameters**: Same as Create Blog.

---

### 5. Delete Blog
**Endpoint**: `DELETE /api/v1/blogs/{id}`
**Authentication**: Required (ADMIN/SUPER_ADMIN)

---

### 6. Get Blog File (Image)
**Endpoint**: `GET /api/v1/blogs/{id}/file`
**Authentication**: None
**Description**: Download/View the image associated with the blog.

---

## Contact Us APIs

### 1. Submit Query
**Endpoint**: `POST /api/v1/contact-us`
**Authentication**: None
**Description**: Submit a contact us message.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a query about...",
  "subject": "GENERAL_INQUIRY",
  "phone": "1234567890"
}
```
**Subjects**: `GENERAL_INQUIRY`, `TECHNICAL_SUPPORT`, `BILLING_ISSUES`, `FEEDBACK_SUGGESTIONS`, `COURSE_INFORMATION`, `COLLABORATION_OPPORTUNITIES`, `OTHER`.

**Response**:
```json
{
  "message": "Message submitted successfully",
  "data": { ... }
}
```

---

### 2. Get All Messages (Paginated)
**Endpoint**: `GET /api/v1/contact-us`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Get paginated list of all contact us messages.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |

**Response**:
```json
{
  "message": "List of contact us messages",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "message": "I have a query about admission.",
        "phone": "1234567890",
        "subject": "ADMISSION"
      }
    ],
    "totalElements": 5,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 3. Delete Message
**Endpoint**: `DELETE /api/v1/contact-us/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a contact us message by ID.

**Response**:
```json
{
  "message": "Contact us message deleted with id: 1",
  "data": null
}
```


---

## Notice APIs

### 1. Get All Notices (Paginated)
**Endpoint**: `GET /api/v1/notices`  
**Authentication**: None  
**Description**: Get paginated list of notices.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | createdDate | Field to sort by |
| sortDir | string | desc | Sort direction (asc/desc) |

**Response**:
```json
{
  "message": "List of Notices",
  "data": {
    "content": [
      {
        "noticeId": 1,
        "title": "Exam Schedule",
        "description": "Final exams start from Monday.",
        "createdDate": "2026-01-11",
        "imageName": "exam_schedule.jpg"
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "last": false
  }
}
```

---

### 2. Get Notice by ID
**Endpoint**: `GET /api/v1/notices/{id}`  
**Authentication**: None  
**Description**: Get a specific notice by ID.

**Response**:
```json
{
  "message": "Notice",
  "data": {
    "noticeId": 1,
    "title": "Exam Schedule",
    "description": "Final exams start from Monday.",
    "createdDate": "2026-01-11",
    "imageName": "exam_schedule.jpg"
  }
}
```

---

### 3. Create Notice
**Endpoint**: `POST /api/v1/notices`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Create a new notice. Requires `multipart/form-data`.

**Request Parameters (Multipart)**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | Yes | Notice title |
| description | String | No | Details |
| image | File | No | Notice file/image |

**Response**:
```json
{
  "message": "Notice created",
  "data": {
    "noticeId": 2,
    "title": "New Notice",
    "description": "Details...",
    "createdDate": "2026-01-11",
    "imageName": "notice.jpg"
  }
}
```

---

### 4. Update Notice
**Endpoint**: `PUT /api/v1/notices/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Update an existing notice. Requires `multipart/form-data`.

**Request Parameters**: Same as Create Notice.

**Response**:
```json
{
  "message": "Notice updated",
  "data": {
    "noticeId": 2,
    "title": "Updated Notice",
    "description": "Updated Details...",
    "createdDate": "2026-01-11",
    "imageName": "updated_notice.jpg"
  }
}
```

---

### 5. Delete Notice
**Endpoint**: `DELETE /api/v1/notices/{id}`  
**Authentication**: Required (ADMIN/SUPER_ADMIN)  
**Description**: Delete a notice by ID.

**Response**:
```json
{
  "message": "Notice deleted with id: 1",
  "data": null
}
```



