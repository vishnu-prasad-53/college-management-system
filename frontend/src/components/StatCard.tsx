type StatCardProps = {
    title: string;
    value: number;
};

const StatCard = ({
    title,
    value,
}: StatCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default StatCard;