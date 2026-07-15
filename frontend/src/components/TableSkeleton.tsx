const TableSkeleton = () => {
    return (
        <div className="animate-pulse rounded-xl border bg-white p-6 shadow">
            <div className="mb-6 h-8 w-48 rounded bg-gray-200"></div>
            <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-12 rounded bg-gray-200"
                    />
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;