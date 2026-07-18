import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import SubjectTable from "../../components/subject/SubjectTable";
import SubjectModal from "../../components/subject/SubjectModal";
import DeleteSubjectModal from "../../components/subject/DeleteSubjectModal";
import SubjectSearch from "../../components/subject/SubjectSearch";
import Pagination from "../../components/student/Pagination";

import { useSubjects } from "../../hooks/useSubject";
import { useCreateSubject } from "../../hooks/useCreateSubject";
import { useUpdateSubject } from "../../hooks/useUpdateSubject";
import { useDeleteSubject } from "../../hooks/useDeleteSubject";

import { useDepartments } from "../../hooks/useDepartment";
import { useFaculty } from "../../hooks/useFaculty";

import type { Subject, CreateSubjectData } from "../../types/subject.types";

const Subjects = () => {
    const { data: subjects = [], isLoading, isError, refetch } = useSubjects();

    const { data: departments = [] } = useDepartments();
    const { data: faculties = [] } = useFaculty();

    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const SUBJECTS_PER_PAGE = 10;

    const handleCreate = (data: CreateSubjectData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateSubjectData) => {
        if (!selectedSubject) return;

        updateMutation.mutate(
            {
                id: selectedSubject.id,
                data,
            },
            {
                onSuccess: () => {
                    setSelectedSubject(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedSubject) return;

        deleteMutation.mutate(selectedSubject.id, {
            onSuccess: () => {
                setSelectedSubject(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredSubjects = useMemo(() => {
        const query = search.toLowerCase();

        return subjects.filter(
            (subject) => subject.name.toLowerCase().includes(query) || subject.code.toLowerCase().includes(query)
        );
    }, [subjects, search]);

    const totalPages = Math.ceil(
        filteredSubjects.length / SUBJECTS_PER_PAGE
    );

    const paginatedSubjects = filteredSubjects.slice(
        (currentPage - 1) * SUBJECTS_PER_PAGE,
        currentPage * SUBJECTS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, subjects]);

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
                title="Unable to load subjects"
                description="Something went wrong while fetching subjects."
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Subjects</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Subject
                </button>
            </div>
            <SubjectSearch
                value={search}
                onChange={setSearch}
            />
            {filteredSubjects.length === 0 ? (
                <EmptyState
                    title="No Subjects Found"
                    description="Try changing your search or create a new subject."
                />
            ) : (
                <>
                    <SubjectTable
                        subjects={paginatedSubjects}
                        onEdit={(subject) => {
                            setSelectedSubject(subject);
                            setIsEditOpen(true);
                        }}
                        onDelete={(subject) => {
                            setSelectedSubject(subject);
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
            <SubjectModal
                open={isCreateOpen}
                title="Add Subject"
                departments={departments}
                faculties={faculties}
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <SubjectModal
                open={isEditOpen}
                title="Edit Subject"
                subject={selectedSubject}
                departments={departments}
                faculties={faculties}
                loading={updateMutation.isPending}
                onClose={() => {
                    setSelectedSubject(null);
                    setIsEditOpen(false);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteSubjectModal
                open={isDeleteOpen}
                subject={selectedSubject}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setSelectedSubject(null);
                    setIsDeleteOpen(false);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Subjects;