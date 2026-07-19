import { useQuery } from "@tanstack/react-query";

import { getAllAttendance } from "../services/attendance.service";

export const useAttendance = () => {
    return useQuery({
        queryKey: ["attendance"],
        queryFn: getAllAttendance,
    });
};