import { useQuery } from "@tanstack/react-query";

import { getStudents } from "../services/student.service";

export const useStudents = () => {
    return useQuery({
        queryKey: ["students"],
        queryFn: getStudents,
    });
};