import { useEffect, useState } from "react";

import type { Attendance, AttendanceStatus, CreateAttendanceData } from "../../types/attendance.types";

type Student = {
    id: number;
    user: {
        name: string;
    };
};

type Subject = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    title: string;
    attendance?: Attendance | null;
    students: Student[];
    subjects: Subject[];
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAttendanceData) => void;
};

const AttendanceModal = ({ open, title, attendance, students, subjects, loading, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState<CreateAttendanceData>({
        studentId: 0,
        subjectId: 0,
        date: "",
        status: "present",
    });

    useEffect(() => {
        if (attendance) {
            setFormData({
                studentId: attendance.studentId,
                subjectId: attendance.subjectId,
                date: attendance.date.split("T")[0],
                status: attendance.status,
            });
        } else {
            setFormData({
                studentId: 0,
                subjectId: 0,
                date: "",
                status: "present",
            });
        }
    }, [attendance]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                <div className="space-y-4">
                    <select
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value={0}>Select Student</option>
                        {students.map((student) => (
                            <option
                                key={student.id}
                                value={student.id}
                            >
                                {student.user.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={formData.subjectId}
                        onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value={0}>Select Subject</option>
                        {subjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.id}
                            >
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceStatus })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-300 px-5 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => onSubmit(formData)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;