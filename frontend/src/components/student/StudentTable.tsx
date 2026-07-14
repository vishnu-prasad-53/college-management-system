import type { Student } from "../../types/student.types";

type StudentTableProps = {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
};

const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => {
    return (
        <div className="overflow-x-auto rounded-lg border bg-white shadow">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">USN</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Semester</th>
                        <th className="px-4 py-3 text-left">CGPA</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="py-8 text-center text-gray-500"
                            >
                                No students found.
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr
                                key={student.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">
                                    {student.user.name}
                                </td>
                                <td className="px-4 py-3">
                                    {student.user.email}
                                </td>
                                <td className="px-4 py-3">
                                    {student.usn}
                                </td>
                                <td className="px-4 py-3">
                                    {student.department.name}
                                </td>
                                <td className="px-4 py-3">
                                    {student.semester}
                                </td>
                                <td className="px-4 py-3">
                                    {student.cgpa}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(student)}
                                            className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(student)}
                                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;