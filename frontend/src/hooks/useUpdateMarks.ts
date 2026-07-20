import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMarks } from "../services/marks.service";

import type { UpdateMarksData } from "../types/marks.types";

type UpdateMarksPayload = {
    id: number;
    data: UpdateMarksData;
};

export const useUpdateMarks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateMarksPayload) => updateMarks(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["marks"],
            });
        },
    });
};