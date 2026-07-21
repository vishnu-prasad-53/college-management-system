import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import AssignmentTable from "../../components/assignment/AssignmentTable";
import AssignmentModal from "../../components/assignment/AssignmentModal";
import DeleteAssignmentModal from "../../components/assignment/DeleteAssignmentModal";
import AssignmentSearch from "../../components/assignment/AssignmentSearch";

import Pagination from "../../components/student/Pagination";

import { useAssignments } from "../../hooks/useAssignments";
import { useCreateAssignment } from "../../hooks/useCreateAssignment";
import { useUpdateAssignment } from "../../hooks/useUpdateAssignment";
import { useDeleteAssignment } from "../../hooks/useDeleteAssignment";

import { useSubjects } from "../../hooks/useSubject";
import { useFaculty } from "../../hooks/useFaculty";

import type { Assignment, CreateAssignmentData } from "../../types/assignment.types";

const Assignments = () => {
    const { data: assignments = [], isLoading, isError, refetch } = useAssignments();

    const { data: subjects = [] } = useSubjects();
    const { data: faculty = [] } = useFaculty();

    const createMutation = useCreateAssignment();
    const updateMutation = useUpdateAssignment();
    const deleteMutation = useDeleteAssignment();

    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const RECORDS_PER_PAGE = 10;

    const handleCreate = (data: CreateAssignmentData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateAssignmentData) => {
        if (!selectedAssignment) return;

        updateMutation.mutate(
            {
                id: selectedAssignment.id,
                data: {
                    title: data.title,
                    description: data.description,
                    dueDate: data.dueDate,
                    maxMarks: data.maxMarks,
                },
            },
            {
                onSuccess: () => {
                    setSelectedAssignment(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedAssignment) return;

        deleteMutation.mutate(selectedAssignment.id, {
            onSuccess: () => {
                setSelectedAssignment(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) => {
            const query = search.toLowerCase();

            return (
                assignment.title.toLowerCase().includes(query) ||
                assignment.subject.name.toLowerCase().includes(query)
            );
        });
    }, [assignments, search]);

    const totalPages = Math.ceil(filteredAssignments.length / RECORDS_PER_PAGE);

    const paginatedAssignments = filteredAssignments.slice((currentPage - 1) * RECORDS_PER_PAGE, currentPage * RECORDS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, assignments]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isError) {
        return (
            <ErrorState
                title="Unable to load assignments"
                description="Something went wrong while fetching assignments."
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
                <h1 className="text-3xl font-bold">Assignments</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Assignment
                </button>
            </div>
            <AssignmentSearch
                value={search}
                onChange={setSearch}
            />
            {filteredAssignments.length === 0 ? (
                <EmptyState
                    title="No Assignments Found"
                    description="Try changing your search or add a new assignment."
                />
            ) : (
                <>
                    <AssignmentTable
                        assignments={paginatedAssignments}
                        onEdit={(assignment) => {
                            setSelectedAssignment(assignment);
                            setIsEditOpen(true);
                        }}
                        onDelete={(assignment) => {
                            setSelectedAssignment(assignment);
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
            <AssignmentModal
                open={isCreateOpen}
                title="Add Assignment"
                subjects={subjects}
                faculty={faculty}
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <AssignmentModal
                open={isEditOpen}
                title="Edit Assignment"
                assignment={selectedAssignment}
                subjects={subjects}
                faculty={faculty}
                loading={updateMutation.isPending}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedAssignment(null);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteAssignmentModal
                open={isDeleteOpen}
                assignment={selectedAssignment}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedAssignment(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Assignments;