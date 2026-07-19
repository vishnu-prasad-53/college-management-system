import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAttendance } from "../services/attendance.service";

export const useDeleteAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAttendance,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["attendance"],
            });
        },
    });
};