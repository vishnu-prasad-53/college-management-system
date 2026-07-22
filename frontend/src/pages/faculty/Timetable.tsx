import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import TimetableTable from "../../components/timetable/TimetableTable";
import TimetableModal from "../../components/timetable/TimetableModal";
import DeleteTimetableModal from "../../components/timetable/DeleteTimetableModal";
import TimetableSearch from "../../components/timetable/TimetableSearch";

import Pagination from "../../components/student/Pagination";

import { useTimetable } from "../../hooks/useTimetable";
import { useCreateTimetable } from "../../hooks/useCreateTimetable";
import { useUpdateTimetable } from "../../hooks/useUpdateTimetable";
import { useDeleteTimetable } from "../../hooks/useDeleteTimetable";

import { useDepartments } from "../../hooks/useDepartment";
import { useSubjects } from "../../hooks/useSubject";
import { useFaculty } from "../../hooks/useFaculty";

import type { Timetable as TimetableRecord, CreateTimetableData } from "../../types/timetable.types";

const Timetable = () => {
    const {
        data: timetable = [],
        isLoading,
        isError,
        refetch,
    } = useTimetable();

    const { data: departments = [] } = useDepartments();
    const { data: subjects = [] } = useSubjects();
    const { data: faculty = [] } = useFaculty();

    const createMutation = useCreateTimetable();
    const updateMutation = useUpdateTimetable();
    const deleteMutation = useDeleteTimetable();

    const [selectedTimetable, setSelectedTimetable] = useState<TimetableRecord | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const RECORDS_PER_PAGE = 10;

    const handleCreate = (data: CreateTimetableData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateTimetableData) => {
        if (!selectedTimetable) return;

        updateMutation.mutate(
            {
                id: selectedTimetable.id,
                data: {
                    semester: data.semester,
                    dayOfWeek: data.dayOfWeek,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    roomNumber: data.roomNumber,
                },
            },
            {
                onSuccess: () => {
                    setSelectedTimetable(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedTimetable) return;

        deleteMutation.mutate(selectedTimetable.id, {
            onSuccess: () => {
                setSelectedTimetable(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredTimetable = useMemo(() => {
        return timetable.filter((record) => {
            const query = search.toLowerCase();

            return (
                record.subject.name.toLowerCase().includes(query) ||
                record.faculty.user.name.toLowerCase().includes(query) ||
                record.department.name.toLowerCase().includes(query) ||
                record.dayOfWeek.toLowerCase().includes(query)
            );
        });
    }, [timetable, search]);

    const totalPages = Math.ceil(filteredTimetable.length / RECORDS_PER_PAGE);

    const paginatedTimetable = filteredTimetable.slice((currentPage - 1) * RECORDS_PER_PAGE, currentPage * RECORDS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, timetable]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isError) {
        return (
            <ErrorState
                title="Unable to load timetable"
                description="Something went wrong while fetching timetable records."
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
                <h1 className="text-3xl font-bold">RTimetableRecord</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Timetable
                </button>
            </div>
            <TimetableSearch
                value={search}
                onChange={setSearch}
            />
            {filteredTimetable.length === 0 ? (
                <EmptyState
                    title="No Timetable Records Found"
                    description="Try changing your search or add a new timetable entry."
                />
            ) : (
                <>
                    <TimetableTable
                        timetable={paginatedTimetable}
                        onEdit={(record) => {
                            setSelectedTimetable(record);
                            setIsEditOpen(true);
                        }}
                        onDelete={(record) => {
                            setSelectedTimetable(record);
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
            <TimetableModal
                open={isCreateOpen}
                title="Add Timetable"
                departments={departments}
                subjects={subjects}
                faculty={faculty}
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <TimetableModal
                open={isEditOpen}
                title="Edit Timetable"
                timetable={selectedTimetable}
                departments={departments}
                subjects={subjects}
                faculty={faculty}
                loading={updateMutation.isPending}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedTimetable(null);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteTimetableModal
                open={isDeleteOpen}
                timetable={selectedTimetable}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedTimetable(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Timetable;