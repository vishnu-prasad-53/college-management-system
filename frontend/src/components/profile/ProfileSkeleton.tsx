const ProfileSkeleton = () => {
    return (
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8 h-8 w-56 rounded bg-slate-200" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                        <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
                        <div className="h-6 w-full rounded bg-slate-200" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileSkeleton;