import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAnnouncement } from "../services/announcement.service";

import type { UpdateAnnouncementData } from "../types/announcement.types";

type UpdateAnnouncementPayload = {
    id: number;
    data: UpdateAnnouncementData;
};

export const useUpdateAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateAnnouncementPayload) => updateAnnouncement(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["announcements"],
            });
        },
    });
};