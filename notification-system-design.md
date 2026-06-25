# Notification System Design
# Stage 1

# Alert Management System - REST API Design

## 1. Objective

The Alert Management System is responsible for delivering important information to authenticated users. Alerts may include academic updates, assignment deadlines, fee reminders, maintenance announcements, and other system-generated messages.

The API follows REST principles and exchanges data in JSON format. Real-time alert delivery is supported through WebSocket connections so that users receive updates instantly after login.

---

# 2. Alert Data Model

Each alert is represented using the following structure:

```json
{
  "alertId": "a12345",
  "userId": "u1001",
  "category": "Academic",
  "title": "Assignment Deadline",
  "description": "Machine Learning assignment submission closes tomorrow.",
  "status": "unread",
  "priority": "high",
  "timestamp": "2026-06-25T10:00:00Z"
}
```

### Attributes

| Field       | Type     | Description              |
| ----------- | -------- | ------------------------ |
| alertId     | String   | Unique alert identifier  |
| userId      | String   | User receiving the alert |
| category    | String   | Alert classification     |
| title       | String   | Short heading            |
| description | String   | Detailed message         |
| status      | String   | unread/read              |
| priority    | String   | low/medium/high          |
| timestamp   | DateTime | Creation time            |

---

# 3. Authentication

All API requests require authentication.

### Request Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

### Response Headers

```http
Content-Type: application/json
```

---

# 4. User Operations

## 4.1 Fetch All Alerts

### Endpoint

```http
GET /api/alerts
```

### Query Parameters

| Parameter | Description           |
| --------- | --------------------- |
| page      | Page number           |
| limit     | Records per page      |
| category  | Filter by category    |
| status    | Filter by read/unread |

### Sample Request

```http
GET /api/alerts?page=1&limit=10&status=unread
```

### Response

```json
{
  "success": true,
  "totalRecords": 35,
  "page": 1,
  "alerts": [
    {
      "alertId": "a12345",
      "category": "Academic",
      "title": "Assignment Deadline",
      "description": "Machine Learning assignment submission closes tomorrow.",
      "status": "unread",
      "priority": "high",
      "timestamp": "2026-06-25T10:00:00Z"
    }
  ]
}
```

---

## 4.2 Fetch Alert Details

### Endpoint

```http
GET /api/alerts/{alertId}
```

### Example

```http
GET /api/alerts/a12345
```

### Response

```json
{
  "success": true,
  "data": {
    "alertId": "a12345",
    "category": "Academic",
    "title": "Assignment Deadline",
    "description": "Machine Learning assignment submission closes tomorrow.",
    "status": "unread",
    "priority": "high",
    "timestamp": "2026-06-25T10:00:00Z"
  }
}
```

---

## 4.3 Mark Alert as Read

### Endpoint

```http
PATCH /api/alerts/{alertId}
```

### Request Body

```json
{
  "status": "read"
}
```

### Response

```json
{
  "success": true,
  "message": "Alert status updated successfully."
}
```

---

## 4.4 Mark All Alerts as Read

### Endpoint

```http
PATCH /api/alerts/read-all
```

### Response

```json
{
  "success": true,
  "message": "All alerts have been marked as read."
}
```

---

## 4.5 Delete Alert

### Endpoint

```http
DELETE /api/alerts/{alertId}
```

### Response

```json
{
  "success": true,
  "message": "Alert removed successfully."
}
```

---

## 4.6 Retrieve Unread Alert Count

### Endpoint

```http
GET /api/alerts/unread-count
```

### Response

```json
{
  "success": true,
  "unreadCount": 7
}
```

---

# 5. Administrative Operations

Administrators can generate alerts for individual users or groups.

## Create Alert

### Endpoint

```http
POST /api/alerts
```

### Request Body

```json
{
  "userId": "u1001",
  "category": "Finance",
  "title": "Fee Payment Reminder",
  "description": "Semester fee payment deadline is approaching.",
  "priority": "medium"
}
```

### Response

```json
{
  "success": true,
  "message": "Alert created successfully.",
  "alertId": "a67890"
}
```

---

# 6. Real-Time Alert Delivery

## Technology Used

WebSocket

### Connection Endpoint

```http
/ws/alerts
```

### Working Process

1. User signs into the application.
2. Client establishes a WebSocket connection.
3. Server validates the user's authentication token.
4. The connection is mapped to the authenticated user.
5. Whenever a new alert is generated, it is stored in the database.
6. The server immediately pushes the alert to connected users.
7. Users receive the update instantly without refreshing the page.

---

## Event: alert-created

### Payload

```json
{
  "alertId": "a67890",
  "category": "Finance",
  "title": "Fee Payment Reminder",
  "description": "Semester fee payment deadline is approaching.",
  "priority": "medium",
  "timestamp": "2026-06-25T10:00:00Z"
}
```

---

## Event: alert-updated

### Payload

```json
{
  "alertId": "a67890",
  "status": "read"
}
```

---

## Event: alert-deleted

### Payload

```json
{
  "alertId": "a67890"
}
```

---

# 7. Error Handling

### Invalid Request

```json
{
  "success": false,
  "message": "Invalid request parameters."
}
```

### Resource Not Found

```json
{
  "success": false,
  "message": "Requested alert does not exist."
}
```

### Unauthorized Access

```json
{
  "success": false,
  "message": "Authentication required."
}
```

---

# 8. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Successful request    |
| 201  | Resource created      |
| 400  | Bad request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Resource not found    |
| 500  | Internal server error |

---

# 9. API Summary

| Method | Endpoint                 | Function                  |
| ------ | ------------------------ | ------------------------- |
| GET    | /api/alerts              | Retrieve all alerts       |
| GET    | /api/alerts/{alertId}    | Retrieve a specific alert |
| POST   | /api/alerts              | Create a new alert        |
| PATCH  | /api/alerts/{alertId}    | Update alert status       |
| PATCH  | /api/alerts/read-all     | Mark all alerts as read   |
| GET    | /api/alerts/unread-count | Get unread count          |
| DELETE | /api/alerts/{alertId}    | Delete alert              |

---

# Design Considerations

* Consistent RESTful endpoint naming.
* JSON-based communication.
* Secure access through bearer token authentication.
* Support for pagination and filtering.
* Real-time delivery using WebSocket technology.
* Standardized response structure across all endpoints.
* Scalable design suitable for large user bases.



# Stage 2

## 1. Database Selection

For the alert/notification system defined in Stage 1, **MongoDB** is chosen as the primary database for persistent storage.

### Reason for Selection

MongoDB is suitable for this system because:

* It stores data in flexible document format (BSON).
* Supports high-speed write operations for frequent alerts.
* Scales horizontally using sharding.
* Schema can evolve without downtime.
* Works efficiently with Node.js backend used in Stage 1 design.

---

## 2. Database Schema Design

The system uses two main collections:

---

### 2.1 Users Collection

```json id="u1"
{
  "_id": "ObjectId",
  "name": "Student Name",
  "email": "student@college.edu",
  "createdAt": "2026-06-25T10:00:00Z"
}
```

---

### 2.2 Alerts Collection

```json id="u2"
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "category": "Academic",
  "title": "Assignment Deadline",
  "message": "ML assignment submission ends tomorrow",
  "priority": "high",
  "isRead": false,
  "createdAt": "2026-06-25T10:05:00Z"
}
```

---

## 3. Data Relationship

* One user can have multiple alerts.
* Each alert belongs to exactly one user.
* Relationship is maintained using `userId`.

```
User
  │
  ├── Alert
  ├── Alert
  └── Alert
```

---

## 4. Indexing Strategy

To improve query performance in large datasets, indexes are created on frequently accessed fields:

```javascript id="u3"
db.alerts.createIndex({ userId: 1 })

db.alerts.createIndex({ userId: 1, isRead: 1 })

db.alerts.createIndex({ category: 1 })

db.alerts.createIndex({ createdAt: -1 })
```

### Purpose

* Faster retrieval of user alerts
* Efficient filtering of read/unread alerts
* Quick sorting by latest alerts

---

## 5. Scalability Challenges

As the number of alerts increases, the following issues may occur:

* Slower query response due to large datasets
* High memory usage during pagination
* Increased load on database during peak traffic
* Sorting overhead on large collections

---

## 6. Solutions for Scaling

To handle large-scale usage:

* Use **pagination (limit/skip)** to avoid loading full datasets
* Apply **proper indexing** on frequently queried fields
* Move old alerts to an **archive collection**
* Use **sharding** to distribute data across servers
* Add **Redis caching** for frequently accessed alerts
* Use read replicas for scaling read operations

---

## 7. Database Queries

---

### 7.1 Get Alerts for a User (Paginated)

```javascript id="u4"
db.alerts.find({ userId: ObjectId(userId) })
.sort({ createdAt: -1 })
.skip(0)
.limit(10)
```

---

### 7.2 Get Single Alert

```javascript id="u5"
db.alerts.findOne({
  _id: ObjectId(alertId)
})
```

---

### 7.3 Create Alert

```javascript id="u6"
db.alerts.insertOne({
  userId: ObjectId(userId),
  category: "Academic",
  title: "Assignment Deadline",
  message: "ML assignment submission ends tomorrow",
  priority: "high",
  isRead: false,
  createdAt: new Date()
})
```

---

### 7.4 Mark Alert as Read

```javascript id="u7"
db.alerts.updateOne(
  { _id: ObjectId(alertId) },
  { $set: { isRead: true } }
)
```

---

### 7.5 Mark All Alerts as Read

```javascript id="u8"
db.alerts.updateMany(
  { userId: ObjectId(userId) },
  { $set: { isRead: true } }
)
```

---

### 7.6 Delete Alert

```javascript id="u9"
db.alerts.deleteOne({
  _id: ObjectId(alertId)
})
```

---

## 8. Summary

MongoDB provides a flexible and scalable storage layer for the alert system designed in Stage 1. With proper indexing, pagination, caching, and archiving strategies, the system can handle large-scale notification traffic efficiently while maintaining fast response times.

