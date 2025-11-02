"use client";

import React, { useState, useRef, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Upload,
  Camera,
  Loader2,
  Check,
} from "lucide-react";
import { useAuthState } from "@/lib/store/authStore";
import Image from "next/image";
import { profileSchema } from "@/lib/schemas";
import { useUpdateProfile, useUpdateProfilePic } from "@/lib/query/hooks";
import { toast } from "sonner";

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettingsPage = () => {
  const updateProfileMutation = useUpdateProfile();
  const { mutate: updateAvatar, isPending } = useUpdateProfilePic();
  const { user } = useAuthState();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      username: user?.username || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        username: user.username || "",
      });
    }
  }, [user, reset]);

  // Handle avatar upload
  // const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Validate file size (max 1MB)
  //   if (file.size > 1 * 1024 * 1024) {
  //     alert("File size must be less than 1MB");
  //     return;
  //   }

  //   // Validate file type
  //   if (!file.type.startsWith("image/")) {
  //     alert("Please upload an image file");
  //     return;
  //   }

  //   try {
  //     setIsUploadingAvatar(true);

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAvatarPreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);

  //     // TODO: Upload to your API
  //     const formData = new FormData();
  //     formData.append("avatar", file);

  //     // const response = await apiClient.patch('/users/profile/avatar', formData);

  //     console.log("Avatar uploaded:", file);

  //     // Show success message
  //     setTimeout(() => {
  //       setIsUploadingAvatar(false);
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Error uploading avatar:", error);
  //     setIsUploadingAvatar(false);
  //   }
  // };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    updateAvatar(file);
  };

  // Handle profile update
  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      updateProfileMutation.mutate(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Profile Information
        </h2>
        <p className="text-slate-600">
          Update your personal details and profile picture
        </p>
      </div>

      {/* Avatar Section */}
      <div className="mb-8 pb-8 border-b border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">
          Profile Picture
        </label>

        <div className="flex items-center space-x-6">
          {/* Avatar Display */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-4 border-white shadow-lg">
              {avatarPreview || user?.profilePic?.path ? (
                <Image
                  src={avatarPreview || user?.profilePic?.path || ""}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <span>
                  {user?.firstname?.[0]}
                  {user?.lastname?.[0]}
                </span>
              )}
            </div>

            {isPending && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Upload Buttons */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4" />
                <span>Change Photo</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              JPG, PNG or GIF. Max size 1MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("firstname")}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-gray-500"
                placeholder="John"
              />
            </div>
            {errors.firstname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstname.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("lastname")}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-gray-500"
                placeholder="Doe"
              />
            </div>
            {errors.lastname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>

        {/* Username & Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("username")}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-gray-500"
                placeholder="e.g johndoe"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("phone")}
                type="tel"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all text-gray-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register("email")}
              type="email"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              disabled
            />
            {user?.isEmailVerified && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Email cannot be changed directly. Contact support if needed.
          </p>
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Bio <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 outline-none transition-all resize-none text-gray-500"
            placeholder="Tell us a bit about yourself..."
          />
          <p className="mt-1 text-xs text-slate-500">
            {watch("bio")?.length || 0} / 500 characters
          </p>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
