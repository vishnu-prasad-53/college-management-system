import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../services/department.service";

export const useDepartments = () => {
    return useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    });
};