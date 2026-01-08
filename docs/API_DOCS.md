# Entrance Gateway API Documentation

> **Base URL:** `/api/v1`  
> **Server Port:** `8080`

---

## Table of Contents
1. [Authentication](#1-authentication-api)
2. [Admin](#2-admin-api)
3. [User](#3-user-api)
4. [Blog](#4-blog-api)
5. [Category](#5-category-api)
6. [College](#6-college-api)
7. [Course](#7-course-api)
8. [Contact Us](#8-contact-us-api)
9. [Ads](#9-ads-api)
10. [Notes](#10-notes-api)
11. [Notices](#11-notices-api)
12. [MCQ Questions](#12-mcq-questions-api)
13. [Question Sets](#13-question-sets-api)
14. [Quiz Attempts](#14-quiz-attempts-api)
15. [Old Question Collections](#15-old-question-collections-api)
16. [Syllabus](#16-syllabus-api)
17. [Training](#17-training-api)
18. [Audit Logs](#18-audit-logs-api)
19. [Error Responses](#error-responses)
20. [Enums Reference](#enums-reference)

---

## Response Structures

### Standard API Response
```json
{
  "message": "string",
  "data": "object | array | null"
}
```

### JWT Response (Login/Refresh)
```json
{
  "userId": "number",
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": "number (seconds)"
}
```

### Paginated Response
```json
{
  "content": "array",
  "totalElements": "number",
  "totalPages": "number",
  "pageNumber": "number",
  "pageSize": "number",
  "isLast": "boolean"
}
```

---

## 1. Authentication API

**Base Path:** `/api/v1/auth`

### POST `/login`
**Description:** Authenticate user or admin  
**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```
**Validation Messages:**
- `email`: "Email is required", "Email should be valid"
- `password`: "Password is required"

**Success Response (200):**
```json
{
  "message": "Login Successful as USER|ADMIN|SUPER_ADMIN",
  "data": { "userId", "accessToken", "refreshToken", "tokenType", "expiresIn" }
}
```

---

### POST `/user/register`
**Description:** Register a new user  
**Request Body:**
```json
{
  "fullname": "string (required)",
  "email": "string (required, valid email)",
  "contact": "string (required, Nepali mobile format)",
  "address": "string (required)",
  "dob": "date (required, format: YYYY-MM-DD)",
  "interested": "string (optional)",
  "latestQualification": "string (optional)",
  "password": "string (required, min 8 chars)",
  "role": "string (optional)"
}
```
**Validation Messages:**
- `fullname`: "Full name is required"
- `email`: "Email is required", "Email should be valid"
- `contact`: "Contact number is required", "Contact must be numeric", "Contact must be a valid mobile number with optional country code (+977 or 977)"
- `address`: "Address is required"
- `dob`: "Date of birth is required"
- `password`: "Password is required", "Password must be at least 8 characters long"

**Success Response (201):**
```json
{ "message": "Success and OTP sent", "data": null }
```

---

### POST `/user/verify-otp`
**Description:** Verify OTP for email confirmation  
**Request Body:**
```json
{
  "email": "string (valid email)",
  "otp": "string (exactly 6 characters)"
}
```
**Validation Messages:**
- `email`: "Email should be valid"
- `otp`: "OTP must be 6 characters long"

**Success Response (200):**
```json
{ "message": "OTP verified successfully", "data": "object" }
```

---

### POST `/admin/register`
**Authorization:** SUPER_ADMIN only  
**Request Body:**
```json
{
  "name": "string (required, 5-100 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, must contain uppercase, lowercase, number, special char)"
}
```
**Validation Messages:**
- `name`: "Name is required", "Name must not exceed 100 characters and be at least 5 characters long"
- `email`: "Email is required", "Email should be valid"
- `password`: "Password is required", "Password must be at least 8 characters long", "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"

**Success Response (201):**
```json
{ "message": "Success", "data": "AdminResponse object" }
```

---

### POST `/refresh-token`
**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```
**Validation Messages:**
- `refreshToken`: "Refresh token is required"

**Success Response (200):**
```json
{ "message": "Token refreshed successfully", "data": { "JwtResponse object" } }
```

---

### POST `/revoke-token`
**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```
**Success Response (200):**
```json
{ "message": "Refresh token revoked successfully", "data": null }
```

---

### POST `/logout`
**Request Body (optional):**
```json
{
  "refreshToken": "string (optional)"
}
```
**Success Response (200):**
```json
{ "message": "Logout successful", "data": null }
```

---

## 2. Admin API

**Base Path:** `/api/v1/admin`

### GET `/me`
**Description:** Get current admin details  
**Success Response (200):**
```json
{ "message": "Admin details fetched successfully", "data": "AdminResponse" }
```

---

### GET `/allAdmins`
**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | "id" | Sort field |
| sortDir | string | "asc" | Sort direction (asc/desc) |

**Success Response (200):**
```json
{ "message": "List of admins", "data": "PageResponse" }
```

---

### DELETE `/`
**Authorization:** SUPER_ADMIN only  
**Request Body:** Email string (with @Email validation)  
**Success Response (200):**
```json
{ "message": "Admin deleted successfully" }
```

---

### PUT `/`
**Authorization:** SUPER_ADMIN only  
**Request Body:** name, email, password  
**Success Response (200):**
```json
{ "message": "Admin role updated successfully", "data": "name, email, password" }
```

---

## 3. User API

**Base Path:** `/api/v1/user`

### GET `/me`
**Success Response (200):**
```json
{ "message": "User details fetched successfully", "data": "UserResponse" }
```

---

### POST `/change-password`
**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 chars)",
  "confirmPassword": "string (required)"
}
```
**Validation Messages:**
- `currentPassword`: "Current password is required"
- `newPassword`: "New password is required", "New password must be at least 8 characters"
- `confirmPassword`: "Confirm password is required"

**Success Response (200):**
```json
{ "message": "Password changed successfully", "data": null }
```

---

### POST `/forgot-password`
**Request Body:**
```json
{
  "email": "string (required, valid email)"
}
```
**Validation Messages:**
- `email`: "Email is required", "Invalid email format"

**Success Response (200):**
```json
{ "message": "Password reset OTP sent to your email", "data": null }
```

---

### POST `/reset-password`
**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "otp": "string (required)",
  "newPassword": "string (required, min 8 chars)",
  "confirmPassword": "string (required)"
}
```
**Validation Messages:**
- `email`: "Email is required", "Invalid email format"
- `otp`: "OTP is required"
- `newPassword`: "New password is required", "Password must be at least 8 characters"
- `confirmPassword`: "Confirm password is required"

**Success Response (200):**
```json
{ "message": "Password reset successfully", "data": null }
```

---

### POST `/{id}/update-profile`
**Path Parameters:** `id` (Long) - User ID  
**Request Body:** RegisterRequest object  
**Success Response (200):**
```json
{ "message": "Profile updated successfully", "data": "UserResponse" }
```

---

## 4. Blog API

**Base Path:** `/api/v1/blogs`

### GET `/`
**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 10 | Page size |
| sortBy | string | "createdDate" | Sort field |
| sortDir | string | "desc" | Sort direction |

**Success Response (200):**
```json
{ "message": "List of blogs", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Blog details for id: {id}", "data": "BlogResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:**
```
title: string (required, max 255 chars)
content: string (required)
image: MultipartFile (optional)
contactEmail: string (optional, valid email)
contactPhone: string (optional)
metaTitle: string (optional, max 60 chars)
metaDescription: string (optional, max 160 chars)
keywords: string (optional, max 255 chars)
```
**Validation Messages:**
- `title`: "Blog title is required", "Title must be less than 255 characters"
- `content`: "Blog content is required"
- `contactEmail`: "Invalid email format"

**Success Response (201):**
```json
{ "message": "Blog created", "data": "BlogResponse" }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:** Same as POST  
**Success Response (200):**
```json
{ "message": "Blog updated", "data": "BlogResponse" }
```

---

### DELETE `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Blog deleted with id: {id}", "data": null }
```

---

### GET `/{id}/file`
**Description:** Download blog image  
**Success Response (200):** Binary file stream with auto-detected content type

---

## 5. Category API

**Base Path:** `/api/v1/categories`

### GET `/`
**Query Parameters:**
| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | "categoryName" |
| sortDir | string | "asc" |

**Success Response (200):**
```json
{ "message": "Categories fetched successfully", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Category fetched successfully", "data": "CategoryResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request Body:**
```json
{
  "categoryName": "string (required, 3-100 chars)",
  "remarks": "string (optional)"
}
```
**Validation Messages:**
- `categoryName`: "Category name must not be blank", "Category name must be between 3 and 100 characters"

**Success Response (200):**
```json
{ "message": "Category created successfully", "data": "CategoryResponse" }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request Body:** CategoryRequest  
**Success Response (200):**
```json
{ "message": "Category updated successfully", "data": "CategoryResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "Category deleted successfully", "data": null }
```

---

## 6. College API

**Base Path:** `/api/v1/colleges`

### GET `/`
**Query Parameters:**
| Parameter | Type | Default |
|-----------|------|---------|
| page | int | 0 |
| size | int | 10 |
| sortBy | string | "collegeName" |
| sortDir | string | "asc" |

**Success Response (200):**
```json
{ "message": "List of colleges", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "College details for id: {id}", "data": "CollegeResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:**
```
collegeName: string (required)
location: string (required)
affiliation: Affiliation enum (required)
priority: Priority enum (optional)
website: string (required)
contact: string (optional)
email: string (optional)
description: string (required, 50-2000 chars)
establishedYear: string (optional)
collegeType: CollegeType enum (required)
logo: MultipartFile (required)
images: List<MultipartFile> (required)
```
**Validation Messages:**
- `collegeName`: "College name is required"
- `location`: "Location is required"
- `affiliation`: "Affiliation is required"
- `website`: "Website is required"
- `description`: "Description is required", "Description must be between 50 and 2000 characters"
- `collegeType`: "College type is required"

**Success Response (201):**
```json
{ "message": "success", "data": "CollegeResponse" }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:** Same as POST  
**Success Response (201):**
```json
{ "message": "success", "data": "CollegeResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "College deleted with id: {id}", "data": null }
```

---

### GET `/search`
**Query Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| name | string | Yes |
| page | int | No (default: 0) |
| size | int | No (default: 10) |
| sortBy | string | No (default: "collegeName") |
| sortDir | string | No (default: "asc") |

**Success Response (200):**
```json
{ "message": "Search results {name}", "data": "PageResponse" }
```

---

### POST `/{collegeId}/courses/{courseId}`
**Description:** Add course to college  
**Success Response (200):**
```json
{ "message": "Course with id: {courseId} added to college with id: {collegeId}", "data": "CollegeResponse" }
```

---

### DELETE `/{collegeId}/courses/{courseId}`
**Description:** Remove course from college  
**Success Response (200):**
```json
{ "message": "Course with id: {courseId} removed from college with id: {collegeId}", "data": "CollegeResponse" }
```

---

### GET `/by-course/{courseId}`
**Success Response (200):**
```json
{ "message": "Colleges offering course: {courseId}", "data": "List<CollegeResponse>" }
```

---

## 7. Course API

**Base Path:** `/api/v1/courses`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "courseName"), sortDir  
**Success Response (200):**
```json
{ "message": "List of courses", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Course details", "data": "CourseResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request Body:**
```json
{
  "courseName": "string (required)",
  "description": "string (optional)",
  "collegeId": "number (optional)",
  "courseType": "CourseType enum (required)",
  "courseLevel": "CourseLevel enum (required)",
  "criteria": "string (required)",
  "affiliation": "Affiliation enum (required)"
}
```
**Validation Messages:**
- `courseName`: "Course name is required"
- `courseType`: "Course type is required"
- `courseLevel`: "Course level is required"
- `criteria`: "Criteria is required"
- `affiliation`: "Affiliation is required"

**Success Response (200):**
```json
{ "message": "Course created successfully", "data": "CourseResponse" }
```

---

### PUT `/{id}`
**Request Body:** CourseRequest  
**Success Response (200):**
```json
{ "message": "Course updated successfully", "data": "CourseResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "Course deleted successfully", "data": null }
```

---

### GET `/by-affiliation`
**Query Parameters:** affiliation (required), page, size  
**Success Response (200):**
```json
{ "message": "affiliated with {affiliation}", "data": "PageResponse" }
```

---

### GET `/colleges/by-courses`
**Query Parameters:** courseId (required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "College for: {courseId}", "data": "List" }
```

---

### GET `/full-syllabus/{courseId}`
**Success Response (200):**
```json
{ "message": "Full syllabus for course: {courseId}", "data": "SyllabusResponse" }
```

---

## 8. Contact Us API

**Base Path:** `/api/v1/contact-us`

### POST `/`
**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "message": "string (required, max 5000 chars)",
  "phone": "string (optional)",
  "subject": "QuerySubject enum (required)"
}
```
**Validation Messages:**
- `name`: "Name is required"
- `email`: "Email is required", "Invalid email format"
- `message`: "Message is required", "Message must not exceed 5000 characters"
- `subject`: "Subject is required"

**Success Response (200):**
```json
{ "message": "Message submitted successfully", "data": "ContactUsResponse" }
```

---

### GET `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Query Parameters:** page, size  
**Success Response (200):**
```json
{ "message": "List of contact us messages", "data": "PageResponse" }
```

---

### GET `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Contact us message", "data": "ContactUsResponse" }
```

---

### DELETE `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Contact us message deleted with id: {id}", "data": null }
```

---

## 9. Ads API

**Base Path:** `/api/v1/ads`

### GET `/`
**Query Parameters:** page (default: 0), size (default: 10)  
**Success Response (200):**
```json
{ "message": "List of ads", "data": "PageResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:**
```
title: string (required, max 150 chars)
banner: string (required)
position: AdPosition enum (required)
priority: Priority enum (optional, default: LOW)
status: AdStatus enum (optional, default: DRAFT)
startDate: date (optional)
endDate: date (optional)
maxImpressions: int (optional)
maxClicks: int (optional)
costPerClick: double (optional)
costPerImpression: double (optional)
totalBudget: double (optional)
targetAudience: string (optional)
tags: string (optional)
isActive: boolean (optional, default: true)
createdBy: string (required)
notes: string (optional, max 500 chars)
targetLocation: string (optional, max 100 chars)
targetDevices: string (optional)
displaySchedule: string (optional, max 200 chars)
weight: int (optional, min 1, default: 1)
trackingPixel: string (optional)
utmParameters: string (optional)
images: List<MultipartFile> (required)
```
**Validation Messages:**
- `title`: "Title is required", "Title must not exceed 150 characters"
- `banner`: "Banner is required"
- `position`: "Position is required"
- `createdBy`: "CreatedBy is required"
- `notes`: "Notes must not exceed 500 characters"
- `targetLocation`: "Target location must not exceed 100 characters"
- `displaySchedule`: "Display schedule must not exceed 200 characters"
- `weight`: "Weight must be at least 1"

**Success Response (200):**
```json
{ "message": "Ad created successfully", "data": "AdResponse" }
```

---

### PUT `/{id}`
**Request Body:** Same as POST  
**Success Response (200):**
```json
{ "message": "Ad updated with id: {id}", "data": "AdResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "Ad deleted with id: {id}", "data": null }
```

---

## 10. Notes API

**Base Path:** `/api/v1/notes`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "noteName"), sortDir  
**Success Response (200):**
```json
{ "message": "List of notes", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "note found with{id}", "data": "NoteResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Parts:**
- `note` (JSON): NoteRequest
- `file`: MultipartFile (required)

**NoteRequest:**
```json
{
  "noteName": "string (required)",
  "noteDescription": "string (optional)",
  "syllabusId": "number (required)"
}
```
**Validation Messages:**
- `noteName`: "Note name cannot be null"
- `syllabusId`: "Syllabus ID cannot be null"

**Success Response (200):**
```json
{ "message": "Note created successfully", "data": "NoteResponse" }
```
**Error Response (400):**
```json
{ "message": "File is required", "data": null }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request Body:** NoteRequest  
**Success Response (200):**
```json
{ "message": "Note updated with id: {id}", "data": "NoteResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "Note deleted with id: {id}", "data": null }
```

---

### GET `/{id}/file`
**Description:** Download note file  
**Success Response (200):** Binary file stream

---

### PUT `/{id}/file`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request:** MultipartFile  
**Success Response (200):**
```json
{ "message": "Note File Updated with id{id}", "data": "NoteResponse" }
```
**Error Response (400):**
```json
{ "message": "File is Missing!. please upload the file", "data": null }
```

---

### GET `/{courseName}/notes`
**Success Response (200):**
```json
{ "message": "List of notes for course: {courseName}", "data": "List<NoteResponse>" }
```

---

### GET `/by-course-semester-affiliation`
**Query Parameters:** courseName (required), semester (required), affiliation (required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "List of notes for course: {courseName} and semester: {semester}", "data": "PageResponse" }
```

---

### GET `/noteName/{noteName}`
**Success Response (200):**
```json
{ "message": "List of notes for note name: {noteName}", "data": "List<NoteResponse>" }
```

---

### GET `/syllabusTitle/{syllabusTitle}`
**Success Response (200):**
```json
{ "message": "List of notes for syllabus title: {syllabusTitle}", "data": "List<NoteResponse>" }
```

---

## 11. Notices API

**Base Path:** `/api/v1/notices`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "createdDate"), sortDir (default: "desc")  
**Success Response (200):**
```json
{ "message": "List of Notices", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Notice", "data": "NoticeResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:**
```
title: string (required, max 255 chars)
description: string (optional)
image: MultipartFile (optional)
```
**Validation Messages:**
- `title`: "Blog title is required", "Title must be less than 255 characters"

**Success Response (201):**
```json
{ "message": "Notice created", "data": "NoticeResponse" }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Body:** Same as POST  
**Success Response (200):**
```json
{ "message": "Notice updated", "data": "NoticeResponse" }
```

---

### DELETE `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Notice deleted with id: {id}", "data": null }
```

---

### GET `/{id}/file`
**Description:** Download notice image  
**Success Response (200):** Binary file stream

---

## 12. MCQ Questions API

**Base Path:** `/api/v1/questions`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "category.categoryName"), sortDir  
**Success Response (200):**
```json
{ "message": "success", "data": "PageResponse" }
```

---

### GET `/id`
**Query Parameters:** id (Long)  
**Success Response (200):**
```json
{ "message": "success", "data": "QuestionResponse" }
```

---

### POST `/`
**Content-Type:** `multipart/form-data`  
**Request Body:**
```
question: string (required)
questionImageName: string (optional)
options: List<McqOptionRequest> (required, 2-4 items)
correctAnswerIndex: int (required, 0-3)
marks: int (required, min 0)
categoryId: number (required)
questionSetId: number (required)
imageFile: MultipartFile (optional)
optionImageFiles: List<MultipartFile> (optional)
```
**McqOptionRequest:**
```json
{
  "optionText": "string",
  "optionOrder": "int",
  "optionImageName": "MultipartFile"
}
```
**Validation Messages:**
- `question`: "McqQuestion text is required"
- `options`: "Options are required", "There must be between 2 and 4 options"
- `correctAnswerIndex`: "Correct answer index is required", "Correct answer index must be at least 0", "Correct answer index cannot exceed 1"
- `marks`: "Marks must be provided", "Marks must be non-negative"
- `categoryId`: "Category ID is required"
- `questionSetId`: "McqQuestion set ID is required"

**Success Response (200):**
```json
{ "message": "created successfully", "data": "QuestionResponse" }
```

---

### PUT `/{id}`
**Request Body:** McqQuestionRequest (JSON)  
**Success Response (200):**
```json
{ "message": "updated successfully", "data": "QuestionResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "{id}Deleted Successfully", "data": null }
```

---

### GET `/set/{questionSetId}`
**Query Parameters:** page, size, sortBy (default: "question"), sortDir  
**Success Response (200):**
```json
{ "message": "Questions for set", "data": "PageResponse" }
```

---

## 13. Question Sets API

**Base Path:** `/api/v1/question-sets`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "setName"), sortDir  
**Success Response (200):**
```json
{ "message": "success", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "success", "data": "QuestionSetResponse" }
```

---

### POST `/`
**Request Body:**
```json
{
  "setName": "string (required, 3-100 chars)",
  "nosOfQuestions": "int (required, 1-500)",
  "durationInMinutes": "int (required, 1-600)",
  "description": "string (optional, max 500 chars)",
  "price": "decimal (required, 0.00-99999.99)",
  "courseId": "number (required)"
}
```
**Validation Messages:**
- `setName`: "Set name is required", "Set name must be between 3 and 100 characters"
- `nosOfQuestions`: "Number of questions is required", "Must have at least 1 question", "Cannot exceed 500 questions"
- `durationInMinutes`: "Duration is required", "Duration must be at least 1 minute", "Duration cannot exceed 600 minutes (10 hours)"
- `description`: "Description cannot exceed 500 characters"
- `price`: "Price is required", "Price cannot be negative", "Price cannot exceed 99999.99", "Price must have at most 5 digits and 2 decimal places"
- `courseId`: "Course ID is required"

**Success Response (200):**
```json
{ "message": "set created successfully", "data": "QuestionSetResponse" }
```

---

### PUT `/{id}`
**Request Body:** QuestionSetRequest  
**Success Response (200):**
```json
{ "message": "set updated successfully", "data": "QuestionSetResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "Deleted successfully", "data": null }
```

---

### GET `/free`
**Query Parameters:** page, size, sortBy (default: "categoryName"), sortDir  
**Success Response (200):**
```json
{ "message": "free sets", "data": "PageResponse" }
```

---

### GET `/course/{courseId}`
**Query Parameters:** page, size, sortBy (default: "setName"), sortDir  
**Success Response (200):**
```json
{ "message": "McqQuestion sets for course", "data": "PageResponse" }
```

---

## 14. Quiz Attempts API

**Base Path:** `/api/v1/quiz-attempts`

### GET `/`
**Query Parameters:** page, size, sortDir  
**Success Response (200):**
```json
{ "message": "List of Quiz attempts", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "success", "data": "QuizAttemptResponse" }
```

---

### POST `/`
**Request Body:**
```json
{
  "questionSetId": "number",
  "questionAnswers": [
    {
      "questionId": "number",
      "selectedOption": "string"
    }
  ]
}
```
**Success Response (200):**
```json
{ "message": "Quiz Attempt  Sucessfully", "data": "QuizAttemptResponse" }
```

---

### DELETE `/{id}`
**Success Response (200):**
```json
{ "message": "{id} Deleted successfully", "data": null }
```

---

### GET `/user`
**Description:** Get quiz attempts for current user  
**Success Response (200):**
```json
{ "message": "success", "data": "List<QuizAttemptResponse>" }
```

---

## 15. Old Question Collections API

**Base Path:** `/api/v1/old-question-collections`

### POST `/admin/old-questions`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Parts:**
- `data` (JSON): OldQuestionCollectionRequest
- `file`: MultipartFile (required)

**OldQuestionCollectionRequest:**
```json
{
  "setName": "string (required)",
  "description": "string (optional)",
  "year": "int (required, 1990-2100)",
  "syllabusId": "number (required)",
  "courseId": "number (required)"
}
```
**Validation Messages:**
- `setName`: "Set name is required"
- `year`: "Year is required", "Year must be at least 1990", "Year must not exceed 2100"
- `syllabusId`: "Syllabus ID is required"
- `courseId`: "Course ID is required"

**Success Response (201):**
```json
{ "message": "success", "data": "OldQuestionResponse" }
```
**Error Response (500):**
```json
{ "error": "File is missing. Please upload the file" }
```

---

### PUT `/admin/old-questions/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Parts:** data (JSON), file (optional)  
**Success Response (200):**
```json
{ "message": "success", "data": "OldQuestionResponse" }
```

---

### GET `/questions`
**Query Parameters:** courseId, syllabusId, year, setName (all optional), page, size, sortBy (default: "syllabusTitle"), sortDir  
**Success Response (200):**
```json
{ "message": "List of old question collections", "data": "PageResponse" }
```

---

### GET `/course/{courseId}/semesters`
**Success Response (200):**
```json
{ "message": "Semesters for course: {courseId}", "data": "List<Integer>" }
```

---

### GET `/course/{courseId}/semester/{semester}/subjects`
**Success Response (200):**
```json
{ "message": "Subjects for course: {courseId} and semester: {semester}", "data": "List" }
```

---

### GET `/syllabus/{syllabusId}`
**Success Response (200):**
```json
{ "message": "Old questions for syllabus: {syllabusId}", "data": "List" }
```

---

### GET `/filter`
**Query Parameters:** courseId (required), semester (optional), year (optional), page, size, sortBy (default: "year"), sortDir (default: "desc")  
**Success Response (200):**
```json
{ "message": "Filtered old questions", "data": "PageResponse" }
```

---

### GET `/view/{id}`
**Description:** View PDF in browser  
**Response:** PDF stream (`application/pdf`, inline disposition)

---

### DELETE `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Old Question Collection deleted with id: {id}", "data": null }
```

---

## 16. Syllabus API

**Base Path:** `/api/v1/syllabus`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "syllabusTitle"), sortDir  
**Success Response (200):**
```json
{ "message": "List of syllabus", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Syllabus details for id: {id}", "data": "SyllabusResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Content-Type:** `multipart/form-data`  
**Request Parts:**
- `syllabus` (JSON): SyllabusRequest
- `file`: MultipartFile (required)

**SyllabusRequest:**
```json
{
  "syllabusTitle": "string (required, max 255 chars)",
  "subjectName": "string (required, max 255 chars)",
  "courseCode": "string (required, max 50 chars)",
  "creditHours": "double (required, min 0)",
  "lectureHours": "int (required, min 0)",
  "practicalHours": "int (required, min 0)",
  "courseId": "number (required)",
  "semester": "int (optional)",
  "year": "int (optional)"
}
```
**Validation Messages:**
- `syllabusTitle`: "Syllabus title is required", "Syllabus title must be less than 255 characters"
- `subjectName`: "Subject name is required", "Subject name must be less than 255 characters"
- `courseCode`: "Course code is required", "Course code must be less than 50 characters"
- `creditHours`: "Credit hours is required", "Credit hours must be non-negative"
- `lectureHours`: "Lecture hours is required", "Lecture hours must be non-negative"
- `practicalHours`: "Practical hours is required", "Practical hours must be non-negative"
- `courseId`: "Course ID is required"

**Success Response (201):**
```json
{ "message": "success", "data": "SyllabusResponse" }
```
**Error Response (500):**
```json
{ "error": "File is Missing!. please upload the file" }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request Body:** SyllabusRequest (JSON)  
**Success Response (200):**
```json
{ "message": "Syllabus updated with id: {id}", "data": "SyllabusResponse" }
```

---

### DELETE `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Syllabus deleted with id: {id}", "data": null }
```

---

### GET `/{id}/file`
**Description:** Download syllabus file  
**Success Response (200):** Binary file stream

---

### PUT `/{id}/file`
**Content-Type:** `multipart/form-data`  
**Request:** file (MultipartFile, required)  
**Success Response (200):**
```json
{ "message": "Syllabus file updated with id: {id}", "data": "SyllabusResponse" }
```

---

### GET `/by-affiliation/by-course`
**Query Parameters:** affiliation (required), courseName (required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Syllabus for affiliation: {affiliation} and course: {courseName}", "data": "PageResponse" }
```

---

### GET `/by-affiliation/by-course/semester`
**Query Parameters:** affiliation (required), courseName (required), semester (required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Syllabus for affiliation: {affiliation} and course: {courseName} and semester: {semester}", "data": "PageResponse" }
```

---

### GET `/by-course`
**Query Parameters:** courseId (required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Syllabus for courseId: {courseId}", "data": "PageResponse" }
```

---

## 17. Training API

**Base Path:** `/api/v1/trainings`

### GET `/`
**Query Parameters:** page, size, sortBy (default: "trainingStatus"), sortDir  
**Success Response (200):**
```json
{ "message": "List of trainings", "data": "PageResponse" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Training details for id: {id}", "data": "TrainingResponse" }
```

---

### POST `/`
**Authorization:** ADMIN or SUPER_ADMIN  
**Request Body:**
```json
{
  "trainingName": "string (required, max 255 chars)",
  "description": "string (required, max 2000 chars)",
  "startDate": "date (required)",
  "endDate": "date (required)",
  "trainingType": "TrainingType enum (required)",
  "trainingStatus": "TrainingStatus enum (required)",
  "trainingHours": "number (required, min 0)",
  "location": "string (optional)",
  "maxParticipants": "int (required, min 0)",
  "currentParticipants": "int (optional, min 0, default: 0)",
  "trainingCategory": "string (optional)",
  "cost": "double (required, min 0)",
  "certificateProvided": "boolean (optional)",
  "materialsLink": "string (optional)",
  "remarks": "string (optional, max 1000 chars)"
}
```
**Validation Messages:**
- `trainingName`: "Training name is required", "Training name must be less than 255 characters"
- `description`: "Description is required", "Description must be less than 2000 characters"
- `startDate`: "Start date is required"
- `endDate`: "End date is required"
- `trainingType`: "Training type is required"
- `trainingStatus`: "Training status is required"
- `trainingHours`: "Training hours is required", "Training hours must be non-negative"
- `maxParticipants`: "Max participants is required", "Max participants must be non-negative"
- `currentParticipants`: "Current participants must be non-negative"
- `cost`: "Cost is required", "Cost must be non-negative"
- `remarks`: "Remarks must be less than 1000 characters"

**Success Response (201):**
```json
{ "message": "success", "data": "TrainingResponse" }
```

---

### PUT `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Training updated with id: {id}", "data": null }
```

---

### DELETE `/{id}`
**Authorization:** ADMIN or SUPER_ADMIN  
**Success Response (200):**
```json
{ "message": "Training deleted with id: {id}", "data": null }
```

---

## 18. Audit Logs API

**Base Path:** `/api/v1/audit-logs`  
**Authorization:** SUPER_ADMIN only (all endpoints)

### GET `/`
**Query Parameters:** page (default: 0), size (default: 20), sortBy (default: "timestamp"), sortDir (default: "desc")  
**Success Response (200):**
```json
{ "message": "Audit logs retrieved successfully", "data": "PageResponse<AuditLogResponse>" }
```

---

### GET `/{id}`
**Success Response (200):**
```json
{ "message": "Audit log retrieved successfully", "data": "AuditLogResponse" }
```

---

### GET `/by-admin`
**Query Parameters:** email (required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Audit logs for admin: {email}", "data": "PageResponse" }
```

---

### GET `/by-action`
**Query Parameters:** action (AuditAction enum, required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Audit logs for action: {action}", "data": "PageResponse" }
```

---

### GET `/by-entity`
**Query Parameters:** entityType (string, required), page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Audit logs for entity: {entityType}", "data": "PageResponse" }
```

---

### GET `/by-date-range`
**Query Parameters:**
- startDate (required, format: `yyyy-MM-ddTHH:mm:ss`)
- endDate (required, format: `yyyy-MM-ddTHH:mm:ss`)
- page, size, sortBy, sortDir

**Success Response (200):**
```json
{ "message": "Audit logs between {startDate} and {endDate}", "data": "PageResponse" }
```

---

### GET `/login-attempts`
**Query Parameters:** page, size, sortBy, sortDir  
**Success Response (200):**
```json
{ "message": "Login attempts retrieved successfully", "data": "PageResponse" }
```

---

### GET `/actions`
**Description:** Get list of available audit action types  
**Success Response (200):**
```json
{ "message": "Available audit actions", "data": ["LOGIN_SUCCESS", "LOGIN_FAILED", "LOGOUT", "CREATE", "UPDATE", "DELETE", "PASSWORD_CHANGE", "ROLE_CHANGE", "TOKEN_REFRESH", "TOKEN_REVOKE"] }
```

---

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "fieldName": "validation error message",
  "anotherField": "another validation error"
}
```

### Missing Parameter (400 Bad Request)
```json
{
  "timestamp": "datetime",
  "status": 400,
  "error": "Bad Request",
  "message": "Required parameter '{paramName}' is missing",
  "path": "{paramName}"
}
```

### Invalid Property Reference (400 Bad Request)
```json
{
  "timestamp": "datetime",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid property reference: {propertyName}"
}
```

### Unauthorized (401)
```json
{ "error": "error message" }
```

### Forbidden (403)
```json
{ "error": "Access denied message" }
```

### Not Found (404)
```json
{ "error": "Resource not found message" }
```

### Conflict - Already Exists (409)
```json
{ "error": "Resource already exists message" }
```

### Too Many Requests (429)
```json
{ "error": "Too many attempts message" }
```

### Internal Server Error (500)
```json
{ "error": "error message" }
```

---

## Enums Reference

### Affiliation
```
TRIBHUVAN_UNIVERSITY, POKHARA_UNIVERSITY, KATHMANDU_UNIVERSITY,
PURWANCHAL_UNIVERSITY, MID_WESTERN_UNIVERSITY, FAR_WESTERN_UNIVERSITY,
LUMBINI_UNIVERSITY, CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY
```

### CollegeType
```
PRIVATE, COMMUNITY, GOVERNMENT
```

### CourseLevel
```
PLUS_TWO, BACHELOR, MASTER, PHD, DIPLOMA, M_PHIL
```

### CourseType
```
SEMESTER, ANNUAL
```

### Priority
```
HIGH, MEDIUM, LOW
```

### AdPosition
```
horizontal_1, horizontal_2, horizontal_3, vertical_1, vertical_2, vertical_3, vertical_4
```

### AdStatus
```
DRAFT, PENDING_APPROVAL, ACTIVE, PAUSED, INACTIVE, EXPIRED, ARCHIVED
```

### QuerySubject
```
GENERAL_INQUIRY, TECHNICAL_SUPPORT, BILLING_ISSUES, FEEDBACK_SUGGESTIONS,
COURSE_INFORMATION, COLLABORATION_OPPORTUNITIES, OTHER
```

### TrainingType
```
REMOTE, ON_SITE, HYBRID
```

### TrainingStatus
```
UPCOMING, FLASH_SALE, ONGOING, COMPLETED, CANCELLED, POSTPONED,
COMING_SOON, REGISTRATION_OPEN, REGISTRATION_CLOSED, SOLD_OUT
```

### AuditAction
```
LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, CREATE, UPDATE, DELETE,
PASSWORD_CHANGE, ROLE_CHANGE, TOKEN_REFRESH, TOKEN_REVOKE
```

---

## Common Query Parameters for Pagination

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number (0-based) |
| size | int | 10 | Items per page |
| sortBy | string | varies | Field to sort by |
| sortDir | string | "asc" or "desc" | Sort direction |

---

*Generated from source code analysis - Entrance Gateway Backend API v1*