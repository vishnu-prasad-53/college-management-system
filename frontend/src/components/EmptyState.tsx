type EmptyStateProps = {
    title: string;
    description: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => {
    return (
        <div className="rounded-xl border border-dashed bg-white py-16 text-center shadow-sm">
            <div className="mb-4 text-6xl">📚</div>
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            <p className="mt-2 text-gray-500">{description}</p>
        </div>
    );
};

export default EmptyState;