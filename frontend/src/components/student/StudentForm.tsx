import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CreateStudentData, Student } from "../../types/student.types";

import { createStudentSchema, type CreateStudentFormData } from "../../validators/student.validator";

type StudentFormProps = {
    defaultValues?: Student | null;
    onSubmit: (data: CreateStudentData) => void;
    loading?: boolean;
};

const StudentForm = ({ defaultValues, onSubmit, loading = false }: StudentFormProps) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStudentFormData>({
        resolver: zodResolver(createStudentSchema),
        defaultValues: {
            name: "",
            email: "",
            departmentId: 1,
            usn: "",
            semester: 1,
            cgpa: 0,
        },
    });

    useEffect(() => {
        if (!defaultValues) return;

        reset({
            name: defaultValues.user.name,
            email: defaultValues.user.email,
            departmentId: defaultValues.departmentId,
            usn: defaultValues.usn,
            semester: defaultValues.semester,
            cgpa: defaultValues.cgpa,
        });
    }, [defaultValues, reset]);

    return (
        <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="space-y-4"
        >
            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    {...register("name")}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>
            <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                    {...register("email")}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div>
                <label className="block mb-1 font-medium">Department ID</label>
                <input
                    type="number"
                    {...register("departmentId", {
                        valueAsNumber: true,
                    })}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-sm text-red-500">{errors.departmentId?.message}</p>
            </div>
            <div>
                <label className="block mb-1 font-medium">USN</label>
                <input
                    {...register("usn")}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-sm text-red-500">{errors.usn?.message}</p>
            </div>
            <div>
                <label className="block mb-1 font-medium">Semester</label>
                <input
                    type="number"
                    {...register("semester", {
                        valueAsNumber: true,
                    })}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-sm text-red-500">{errors.semester?.message}</p>
            </div>
            <div>
                <label className="block mb-1 font-medium">CGPA</label>
                <input
                    type="number"
                    step="0.01"
                    {...register("cgpa", {
                        valueAsNumber: true,
                    })}
                    className="w-full rounded border px-3 py-2"
                />
                <p className="text-sm text-red-500">{errors.cgpa?.message}</p>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Student"}
            </button>
        </form>
    );
};

export default StudentForm;