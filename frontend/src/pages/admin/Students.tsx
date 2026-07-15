import { useMemo, useState, useEffect } from "react";

import EmptyState from "../../components/EmptyState";
import TableSkeleton from "../../components/TableSkeleton";
import ErrorState from "../../components/ErrorState";

import StudentTable from "../../components/student/StudentTable";
import StudentModal from "../../components/student/StudentModal";
import DeleteStudentModal from "../../components/student/DeleteStudentModal";
import StudentSearch from "../../components/student/StudentSearch";
import Pagination from "../../components/student/Pagination";

import { useStudents } from "../../hooks/useStudent";
import { useCreateStudent } from "../../hooks/useCreateStudent";
import { useUpdateStudent } from "../../hooks/useUpdateStudent";
import { useDeleteStudent } from "../../hooks/useDeleteStudent";

import type { Student, CreateStudentData, } from "../../types/student.types";

const Students = () => {
    const { data: students = [], isLoading, isError, refetch } = useStudents();

    const createMutation = useCreateStudent();
    const updateMutation = useUpdateStudent();
    const deleteMutation = useDeleteStudent();

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const STUDENTS_PER_PAGE = 10;

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

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const query = search.toLowerCase();

            return (
                student.user.name.toLowerCase().includes(query) ||
                student.user.email.toLowerCase().includes(query) ||
                student.usn.toLowerCase().includes(query)
            );
        });
    }, [students, search]);

    const totalPages = Math.ceil(
        filteredStudents.length / STUDENTS_PER_PAGE
    );

    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * STUDENTS_PER_PAGE,
        currentPage * STUDENTS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, students]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isError) {
        return (
            <ErrorState
                title="Unable to load students"
                description="Something went wrong while fetching student data."
                onRetry={refetch}
            />
        );
    }

    if (isLoading) {
        return <TableSkeleton />;
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
            <StudentSearch
                value={search}
                onChange={setSearch}
            />
            {filteredStudents.length === 0 ? (
                <EmptyState
                    title="No Students Found"
                    description="Try changing your search or add a new student."
                />
            ) : (
                <>
                    <StudentTable
                        students={paginatedStudents}
                        onEdit={(student) => {
                            setSelectedStudent(student);
                            setIsEditOpen(true);
                        }}
                        onDelete={(student) => {
                            setSelectedStudent(student);
                            setIsDeleteOpen(true);
                        }}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
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