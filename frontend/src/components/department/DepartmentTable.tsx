import type { Department } from "../../types/department.types";

type Props = {
    departments: Department[];
    onEdit: (department: Department) => void;
    onDelete: (department: Department) => void;
};

const DepartmentTable = ({ departments, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Code</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department) => (
                        <tr
                            key={department.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-6 py-4">{department.name}</td>
                            <td className="px-6 py-4">{department.code}</td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() =>
                                            onEdit(department)
                                        }
                                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            onDelete(department)
                                        }
                                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentTable;