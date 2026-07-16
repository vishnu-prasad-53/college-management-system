import type { Faculty } from "../../types/faculty.types";

type DeleteFacultyModalProps = {
    open: boolean;
    faculty: Faculty | null;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteFacultyModal = ({ open, faculty, loading, onClose, onConfirm }: DeleteFacultyModalProps) => {
    if (!open || !faculty) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-2xl font-semibold">Delete Faculty</h2>
                <p className="mt-4">Are you sure you want to delete<strong> {faculty.user.name}</strong>?</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded border px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteFacultyModal;