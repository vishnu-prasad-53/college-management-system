import type { Marks } from "../../types/marks.types";

type Props = {
    marks: Marks[];
    onEdit: (mark: Marks) => void;
    onDelete: (mark: Marks) => void;
};

const MarksTable = ({ marks, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">USN</th>
                        <th className="px-4 py-3 text-left">Subject</th>
                        <th className="px-4 py-3 text-left">Internal</th>
                        <th className="px-4 py-3 text-left">External</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Grade</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {marks.map((mark) => (
                        <tr
                            key={mark.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">{mark.student.user.name}</td>
                            <td className="px-4 py-3">{mark.student.usn}</td>
                            <td className="px-4 py-3">{mark.subject.name}</td>
                            <td className="px-4 py-3">{mark.internalMarks}</td>
                            <td className="px-4 py-3">{mark.externalMarks}</td>
                            <td className="px-4 py-3 font-semibold">{mark.totalMarks}</td>
                            <td className="px-4 py-3"><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">{mark.grade}</span></td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(mark)}
                                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(mark)}
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

export default MarksTable;