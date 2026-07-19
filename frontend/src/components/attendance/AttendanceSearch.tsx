type Props = {
    value: string;
    onChange: (value: string) => void;
};

const AttendanceSearch = ({ value, onChange }: Props) => {
    return (
        <input
            type="text"
            placeholder="Search by student or subject..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />
    );
};

export default AttendanceSearch;