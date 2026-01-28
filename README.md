# Invoice & Inventory Management Application

A modern, full-stack invoice management system built with Next.js 16, React 19, and TypeScript. This application provides a complete solution for managing invoices, and monitoring business statistics through an intuitive dashboard interface.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication with automatic token refresh
- **Dashboard Analytics** - Real-time statistics showing total invoices, amounts, and status breakdowns
- **Invoice Management** - Create and view invoices with multiple line items
- **Dynamic Forms** - Add/remove invoice items with automatic total calculation
- **Status Tracking** - Monitor invoice status (Paid, Unpaid, Overdue) with color-coded badges
- **Sortable Tables** - Interactive data tables with sorting and pagination
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Toast Notifications** - Real-time feedback for all user actions

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16.1.5** - React framework with App Router and Server Components
- **React 19.2.3** - Latest React with automatic batching
- **TypeScript 5** - Strict type safety throughout the application

### State Management & Data Fetching
- **TanStack React Query v5** - Powerful server state management
- **Axios 1.13.3** - HTTP client with interceptors for token management

### Form Management & Validation
- **React Hook Form 7.71.1** - Performant form state management
- **Zod 4.3.6** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible headless UI primitives
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **class-variance-authority** - Component variant management

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- Backend API server running (default: `http://localhost:4000`)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with custom my-app-primary color
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to sign-in)
│   ├── (auth)/                  # Authentication route group
│   │   ├── sign-in/
│   │   │   └── page.tsx        # Login page
│   │   └── sign-up/
│   │       └── page.tsx        # Registration page
│   └── dashboard/
│       └── page.tsx            # Protected dashboard page
│
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx      # Login form with validation
│   │   └── sign-up-form.tsx    # Registration form with validation
│   ├── common/                  # Common reusable components
│   │   ├── data-table.tsx      # Sortable table with internal sorting
│   │   ├── pagination.tsx      # Table pagination component
│   │   └── protected-route.tsx # Route protection wrapper
│   ├── dashboard/               # Dashboard components
│   │   ├── dashboard.tsx       # Main dashboard container
│   │   └── header.tsx          # App header with user info
│   ├── invoice/                 # Invoice management components
│   │   ├── invoice-details-dialog.tsx  # Invoice details modal
│   │   ├── invoice-form.tsx    # Create invoice form with validation
│   │   ├── invoice-list.tsx    # Invoice table with actions
│   │   ├── stat-card.tsx       # Individual statistic card
│   │   └── stats-cards.tsx     # Dashboard statistics grid
│   ├── providers/               # Context providers
│   │   └── react-query-provider.tsx  # React Query setup
│   └── ui/                      # Reusable UI components (shadcn-style)
│       ├── alert.tsx
│       ├── button.tsx          # Enhanced with primary color styles
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx           # Enhanced with primary color focus states
│       ├── label.tsx
│       └── table.tsx
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts              # Authentication logic
│   └── use-invoices.ts          # Invoice CRUD operations
│
├── lib/                          # Utility libraries
│   ├── api.ts                   # Axios configuration & API endpoints
│   ├── react-query.ts           # React Query client setup
│   └── utils.ts                 # Helper functions (cn, etc.)
│
├── public/                       # Static assets
│
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔐 Authentication Flow

### JWT Token Management

The application uses a sophisticated JWT authentication system:

1. **User Registration** (`POST /register`)
   - Username (min 3 characters)
   - Password (min 6 characters)
   - Confirmation password validation

2. **User Login** (`POST /login`)
   - Returns access token and refresh token
   - Tokens stored in localStorage
   - Automatic redirect to dashboard

3. **Automatic Token Refresh**
   - Axios response interceptor detects 401 errors
   - Automatically refreshes access token using refresh token
   - Queues failed requests and retries after refresh
   - Prevents multiple simultaneous refresh attempts

4. **Protected Routes**
   - Dashboard requires valid authentication
   - Automatic redirect to sign-in if unauthenticated
   - User profile decoded from JWT payload

5. **Logout**
   - Clears tokens from localStorage
   - Redirects to sign-in page

### API Request Flow

```
User Action → API Call → Axios Interceptor (add Bearer token)
    ↓
API Response
    ↓
401 Error? → Refresh Token → Retry Original Request
    ↓
Success → Update React Query Cache → UI Update
```

## 📊 Dashboard Features

### Statistics Cards

Displays real-time analytics:
- **Total Invoices** - Total count of all invoices
- **Total Amount** - Sum of all invoice amounts
- **Paid** - Count of paid invoices (green badge)
- **Unpaid** - Count of unpaid invoices (yellow badge)
- **Overdue** - Count of overdue invoices (red badge)

### Invoice Management

#### Create Invoice
- **Customer Information** - Customer name (required)
- **Date Management** - Invoice date and due date with validation
- **Description** - Optional invoice description
- **Line Items** - Dynamic item rows with:
  - Item name (required)
  - Quantity (min: 1, with validation messages)
  - Price per unit (min: 0.01, prevents negative values with validation messages)
  - Automatic total calculation
  - Add/remove items (minimum 1 item)
- **Real-time Total** - Displays calculated total amount

#### Invoice List
- **Auto-Sorting** - Click headers to sort data (DataTable handles sorting internally)
- **Three-way sorting** - Ascending → Descending → No sort
- **Status Badges** - Color-coded status indicators
- **Action Buttons** - View invoice details
- **Pagination** - Navigate through multiple pages with my-app-primary styling
- **Empty State** - Helpful message when no invoices exist

## 🔄 API Integration

### Base Configuration

```typescript
Base URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
Timeout: 10 seconds
Content-Type: application/json
```

### Available Endpoints

| Method | Endpoint     | Description              | Auth Required |
|--------|-------------|--------------------------|---------------|
| POST   | /register   | Create new user account  | No            |
| POST   | /login      | Authenticate user        | No            |
| POST   | /refresh    | Refresh access token     | Yes (refresh) |
| GET    | /invoices   | Fetch all user invoices  | Yes           |
| POST   | /invoices   | Create new invoice       | Yes           |

### React Query Configuration

- **Stale Time**: 5 minutes (default), 30 seconds (invoices)
- **Cache Time**: 10 minutes
- **Retry Strategy**: Max 3 retries, skip 4xx errors
- **Automatic Refetch**: On window focus and reconnect

### Query Keys

```typescript
authKeys: ['auth', 'profile']
invoiceKeys: ['invoices', 'list']
```

## 🎨 UI Components

### Custom Color Theme

The application uses a custom primary color `rgb(139, 61, 255)`:
- Defined as `--my-app-primary` in `globals.css`
- Used via Tailwind classes: `bg-my-app-primary`, `text-my-app-primary`, `border-my-app-primary`
- Replaces all gradient colors for consistency
- Automatically applied to focus states in inputs and form fields

### Design System

Built with **shadcn/ui** patterns:
- Radix UI primitives for accessibility
- Tailwind CSS v4 for styling
- Consistent purple theme (rgb(139, 61, 255))
- Status-based colors (green/yellow/red)
- Geist Sans & Geist Mono fonts

### Enhanced Components

- **Button** - Multiple variants with shadow, transform, and hover effects built-in
- **Input** - Automatic my-app-primary color on focus with slate-200 border
- **Form** - React Hook Form integration with field-level errors
- **DataTable** - Sortable table with internal sorting logic (no external state needed)
- **Pagination** - Integrated pagination with my-app-primary styling
- **Alert** - Notification component for displaying messages
- **Label** - Form labels with accessibility support

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔍 Key Features & Patterns

### Custom Theme System
- **CSS Variables** - `--my-app-primary: rgb(139, 61, 255)` defined in globals.css
- **Tailwind Integration** - `--color-my-app-primary: 139 61 255` for utility classes
- **Consistent Styling** - All gradients replaced with single primary color
- **Focus States** - Automatic primary color on input focus

### DataTable Component
- **Internal Sorting** - No need to manage sort state in parent components
- **Type-safe** - Generic TypeScript support for any data type
- **Auto-pagination** - Built-in pagination logic
- **Flexible** - Supports both controlled and uncontrolled modes
- **Sortable Columns** - Just mark columns with `sortable: true`

### Type Safety
- Full TypeScript coverage
- Shared types between API and components
- Zod schemas for runtime validation

### State Management
- React Query for server state
- No Redux or Zustand needed
- Optimistic UI updates
- Automatic cache invalidation

### Form Handling
- React Hook Form for performance
- Zod schema validation
- Field-level error display
- useFieldArray for dynamic items

### Error Handling
- Custom ApiError type
- Toast notifications for feedback
- Axios interceptors for global error handling
- React Query retry logic

### Code Organization
- Custom hooks for business logic
- Repository pattern in API layer
- Component composition by feature (auth/, invoice/, dashboard/)
- Route groups for layout sharing

## 🚧 Development Guidelines

### Adding New Features

1. **API Endpoints** - Add to `lib/api.ts`
2. **Custom Hooks** - Create in `hooks/` directory
3. **Components** - Add to appropriate subdirectory
4. **Types** - Define interfaces in component files or shared types
5. **Validation** - Use Zod schemas for all forms

### Component Creation

Follow shadcn/ui patterns:
```typescript
"use client"  // For interactive components

import { cn } from "@/lib/utils"

export function Component() {
  return <div className={cn("base-classes", conditionalClasses)} />
}
```

### Best Practices

- Use TypeScript for all files
- Keep components small and focused
- Extract business logic to custom hooks
- Use React Query for all API calls
- Validate forms with Zod schemas
- Handle loading and error states
- Provide toast feedback for user actions

## 🐛 Troubleshooting


**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Environment Variables Not Loading**
- Ensure `.env.local` exists
- Restart development server after changes
- Variables must start with `NEXT_PUBLIC_` for client access

**API Connection Failed**
- Verify backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure correct port (default: 4000)

**Authentication Issues**
- Clear localStorage and cookies
- Check token expiration times
- Verify refresh token endpoint is working



**Built with ❤️ using Next.js 16 and React 19**
