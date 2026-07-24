import { useEffect, useState } from "react";

import type { StudentProfile, UpdateProfileData } from "../../types/profile.types";

type Props = {
    open: boolean;
    profile: StudentProfile | null;
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateProfileData) => void;
};

const ProfileForm = ({ open, profile, loading, onClose, onSubmit }: Props) => {
    const [formData, setFormData] =
        useState<UpdateProfileData>({
            name: "",
            phone: "",
            address: "",
        });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.user.name,
                phone: profile.phone,
                address: profile.address,
            });
        }
    }, [profile]);

    if (!open || !profile) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">Edit Profile</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <textarea
                        rows={4}
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;