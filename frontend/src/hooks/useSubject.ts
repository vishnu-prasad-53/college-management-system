import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../services/subject.service";

export const useSubjects = () => {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: getSubjects,
    });
};