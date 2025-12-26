# Helpdesk Management System - Client Application

A modern, full-stack helpdesk management system built with **React**, **TypeScript**, **Vite**, and **Material-UI**. This is the frontend client that connects to the Node.js backend API for ticket and user management.

---

## 📋 Project Overview

### What This System Does

The Helpdesk Management System is a complete support ticketing platform that enables organizations to manage customer support requests efficiently. The system allows:

- **Ticket Management**: Create, track, update, and resolve support tickets with status and priority tracking
- **User Management**: Manage customers, support agents, and administrators with role-based access
- **Comments & Communication**: Add detailed comments to tickets for internal notes and customer communication
- **Real-time Dashboard**: View ticket status, priority distribution, and system statistics
- **Role-Based Access**: Secure access control based on user roles (customer, agent, admin)
- **Authentication**: Secure login and registration with JWT token-based authentication

---

## 👥 User Roles & Permissions

### 1. **Customer** 👤
Customers can:
- Register and login to the system
- Create new support tickets with subject and description
- View their own tickets and ticket details
- Add comments to their tickets
- Track ticket status and priority
- View ticket history

### 2. **Agent** 🛠️
Support agents can:
- View all tickets in the system
- Update ticket status and priority
- Assign tickets to themselves or other agents
- Add internal comments and notes to tickets
- View all customer information
- Track ticket assignments and workload
- Manage comments on all tickets

### 3. **Admin** 👨‍💼
Administrators have full system control:
- All agent permissions plus:
- Create, edit, and delete user accounts
- Manage system statuses and priorities
- View and export all user and ticket data
- Reset database and manage system configuration
- Access admin dashboard with system statistics

---

## 🚀 Running Instructions

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **Backend API** running on http://localhost:4000

### Installation & Setup

#### 1. Clone or Navigate to Project
```bash
cd helpdesk-client
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Backend URL (if needed)
Create or edit `.env` file in the root directory:
```
VITE_API_URL=http://localhost:4000
```

#### 4. Backend Setup (Separate Terminal)
Navigate to the backend folder and start the API server:
```bash
cd helpdesk-api-main
npm install
npm run dev
# API runs on http://localhost:4000
```

### Running the Application

#### Development Mode
```bash
npm run dev
```
- Client runs on **http://localhost:5173**
- Automatically reloads on code changes
- Includes hot module replacement (HMR)

#### Production Build
```bash
npm run build
npm run preview
```
- Builds optimized production bundle to `dist/` folder
- Preview builds locally before deployment

#### Linting (Optional)
```bash
npm lint
```
- Checks code for style and quality issues

---

## 🏗️ Project Structure

```
src/
├── Components/           # Reusable React components
│   ├── AddComment.tsx           # Add comment to ticket
│   ├── CreateTicket.tsx         # Create new ticket form
│   ├── UpdateTicket.tsx         # Edit ticket details
│   ├── DeleteTicket.tsx         # Delete ticket
│   ├── ShowTickets.tsx          # Display all tickets
│   ├── ShowComments.tsx         # Display ticket comments
│   ├── ShowUsers.tsx            # Display users
│   ├── ShowStatusPriority.tsx   # Display statuses/priorities
│   └── layout/                  # Layout components
│       └── AppShell.tsx         # Main app shell
├── Pages/                # Page components (screens)
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   ├── AdminDashboard.tsx       # Admin dashboard
│   ├── AgentDashboard.tsx       # Agent dashboard
│   ├── CustomerDashboard.tsx    # Customer dashboard
│   ├── TicketDetails.tsx        # Ticket detail page
│   ├── Status.tsx               # Status management
│   ├── Priority.tsx             # Priority management
│   └── Page404.tsx              # 404 page
├── Service/             # API service calls
│   ├── Login/                   # Authentication services
│   ├── Ticket/                  # Ticket API calls
│   ├── Comment/                 # Comment API calls
│   ├── User/                    # User API calls
│   └── Status-Priority/         # Status/priority API calls
├── Query/               # React Query configurations
├── Route/               # Routing components
│   ├── ProtectedRoute.tsx       # Protected route wrapper
│   ├── RootRedirect.tsx         # Root redirect logic
│   └── Route.tsx                # Route configuration
├── Context/             # React Context
│   └── UserContext.tsx          # User context provider
├── Types/               # TypeScript type definitions
├── theme/               # Material-UI theme configuration
├── styles/              # Global CSS styles
├── App.tsx              # Main App component
└── main.tsx             # React entry point
```

---

## 🔑 Key Features

### Authentication
- **Secure Login**: JWT-based authentication with token storage
- **User Registration**: Customers can self-register
- **Session Management**: Automatic token management and logout

### Dashboard Views
- **Admin Dashboard**: System overview, user management, statistics
- **Agent Dashboard**: Assigned tickets, workload view, ticket management
- **Customer Dashboard**: Personal tickets, ticket history, support view

### Ticket System
- **Create Tickets**: Customers can submit support requests
- **Status Tracking**: Real-time status updates (Open, In Progress, Closed, etc.)
- **Priority Levels**: Urgent, High, Medium, Low prioritization
- **Assignment**: Agents can be assigned to specific tickets
- **Comments**: Add internal notes and customer communication

### User Management (Admin Only)
- Create and manage user accounts
- Assign user roles (customer, agent, admin)
- Manage user status (active/inactive)

### Status & Priority Management (Admin Only)
- Customize ticket statuses
- Customize priority levels
- System-wide configuration

---

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Material-UI (MUI)**: UI component library
- **React Router v7**: Client-side routing
- **React Query**: Server state management
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form state management
- **Styled Components**: CSS-in-JS styling
- **Recharts**: Data visualization charts
- **SweetAlert2**: Beautiful alert dialogs
- **Lucide React**: Icon library


## 🚀 Default Test Users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | Admin |
| agent@example.com | password | Agent |
| customer@example.com | password | Customer |

---

## 📚 API Documentation

The backend API includes comprehensive Swagger documentation:
- **Swagger UI**: http://localhost:4000/docs
- **OpenAPI Spec**: http://localhost:4000/docs/swagger.json
- **Postman Collection**: Available in `helpdesk-api-main/helpdesk.postman_collection.json`

---

## 🔄 Application Workflow

1. **User Visits Application**
   - Redirected to login page if not authenticated
   - Can register as customer or login with existing account

2. **After Login**
   - Redirected to role-specific dashboard
   - Customer Dashboard: View and create tickets
   - Agent Dashboard: Manage assigned tickets
   - Admin Dashboard: Full system control

3. **Creating a Ticket**
   - Customer fills ticket form with subject and description
   - System auto-assigns ticket to customer
   - Ticket appears in customer's ticket list

4. **Managing Tickets**
   - Agent: Can assign to self, change status/priority, add comments
   - Admin: Can manage any ticket, create status/priority types
   - Customer: Can view own tickets and add comments

5. **Communication**
   - Users add comments to tickets for communication
   - Comments show author information and timestamps
   - All ticket history is tracked

---

## 📦 Development Commands

```bash
npm run dev       # Start development server (hot reload)
npm run build     # Build production bundle
npm run preview   # Preview production build locally
npm lint          # Run ESLint
```

---

## 🔒 Security

- JWT-based authentication for API calls
- Role-based access control (RBAC)
- Protected routes for authenticated users only
- Secure token storage in browser
- Automatic logout on session expiration

---

## 📝 Notes

- The application requires the backend API to be running
- Database is automatically initialized on first API startup
- Ensure both frontend and backend are running on the configured URLs
- For production deployment, update API URL in environment variables

---

## 🤝 Support

For issues or questions:
1. Check the backend API documentation at http://localhost:4000/docs
2. Review the Postman collection for API usage examples
3. Check console logs in browser developer tools for debugging

