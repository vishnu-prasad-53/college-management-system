import type { Timetable } from "../../types/timetable.types";

type Props = {
    timetable: Timetable[];
    onEdit: (record: Timetable) => void;
    onDelete: (record: Timetable) => void;
};

const TimetableTable = ({ timetable, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Subject</th>
                        <th className="px-4 py-3 text-left">Faculty</th>
                        <th className="px-4 py-3 text-center">Semester</th>
                        <th className="px-4 py-3 text-center">Day</th>
                        <th className="px-4 py-3 text-center">Time</th>
                        <th className="px-4 py-3 text-center">Room</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {timetable.map((record) => (
                        <tr
                            key={record.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">{record.department.name}</td>
                            <td className="px-4 py-3">{record.subject.name}</td>
                            <td className="px-4 py-3">{record.faculty.user.name}</td>
                            <td className="px-4 py-3 text-center">{record.semester}</td>
                            <td className="px-4 py-3 text-center">{record.dayOfWeek}</td>
                            <td className="px-4 py-3 text-center">{record.startTime} - {record.endTime}</td>
                            <td className="px-4 py-3 text-center">{record.roomNumber}</td>
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

export default TimetableTable;