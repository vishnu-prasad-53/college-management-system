import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createStudent } from "../services/student.service";

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            toast.success("Student created successfully");

            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to create student");
        },
    });
};