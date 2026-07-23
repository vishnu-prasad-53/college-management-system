import { useEffect, useState } from "react";

import type { Announcement, CreateAnnouncementData } from "../../types/announcement.types";

type Department = {
    id: number;
    name: string;
};

type Props = {
    open: boolean;
    title: string;
    announcement?: Announcement | null;
    departments: Department[];
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAnnouncementData) => void;
};

const AnnouncementModal = ({ open, title, announcement, departments, loading, onClose, onSubmit }: Props) => {
    const [formData, setFormData] =
        useState<CreateAnnouncementData>({
            title: "",
            content: "",
            postedBy: 0,
            departmentId: null,
            audience: "all",
            priority: "normal",
            expiryDate: null,
        });

    useEffect(() => {
        if (announcement) {
            setFormData({
                title: announcement.title,
                content: announcement.content,
                postedBy: announcement.postedBy,
                departmentId: announcement.departmentId,
                audience: announcement.audience,
                priority: announcement.priority,
                expiryDate: announcement.expiryDate,
            });
        } else {
            setFormData({
                title: "",
                content: "",
                postedBy: 0,
                departmentId: null,
                audience: "all",
                priority: "normal",
                expiryDate: null,
            });
        }
    }, [announcement]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Announcement Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <textarea
                        rows={5}
                        placeholder="Announcement Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <select
                        value={formData.departmentId ?? ""}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value ? Number(e.target.value) : null })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="">All Departments</option>
                        {departments.map((department) => (
                            <option
                                key={department.id}
                                value={department.id}
                            >
                                {department.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={formData.audience}
                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="all">All</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                    <input
                        type="date"
                        value={formData.expiryDate ?? ""}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value || null })}
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

export default AnnouncementModal;