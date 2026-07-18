import type { Subject } from "../../types/subject.types";

type Props = {
    subjects: Subject[];
    onEdit: (subject: Subject) => void;
    onDelete: (subject: Subject) => void;
};

const SubjectTable = ({ subjects, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Code</th>
                        <th className="px-4 py-3 text-left">Subject</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-center">Semester</th>
                        <th className="px-4 py-3 text-center">Credits</th>
                        <th className="px-4 py-3 text-left">Faculty</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr
                            key={subject.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">{subject.code}</td>
                            <td className="px-4 py-3 font-medium">{subject.name}</td>
                            <td className="px-4 py-3">{subject.department.name}</td>
                            <td className="px-4 py-3 text-center">{subject.semester}</td>
                            <td className="px-4 py-3 text-center">{subject.credits}</td>
                            <td className="px-4 py-3">
                                {subject.faculty ? subject.faculty.user.name : (
                                    <span className="text-slate-400">Not Assigned</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(subject)}
                                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(subject)}
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

export default SubjectTable;