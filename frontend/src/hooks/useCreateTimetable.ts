import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTimetable } from "../services/timetable.service";

export const useCreateTimetable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTimetable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["timetable"],
            });
        },
    });
};