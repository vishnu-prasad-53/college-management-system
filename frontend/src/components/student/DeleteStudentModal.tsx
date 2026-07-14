import type { Student } from "../../types/student.types";

type DeleteStudentModalProps = {
    open: boolean;
    student?: Student | null;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteStudentModal = ({ open, student, loading = false, onClose, onConfirm }: DeleteStudentModalProps) => {
    if (!open || !student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-red-600">Delete Student</h2>
                <p className="mt-4 text-gray-600">Are you sure you want to delete{" "}<span className="font-semibold">{student.user.name}</span>?</p>
                <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteStudentModal;