import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAttendance } from "../services/attendance.service";

export const useCreateAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAttendance,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["attendance"],
            });
        },
    });
};