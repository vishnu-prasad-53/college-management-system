import type { Assignment } from "../../types/assignment.types";

type Props = {
    assignments: Assignment[];
    onEdit: (assignment: Assignment) => void;
    onDelete: (assignment: Assignment) => void;
};

const AssignmentTable = ({ assignments, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Subject</th>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Due Date</th>
                        <th className="px-4 py-3 text-left">Max Marks</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr
                            key={assignment.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">{assignment.subject.name}</td>
                            <td className="px-4 py-3">{assignment.title}</td>
                            <td className="px-4 py-3">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">{assignment.maxMarks}</td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(assignment)}
                                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(assignment)}
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

export default AssignmentTable;