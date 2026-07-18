import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubject } from "../services/subject.service";

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subjects"],
            });
        },
    });
};