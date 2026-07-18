import { useEffect, useState } from "react";

import type { Subject, CreateSubjectData } from "../../types/subject.types";
import type { Department } from "../../types/department.types";
import type { Faculty } from "../../types/faculty.types";

type Props = {
    open: boolean;
    title: string;
    subject?: Subject | null;
    departments: Department[];
    faculties: Faculty[];
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateSubjectData) => void;
};

const SubjectModal = ({ open, title, subject, departments, faculties, loading, onClose, onSubmit }: Props) => {
    const [form, setForm] = useState<CreateSubjectData>({
        name: "",
        code: "",
        semester: 1,
        credits: 4,
        departmentId: 0,
        facultyId: null,
    });

    useEffect(() => {
        if (subject) {
            setForm({
                name: subject.name,
                code: subject.code,
                semester: subject.semester,
                credits: subject.credits,
                departmentId: subject.departmentId,
                facultyId: subject.facultyId,
            });
        } else {
            setForm({
                name: "",
                code: "",
                semester: 1,
                credits: 4,
                departmentId: 0,
                facultyId: null,
            });
        }
    }, [subject, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Subject Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border p-3"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject Code"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        className="w-full rounded-lg border p-3"
                        required
                    />
                    <select
                        value={form.departmentId}
                        onChange={(e) => setForm({ ...form, departmentId: Number(e.target.value), })}
                        className="w-full rounded-lg border p-3"
                        required
                    >
                        <option value={0}>Select Department</option>
                        {departments.map((department) => (<option key={department.id} value={department.id}>{department.name}</option>))}
                    </select>
                    <select
                        value={form.facultyId ?? ""}
                        onChange={(e) => setForm({ ...form, facultyId: e.target.value ? Number(e.target.value) : null })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="">Select Faculty</option>
                        {faculties.map((faculty) => (
                            <option
                                key={faculty.id}
                                value={faculty.id}
                            >
                                {faculty.user.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min={1}
                        max={8}
                        placeholder="Semester"
                        value={form.semester}
                        onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="number"
                        min={1}
                        max={10}
                        placeholder="Credits"
                        value={form.credits}
                        onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-300 px-5 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubjectModal;