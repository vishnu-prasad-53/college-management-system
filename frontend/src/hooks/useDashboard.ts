import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "../services/dashboard.service";

export const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardStats,
    });
};