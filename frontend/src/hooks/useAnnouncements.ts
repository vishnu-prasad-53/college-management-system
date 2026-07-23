import { useQuery } from "@tanstack/react-query";

import { getAllAnnouncements } from "../services/announcement.service";

export const useAnnouncements = () => {
    return useQuery({
        queryKey: ["announcements"],
        queryFn: getAllAnnouncements,
    });
};