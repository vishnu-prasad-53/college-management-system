import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import MarksTable from "../../components/marks/MarksTable";
import MarksModal from "../../components/marks/MarksModal";
import DeleteMarksModal from "../../components/marks/DeleteMarksModal";
import MarksSearch from "../../components/marks/MarksSearch";
import Pagination from "../../components/student/Pagination";

import { useMarks } from "../../hooks/useMarks";
import { useCreateMarks } from "../../hooks/useCreateMarks";
import { useUpdateMarks } from "../../hooks/useUpdateMarks";
import { useDeleteMarks } from "../../hooks/useDeleteMarks";

import { useStudents } from "../../hooks/useStudent";
import { useSubjects } from "../../hooks/useSubject";

import type { Marks as MarksRecord, CreateMarksData } from "../../types/marks.types";

const Marks = () => {
    const { data: marks = [], isLoading, isError, refetch } = useMarks();

    const { data: students = [] } = useStudents();
    const { data: subjects = [] } = useSubjects();

    const createMutation = useCreateMarks();
    const updateMutation = useUpdateMarks();
    const deleteMutation = useDeleteMarks();

    const [selectedMarks, setSelectedMarks] = useState<MarksRecord | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const RECORDS_PER_PAGE = 10;

    const handleCreate = (data: CreateMarksData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateMarksData) => {
        if (!selectedMarks) return;

        updateMutation.mutate(
            {
                id: selectedMarks.id,
                data: {
                    internalMarks: data.internalMarks,
                    externalMarks: data.externalMarks,
                    totalMarks: data.totalMarks,
                    grade: data.grade,
                },
            },
            {
                onSuccess: () => {
                    setSelectedMarks(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedMarks) return;

        deleteMutation.mutate(selectedMarks.id, {
            onSuccess: () => {
                setSelectedMarks(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredMarks = useMemo(() => {
        return marks.filter((mark) => {
            const query = search.toLowerCase();

            return (
                mark.student.user.name.toLowerCase().includes(query) ||
                mark.student.usn.toLowerCase().includes(query) ||
                mark.subject.name.toLowerCase().includes(query)
            );
        });
    }, [marks, search]);

    const totalPages = Math.ceil(
        filteredMarks.length / RECORDS_PER_PAGE
    );

    const paginatedMarks = filteredMarks.slice(
        (currentPage - 1) * RECORDS_PER_PAGE,
        currentPage * RECORDS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, marks]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isError) {
        return (
            <ErrorState
                title="Unable to load marks"
                description="Something went wrong while fetching marks."
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
                <h1 className="text-3xl font-bold">Marks</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Marks
                </button>
            </div>
            <MarksSearch
                value={search}
                onChange={setSearch}
            />
            {filteredMarks.length === 0 ? (
                <EmptyState
                    title="No Marks Found"
                    description="Try changing your search or add a new marks record."
                />
            ) : (
                <>
                    <MarksTable
                        marks={paginatedMarks}
                        onEdit={(mark) => {
                            setSelectedMarks(mark);
                            setIsEditOpen(true);
                        }}
                        onDelete={(mark) => {
                            setSelectedMarks(mark);
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
            <MarksModal
                open={isCreateOpen}
                title="Add Marks"
                students={students}
                subjects={subjects}
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <MarksModal
                open={isEditOpen}
                title="Edit Marks"
                marks={selectedMarks}
                students={students}
                subjects={subjects}
                loading={updateMutation.isPending}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedMarks(null);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteMarksModal
                open={isDeleteOpen}
                marks={selectedMarks}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedMarks(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Marks;