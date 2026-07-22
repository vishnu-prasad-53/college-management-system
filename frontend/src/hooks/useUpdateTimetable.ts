import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTimetable } from "../services/timetable.service";

import type { UpdateTimetableData } from "../types/timetable.types";

type UpdateTimetablePayload = {
    id: number;
    data: UpdateTimetableData;
};

export const useUpdateTimetable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateTimetablePayload) => updateTimetable(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["timetable"],
            });
        },
    });
};