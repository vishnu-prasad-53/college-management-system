import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
    const { user } = useAuth();
    const menu = {
        admin: [
            { label: "Dashboard", path: "/admin/dashboard" },
            { label: "Students", path: "/admin/students" },
            { label: "Faculty", path: "/admin/faculty" },
            { label: "Departments", path: "/admin/departments" },
            { label: "Subjects", path: "/admin/subjects" },
            { label: "Timetable", path: "/admin/timetable" },
            { label: "Library", path: "/admin/library" },
            { label: "Announcements", path: "/admin/announcements" },
        ],
        faculty: [
            { label: "Dashboard", path: "/faculty/dashboard" },
            { label: "Attendance", path: "/faculty/attendance" },
            { label: "Marks", path: "/faculty/marks" },
            { label: "Assignments", path: "/faculty/assignments" },
            { label: "Timetable", path: "/faculty/timetable" },
            { label: "Announcements", path: "/faculty/announcements" },
        ],
        student: [
            { label: "Dashboard", path: "/student/dashboard" },
            { label: "Attendance", path: "/student/attendance" },
            { label: "Marks", path: "/student/marks" },
            { label: "Assignments", path: "/student/assignments" },
            { label: "Timetable", path: "/student/timetable" },
            { label: "Library", path: "/student/library" },
            { label: "Announcements", path: "/student/announcements" },
        ],
    };

    const links = user ? menu[user.role] : [];

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold">CMS</h1>
            </div>
            <nav className="flex flex-col p-4 gap-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `px-4 py-3 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-slate-800"}`}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;