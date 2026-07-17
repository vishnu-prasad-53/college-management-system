import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import TableSkeleton from "../../components/TableSkeleton";

import DepartmentTable from "../../components/department/DepartmentTable";
import DepartmentModal from "../../components/department/DepartmentModal";
import DeleteDepartmentModal from "../../components/department/DeleteDepartmentModal";
import DepartmentSearch from "../../components/department/DepartmentSearch";
import Pagination from "../../components/student/Pagination";

import { useDepartments } from "../../hooks/useDepartment";
import { useCreateDepartment } from "../../hooks/useCreateDepartment";
import { useUpdateDepartment } from "../../hooks/useUpdateDepartment";
import { useDeleteDepartment } from "../../hooks/useDeleteDepartment";

import type { Department, CreateDepartmentData } from "../../types/department.types";

const Departments = () => {
    const { data: departments = [], isLoading, isError, refetch } = useDepartments();

    const createMutation = useCreateDepartment();
    const updateMutation = useUpdateDepartment();
    const deleteMutation = useDeleteDepartment();

    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const DEPARTMENTS_PER_PAGE = 10;

    const handleCreate = (data: CreateDepartmentData) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (data: CreateDepartmentData) => {
        if (!selectedDepartment) return;

        updateMutation.mutate(
            {
                id: selectedDepartment.id,
                data,
            },
            {
                onSuccess: () => {
                    setSelectedDepartment(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedDepartment) return;

        deleteMutation.mutate(selectedDepartment.id, {
            onSuccess: () => {
                setSelectedDepartment(null);
                setIsDeleteOpen(false);
            },
        });
    };

    const filteredDepartments = useMemo(() => {
        const query = search.toLowerCase();

        return departments.filter(
            (department) => department.name.toLowerCase().includes(query) || department.code.toLowerCase().includes(query)
        );
    }, [departments, search]);

    const totalPages = Math.ceil(
        filteredDepartments.length / DEPARTMENTS_PER_PAGE
    );

    const paginatedDepartments = filteredDepartments.slice(
        (currentPage - 1) * DEPARTMENTS_PER_PAGE,
        currentPage * DEPARTMENTS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, departments]);

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
                title="Unable to load departments"
                description="Something went wrong while fetching departments."
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Departments</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Add Department
                </button>
            </div>
            <DepartmentSearch
                value={search}
                onChange={setSearch}
            />
            {filteredDepartments.length === 0 ? (
                <EmptyState
                    title="No Departments Found"
                    description="Try changing your search or create a new department."
                />
            ) : (
                <>
                    <DepartmentTable
                        departments={paginatedDepartments}
                        onEdit={(department) => {
                            setSelectedDepartment(department);
                            setIsEditOpen(true);
                        }}
                        onDelete={(department) => {
                            setSelectedDepartment(department);
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
            <DepartmentModal
                open={isCreateOpen}
                title="Add Department"
                loading={createMutation.isPending}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <DepartmentModal
                open={isEditOpen}
                title="Edit Department"
                department={selectedDepartment}
                loading={updateMutation.isPending}
                onClose={() => {
                    setSelectedDepartment(null);
                    setIsEditOpen(false);
                }}
                onSubmit={handleUpdate}
            />
            <DeleteDepartmentModal
                open={isDeleteOpen}
                department={selectedDepartment}
                loading={deleteMutation.isPending}
                onClose={() => {
                    setSelectedDepartment(null);
                    setIsDeleteOpen(false);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Departments;