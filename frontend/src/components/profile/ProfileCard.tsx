import type { StudentProfile } from "../../types/profile.types";

type Props = {
    profile: StudentProfile;
    onEdit: () => void;
};

const ProfileCard = ({ profile, onEdit }: Props) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Student Profile</h2>
                <button
                    onClick={onEdit}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Edit Profile
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-medium">{profile.user.name}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{profile.user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">USN</p>
                    <p className="font-medium">{profile.usn}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Department</p>
                    <p className="font-medium">{profile.department.name}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Semester</p>
                    <p className="font-medium">{profile.semester}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Section</p>
                    <p className="font-medium">{profile.section}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium">{profile.address}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;