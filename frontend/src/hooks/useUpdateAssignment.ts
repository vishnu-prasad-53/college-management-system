import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAssignment } from "../services/assignment.service";

import type { UpdateAssignmentData } from "../types/assignment.types";

type UpdateAssignmentPayload = {
    id: number;
    data: UpdateAssignmentData;
};

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateAssignmentPayload) => updateAssignment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
        },
    });
};