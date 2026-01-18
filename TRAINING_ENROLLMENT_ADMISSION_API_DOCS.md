# Training Enrollment & Admission API Documentation

**Base URL:** `/api/v1`  
**Authentication:** JWT Bearer Token (Required for all endpoints unless specified)  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Training Enrollment APIs](#training-enrollment-apis)
2. [Admission APIs](#admission-apis)
3. [Common Models](#common-models)
4. [Error Responses](#error-responses)

---

# Training Enrollment APIs

Base Path: `/api/v1/training-enrollments`

## 1. Enroll in Training Program

**Endpoint:** `POST /api/v1/training-enrollments/{trainingId}/enroll`

**Description:** Allows authenticated users to enroll in a training program. Requires idempotency key to prevent duplicate enrollments.

**Authentication:** Required (User/Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| trainingId | Long | Yes | ID of the training program |

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| Authorization | String | Yes | Bearer {JWT_TOKEN} |
| Idempotency-Key | UUID | Yes | Unique identifier to prevent duplicate enrollments |

**Request Example:**
```http
POST /api/v1/training-enrollments/123/enroll
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

**Response (201 Created):**
```json
{
  "message": "Successfully enrolled in training program",
  "data": {
    "enrollmentId": 456,
    "userId": 789,
    "userName": "John Doe",
    "trainingId": 123,
    "trainingName": "Advanced Java Programming",
    "status": "ACTIVE",
    "enrollmentDate": "2026-01-15T10:30:00",
    "completionDate": null,
    "paidAmount": 5000.00,
    "paymentReference": "PAY_REF_123456",
    "paymentMethod": "CARD",
    "progressPercentage": 0,
    "remarks": null,
    "createdAt": "2026-01-15T10:30:00",
    "updatedAt": "2026-01-15T10:30:00"
  }
}
```

**Business Rules:**
- Training must be ACTIVE (not CANCELLED or COMPLETED)
- User cannot have duplicate active enrollment for the same training
- Training capacity must not be exceeded (maxParticipants)
- Idempotency key prevents duplicate requests
- Uses optimistic locking to handle concurrent enrollments

**Error Responses:**
- `400 Bad Request` - Idempotency-Key header missing or invalid
- `404 Not Found` - Training program not found
- `409 Conflict` - Duplicate enrollment detected
- `400 Bad Request` - Training capacity full
- `400 Bad Request` - Training not currently active

---

## 2. Get All Training Enrollments (Admin)

**Endpoint:** `GET /api/v1/training-enrollments`

**Description:** Retrieve all training enrollments with pagination and sorting. Admin only.

**Authentication:** Required (Admin/Super Admin)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | Integer | No | 0 | Page number (0-indexed) |
| size | Integer | No | 10 | Number of records per page |
| sortBy | String | No | enrollmentDate | Field to sort by |
| sortDir | String | No | desc | Sort direction (asc/desc) |

**Request Example:**
```http
GET /api/v1/training-enrollments?page=0&size=20&sortBy=enrollmentDate&sortDir=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "List of training enrollments",
  "data": {
    "content": [
      {
        "enrollmentId": 456,
        "userId": 789,
        "userName": "John Doe",
        "trainingId": 123,
        "trainingName": "Advanced Java Programming",
        "status": "ACTIVE",
        "enrollmentDate": "2026-01-15T10:30:00",
        "completionDate": null,
        "paidAmount": 5000.00,
        "paymentReference": "PAY_REF_123456",
        "paymentMethod": "CARD",
        "progressPercentage": 25,
        "remarks": null,
        "createdAt": "2026-01-15T10:30:00",
        "updatedAt": "2026-01-15T11:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 5,
    "totalElements": 95,
    "last": false,
    "size": 20,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "numberOfElements": 20,
    "first": true,
    "empty": false
  }
}
```

**Authorization:**
- Requires `ADMIN` or `SUPER_ADMIN` role

---

## 3. Get Enrollment by ID

**Endpoint:** `GET /api/v1/training-enrollments/{id}`

**Description:** Retrieve a specific training enrollment by its ID.

**Authentication:** Required (User/Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Enrollment ID |

**Request Example:**
```http
GET /api/v1/training-enrollments/456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Training enrollment details",
  "data": {
    "enrollmentId": 456,
    "userId": 789,
    "userName": "John Doe",
    "trainingId": 123,
    "trainingName": "Advanced Java Programming",
    "status": "ACTIVE",
    "enrollmentDate": "2026-01-15T10:30:00",
    "completionDate": null,
    "paidAmount": 5000.00,
    "paymentReference": "PAY_REF_123456",
    "paymentMethod": "CARD",
    "progressPercentage": 25,
    "remarks": null,
    "createdAt": "2026-01-15T10:30:00",
    "updatedAt": "2026-01-15T11:00:00"
  }
}
```

**Error Responses:**
- `404 Not Found` - Enrollment not found

---

## 4. Get My Training Enrollments

**Endpoint:** `GET /api/v1/training-enrollments/my-enrollments`

**Description:** Retrieve all training enrollments for the currently authenticated user.

**Authentication:** Required (User/Admin)

**Request Example:**
```http
GET /api/v1/training-enrollments/my-enrollments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Your training enrollments",
  "data": [
    {
      "enrollmentId": 456,
      "userId": 789,
      "userName": "John Doe",
      "trainingId": 123,
      "trainingName": "Advanced Java Programming",
      "status": "ACTIVE",
      "enrollmentDate": "2026-01-15T10:30:00",
      "completionDate": null,
      "paidAmount": 5000.00,
      "paymentReference": "PAY_REF_123456",
      "paymentMethod": "CARD",
      "progressPercentage": 25,
      "remarks": null,
      "createdAt": "2026-01-15T10:30:00",
      "updatedAt": "2026-01-15T11:00:00"
    },
    {
      "enrollmentId": 457,
      "userId": 789,
      "userName": "John Doe",
      "trainingId": 124,
      "trainingName": "Spring Boot Masterclass",
      "status": "COMPLETED",
      "enrollmentDate": "2025-12-01T09:00:00",
      "completionDate": "2026-01-10T18:00:00",
      "paidAmount": 7500.00,
      "paymentReference": "PAY_REF_789012",
      "paymentMethod": "UPI",
      "progressPercentage": 100,
      "remarks": null,
      "createdAt": "2025-12-01T09:00:00",
      "updatedAt": "2026-01-10T18:00:00"
    }
  ]
}
```

**Notes:**
- Returns enrollments ordered by enrollment date (most recent first)
- No pagination for user's own enrollments

---

## 5. Get Enrollments by Status (Admin)

**Endpoint:** `GET /api/v1/training-enrollments/status/{status}`

**Description:** Retrieve training enrollments filtered by status. Admin only.

**Authentication:** Required (Admin/Super Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | EnrollmentStatus | Yes | Enrollment status filter |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | Integer | No | 0 | Page number (0-indexed) |
| size | Integer | No | 10 | Number of records per page |

**Valid Status Values:**
- `PENDING` - Enrollment initiated, payment pending
- `ACTIVE` - Payment confirmed, enrolled
- `COMPLETED` - Training completed
- `CANCELLED` - Student cancelled
- `PAYMENT_FAILED` - Payment verification failed
- `EXPIRED` - Enrollment expired due to inactivity
- `SUSPENDED` - Admin suspended enrollment

**Request Example:**
```http
GET /api/v1/training-enrollments/status/ACTIVE?page=0&size=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Enrollments with status: ACTIVE",
  "data": {
    "content": [
      {
        "enrollmentId": 456,
        "userId": 789,
        "userName": "John Doe",
        "trainingId": 123,
        "trainingName": "Advanced Java Programming",
        "status": "ACTIVE",
        "enrollmentDate": "2026-01-15T10:30:00",
        "completionDate": null,
        "paidAmount": 5000.00,
        "paymentReference": "PAY_REF_123456",
        "paymentMethod": "CARD",
        "progressPercentage": 25,
        "remarks": null,
        "createdAt": "2026-01-15T10:30:00",
        "updatedAt": "2026-01-15T11:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "unsorted": true,
        "empty": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 3,
    "totalElements": 28,
    "last": false,
    "size": 10,
    "number": 0,
    "first": true,
    "empty": false
  }
}
```

**Authorization:**
- Requires `ADMIN` or `SUPER_ADMIN` role

---

## 6. Cancel Enrollment

**Endpoint:** `DELETE /api/v1/training-enrollments/{id}`

**Description:** Cancel a training enrollment. Users can only cancel their own enrollments.

**Authentication:** Required (User/Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Enrollment ID to cancel |

**Request Example:**
```http
DELETE /api/v1/training-enrollments/456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Training enrollment cancelled successfully",
  "data": {
    "enrollmentId": 456,
    "userId": 789,
    "userName": "John Doe",
    "trainingId": 123,
    "trainingName": "Advanced Java Programming",
    "status": "CANCELLED",
    "enrollmentDate": "2026-01-15T10:30:00",
    "completionDate": null,
    "paidAmount": 5000.00,
    "paymentReference": "PAY_REF_123456",
    "paymentMethod": "CARD",
    "progressPercentage": 25,
    "remarks": "Cancelled by student",
    "createdAt": "2026-01-15T10:30:00",
    "updatedAt": "2026-01-15T14:30:00"
  }
}
```

**Business Rules:**
- User can only cancel their own enrollments
- Only ACTIVE or PENDING enrollments can be cancelled
- Cannot cancel after training has started
- Participant count is decremented upon cancellation

**Error Responses:**
- `404 Not Found` - Enrollment not found
- `403 Forbidden` - Attempting to cancel another user's enrollment
- `400 Bad Request` - Only ACTIVE or PENDING enrollments can be cancelled
- `400 Bad Request` - Cannot cancel enrollment after training has started

---

## 7. Update Enrollment Progress (Admin)

**Endpoint:** `PATCH /api/v1/training-enrollments/{id}/progress`

**Description:** Update the progress percentage of an enrollment. Admin only.

**Authentication:** Required (Admin/Super Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Enrollment ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| progressPercentage | Integer | Yes | Progress percentage (0-100) |

**Request Example:**
```http
PATCH /api/v1/training-enrollments/456/progress?progressPercentage=75
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Enrollment progress updated",
  "data": {
    "enrollmentId": 456,
    "userId": 789,
    "userName": "John Doe",
    "trainingId": 123,
    "trainingName": "Advanced Java Programming",
    "status": "ACTIVE",
    "enrollmentDate": "2026-01-15T10:30:00",
    "completionDate": null,
    "paidAmount": 5000.00,
    "paymentReference": "PAY_REF_123456",
    "paymentMethod": "CARD",
    "progressPercentage": 75,
    "remarks": null,
    "createdAt": "2026-01-15T10:30:00",
    "updatedAt": "2026-01-15T15:30:00"
  }
}
```

**Business Rules:**
- Progress percentage must be between 0 and 100
- Can only update progress for ACTIVE enrollments
- When progress reaches 100%, status automatically changes to COMPLETED and completionDate is set

**Error Responses:**
- `404 Not Found` - Enrollment not found
- `400 Bad Request` - Progress percentage must be between 0 and 100
- `400 Bad Request` - Can only update progress for active enrollments

**Authorization:**
- Requires `ADMIN` or `SUPER_ADMIN` role

---

# Admission APIs

Base Path: `/api/v1/admissions`

## 1. Apply for Admission

**Endpoint:** `POST /api/v1/admissions`

**Description:** Submit an admission application for a course at a specific college.

**Authentication:** Required (User/Admin)

**Request Body:**
```json
{
  "courseId": 101,
  "collegeId": 202,
  "applicantName": "John Doe",
  "applicantEmail": "john.doe@example.com",
  "applicantPhone": "9876543210",
  "previousEducation": "+2 Science with 85% from ABC College, Kathmandu",
  "reasonForApplication": "Passionate about Computer Science and want to pursue career in software development",
  "referredBy": "Jane Smith"
}
```

**Validation Rules:**
| Field | Required | Constraints |
|-------|----------|-------------|
| courseId | Yes | Must exist |
| collegeId | Yes | Must exist |
| applicantName | Yes | 2-100 characters |
| applicantEmail | Yes | Valid email format, max 100 characters |
| applicantPhone | Yes | 10-digit Indian phone number starting with 6-9 |
| previousEducation | No | Max 2000 characters |
| reasonForApplication | No | Max 500 characters |
| referredBy | No | Text |

**Request Example:**
```http
POST /api/v1/admissions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "courseId": 101,
  "collegeId": 202,
  "applicantName": "John Doe",
  "applicantEmail": "john.doe@example.com",
  "applicantPhone": "9876543210",
  "previousEducation": "+2 Science with 85% from ABC College, Kathmandu",
  "reasonForApplication": "Passionate about Computer Science",
  "referredBy": "Jane Smith"
}
```

**Response (201 Created):**
```json
{
  "message": "Admission application submitted successfully",
  "data": {
    "admissionId": 301,
    "userId": 789,
    "userName": "John Doe",
    "courseId": 101,
    "courseName": "Bachelor of Computer Application",
    "collegeId": 202,
    "collegeName": "Nepal Engineering College",
    "status": "PENDING",
    "applicationDate": "2026-01-15T10:30:00",
    "approvalDate": null,
    "enrollmentDate": null,
    "remarks": null,
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "applicantPhone": "9876543210",
    "previousEducation": "+2 Science with 85% from ABC College, Kathmandu",
    "reasonForApplication": "Passionate about Computer Science",
    "createdAt": "2026-01-15",
    "updatedAt": "2026-01-15",
    "referredBy": "Jane Smith"
  }
}
```

**Business Rules:**
- User is automatically associated from JWT token
- Course must exist and belong to the selected college
- Cannot have duplicate active admission for same course
- Status is automatically set to PENDING
- Unique constraint on (user_id, college_id, course_id)

**Error Responses:**
- `400 Bad Request` - Validation errors (invalid fields)
- `404 Not Found` - Course or College not found
- `400 Bad Request` - Course does not belong to selected college
- `409 Conflict` - Already have an active application for this course

---

## 2. Get All Admissions (Admin)

**Endpoint:** `GET /api/v1/admissions`

**Description:** Retrieve all admission applications with pagination and sorting. Admin only.

**Authentication:** Required (Admin/Super Admin)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | Integer | No | 0 | Page number (0-indexed) |
| size | Integer | No | 10 | Number of records per page |
| sortBy | String | No | applicationDate | Field to sort by |
| sortDir | String | No | desc | Sort direction (asc/desc) |

**Request Example:**
```http
GET /api/v1/admissions?page=0&size=20&sortBy=applicationDate&sortDir=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "List of admissions",
  "data": {
    "content": [
      {
        "admissionId": 301,
        "userId": 789,
        "userName": "John Doe",
        "courseId": 101,
        "courseName": "Bachelor of Computer Application",
        "collegeId": 202,
        "collegeName": "Nepal Engineering College",
        "status": "PENDING",
        "applicationDate": "2026-01-15T10:30:00",
        "approvalDate": null,
        "enrollmentDate": null,
        "remarks": null,
        "applicantName": "John Doe",
        "applicantEmail": "john.doe@example.com",
        "applicantPhone": "9876543210",
        "previousEducation": "+2 Science with 85%",
        "reasonForApplication": "Passionate about Computer Science",
        "createdAt": "2026-01-15",
        "updatedAt": "2026-01-15",
        "referredBy": "Jane Smith"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 8,
    "totalElements": 152,
    "last": false,
    "size": 20,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "numberOfElements": 20,
    "first": true,
    "empty": false
  }
}
```

**Authorization:**
- Requires `ADMIN` or `SUPER_ADMIN` role

---

## 3. Get Admission by ID

**Endpoint:** `GET /api/v1/admissions/{id}`

**Description:** Retrieve a specific admission application by its ID.

**Authentication:** Required (User/Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Admission ID |

**Request Example:**
```http
GET /api/v1/admissions/301
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Admission details",
  "data": {
    "admissionId": 301,
    "userId": 789,
    "userName": "John Doe",
    "courseId": 101,
    "courseName": "Bachelor of Computer Application",
    "collegeId": 202,
    "collegeName": "Nepal Engineering College",
    "status": "PENDING",
    "applicationDate": "2026-01-15T10:30:00",
    "approvalDate": null,
    "enrollmentDate": null,
    "remarks": null,
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "applicantPhone": "9876543210",
    "previousEducation": "+2 Science with 85% from ABC College",
    "reasonForApplication": "Passionate about Computer Science",
    "createdAt": "2026-01-15",
    "updatedAt": "2026-01-15",
    "referredBy": "Jane Smith"
  }
}
```

**Error Responses:**
- `404 Not Found` - Admission not found

---

## 4. Get My Admission Applications

**Endpoint:** `GET /api/v1/admissions/my-applications`

**Description:** Retrieve all admission applications for the currently authenticated user.

**Authentication:** Required (User/Admin)

**Request Example:**
```http
GET /api/v1/admissions/my-applications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Your admission applications",
  "data": [
    {
      "admissionId": 301,
      "userId": 789,
      "userName": "John Doe",
      "courseId": 101,
      "courseName": "Bachelor of Computer Application",
      "collegeId": 202,
      "collegeName": "Nepal Engineering College",
      "status": "PENDING",
      "applicationDate": "2026-01-15T10:30:00",
      "approvalDate": null,
      "enrollmentDate": null,
      "remarks": null,
      "applicantName": "John Doe",
      "applicantEmail": "john.doe@example.com",
      "applicantPhone": "9876543210",
      "previousEducation": "+2 Science with 85%",
      "reasonForApplication": "Passionate about Computer Science",
      "createdAt": "2026-01-15",
      "updatedAt": "2026-01-15",
      "referredBy": "Jane Smith"
    },
    {
      "admissionId": 302,
      "userId": 789,
      "userName": "John Doe",
      "courseId": 102,
      "courseName": "Bachelor of Information Technology",
      "collegeId": 203,
      "collegeName": "Kathmandu University",
      "status": "APPROVED",
      "applicationDate": "2026-01-10T09:00:00",
      "approvalDate": "2026-01-14",
      "enrollmentDate": null,
      "remarks": "Excellent academic record",
      "applicantName": "John Doe",
      "applicantEmail": "john.doe@example.com",
      "applicantPhone": "9876543210",
      "previousEducation": "+2 Science with 85%",
      "reasonForApplication": "Interest in IT field",
      "createdAt": "2026-01-10",
      "updatedAt": "2026-01-14",
      "referredBy": null
    }
  ]
}
```

**Notes:**
- Returns applications ordered by application date (most recent first)
- No pagination for user's own applications

---

## 5. Get Admissions by Status (Admin)

**Endpoint:** `GET /api/v1/admissions/status/{status}`

**Description:** Retrieve admission applications filtered by status. Admin only.

**Authentication:** Required (Admin/Super Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | AdmissionStatus | Yes | Admission status filter |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | Integer | No | 0 | Page number (0-indexed) |
| size | Integer | No | 10 | Number of records per page |

**Valid Status Values:**
- `APPLIED` - Initial application status
- `PENDING` - Application pending review
- `APPROVED` - Application approved
- `ENROLLED` - Student enrolled in college
- `REJECTED` - Application rejected
- `WITHDRAWN` - Application withdrawn by student
- `ON_CONTACT` - Attempting to contact applicant
- `OUT_OF_CONTACT` - Unable to reach applicant
- `UNDER_REVIEW` - Application under review
- `DOCUMENTS_PENDING` - Waiting for documents
- `INTERVIEW_SCHEDULED` - Interview scheduled

**Request Example:**
```http
GET /api/v1/admissions/status/PENDING?page=0&size=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Admissions with status: PENDING",
  "data": {
    "content": [
      {
        "admissionId": 301,
        "userId": 789,
        "userName": "John Doe",
        "courseId": 101,
        "courseName": "Bachelor of Computer Application",
        "collegeId": 202,
        "collegeName": "Nepal Engineering College",
        "status": "PENDING",
        "applicationDate": "2026-01-15T10:30:00",
        "approvalDate": null,
        "enrollmentDate": null,
        "remarks": null,
        "applicantName": "John Doe",
        "applicantEmail": "john.doe@example.com",
        "applicantPhone": "9876543210",
        "previousEducation": "+2 Science with 85%",
        "reasonForApplication": "Passionate about Computer Science",
        "createdAt": "2026-01-15",
        "updatedAt": "2026-01-15",
        "referredBy": "Jane Smith"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "unsorted": true,
        "empty": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 4,
    "totalElements": 35,
    "last": false,
    "size": 10,
    "number": 0,
    "first": true,
    "empty": false
  }
}
```

**Authorization:**
- Requires `ADMIN` or `SUPER_ADMIN` role

---

## 6. Update Admission Status (Admin)

**Endpoint:** `PUT /api/v1/admissions/{id}/status`

**Description:** Update the status of an admission application. Admin only.

**Authentication:** Required (Admin/Super Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Admission ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | AdmissionStatus | Yes | New status value |
| remarks | String | No | Optional remarks/notes |

**Request Example:**
```http
PUT /api/v1/admissions/301/status?status=APPROVED&remarks=Excellent academic record
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Admission status updated successfully",
  "data": {
    "admissionId": 301,
    "userId": 789,
    "userName": "John Doe",
    "courseId": 101,
    "courseName": "Bachelor of Computer Application",
    "collegeId": 202,
    "collegeName": "Nepal Engineering College",
    "status": "APPROVED",
    "applicationDate": "2026-01-15T10:30:00",
    "approvalDate": "2026-01-15",
    "enrollmentDate": null,
    "remarks": "Excellent academic record",
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "applicantPhone": "9876543210",
    "previousEducation": "+2 Science with 85%",
    "reasonForApplication": "Passionate about Computer Science",
    "createdAt": "2026-01-15",
    "updatedAt": "2026-01-15",
    "referredBy": "Jane Smith"
  }
}
```

**Business Rules:**
- When status is set to APPROVED, approvalDate is automatically set to current date
- Only APPROVED admissions can be moved to ENROLLED status
- Status transitions are validated (specific rules may apply)

**Error Responses:**
- `404 Not Found` - Admission not found
- `400 Bad Request` - Invalid status transition
- `400 Bad Request` - Only approved admissions can be enrolled

**Authorization:**
- Requires `ADMIN` or `SUPER_ADMIN` role

---

## 7. Withdraw Admission Application

**Endpoint:** `DELETE /api/v1/admissions/{id}/withdraw`

**Description:** Withdraw an admission application. Users can only withdraw their own applications.

**Authentication:** Required (User/Admin)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Admission ID to withdraw |

**Request Example:**
```http
DELETE /api/v1/admissions/301/withdraw
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Admission application withdrawn successfully",
  "data": {
    "admissionId": 301,
    "userId": 789,
    "userName": "John Doe",
    "courseId": 101,
    "courseName": "Bachelor of Computer Application",
    "collegeId": 202,
    "collegeName": "Nepal Engineering College",
    "status": "WITHDRAWN",
    "applicationDate": "2026-01-15T10:30:00",
    "approvalDate": null,
    "enrollmentDate": null,
    "remarks": "Withdrawn by student",
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "applicantPhone": "9876543210",
    "previousEducation": "+2 Science with 85%",
    "reasonForApplication": "Passionate about Computer Science",
    "createdAt": "2026-01-15",
    "updatedAt": "2026-01-15",
    "referredBy": "Jane Smith"
  }
}
```

**Business Rules:**
- User can only withdraw their own applications
- Only PENDING or UNDER_REVIEW applications can be withdrawn
- Status is set to WITHDRAWN with remark "Withdrawn by student"

**Error Responses:**
- `404 Not Found` - Admission not found
- `403 Forbidden` - Attempting to withdraw another user's application
- `400 Bad Request` - Only PENDING or UNDER_REVIEW applications can be withdrawn

---

# Common Models

## TrainingEnrollmentResponse

```json
{
  "enrollmentId": "Long - Unique identifier",
  "userId": "Long - User ID",
  "userName": "String - Full name of user",
  "trainingId": "Long - Training program ID",
  "trainingName": "String - Training program name",
  "status": "EnrollmentStatus - Current enrollment status",
  "enrollmentDate": "LocalDateTime - When enrollment was created",
  "completionDate": "LocalDateTime - When training was completed (null if not completed)",
  "paidAmount": "BigDecimal - Amount paid for enrollment",
  "paymentReference": "String - Payment transaction reference",
  "paymentMethod": "String - Payment method used (CARD, UPI, etc.)",
  "progressPercentage": "Integer - Course completion progress (0-100)",
  "remarks": "String - Additional notes/remarks",
  "createdAt": "LocalDateTime - Record creation timestamp",
  "updatedAt": "LocalDateTime - Record last update timestamp"
}
```

## AdmissionResponse

```json
{
  "admissionId": "Long - Unique identifier",
  "userId": "Long - User ID",
  "userName": "String - Full name of user",
  "courseId": "Long - Course ID",
  "courseName": "String - Course name",
  "collegeId": "Long - College ID",
  "collegeName": "String - College name",
  "status": "AdmissionStatus - Current admission status",
  "applicationDate": "LocalDateTime - When application was submitted",
  "approvalDate": "LocalDate - When application was approved (null if not approved)",
  "enrollmentDate": "LocalDate - When student enrolled (null if not enrolled)",
  "remarks": "String - Admin remarks/notes",
  "applicantName": "String - Applicant's full name",
  "applicantEmail": "String - Applicant's email",
  "applicantPhone": "String - Applicant's phone number",
  "previousEducation": "String - Previous education qualification details",
  "reasonForApplication": "String - Reason for applying",
  "createdAt": "LocalDate - Record creation date",
  "updatedAt": "LocalDate - Record last update date",
  "referredBy": "String - Name of referrer (optional)"
}
```

## EnrollmentStatus Enum

| Value | Description |
|-------|-------------|
| PENDING | Enrollment initiated, payment pending |
| ACTIVE | Payment confirmed, enrolled |
| COMPLETED | Training completed |
| CANCELLED | Student cancelled |
| PAYMENT_FAILED | Payment verification failed |
| EXPIRED | Enrollment expired due to inactivity |
| SUSPENDED | Admin suspended enrollment |

## AdmissionStatus Enum

| Value | Description |
|-------|-------------|
| APPLIED | Initial application status |
| PENDING | Application pending review |
| APPROVED | Application approved |
| ENROLLED | Student enrolled in college |
| REJECTED | Application rejected |
| WITHDRAWN | Application withdrawn by student |
| ON_CONTACT | Attempting to contact applicant |
| OUT_OF_CONTACT | Unable to reach applicant |
| UNDER_REVIEW | Application under review |
| DOCUMENTS_PENDING | Waiting for documents |
| INTERVIEW_SCHEDULED | Interview scheduled |

---

# Error Responses

## Standard Error Response Format

```json
{
  "message": "Error description",
  "data": null
}
```

## Common HTTP Status Codes

| Status Code | Description | Common Scenarios |
|-------------|-------------|------------------|
| 200 OK | Request successful | Successful GET, PUT, PATCH, DELETE |
| 201 Created | Resource created | Successful POST |
| 400 Bad Request | Invalid request | Validation errors, business rule violations |
| 401 Unauthorized | Not authenticated | Missing or invalid JWT token |
| 403 Forbidden | Not authorized | Insufficient permissions |
| 404 Not Found | Resource not found | Invalid ID in path |
| 409 Conflict | Resource conflict | Duplicate enrollment/admission |
| 500 Internal Server Error | Server error | Unexpected server errors |

## Example Error Responses

**Validation Error (400):**
```json
{
  "message": "Validation failed",
  "data": {
    "applicantEmail": "Invalid email format",
    "applicantPhone": "Phone must be a valid 10-digit Indian number"
  }
}
```

**Not Found (404):**
```json
{
  "message": "Training Enrollment Not Found With ID: 999",
  "data": null
}
```

**Duplicate Enrollment (409):**
```json
{
  "message": "You are already enrolled in this training program",
  "data": null
}
```

**Unauthorized (401):**
```json
{
  "message": "Unauthorized - Invalid or expired token",
  "data": null
}
```

**Forbidden (403):**
```json
{
  "message": "You can only cancel your own enrollments",
  "data": null
}
```

---

# Important Notes

## Authentication
- All endpoints require JWT Bearer token in Authorization header
- Token format: `Authorization: Bearer {your_jwt_token}`
- Token is obtained from login/authentication endpoint

## Idempotency
- Training enrollment requires `Idempotency-Key` header (UUID format)
- Prevents duplicate enrollments from retry requests
- Same idempotency key returns existing enrollment if already processed

## Pagination
- Page numbers are 0-indexed (first page is 0)
- Default page size is 10
- Maximum recommended page size is 100
- Sort direction: `asc` (ascending) or `desc` (descending)

## Optimistic Locking
- Training enrollment uses optimistic locking to handle concurrent enrollments
- Prevents capacity overbooking when multiple users enroll simultaneously
- Automatic retry mechanism (up to 3 attempts)

## Scheduled Jobs
- Stale PENDING enrollments are automatically cancelled after configured timeout
- Enrollment status and remarks are updated automatically

## Database Constraints
- Unique constraint on (user_id, college_id, course_id) for admissions
- Unique constraint on (user_id, training_id, enrollment_status) for enrollments
- Indexes on user_id, training_id, course_id, college_id, status for performance

---

**Document Version:** 1.0  
**Last Updated:** January 15, 2026  
**API Version:** v1

