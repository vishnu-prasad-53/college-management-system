import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import AnnouncementTable from "../../components/announcement/AnnouncementTable";
import AnnouncementModal from "../../components/announcement/AnnouncementModal";
import DeleteAnnouncementModal from "../../components/announcement/DeleteAnnouncementModal";
import AnnouncementSearch from "../../components/announcement/AnnouncementSearch";

import Pagination from "../../components/student/Pagination";

import { useAnnouncements } from "../../hooks/useAnnouncements";
import { useCreateAnnouncement } from "../../hooks/useCreateAnnouncement";
import { useUpdateAnnouncement } from "../../hooks/useUpdateAnnouncement";
import { useDeleteAnnouncement } from "../../hooks/useDeleteAnnouncement";

import { useDepartments } from "../../hooks/useDepartment";

import type { Announcement as AnnouncementRecord, CreateAnnouncementData } from "../../types/announcement.types";

const Announcements = () => {
    const { data: announcements = [], isLoading, isError, refetch } = useAnnouncements();

    const { data: departments = [] } = useDepartments();

    const createMutation = useCreateAnnouncement();
    const updateMutation = useUpdateAnnouncement();
    const deleteMutation = useDeleteAnnouncement();

    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementRecord | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const RECORDS_PER_PAGE = 10;

    const handleCreate = (data: CreateAnnouncementData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateAnnouncementData) => {
        if (!selectedAnnouncement) return;

        updateMutation.mutate(
            {
                id: selectedAnnouncement.id,
                data: {
                    title: data.title,
                    content: data.content,
                    departmentId: data.departmentId,
                    audience: data.audience,
                    priority: data.priority,
                    expiryDate: data.expiryDate,
                },
            },
            {
                onSuccess: () => {
                    setSelectedAnnouncement(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedAnnouncement) return;

        deleteMutation.mutate(selectedAnnouncement.id, {
            onSuccess: () => {
                setSelectedAnnouncement(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((announcement) => {
            const query = search.toLowerCase();

            return (
                announcement.title.toLowerCase().includes(query) ||
                announcement.audience.toLowerCase().includes(query) ||
                announcement.priority.toLowerCase().includes(query) ||
                (announcement.department?.name?.toLowerCase().includes(query) ?? false)
            );
        });
    }, [announcements, search]);

    const totalPages = Math.ceil(filteredAnnouncements.length / RECORDS_PER_PAGE);

    const paginatedAnnouncements = filteredAnnouncements.slice((currentPage - 1) * RECORDS_PER_PAGE, currentPage * RECORDS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, announcements]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isError) {
        return (
            <ErrorState
                title="Unable to load announcements"
                description="Something went wrong while fetching announcements."
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
                <h1 className="text-3xl font-bold">Announcements</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Announcement
                </button>
            </div>
            <AnnouncementSearch
                value={search}
                onChange={setSearch}
            />
            {filteredAnnouncements.length === 0 ? (
                <EmptyState
                    title="No Announcements Found"
                    description="Try changing your search or create a new announcement."
                />
            ) : (
                <>
                    <AnnouncementTable
                        announcements={paginatedAnnouncements}
                        onEdit={(announcement) => {
                            setSelectedAnnouncement(announcement);
                            setIsEditOpen(true);
                        }}
                        onDelete={(announcement) => {
                            setSelectedAnnouncement(announcement);
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
            <AnnouncementModal
                open={isCreateOpen}
                title="Add Announcement"
                departments={departments}
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <AnnouncementModal
                open={isEditOpen}
                title="Edit Announcement"
                announcement={selectedAnnouncement}
                departments={departments}
                loading={updateMutation.isPending}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedAnnouncement(null);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteAnnouncementModal
                open={isDeleteOpen}
                announcement={selectedAnnouncement}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedAnnouncement(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Announcements;