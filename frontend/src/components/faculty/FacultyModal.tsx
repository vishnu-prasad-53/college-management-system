import { useEffect, useState } from "react";
import type {
    Faculty,
    CreateFacultyData,
} from "../../types/faculty.types";

type FacultyModalProps = {
    open: boolean;
    title: string;
    faculty?: Faculty | null;
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateFacultyData) => void;
};

const FacultyModal = ({ open, title, faculty, loading, onClose, onSubmit }: FacultyModalProps) => {
    const [form, setForm] = useState<CreateFacultyData>({
        name: "",
        email: "",
        departmentId: 1,
        designation: "",
    });

    useEffect(() => {
        if (faculty) {
            setForm({
                name: faculty.user.name,
                email: faculty.user.email,
                departmentId: faculty.departmentId,
                designation: faculty.designation,
            });
        } else {
            setForm({
                name: "",
                email: "",
                departmentId: 1,
                designation: "",
            });
        }
    }, [faculty, open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Faculty Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="w-full rounded border p-3"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        disabled={!!faculty}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="w-full rounded border p-3"
                    />
                    <input
                        type="number"
                        placeholder="Department ID"
                        value={form.departmentId}
                        onChange={(e) =>
                            setForm({ ...form, departmentId: Number(e.target.value) })
                        }
                        className="w-full rounded border p-3"
                    />
                    <input
                        type="text"
                        placeholder="Designation"
                        value={form.designation}
                        onChange={(e) =>
                            setForm({ ...form, designation: e.target.value })
                        }
                        className="w-full rounded border p-3"
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded border px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => onSubmit(form)}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultyModal;