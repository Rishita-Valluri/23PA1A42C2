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



# Stage 3

## 1. Query Evaluation

The given query is used to fetch all unread notifications for a specific student:

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at ASC;
```

### Functional Check

The query is correct in terms of output. It successfully returns all unread notifications for the given student and sorts them by creation time.

However, when the dataset grows large, this query will not scale efficiently.

---

## 2. Performance Issues

### 2.1 Selecting All Columns

Using `SELECT *` retrieves unnecessary fields from the table.

In a real notification system, the UI only needs limited fields like title, message, and timestamp. Fetching extra data increases memory usage and network overhead.

---

### 2.2 Missing Effective Indexing

If proper indexes are not defined, the database performs a full table scan to filter records.

With millions of notifications, this becomes very slow.

---

### 2.3 Sorting Cost

The query sorts results using `created_at`.

If this column is not part of an index, the database performs an additional sorting step after filtering, which increases execution time.

---

## 3. Improved Query

A better approach is to fetch only required fields:

```sql
SELECT
    id,
    title,
    message,
    type,
    created_at
FROM notifications
WHERE student_id = 1042
AND is_read = FALSE
ORDER BY created_at ASC;
```

This reduces data transfer and improves response time.

---

## 4. Recommended Index

To optimize performance, a composite index should be used:

```sql
CREATE INDEX idx_notifications_user_read_time
ON notifications(student_id, is_read, created_at);
```

### Benefit

* Quickly filters notifications for a specific user
* Efficiently finds unread records
* Maintains sorted order using index itself

---

## 5. Time Complexity

### Without Index

* Full table scan: **O(n)**
* Sorting: **O(n log n)**

This becomes slow as the number of notifications increases.

---

### With Index

* Lookup: **O(log n)**
* Retrieval: proportional to result size
* Sorting is mostly avoided due to indexed order

---

## 6. On Indexing Every Column

Adding indexes on every column is not a good idea.

### Problems:

* Increases storage usage
* Slows down INSERT/UPDATE/DELETE operations
* Database optimizer ignores unnecessary indexes
* Maintenance becomes expensive

### Better Approach:

Create indexes only on columns used frequently in:

* filtering
* sorting
* joining

---

## 7. Query for Placement Notifications (Last 7 Days)

To fetch students who received placement notifications recently:

```sql
SELECT DISTINCT student_id
FROM notifications
WHERE notification_type = 'Placement'
AND created_at >= NOW() - INTERVAL 7 DAY;
```

---

## 8. Suggested Index for This Query

```sql
CREATE INDEX idx_notifications_type_time
ON notifications(notification_type, created_at);
```

This helps in:

* Filtering placement notifications efficiently
* Restricting results to recent records
* Reducing scan time significantly

---

## 9. Summary

The original query is functionally correct but not optimized for large-scale data. Proper indexing, selective column retrieval, and avoiding full table scans are essential for maintaining performance in a growing notification system.




# Stage 4

## 1. Problem Statement

In the current system, notifications are being fetched from the database on every page load for each student. As the number of users and notifications increases, this leads to:

* High database load
* Increased response time
* Poor user experience during peak traffic

To solve this, a performance optimization strategy is required.

---

## 2. Proposed Solution Overview

To improve system performance, I would introduce:

* **Redis (Caching Layer)** for reducing repeated database reads
* **Socket.IO (Real-Time Communication)** for instant notification delivery

This combination reduces database dependency and improves responsiveness.

---

## 3. Caching Strategy (Redis)

### Why Caching is Needed

Repeated fetching of the same notifications from the database is inefficient. Redis stores frequently accessed data in memory, which significantly reduces latency.

---

### Cache Flow

1. User requests notifications
2. System checks Redis cache first
3. If data exists (**cache hit**) → return immediately
4. If data does not exist (**cache miss**) → fetch from database
5. Store result in Redis for future requests

---

### Cache Invalidation Strategy

To ensure data consistency:

1. Update database first
2. Remove or update Redis cache for that user
3. Next request repopulates cache with fresh data

This ensures users always see updated notifications.

---

### Tradeoffs of Caching

**Advantages:**

* Faster response time
* Reduced database load
* Better scalability

**Disadvantages:**

* Risk of stale data if cache is not updated properly
* Additional system complexity
* Memory overhead for Redis storage

---

## 4. Real-Time Delivery (Socket.IO)

### Purpose

Instead of waiting for page refresh, notifications should be pushed instantly to users.

---

### Flow

1. User logs into the system
2. Socket connection is established
3. Server stores new notification in database
4. Cache is invalidated for that user
5. Server emits `new-notification` event
6. Client receives and updates UI instantly

---

### Tradeoffs of Real-Time System

**Advantages:**

* Instant updates
* Better user experience
* No need for manual refresh

**Disadvantages:**

* Requires persistent connections
* Slight increase in server resource usage
* More complex infrastructure setup

---

## 5. Combined System Benefits

Using Redis + Socket.IO together provides a balanced architecture:

* Redis handles **fast data retrieval**
* Socket.IO handles **instant delivery**
* Database remains source of truth

---

## 6. Final Architecture Impact

This approach improves system performance in the following ways:

* Reduces repeated database queries
* Handles high concurrent users efficiently
* Ensures real-time notification delivery
* Maintains data consistency with cache invalidation
* Improves scalability for future growth

---

## 7. Conclusion

By introducing caching and real-time communication, the notification system becomes more scalable, responsive, and user-friendly. The tradeoff is increased system complexity, but the performance benefits outweigh the additional overhead in large-scale usage scenarios.



# Stage 5

## 1. Problem in Current Design

The given implementation processes notifications in a **synchronous loop**:

```pseudo
for student_id in student_ids:
    send_email(student_id, message)
    save_to_db(student_id, message)
    push_to_app(student_id, message)
