import { useQuery } from "@tanstack/react-query";

import { getAllTimetable } from "../services/timetable.service";

export const useTimetable = () => {
    return useQuery({
        queryKey: ["timetable"],
        queryFn: getAllTimetable,
    });
};