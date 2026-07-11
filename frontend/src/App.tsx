import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

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
        </Route>
        <Route element={<RoleProtectedRoute allowedRoles={["faculty"]} />}>
          <Route
            path="/faculty/dashboard"
            element={<FacultyDashboard />}
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