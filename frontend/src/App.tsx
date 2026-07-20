import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

import Students from "./pages/admin/Students";
import Faculty from "./pages/admin/Faculty";
import Departments from "./pages/admin/Departments";
import Subjects from "./pages/admin/Subjects";

import Attendance from "./pages/faculty/Attendance";
import Marks from "./pages/faculty/Marks";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/students"
            element={<Students />}
          />
          <Route
            path="/admin/faculty"
            element={<Faculty />}
          />
          <Route
            path="/admin/departments"
            element={<Departments />}
          />
          <Route
            path="/admin/subjects"
            element={<Subjects />}
          />
        </Route>
        <Route element={<RoleProtectedRoute allowedRoles={["faculty"]} />}>
          <Route
            path="/faculty/dashboard"
            element={<FacultyDashboard />}
          />
          <Route
            path="/faculty/attendance"
            element={<Attendance />}
          />
          <Route
            path="/faculty/marks"
            element={<Marks />}
          />
        </Route>
        <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />
        </Route>
      </Route>
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;