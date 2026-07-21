import { useQuery } from "@tanstack/react-query";

import { getAllAssignments } from "../services/assignment.service";

export const useAssignments = () => {
    return useQuery({
        queryKey: ["assignments"],
        queryFn: getAllAssignments,
    });
};