```

### Key Issues

* **Blocking execution:** Each student is processed one by one, making the system slow.
* **No scalability:** 50,000 users will cause major delay and timeout risk.
* **Partial failure risk:** If email fails midway (e.g., 200 users), system continues without proper recovery handling.
* **No retry mechanism:** Failed email deliveries are not retried.
* **Tight coupling:** Email, DB, and push notification are all tightly connected in one flow.
* **Uneven performance:** Email API latency affects entire system performance.

---

## 2. What Happens When Email Fails Midway?

If `send_email()` fails for some users:

* Those users will not receive notifications.
* DB inserts and push notifications may still proceed inconsistently.
* System has **no tracking of failure state**.
* No automatic retry or recovery mechanism exists.

This leads to **data inconsistency and unreliable delivery**.

---

## 3. Should DB Save and Email Sending Happen Together?

No, they should NOT be tightly coupled.

### Reason:

* Database persistence is **source of truth**
* Email delivery is a **best-effort external operation**
* Combining both makes the system slow and unreliable

Instead:

* Save data first
* Process delivery asynchronously

---

## 4. Proposed Solution (Redesigned System)

To improve reliability and performance, the system should use:

* **Message Queue (RabbitMQ)**
* **Background Workers**
* **Retry + Dead Letter Queue (DLQ)**

---

## 5. Improved Design Approach

### Flow

1. API receives request for bulk notification
2. Notifications are saved in database
3. Each notification event is published to RabbitMQ
4. Worker services consume messages asynchronously
5. Workers handle:

   * Email sending
   * In-app push notification
6. Failures are retried automatically
7. Persistent failures go to DLQ

---

## 6. Revised Pseudocode

```pseudo id="st5_code"
function notify_all(student_ids, message):

    for student_id in student_ids:

        notification = {
            student_id: student_id,
            message: message,
            status: "PENDING"
        }

        save_to_db(notification)

        publish_to_queue("notification_queue", notification)
```

---

### Worker Service

```pseudo id="st5_worker"
function process_queue_message(notification):

    try:
        send_email(notification.student_id, notification.message)
        push_to_app(notification.student_id, notification.message)

        update_db_status(notification.id, "SENT")

    catch error:
        retry_count = get_retry_count(notification.id)

        if retry_count < MAX_RETRIES:
            requeue(notification)
        else:
            send_to_dead_letter_queue(notification)
            update_db_status(notification.id, "FAILED")
```

---

## 7. Why This Design is Better

* Non-blocking API requests
* High scalability for 50,000+ users
* Independent worker scaling
* Reliable retry mechanism
* Fault isolation using DLQ
* Faster user response time

---

## 8. Tradeoffs

### Advantages

* High performance under load
* Better reliability
* Failure isolation
* Easier horizontal scaling

### Disadvantages

* Increased system complexity
* Requires queue infrastructure (RabbitMQ)
* Debugging becomes slightly harder
* Eventual consistency instead of immediate consistency

---

## 9. Final Conclusion

The synchronous approach is not suitable for large-scale notification delivery. By introducing asynchronous processing using a message queue and worker system, the platform becomes scalable, fault-tolerant, and production-ready.




