type ErrorStateProps = {
    title: string;
    description: string;
    onRetry: () => void;
};

const ErrorState = ({ title, description, onRetry }: ErrorStateProps) => {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 py-16 text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="text-2xl font-semibold text-red-700">{title}</h2>
            <p className="mt-2 text-red-500">{description}</p>
            <button
                onClick={onRetry}
                className="mt-6 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
                Retry
            </button>
        </div>
    );
};

export default ErrorState;