import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "../services/department.service";

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });
        },
    });
};