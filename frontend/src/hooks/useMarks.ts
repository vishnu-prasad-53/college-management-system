import { useQuery } from "@tanstack/react-query";

import { getAllMarks } from "../services/marks.service";

export const useMarks = () => {
    return useQuery({
        queryKey: ["marks"],
        queryFn: getAllMarks,
    });
};