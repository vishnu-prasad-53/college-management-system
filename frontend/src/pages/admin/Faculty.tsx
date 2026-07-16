import { useMemo, useState, useEffect } from "react";

import EmptyState from "../../components/EmptyState";
import TableSkeleton from "../../components/TableSkeleton";
import ErrorState from "../../components/ErrorState";

import FacultyTable from "../../components/faculty/FacultyTable";
import FacultyModal from "../../components/faculty/FacultyModal";
import DeleteFacultyModal from "../../components/faculty/DeleteFacultyModal";
import FacultySearch from "../../components/faculty/FacultySearch";
import Pagination from "../../components/student/Pagination";

import { useFaculty } from "../../hooks/useFaculty";
import { useCreateFaculty } from "../../hooks/useCreateFaculty";
import { useUpdateFaculty } from "../../hooks/useUpdateFaculty";
import { useDeleteFaculty } from "../../hooks/useDeleteFaculty";

import type { Faculty, CreateFacultyData } from "../../types/faculty.types";

const FacultyPage = () => {
    const { data: faculty = [], isLoading, isError, refetch } = useFaculty();

    const createMutation = useCreateFaculty();
    const updateMutation = useUpdateFaculty();
    const deleteMutation = useDeleteFaculty();

    const [selectedFaculty, setSelectedFaculty] =
        useState<Faculty | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const FACULTY_PER_PAGE = 10;

    const handleCreate = (data: CreateFacultyData) => {
        createMutation.mutate(data, {
            onSuccess: () => setIsCreateOpen(false),
        });
    };

    const handleUpdate = (data: CreateFacultyData) => {
        if (!selectedFaculty) return;

        updateMutation.mutate(
            {
                id: selectedFaculty.id,
                data: {
                    departmentId: data.departmentId,
                    designation: data.designation,
                },
            },
            {
                onSuccess: () => {
                    setSelectedFaculty(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedFaculty) return;

        deleteMutation.mutate(selectedFaculty.id, {
            onSuccess: () => {
                setSelectedFaculty(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredFaculty = useMemo(() => {
        const query = search.toLowerCase();

        return faculty.filter((member) =>
            member.user.name.toLowerCase().includes(query) ||
            member.user.email.toLowerCase().includes(query) ||
            member.designation.toLowerCase().includes(query)
        );
    }, [faculty, search]);

    const totalPages = Math.ceil(
        filteredFaculty.length / FACULTY_PER_PAGE
    );

    const paginatedFaculty = filteredFaculty.slice(
        (currentPage - 1) * FACULTY_PER_PAGE,
        currentPage * FACULTY_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, faculty]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Unable to load faculty"
                description="Something went wrong while fetching faculty."
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Faculty</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Faculty
                </button>
            </div>
            <FacultySearch
                value={search}
                onChange={setSearch}
            />
            {filteredFaculty.length === 0 ? (
                <EmptyState
                    title="No Faculty Found"
                    description="Try another search or add faculty."
                />
            ) : (
                <>
                    <FacultyTable
                        faculty={paginatedFaculty}
                        onEdit={(member) => {
                            setSelectedFaculty(member);
                            setIsEditOpen(true);
                        }}
                        onDelete={(member) => {
                            setSelectedFaculty(member);
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
            <FacultyModal
                open={isCreateOpen}
                title="Add Faculty"
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <FacultyModal
                open={isEditOpen}
                title="Edit Faculty"
                faculty={selectedFaculty}
                loading={updateMutation.isPending}
                onClose={() => {
                    setSelectedFaculty(null);
                    setIsEditOpen(false);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteFacultyModal
                open={isDeleteOpen}
                faculty={selectedFaculty}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setSelectedFaculty(null);
                    setIsDeleteOpen(false);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default FacultyPage;