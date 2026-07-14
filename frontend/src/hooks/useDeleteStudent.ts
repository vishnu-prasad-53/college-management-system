import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteStudent } from "../services/student.service";

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            toast.success("Student deleted successfully");

            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete student");
        },
    });
};