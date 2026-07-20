import { useEffect, useState } from "react";

import type { Marks, CreateMarksData } from "../../types/marks.types";

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
    marks?: Marks | null;
    students: Student[];
    subjects: Subject[];
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateMarksData) => void;
};

const MarksModal = ({ open, title, marks, students, subjects, loading, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState<CreateMarksData>({
        studentId: 0,
        subjectId: 0,
        internalMarks: 0,
        externalMarks: 0,
        totalMarks: 0,
        grade: "",
    });

    useEffect(() => {
        if (marks) {
            setFormData({
                studentId: marks.studentId,
                subjectId: marks.subjectId,
                internalMarks: marks.internalMarks,
                externalMarks: marks.externalMarks,
                totalMarks: marks.totalMarks,
                grade: marks.grade,
            });
        } else {
            setFormData({
                studentId: 0,
                subjectId: 0,
                internalMarks: 0,
                externalMarks: 0,
                totalMarks: 0,
                grade: "",
            });
        }
    }, [marks]);

    useEffect(() => {
        const total =
            Number(formData.internalMarks) +
            Number(formData.externalMarks);

        let grade = "F";

        if (total >= 90) grade = "A+";
        else if (total >= 80) grade = "A";
        else if (total >= 70) grade = "B+";
        else if (total >= 60) grade = "B";
        else if (total >= 50) grade = "C";
        else if (total >= 40) grade = "D";

        setFormData((prev) => ({
            ...prev,
            totalMarks: total,
            grade,
        }));
    }, [formData.internalMarks, formData.externalMarks]);

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
                        type="number"
                        placeholder="Internal Marks"
                        value={formData.internalMarks}
                        onChange={(e) => setFormData({ ...formData, internalMarks: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="number"
                        placeholder="External Marks"
                        value={formData.externalMarks}
                        onChange={(e) => setFormData({ ...formData, externalMarks: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="number"
                        value={formData.totalMarks}
                        readOnly
                        className="w-full rounded-lg border bg-slate-100 p-3"
                    />
                    <input
                        type="text"
                        value={formData.grade}
                        readOnly
                        className="w-full rounded-lg border bg-slate-100 p-3"
                    />
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

export default MarksModal;