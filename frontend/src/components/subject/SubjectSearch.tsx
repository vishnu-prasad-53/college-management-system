type Props = {
    value: string;
    onChange: (value: string) => void;
};

const SubjectSearch = ({ value, onChange }: Props) => {
    return (
        <input
            type="text"
            placeholder="Search by subject name, code..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
    );
};

export default SubjectSearch;