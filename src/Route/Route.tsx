import { createBrowserRouter } from "react-router-dom";
import CustomerDashboard from "../Pages/CustomerDashboard";
import { ShowTickets } from "../Components/ShowTickets";
import { CreateTicket } from "../Components/CreateTicket";
import LoginForm from "../Pages/Login";
import RegisterForm from "../Pages/Register";
import AgentDashboard from "../Pages/AgentDashboard";
import { ShowUsers } from "../Components/ShowUsers";
import { CreateUser } from "../Components/CreateUser";
import AdminDashboard from "../Pages/AdminDashboard";
import Layout from "../Pages/Layot";
import Page404 from "../Pages/Page404";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";
import TicketDetails from "../Pages/TicketDetails";
import Priority from "../Pages/Priority";
import Status from "../Pages/Status";
import GetUserById from "../Components/GetUserById";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/customer/dashboard",
    element: (
      <ProtectedRoute allowedRole="customer">
        <Layout><CustomerDashboard /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/agent/dashboard",
    element: (
      <ProtectedRoute allowedRole="agent">
        <Layout><AgentDashboard /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRole="admin">
        <Layout><AdminDashboard /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ticket/new",
    element: (
      <ProtectedRoute allowedRole="customer">
        <Layout><CreateTicket /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets",
    element: <Layout><ShowTickets /></Layout>,
  },
  {
    path: "/tickets/:id",
    element: (
      <ProtectedRoute>
        <Layout><TicketDetails /></Layout>
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRole="admin">
        <Layout><ShowUsers /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/:id",
    element: (
      <ProtectedRoute allowedRole="admin">
        <Layout><GetUserById /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/createUser",
    element: (
      <ProtectedRoute allowedRole="admin">
        <Layout><CreateUser /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/createPriority",
    element: (
      <ProtectedRoute allowedRole="admin">
        <Layout><Priority /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/createStatus",
    element: (
      <ProtectedRoute allowedRole="admin">
        <Layout><Status /></Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: <Page404 />,
  },
]);
