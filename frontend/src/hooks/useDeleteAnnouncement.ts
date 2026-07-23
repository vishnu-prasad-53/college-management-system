import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAnnouncement } from "../services/announcement.service";

export const useDeleteAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAnnouncement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["announcements"],
            });
        },
    });
};