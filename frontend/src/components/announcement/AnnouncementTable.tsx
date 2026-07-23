import type { Announcement } from "../../types/announcement.types";

type Props = {
    announcements: Announcement[];
    onEdit: (announcement: Announcement) => void;
    onDelete: (announcement: Announcement) => void;
};

const AnnouncementTable = ({ announcements, onEdit, onDelete }: Props) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Audience</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-center">Priority</th>
                        <th className="px-4 py-3 text-center">Expiry Date</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => (
                        <tr
                            key={announcement.id}
                            className="border-t hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">{announcement.title}</td>
                            <td className="px-4 py-3">{announcement.audience}</td>
                            <td className="px-4 py-3">{announcement.department?.name ?? "-"}</td>
                            <td className="px-4 py-3 text-center">{announcement.priority}</td>
                            <td className="px-4 py-3 text-center">{announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleDateString() : "-"}</td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(announcement)}
                                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(announcement)}
                                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnnouncementTable;