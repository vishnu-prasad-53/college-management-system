import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFaculty } from "../services/faculty.service";
import type { UpdateFacultyData } from "../types/faculty.types";

export const useUpdateFaculty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: number;
            data: UpdateFacultyData;
        }) => updateFaculty(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faculty"] });
        },
    });
};