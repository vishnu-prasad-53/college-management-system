import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAssignment } from "../services/assignment.service";

export const useDeleteAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
        },
    });
};