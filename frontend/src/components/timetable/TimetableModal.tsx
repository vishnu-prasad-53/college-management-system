import { useEffect, useState } from "react";

import type { Timetable, CreateTimetableData } from "../../types/timetable.types";

type Department = {
    id: number;
    name: string;
};

type Subject = {
    id: number;
    name: string;
};

type Faculty = {
    id: number;
    user: {
        name: string;
    };
};

type Props = {
    open: boolean;
    title: string;
    timetable?: Timetable | null;
    departments: Department[];
    subjects: Subject[];
    faculty: Faculty[];
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTimetableData) => void;
};

const TimetableModal = ({ open, title, timetable, departments, subjects, faculty, loading, onClose, onSubmit }: Props) => {
    const [formData, setFormData] =
        useState<CreateTimetableData>({
            departmentId: 0,
            subjectId: 0,
            facultyId: 0,
            semester: 1,
            dayOfWeek: "",
            startTime: "",
            endTime: "",
            roomNumber: "",
        });

    useEffect(() => {
        if (timetable) {
            setFormData({
                departmentId: timetable.departmentId,
                subjectId: timetable.subjectId,
                facultyId: timetable.facultyId,
                semester: timetable.semester,
                dayOfWeek: timetable.dayOfWeek,
                startTime: timetable.startTime,
                endTime: timetable.endTime,
                roomNumber: timetable.roomNumber,
            });
        } else {
            setFormData({
                departmentId: 0,
                subjectId: 0,
                facultyId: 0,
                semester: 1,
                dayOfWeek: "",
                startTime: "",
                endTime: "",
                roomNumber: "",
            });
        }
    }, [timetable]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">{title}</h2>
                <div className="space-y-4">
                    <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value={0}>Select Department</option>
                        {departments.map((department) => (
                            <option
                                key={department.id}
                                value={department.id}
                            >
                                {department.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={formData.subjectId}
                        onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value={0}>Select Subject</option>
                        {subjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.id}
                            >
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={formData.facultyId}
                        onChange={(e) => setFormData({ ...formData, facultyId: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    >
                        <option value={0}>Select Faculty</option>
                        {faculty.map((member) => (
                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.user.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min={1}
                        max={8}
                        placeholder="Semester"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                        className="w-full rounded-lg border p-3"
                    />
                    <input
                        type="text"
                        placeholder="Day (Monday, Tuesday...)"
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="rounded-lg border p-3"
                        />
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="rounded-lg border p-3"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Room Number"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        className="w-full rounded-lg border p-3"
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-300 px-5 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => onSubmit(formData)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimetableModal;