import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubject } from "../services/subject.service";
import type { UpdateSubjectData } from "../types/subject.types";

type UpdateParams = {
    id: number;
    data: UpdateSubjectData;
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateParams) => updateSubject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subjects"],
            });
        },
    });
};