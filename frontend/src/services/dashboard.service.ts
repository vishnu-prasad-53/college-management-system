import api from "../api/axios";

import type { DashboardResponse } from "../types/dashboard.types";

export const getDashboardStats = async (): Promise<DashboardResponse> => {
    const { data } = await api.get("/dashboard");

    return data;
};