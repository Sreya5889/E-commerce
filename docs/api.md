# EduAcademy REST API Documentation (v1)

Base URL: `http://localhost:5000/api/v1`  
Health Check: `GET http://localhost:5000/health`

---

## Standard Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### List / Paginated
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "totalPages": 10
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Detailed error description",
  "errorCode": "VALIDATION_ERROR",
  "details": []
}
```

---

## 1. System Health
- **`GET /health`**  
  Returns server uptime, database connection status, and latency probe.

---

## 2. Authentication (`/api/v1/auth`)
- **`POST /api/v1/auth/register`**  
  Payload: `{ email, password, fullName, role?: 'student' | 'teacher' }`
- **`POST /api/v1/auth/login`**  
  Payload: `{ email, password }`
- **`GET /api/v1/auth/me`** (Bearer Token)  
  Returns authenticated user profile and roles.
- **`POST /api/v1/auth/logout`** (Bearer Token)
- **`POST /api/v1/auth/forgot-password`**  
  Payload: `{ email }`

---

## 3. Courses (`/api/v1/courses`)
- **`GET /api/v1/courses`**  
  Query params: `search`, `category`, `level`, `minPrice`, `maxPrice`, `isFree`, `sort`, `page`, `limit`  
  *Filtering, sorting, and pagination are executed entirely at the database level.*
- **`GET /api/v1/courses/:id`**  
  Returns course details, curriculum sections, lessons, and instructor info.  
  *Protected lesson content and video URLs are only returned for enrolled students or course owners.*
- **`POST /api/v1/courses`** (Teacher / Admin)  
  Payload: `{ title, categoryId, description, price, discountPrice, level, isFree, thumbnailUrl }`
- **`PATCH /api/v1/courses/:id`** (Teacher Owner / Admin)
- **`DELETE /api/v1/courses/:id`** (Teacher Owner / Admin)
- **`POST /api/v1/courses/:id/publish`** (Teacher Owner / Admin)
- **`POST /api/v1/courses/:id/unpublish`** (Teacher Owner / Admin)

---

## 4. Categories (`/api/v1/categories`)
- **`GET /api/v1/categories`**  
  Returns active categories with aggregated course counts.
- **`GET /api/v1/categories/:slug`**  
  Returns category details and child subcategories.

---

## 5. Instructors (`/api/v1/teachers`)
- **`GET /api/v1/teachers`**  
  Returns verified instructors with ratings, student counts, and specialties.
- **`GET /api/v1/teachers/:id`**  
  Returns instructor bio and published course portfolio.

---

## 6. Shopping Cart (`/api/v1/cart`)
*All calculations (subtotals, discounts, taxes, and grand totals) are authoritatively computed server-side.*
- **`GET /api/v1/cart`** (Bearer Token)  
  Query params: `couponCode`
- **`POST /api/v1/cart/items`** (Bearer Token)  
  Payload: `{ courseId }`
- **`DELETE /api/v1/cart/items/:courseId`** (Bearer Token)
- **`DELETE /api/v1/cart`** (Bearer Token)

---

## 7. Wishlist (`/api/v1/wishlist`)
- **`GET /api/v1/wishlist`** (Bearer Token)
- **`POST /api/v1/wishlist/:courseId`** (Bearer Token)
- **`DELETE /api/v1/wishlist/:courseId`** (Bearer Token)

---

## 8. Orders (`/api/v1/orders`)
- **`POST /api/v1/orders`** (Bearer Token)  
  Payload: `{ couponCode?: string }`  
  *Executes atomic database transaction: verifies cart items, calculates server-side totals, creates pending order with immutable price snapshots.*
- **`GET /api/v1/orders`** (Bearer Token)  
  Returns student's order history.
- **`GET /api/v1/orders/:id`** (Bearer Token)
- **`POST /api/v1/orders/:id/cancel`** (Bearer Token)

---

## 9. Payments (`/api/v1/payments`)
- **`POST /api/v1/payments/process`** (Bearer Token)  
  Payload: `{ orderId, paymentMethod, paymentDetails }`  
  *Transactional execution: updates order to completed, creates enrollments, clears cart items, creates notifications, and logs analytics.*
- **`POST /api/v1/payments/webhook`**  
  *Idempotent payment gateway listener preventing duplicate webhook execution.*

---

## 10. Enrollments & Course Progress (`/api/v1/enrollments`, `/api/v1/progress`)
- **`GET /api/v1/enrollments`** (Bearer Token)  
  Returns student's active courses and progress percentages.
- **`GET /api/v1/enrollments/check/:courseId`** (Bearer Token)
- **`POST /api/v1/enrollments/free`** (Bearer Token)  
  Payload: `{ courseId }`
- **`GET /api/v1/progress/:courseId`** (Bearer Token)  
  Returns lesson-by-lesson progress.
- **`POST /api/v1/progress/:lessonId`** (Bearer Token)  
  Payload: `{ completed: boolean, watchedSeconds: number }`  
  *Automatically recalculates course progress. When reaching 100%, marks enrollment completed and auto-generates certificate.*

---

## 11. Reviews (`/api/v1/reviews`)
- **`GET /api/v1/reviews/:courseId`**
- **`POST /api/v1/reviews/:courseId`** (Bearer Token)  
  Payload: `{ rating: 1-5, review: string }`  
  *Enforces that only verified enrolled students can post reviews.*
- **`POST /api/v1/reviews/:id/reply`** (Teacher / Admin)  
  Payload: `{ reply: string }`

---

## 12. Coupons (`/api/v1/coupons`)
- **`POST /api/v1/coupons/validate`**  
  Payload: `{ code: string, cartSubtotal: number }`  
  *Validates active status, date range, usage limits, and minimum order requirements.*
- **`GET /api/v1/coupons`** (Admin)
- **`POST /api/v1/coupons`** (Admin)
- **`DELETE /api/v1/coupons/:id`** (Admin)

---

## 13. Certificates (`/api/v1/certificates`)
- **`GET /api/v1/certificates`** (Bearer Token)  
  Returns user's earned certificates.
- **`GET /api/v1/certificates/verify/:certificateNumber`** (Public)  
  Public verification of student, course, and date of completion.

---

## 14. Admin APIs (`/api/v1/admin`)
- **`GET /api/v1/admin/stats`** (Admin)  
  Platform aggregation metrics: total revenue, monthly revenue, total students, total teachers, total courses, and pending instructor applications.
- **`GET /api/v1/admin/users`** (Admin)  
  List all platform users with roles.
- **`GET /api/v1/admin/courses`** (Admin)
- **`PATCH /api/v1/admin/courses/:id/status`** (Admin)  
  Payload: `{ status: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived' }`
- **`GET /api/v1/admin/teachers`** (Admin)
- **`PATCH /api/v1/admin/teachers/:id/verify`** (Admin)  
  Payload: `{ status: 'pending' | 'approved' | 'rejected' | 'suspended', rejectionReason?: string }`

---

## 15. Notifications & Support (`/api/v1/notifications`, `/api/v1/support`)
- **`GET /api/v1/notifications`** (Bearer Token)
- **`PATCH /api/v1/notifications/read-all`** (Bearer Token)
- **`PATCH /api/v1/notifications/:id/read`** (Bearer Token)
- **`GET /api/v1/support/faq`** (Public)
- **`POST /api/v1/support/faq`** (Admin)
- **`POST /api/v1/support/contact`** (Public)  
  Payload: `{ name, email, subject, message, phone? }`
