import { useQuery } from "@tanstack/react-query";
import { getAllFaculty } from "../services/faculty.service";

export const useFaculty = () => {
    return useQuery({
        queryKey: ["faculty"],
        queryFn: getAllFaculty,
    });
};