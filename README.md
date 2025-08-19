# Content Management System

A full-stack web application for content submission and approval workflow.

## Overview

This application allows users to submit content for review and provides administrators with tools to approve or reject submissions. It features user authentication, role-based access control, and an admin dashboard for content management.

## Features

### User Features

- User registration and authentication
- Content submission with title and description
- View submission status (pending, approved, rejected)
- Personal dashboard to track submissions

### Admin Features

- Admin dashboard with analytics
- Content approval/rejection workflow
- Search and filter content by status
- View submission statistics
- Recent activity monitoring

## Technology Stack

### Frontend

- React 19 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Shadcn/ui
- Axios for API communication
- Vite as build tool

### Backend (Separate Repository)

https://github.com/eulerbutcooler/asngmnt-bcknd

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Role-based authorization middleware

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/eulerbutcooler/asngmnt-frntnd.git
cd asngmnt-frntnd
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Configure environment variables

```
VITE_API_URL=http://localhost:5000/api
```

5. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── AdminDashboard.tsx
│   ├── AuthForm.tsx
│   └── Header.tsx
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── SubmitContentPage.tsx
│   └── ApprovalPage.tsx
├── hooks/              # Custom React hooks
├── api/                # API configuration
└── lib/                # Utility functions
```

## Authentication & Authorization

The application implements JWT-based authentication with role-based access control:

- **Users**: Can submit content and view their submissions
- **Admins**: Can approve/reject content and access analytics

## Deployment

The application is configured for deployment on Vercel with proper client-side routing support via `vercel.json`.
