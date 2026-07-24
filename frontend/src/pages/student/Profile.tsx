import { useState } from "react";

import ErrorState from "../../components/ErrorState";

import ProfileCard from "../../components/profile/ProfileCard";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileSkeleton from "../../components/profile/ProfileSkeleton";

import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";

import type { UpdateProfileData } from "../../types/profile.types";

const Profile = () => {
    const { data: profile, isLoading, isError, refetch } = useProfile();

    const updateMutation = useUpdateProfile();

    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleUpdate = (data: UpdateProfileData) => {
        updateMutation.mutate(data, {
            onSuccess: () => {
                setIsEditOpen(false);
            },
        });
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (isError || !profile) {
        return (
            <ErrorState
                title="Unable to load profile"
                description="Something went wrong while fetching your profile."
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <ProfileCard
                profile={profile}
                onEdit={() => setIsEditOpen(true)}
            />
            <ProfileForm
                open={isEditOpen}
                profile={profile}
                loading={updateMutation.isPending}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleUpdate}
            />
        </div>
    );
};

export default Profile;