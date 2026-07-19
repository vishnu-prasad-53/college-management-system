import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const FacultyDashboard = () => {
    const cards = [
        {
            title: "Attendance",
            description: "Manage student attendance",
            path: "/faculty/attendance",
        },
        {
            title: "Marks",
            description: "Manage student marks",
            path: "/faculty/marks",
        },
        {
            title: "Assignments",
            description: "Manage assignments",
            path: "/faculty/assignments",
        },
        {
            title: "Timetable",
            description: "View timetable",
            path: "/faculty/timetable",
        },
        {
            title: "Announcements",
            description: "View announcements",
            path: "/faculty/announcements",
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <Link
                            key={card.path}
                            to={card.path}
                            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-500"
                        >
                            <h2 className="text-xl font-semibold">{card.title}</h2>
                            <p className="mt-2 text-slate-600">{card.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FacultyDashboard;