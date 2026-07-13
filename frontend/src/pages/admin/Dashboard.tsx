import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";

import { useDashboard } from "../../hooks/useDashboard";

const AdminDashboard = () => {
    const { data, isLoading, isError } = useDashboard();

    if (isLoading) {
        return (
            <DashboardLayout>
                <p>Loading dashboard...</p>
            </DashboardLayout>
        );
    }

    if (isError || !data) {
        return (
            <DashboardLayout>
                <p>Failed to load dashboard.</p>
            </DashboardLayout>
        );
    }

    const stats = data.data;

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                />
                <StatCard
                    title="Total Faculty"
                    value={stats.totalFaculty}
                />
                <StatCard
                    title="Total Departments"
                    value={stats.totalDepartments}
                />
                <StatCard
                    title="Total Subjects"
                    value={stats.totalSubjects}
                />
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;