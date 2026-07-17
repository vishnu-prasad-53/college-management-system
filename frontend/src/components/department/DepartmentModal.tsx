import { useEffect, useState } from "react";
import type { Department, CreateDepartmentData } from "../../types/department.types";

type Props = {
    open: boolean;
    title: string;
    loading: boolean;
    department?: Department | null;
    onClose: () => void;
    onSubmit: (data: CreateDepartmentData) => void;
};

const DepartmentModal = ({ open, title, loading, department, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState<CreateDepartmentData>({
        name: "",
        code: "",
    });

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                code: department.code,
            });
        } else {
            setFormData({
                name: "",
                code: "",
            });
        }
    }, [department, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">Department Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-lg border p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Department Code</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full rounded-lg border p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentModal;