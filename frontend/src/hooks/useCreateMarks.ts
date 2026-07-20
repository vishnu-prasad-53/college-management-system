import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMarks } from "../services/marks.service";

export const useCreateMarks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMarks,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["marks"],
            });
        },
    });
};