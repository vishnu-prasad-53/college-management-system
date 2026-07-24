import api from "../api/axios";

import type { StudentProfile, UpdateProfileData } from "../types/profile.types";

export const getProfile = async (): Promise<StudentProfile> => {
    const { data } = await api.get("/profile");

    return data;
};

export const updateProfile = async (profile: UpdateProfileData): Promise<StudentProfile> => {
    const { data } = await api.put("/profile", profile);

    return data;
};