import { useEffect, useState } from "react";

import type { Assignment, CreateAssignmentData } from "../../types/assignment.types";

type Subject = {
    id: number;
    name: string;
};

type Faculty = {
    id: number;
    user: {
        name: string;
    };
};

type Props = {
    open: boolean;
    title: string;
    assignment?: Assignment | null;
    subjects: Subject[];
    faculty: Faculty[];
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAssignmentData) => void;
};

const AssignmentModal = ({ open, title, assignment, subjects, faculty, loading, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState<CreateAssignmentData>({
        subjectId: 0,
        facultyId: 0,
        title: "",
        description: "",
        dueDate: "",
        maxMarks: 100,
    });

    useEffect(() => {
        if (assignment) {
            setFormData({
                subjectId: assignment.subjectId,
                facultyId: assignment.facultyId,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate.split("T")[0],
                maxMarks: assignment.maxMarks,
            });
        } else {
            setFormData({
                subjectId: 0,
                facultyId: 0,
                title: "",
                description: "",
                dueDate: "",
                maxMarks: 100,
            });
        }
    }, [assignment]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                <div className="space-y-4">
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
                    <select
                        value={formData.facultyId}
                        onChange={(e) => setFormData({ ...formData, facultyId: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value={0}>Select Faculty</option>
                        {faculty.map((member) => (
                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.user.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Assignment Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <textarea
                        placeholder="Description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="number"
                        placeholder="Maximum Marks"
                        value={formData.maxMarks}
                        onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
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

export default AssignmentModal;