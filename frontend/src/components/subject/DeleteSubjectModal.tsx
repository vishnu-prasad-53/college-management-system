import type { Subject } from "../../types/subject.types";

type Props = {
    open: boolean;
    subject: Subject | null;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteSubjectModal = ({ open, subject, loading, onClose, onConfirm }: Props) => {
    if (!open || !subject) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-red-600">Delete Subject</h2>
                <p className="mt-4 text-slate-600">Are you sure you want to delete{" "}<span className="font-semibold">{subject.name}</span>?</p>
                <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-300 px-5 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSubjectModal;