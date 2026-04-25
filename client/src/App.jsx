import { createBrowserRouter, Outlet } from "react-router";
import {
  AdmimProtection,
  StudentProtection,
  SupervisorProtection,
} from "./protect/Protect";

// Auth Pages
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SupervisorOnboarding from "./pages/auth/SupervisorOnboarding";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";

// Supervisor Pages
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentOverview from "./pages/student/StudentOverview";
import StudentInternships from "./pages/student/StudentInternships";
import StudentHelp from "./pages/student/StudentHelp";
import StudentProfile from "./pages/student/StudentProfile";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminInternships from "./pages/admin/AdminInternships";
import AdminFaculties from "./pages/admin/AdminFaculties";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminFacultyDetails from "./pages/admin/AdminFacultyDetails";
import CreateFaculty from "./pages/admin/faculties/CreateFaculty";
import EditFaculty from "./pages/admin/faculties/EditFaculty";
import DeleteFaculty from "./pages/admin/faculties/DeleteFaculty";
import AdminDepartmentDetails from "./pages/admin/AdminDepartmentDetails";
import EditDepartment from "./pages/admin/faculties/EditDepartment";
import DeleteDepartment from "./pages/admin/faculties/DeleteDepartment";
import CreateDepartment from "./pages/admin/faculties/CreateDepartment";
import CreateStaff from "./pages/admin/staff/CreateStaff";
import AdminStaffDetails from "./pages/admin/AdminStaffDetails";
import EditStaff from "./pages/admin/staff/EditStaff";
import DeleteStaff from "./pages/admin/staff/DeleteStaff";
import DeactivateStaff from "./pages/admin/staff/DeactivateStaff";
import ActivateStaff from "./pages/admin/staff/ActivateStaff";
import AdminStudentDetails from "./pages/admin/students/AdminStudentDetails";
import AdminStudentInternship from "./pages/admin/students/AdminStudentInternship";
import AdminStudentInternshipLogs from "./pages/admin/students/AdminStudentInternshipLogs";
import CreateInternship from "./pages/admin/internship/CreateInternship";
import EditInternship from "./pages/admin/internship/EditInternship";
import DeleteInternship from "./pages/admin/internship/DeleteInternship";
import InternshipDetails from "./pages/admin/internship/InternshipDetails";
import AdminInterns from "./pages/admin/AdminInterns";
import AdminInternDetails from "./pages/admin/interns/AdminInternDetails";
import AdminInternInternship from "./pages/admin/interns/AdminInternInternship";
import AdminInternInternshipLogs from "./pages/admin/interns/AdminInternInternshipLogs";
import AdminInternshipRequestDetails from "./pages/admin/AdminInternshipRequestDetails";
import ApproveInternshipRequest from "./pages/admin/requests/ApproveInternshipRequest";
import RejectInternshipRequest from "./pages/admin/requests/RejectInternshipRequest";
import DeleteInternshipRequest from "./pages/admin/requests/DeleteInternshipRequest";
import SupervisorOverview from "./pages/supervisor/SupervisorOverview";
import SupervisorInterns from "./pages/supervisor/SupervisorInterns";
import SupervisorInternDetails from "./pages/supervisor/interns/SupervisorInternDetails";
import SupervisorInternInternship from "./pages/supervisor/interns/SupervisorInternInternship";
import SupervisorInternInternshipLogs from "./pages/supervisor/interns/SupervisorInternInternshipLogs";
import SupervisorProfile from "./pages/supervisor/SupervisorProfile";
import StudentDInternshipDetails from "./pages/student/internships/StudentInternshipDetails";
import StudentInternshipLogs from "./pages/student/internships/StudentInternshipLogs";
import InternshipApplication from "./pages/student/InternshipApplication";

