import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAttendance } from "../services/attendance.service";

import type { UpdateAttendanceData } from "../types/attendance.types";

type UpdateAttendancePayload = {
    id: number;
    data: UpdateAttendanceData;
};

export const useUpdateAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateAttendancePayload) => updateAttendance(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["attendance"],
            });
        },
    });
};