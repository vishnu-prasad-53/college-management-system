import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceModal from "../../components/attendance/AttendanceModal";
import DeleteAttendanceModal from "../../components/attendance/DeleteAttendanceModal";
import AttendanceSearch from "../../components/attendance/AttendanceSearch";
import Pagination from "../../components/student/Pagination";

import { useAttendance } from "../../hooks/useAttendance";
import { useCreateAttendance } from "../../hooks/useCreateAttendance";
import { useUpdateAttendance } from "../../hooks/useUpdateAttendance";
import { useDeleteAttendance } from "../../hooks/useDeleteAttendance";

import { useStudents } from "../../hooks/useStudent";
import { useSubjects } from "../../hooks/useSubject";

import type { Attendance as AttendanceRecord, CreateAttendanceData } from "../../types/attendance.types";

const Attendance = () => {
    const { data: attendance = [], isLoading, isError, refetch } = useAttendance();

    const { data: students = [] } = useStudents();
    const { data: subjects = [] } = useSubjects();

    const createMutation = useCreateAttendance();
    const updateMutation = useUpdateAttendance();
    const deleteMutation = useDeleteAttendance();

    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const RECORDS_PER_PAGE = 10;

    const handleCreate = (data: CreateAttendanceData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateAttendanceData) => {
        if (!selectedAttendance) return;

        updateMutation.mutate(
            {
                id: selectedAttendance.id,
                data: {
                    date: data.date,
                    status: data.status,
                },
            },
            {
                onSuccess: () => {
                    setSelectedAttendance(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedAttendance) return;

        deleteMutation.mutate(selectedAttendance.id, {
            onSuccess: () => {
                setSelectedAttendance(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredAttendance = useMemo(() => {
        return attendance.filter((record) => {
            const query = search.toLowerCase();

            return (
                record.student.user.name.toLowerCase().includes(query) ||
                record.student.usn.toLowerCase().includes(query) ||
                record.subject.name.toLowerCase().includes(query)
            );
        });
    }, [attendance, search]);

    const totalPages = Math.ceil(
        filteredAttendance.length / RECORDS_PER_PAGE
    );

    const paginatedAttendance = filteredAttendance.slice(
        (currentPage - 1) * RECORDS_PER_PAGE,
        currentPage * RECORDS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, attendance]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isError) {
        return (
            <ErrorState
                title="Unable to load attendance"
                description="Something went wrong while fetching attendance records."
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
                <h1 className="text-3xl font-bold">Attendance</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Attendance
                </button>
            </div>
            <AttendanceSearch
                value={search}
                onChange={setSearch}
            />
            {filteredAttendance.length === 0 ? (
                <EmptyState
                    title="No Attendance Records"
                    description="Try changing your search or add a new attendance record."
                />
            ) : (
                <>
                    <AttendanceTable
                        attendance={paginatedAttendance}
                        onEdit={(attendance) => {
                            setSelectedAttendance(attendance);
                            setIsEditOpen(true);
                        }}
                        onDelete={(attendance) => {
                            setSelectedAttendance(attendance);
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
            <AttendanceModal
                open={isCreateOpen}
                title="Add Attendance"
                students={students}
                subjects={subjects}
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <AttendanceModal
                open={isEditOpen}
                title="Edit Attendance"
                attendance={selectedAttendance}
                students={students}
                subjects={subjects}
                loading={updateMutation.isPending}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedAttendance(null);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteAttendanceModal
                open={isDeleteOpen}
                attendance={selectedAttendance}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedAttendance(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Attendance;