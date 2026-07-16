import type { Faculty } from "../../types/faculty.types";

type FacultyTableProps = {
    faculty: Faculty[];
    onEdit: (faculty: Faculty) => void;
    onDelete: (faculty: Faculty) => void;
};

const FacultyTable = ({ faculty, onEdit, onDelete }: FacultyTableProps) => {
    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Department</th>
                        <th className="px-6 py-4 text-left">Designation</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {faculty.map((member) => (
                        <tr
                            key={member.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-6 py-4">
                                {member.user.name}
                            </td>
                            <td className="px-6 py-4">
                                {member.user.email}
                            </td>
                            <td className="px-6 py-4">
                                {member.department.name}
                            </td>
                            <td className="px-6 py-4">
                                {member.designation}
                            </td>
                            <td className="space-x-2 px-6 py-4 text-center">
                                <button
                                    onClick={() => onEdit(member)}
                                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(member)}
                                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacultyTable;