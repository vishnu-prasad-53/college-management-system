export type DashboardStats = {
    totalStudents: number;
    totalFaculty: number;
    totalDepartments: number;
    totalSubjects: number;
};

export type DashboardResponse = {
    success: boolean;
    data: DashboardStats;
};