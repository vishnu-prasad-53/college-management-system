import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMarks } from "../services/marks.service";

export const useDeleteMarks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMarks,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["marks"],
            });
        },
    });
};