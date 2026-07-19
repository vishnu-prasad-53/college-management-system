import type { Attendance } from "../../types/attendance.types";

type Props = {
    attendance: Attendance[];
    onEdit: (attendance: Attendance) => void;
    onDelete: (attendance: Attendance) => void;
};

const AttendanceTable = ({ attendance, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">USN</th>
                        <th className="px-4 py-3 text-left">Subject</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((record) => (
                        <tr
                            key={record.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">{record.student.user.name}</td>
                            <td className="px-4 py-3">{record.student.usn}</td>
                            <td className="px-4 py-3">{record.subject.name}</td>
                            <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-medium ${record.status === "present"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(record)}
                                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(record)}
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

export default AttendanceTable;