export const interhubApp = createBrowserRouter([
  // Auth Routes
  {
    path: "/signin",
    Component: Signin,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/auth/supervisor-onboarding",
    Component: SupervisorOnboarding,
  },

  // Student Dashboard Routes
  {
    path: "/",
    element: (
      <StudentProtection>
        <StudentDashboard />
      </StudentProtection>
    ),
    children: [
      {
        index: true,
        element: <StudentOverview />,
      },
      {
        path: "apply",
        element: <StudentOverview />,
        children: [
          {
            index: true,
            element: <InternshipApplication />,
          },
        ]
      },
      {
        path: "internships",
        element: <StudentInternships />,
      },
      {
        path: "internships/:internshipId",
        element: <StudentDInternshipDetails />,
      },
      {
        path: "internships/:internshipId/:weekId",
        element: <StudentInternshipLogs />,
      },
      {
        path: "help",
        element: <StudentHelp />,
      },
      {
        path: "profile",
        element: <StudentProfile />,
      },
    ],
  },

  // Supervisor Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <SupervisorProtection>
        <SupervisorDashboard />
      </SupervisorProtection>
    ),
    children: [
      {
        index: true,
        element: <SupervisorOverview />,
      },
      {
        path: "interns",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <SupervisorInterns />,
          },
          {
            path: ":studentId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <SupervisorInternDetails />,
              },
              {
                path: ":internshipId",
                element: <SupervisorInternInternship />,
              },
              {
                path: ":internshipId/:weekId",
                element: <SupervisorInternInternshipLogs />,
              },
            ],
          },
        ],
      },
      {
        path: "profile",
        element: <SupervisorProfile />,
      },
    ],
  },

  // Admin Dashboard Routes
  {
    path: "/admin",
    element: (
      <AdmimProtection>
        <AdminDashboard />
      </AdmimProtection>
    ),
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "requests",
        element: <AdminRequests />,
        children: [
          {
            path: ":requestId",
            element: <AdminInternshipRequestDetails />,
          },
          {
            path: ":requestId/approve",
            element: <ApproveInternshipRequest />,
          },
          {
            path: ":requestId/reject",
            element: <RejectInternshipRequest />,
          },
          {
            path: ":requestId/delete",
            element: <DeleteInternshipRequest />,
          },
        ],
      },
      {
        path: "students",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <AdminStudents />,
          },
          {
            path: ":studentId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <AdminStudentDetails />,
              },
              {
                path: ":internshipId",
                element: <AdminStudentInternship />,
              },
              {
                path: ":internshipId/:weekId",
                element: <AdminStudentInternshipLogs />,
              },
            ],
          },
        ],
      },
      {
        path: "interns",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <AdminInterns />,
          },
          {
            path: ":studentId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <AdminInternDetails />,
              },
              {
                path: ":internshipId",
                element: <AdminInternInternship />,
              },
              {
                path: ":internshipId/:weekId",
                element: <AdminInternInternshipLogs />,
              },
            ],
          },
        ],
      },
      {
        path: "staff",
        element: <AdminStaff />,
        children: [
          {
            path: "new",
            element: <CreateStaff />,
          },
          {
            path: ":supervisorId",
            element: <AdminStaffDetails />,
          },
          {
            path: ":supervisorId/edit",
            element: <EditStaff />,
          },
          {
            path: ":supervisorId/delete",
            element: <DeleteStaff />,
          },
          {
            path: ":supervisorId/deactivate",
            element: <DeactivateStaff />,
          },
          {
            path: ":supervisorId/activate",
            element: <ActivateStaff />,
          },
        ],
      },
      {
        path: "internships",
        element: <AdminInternships />,
        children: [
          {
            path: "new",
            element: <CreateInternship />,
          },
          {
            path: ":internshipId",
            element: <InternshipDetails />,
          },
          {
            path: ":internshipId/edit",
            element: <EditInternship />,
          },
          {
            path: ":internshipId/delete",
            element: <DeleteInternship />,
          },
        ],
      },
      {
        path: "faculties",
        element: <AdminFaculties />,
        children: [
          {
            path: "new",
            element: <CreateFaculty />,
          },
        ],
      },
      {
        path: "faculties/:facultyId",
        element: <AdminFacultyDetails />,
        children: [
          {
            path: "new",
            element: <CreateDepartment />,
          },
          {
            path: "edit",
            element: <EditFaculty />,
          },
          {
            path: "delete",
            element: <DeleteFaculty />,
          },
          {
            path: ":departmentId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <AdminDepartmentDetails />,
              },
              {
                path: "edit",
                element: <EditDepartment />,
              },
              {
                path: "delete",
                element: <DeleteDepartment />,
              },
            ],
          },
        ],
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
    ],
  },
]);
