import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "../services/department.service";
import type { UpdateDepartmentData } from "../types/department.types";

export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: {
            id: number;
            data: UpdateDepartmentData;
        }) => updateDepartment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });
        },
    });
};