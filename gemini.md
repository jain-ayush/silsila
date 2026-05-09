# Silver Jewellery E-Commerce Platform — Production Grade Master Prompt (FINAL)

## Project Overview

Create a production-grade full-stack e-commerce web application for selling silver jewellery online.

The application must be built using a modern scalable architecture using a single Next.js codebase for both frontend and backend.

The website should support:
- Public storefront browsing (no login required)
- Customer authentication only when needed (checkout / orders / wishlist save)
- Admin dashboard
- Product management
- Inventory management
- Payments
- Orders
- Coupons
- Wishlist
- Reviews
- SEO optimization
- Security hardening
- Image optimization
- Shipping integrations
- Instagram & Meta commerce integration

The generated code should follow:
- Clean architecture
- Modular design
- Production-grade standards
- Type safety
- Security best practices
- Responsive UI
- Reusable components
- Scalable folder structure

---

# Tech Stack

## Core Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Database: MySQL
- ORM: TypeORM
- Authentication: Auth.js (NextAuth) + OTP system
- Validation: Zod
- State Management: Zustand
- Forms: React Hook Form
- Image Hosting: Cloudinary
- Payments: Razorpay
- Email Service: Resend
- OTP Service: Firebase Auth OR MSG91 OR Twilio
- File Uploads: Cloudinary / UploadThing
- Deployment: Vercel
- CDN/Security: Cloudflare

---

# Project Goals

Generate a complete production-ready MVP including:
- Frontend (public storefront)
- Backend APIs
- Database schema (TypeORM)
- Admin dashboard
- Authentication system (OTP + Google login)
- Payment integration
- Security protections
- SEO setup
- Instagram compatibility
- Meta commerce integration
- Deployment configuration

---

# 1. Public Storefront (NO LOGIN REQUIRED)

## Critical Requirement

The entire storefront must be accessible without authentication.

Users must be able to:
- Browse homepage
- View products
- Search products
- Filter products
- View product details
- View reviews
- View Instagram feed
- Add to cart (guest cart allowed)
- Browse categories

❌ DO NOT force login on landing page  
❌ DO NOT block product browsing behind authentication  

---

## UX Requirement

The experience must feel like:
- Instagram-first ecommerce
- Fast D2C shopping brands
- Mobile-first shopping experience

---

# 2. Authentication Flow (ONLY WHEN REQUIRED)

Authentication is triggered only during:

- Checkout
- Order placement
- Wishlist save (optional)
- Account access
- Admin panel access

---

## Authentication Methods

### 1. Phone OTP Login (PRIMARY)

Implement passwordless login using phone number OTP.

Features:
- Phone number login
- OTP verification
- OTP expiration
- Resend OTP
- Rate limiting
- Secure session creation
- Auto login after OTP verification

Providers:
- Firebase Auth (preferred)
- MSG91
- Twilio

---

### 2. Google Login

Implement Google OAuth via Auth.js.

Features:
- One-click login
- Secure token handling
- Persistent session

---

## REMOVE PASSWORD SYSTEM

Do NOT implement:
- Password login
- Password signup
- Forgot password
- Reset password

Only OTP + OAuth.

---

# 3. Guest Cart System

Users can:
- Add items to cart without login
- Maintain cart in local storage / cookies
- Continue shopping freely

On login:
- Merge guest cart with user cart

---

# 4. Checkout Flow

```txt
Browse → Add to Cart → Checkout → Login (OTP / Google) → Payment → Order
```

Login happens ONLY at checkout stage.

---

# 5. Admin Dashboard

Create a fully functional admin panel.

## Features:
- Revenue dashboard
- Product management
- Inventory management
- Order management
- User management
- Coupon system
- Review moderation
- Instagram content management

---

# 6. Database Schema (TypeORM + MySQL)

## Design Requirements

- Fully relational schema
- Indexed foreign keys
- Transaction-safe design
- Decimal support for price
- UUID primary keys recommended

---

## Core Entities

### User
- id
- name
- email (nullable)
- phoneNumber (nullable)
- phoneVerified
- googleId
- role
- avatar
- createdAt
- updatedAt

---

### Address
- id
- userId
- fullName
- phone
- addressLine1
- addressLine2
- city
- state
- postalCode
- country

---

### Product
- id
- title
- slug
- description
- price
- comparePrice
- stock
- sku
- purity
- weight
- categoryId
- featured
- brand
- currency
- availability
- metaTitle
- metaDescription
- ogImage

---

### ProductImage
- id
- productId
- url

---

### Order
- id
- userId
- totalAmount
- paymentStatus
- orderStatus
- shippingAddressId
- createdAt

---

### OrderItem
- id
- orderId
- productId
- quantity
- price

---

### Cart
- id
- userId (nullable for guest handling)

---

### CartItem
- id
- cartId
- productId
- quantity

---

### Payment
- id
- orderId
- razorpayPaymentId
- amount
- status

---

### Coupon
- id
- code
- discountType
- discountValue
- expiryDate

---

### Review
- id
- userId
- productId
- rating
- comment

---

# 7. TypeORM Requirements

## Architecture

Use:
- Entities
- Repositories
- Services layer
- Controllers (API routes)
- Migrations
- DataSource config

---

## Best Practices

- Use QueryBuilder for complex queries
- Use transactions for:
  - Order creation
  - Payment confirmation
  - Inventory updates
- Proper indexing on:
  - slug
  - email
  - phone
  - sku
- Prevent N+1 queries
- Use lazy/eager loading correctly

---

# 8. Instagram & Meta Commerce Integration

## Required Features

### Meta Pixel
Track:
- Page views
- Product views
- Add to cart
- Checkout
- Purchase

---

### Meta Conversions API
Server-side tracking for:
- Orders
- Purchases
- Checkout events

---

### Instagram Shopping Compatibility

Generate product feed for:
- Instagram Shop
- Facebook Shop
- Meta Commerce Manager

Fields:
- title
- price
- description
- image
- availability
- product URL
- brand
- SKU

---

### Product Feed API

Endpoint:
```txt
/api/meta/catalog-feed
```

Formats:
- JSON
- XML

---

### OpenGraph & SEO Tags

Implement:
- OG tags
- Twitter cards
- Product schema
- Dynamic preview images

---

### Instagram Feed Section

Homepage section:
- “Shop Our Instagram”

Supports:
- Embedded posts
- Reels display
- Product tagging

---

# 9. Payment Integration (Razorpay)

Support:
- UPI
- Cards
- Netbanking
- Wallets

Features:
- Payment verification
- Webhook validation
- Secure order confirmation

---

# 10. Security Requirements

- CSRF protection
- XSS protection
- Input sanitization
- Rate limiting
- Secure cookies
- JWT/session security
- Admin route protection
- Razorpay webhook verification

---

# 11. SEO Requirements

- Dynamic metadata
- Sitemap
- Robots.txt
- Canonical URLs
- OpenGraph optimization
- Instagram sharing support

---

# 12. Performance Requirements

- Lazy loading
- Image optimization (Cloudinary)
- Code splitting
- Edge caching
- Mobile-first optimization
- Lighthouse score > 90

---

# 13. UI/UX Requirements

- Luxury jewellery design
- Minimal aesthetic
- Mobile-first UI
- Smooth animations
- Skeleton loaders
- Fast checkout UX
- Instagram-like browsing experience

---

# 14. Folder Structure

```txt
src/
├── app/
│   ├── (store)/
│   ├── admin/
│   ├── api/
│   ├── auth/
│   └── checkout/
│
├── components/
├── database/
│   ├── entities/
│   ├── migrations/
│   ├── repositories/
│   ├── services/
│   └── datasource/
│
├── lib/
├── hooks/
├── utils/
├── validations/
└── config/
```

---

# 15. Environment Variables

```env
DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_CATALOG_ID=

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=

MSG91_AUTH_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

---

# 16. Development Phases

## Phase 1
- Setup Next.js + MySQL + TypeORM

## Phase 2
- Public storefront (no login)

## Phase 3
- Product system

## Phase 4
- Guest cart system

## Phase 5
- Checkout + OTP login

## Phase 6
- Razorpay integration

## Phase 7
- Admin panel

## Phase 8
- Instagram + Meta integration

## Phase 9
- SEO + performance optimization

---

# 17. Final Deliverables

Generate:
- Full Next.js project
- TypeORM schema
- API routes
- Admin dashboard
- Authentication system (OTP + Google)
- Guest cart system
- Razorpay integration
- Instagram shopping integration
- Meta pixel + conversions API
- Product feed API
- SEO setup
- Deployment config
- Documentation

---

# 18. Critical Instruction

The system MUST:

- Allow full browsing without login
- Only request login at checkout
- Support OTP login (no password system)
- Support Google login
- Support guest cart
- Be optimized for Instagram traffic
- Be production-ready and scalable