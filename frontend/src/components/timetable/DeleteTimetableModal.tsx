import type { Timetable } from "../../types/timetable.types";

type Props = {
    open: boolean;
    timetable: Timetable | null;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteTimetableModal = ({ open, timetable, loading, onClose, onConfirm }: Props) => {
    if (!open || !timetable) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-red-600">Delete Timetable</h2>
                <p className="mt-4 text-slate-600">Are you sure you want to delete the timetable entry for{" "}<strong>{timetable.subject.name}</strong> on{" "}<strong>{timetable.dayOfWeek}</strong>?</p>
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

export default DeleteTimetableModal;