# Enhanced Sweet Shop Management System - Implementation Plan

## Goal
Build a production-ready, full-stack Sweet Shop Management System with JWT authentication, role-based access control, animated UI, and admin management features.

---

## Proposed Changes

### Dependencies to Install
```bash
npm install bcryptjs jsonwebtoken zod framer-motion react-hot-toast
npm install -D @types/bcryptjs @types/jsonwebtoken
```

---

### Database Schema Updates

#### [MODIFY] [schema.prisma](file:///c:/sweetshop/prisma/schema.prisma)

Add `User` model with roles:
```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}
```

---

### Backend - Authentication

#### [NEW] `lib/auth.ts`
- JWT sign/verify functions
- Password hash/compare with bcrypt
- `verifyToken` middleware helper

#### [NEW] `app/api/auth/register/route.ts`
- Zod validation for email, password, name
- Hash password with bcrypt
- Create user in DB
- Return JWT token

#### [NEW] `app/api/auth/login/route.ts`
- Validate credentials
- Compare password hash
- Return JWT token

#### [NEW] `app/api/auth/me/route.ts`
- Protected route
- Return current user from JWT

---

### Backend - Enhanced Product APIs

#### [MODIFY] `app/api/products/route.ts`
- Add Zod validation
- Add search query params: `?search=`, `?category=`, `?minPrice=`, `?maxPrice=`

#### [NEW] `app/api/products/[id]/purchase/route.ts`
- Decrement stock by 1
- Return error if stock is 0

#### [NEW] `app/api/products/[id]/restock/route.ts`
- Admin only
- Increment stock by specified amount

#### [MODIFY] `app/api/products/[id]/route.ts`
- Add DELETE (admin only)
- Add PATCH with validation

---

### Frontend - Authentication

#### [NEW] `contexts/AuthContext.tsx`
- Store JWT in localStorage
- Provide user state globally
- Login/logout/register functions

#### [NEW] `app/login/page.tsx`
- Animated form with Framer Motion
- Email/password validation
- Loading states and error feedback
- Redirect to dashboard on success

#### [NEW] `app/register/page.tsx`
- Animated form
- Name/email/password validation
- Auto-login after registration

#### [NEW] `components/ProtectedRoute.tsx`
- Redirect to login if not authenticated
- Show loading while checking auth

---

### Frontend - Dashboard

#### [MODIFY] `app/page.tsx` (Dashboard)
- Show all sweets in animated card grid
- Search input with debounce
- Category filter dropdown
- Price range filter
- Purchase button (disabled when stock=0)
- Toast notifications for actions

#### [MODIFY] `app/layout.tsx`
- Add Toaster component
- Add AuthProvider
- Enhanced navbar with user menu

---

### Frontend - Admin Features

#### [NEW] `app/admin/page.tsx`
- Admin dashboard with management table
- Add/Edit/Delete/Restock buttons

#### [NEW] `components/modals/AddSweetModal.tsx`
#### [NEW] `components/modals/EditSweetModal.tsx`
#### [NEW] `components/modals/RestockModal.tsx`
#### [NEW] `components/modals/ConfirmDeleteModal.tsx`

---

## Verification Plan

### Automated Tests
- `npm run build` - Verify build passes
- `npm run lint` - Check for lint errors

### Manual Verification
1. Register a new user → verify redirect to dashboard
2. Login with credentials → verify JWT stored
3. Search/filter sweets → verify results update
4. Purchase a sweet → verify stock decreases, toast shows
5. Login as admin → verify admin panel accessible
6. Add/Edit/Delete sweets as admin → verify CRUD works
7. Try admin actions as normal user → verify 403 errors
