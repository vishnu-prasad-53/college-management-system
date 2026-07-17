type Props = {
    value: string;
    onChange: (value: string) => void;
};

const DepartmentSearch = ({ value, onChange }: Props) => {
    return (
        <div className="flex justify-between items-center">
            <input
                type="text"
                placeholder="Search by department name or code..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
        </div>
    );
};

export default DepartmentSearch;