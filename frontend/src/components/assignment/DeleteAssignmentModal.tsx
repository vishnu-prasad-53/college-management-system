import type { Assignment } from "../../types/assignment.types";

type Props = {
    open: boolean;
    assignment: Assignment | null;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteAssignmentModal = ({ open, assignment, loading, onClose, onConfirm }: Props) => {
    if (!open || !assignment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-red-600">Delete Assignment</h2>
                <p className="mt-4 text-slate-600">Are you sure you want to delete{" "}<strong>{assignment.title}</strong>?</p>
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

export default DeleteAssignmentModal;