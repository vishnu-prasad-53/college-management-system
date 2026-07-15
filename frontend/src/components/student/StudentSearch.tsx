type StudentSearchProps = {
    value: string;
    onChange: (value: string) => void;
};

const StudentSearch = ({ value, onChange }: StudentSearchProps) => {
    return (
        <div className="mb-6">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by name, email or USN..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default StudentSearch;