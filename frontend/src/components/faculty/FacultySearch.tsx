type FacultySearchProps = {
    value: string;
    onChange: (value: string) => void;
};

const FacultySearch = ({ value, onChange }: FacultySearchProps) => {
    return (
        <input
            type="text"
            placeholder="Search faculty..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

export default FacultySearch;