import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateStudent } from "../services/student.service";
import type { UpdateStudentData } from "../types/student.types";

type UpdateStudentPayload = {
    id: number;
    data: UpdateStudentData;
};

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: UpdateStudentPayload) => updateStudent(id, data),
        onSuccess: () => {
            toast.success("Student updated successfully");

            queryClient.invalidateQueries({ queryKey: ["students"] });
        },

        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update student");
        },
    });
};