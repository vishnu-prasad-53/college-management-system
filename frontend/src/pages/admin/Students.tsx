import { useState } from "react";

import StudentTable from "../../components/student/StudentTable";
import StudentModal from "../../components/student/StudentModal";
import DeleteStudentModal from "../../components/student/DeleteStudentModal";

import { useStudents } from "../../hooks/useStudent";
import { useCreateStudent } from "../../hooks/useCreateStudent";
import { useUpdateStudent } from "../../hooks/useUpdateStudent";
import { useDeleteStudent } from "../../hooks/useDeleteStudent";

import type { Student, CreateStudentData,} from "../../types/student.types";

const Students = () => {
    const { data: students = [], isLoading } = useStudents();

    const createMutation = useCreateStudent();
    const updateMutation = useUpdateStudent();
    const deleteMutation = useDeleteStudent();

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleCreate = (data: CreateStudentData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateStudentData) => {
        if (!selectedStudent) return;

        updateMutation.mutate(
            {
                id: selectedStudent.id,
                data: {
                    departmentId: data.departmentId,
                    usn: data.usn,
                    semester: data.semester,
                    cgpa: data.cgpa,
                },
            },
            {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedStudent(null);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedStudent) return;

        deleteMutation.mutate(selectedStudent.id, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedStudent(null);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="p-8">Loading students...</div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Students</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Student
                </button>

            </div>
            <StudentTable
                students={students}
                onEdit={(student) => {
                    setSelectedStudent(student);
                    setIsEditOpen(true);
                }}
                onDelete={(student) => {
                    setSelectedStudent(student);
                    setIsDeleteOpen(true);
                }}
            />
            <StudentModal
                open={isCreateOpen}
                title="Add Student"
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <StudentModal
                open={isEditOpen}
                title="Edit Student"
                student={selectedStudent}
                loading={updateMutation.isPending}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedStudent(null);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteStudentModal
                open={isDeleteOpen}
                student={selectedStudent}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedStudent(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Students;