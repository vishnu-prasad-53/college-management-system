import type { Student, CreateStudentData } from "../../types/student.types";

import StudentForm from "./StudentForm";

type StudentModalProps = {
    open: boolean;
    title: string;
    student?: Student | null;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (data: CreateStudentData) => void;
};

const StudentModal = ({ open, title, student, loading = false, onClose, onSubmit }: StudentModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-black"
                    >
                        ×
                    </button>
                </div>
                <StudentForm
                    defaultValues={student}
                    loading={loading}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};

export default StudentModal;