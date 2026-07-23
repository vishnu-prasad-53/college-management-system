import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAnnouncement } from "../services/announcement.service";

export const useCreateAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAnnouncement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["announcements"],
            });
        },
    });
};