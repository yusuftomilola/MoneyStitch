// app/admin/users/[id]/edit/page.tsx
"use client";

import { useUser } from "@/lib/query/hooks/users/useUser";
import { useUpdateUser } from "@/lib/query/hooks/users/useUpdateUser";
import { useUpdateUserProfilePicture } from "@/lib/query/hooks/users/useAdminUpdateUserProfilePicture";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  X,
  User as UserIcon,
  Mail,
  Phone,
  AtSign,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Suspense } from "react";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: user, isLoading: userLoading, isError } = useUser({ userId });
  const updateUser = useUpdateUser();
  const updateProfilePicture = useUpdateUserProfilePicture();

  // Form state
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Profile picture state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("error", "Please select an image file");
        return;
      }

      // Validate file size (1MB max)
      if (file.size > 1 * 1024 * 1024) {
        showToast("error", "Image size should be less than 1MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!firstname.trim() || !lastname.trim()) {
      showToast("error", "First name and last name are required");
      return;
    }

    try {
      // Update profile picture if a new one was selected
      if (selectedFile) {
        await updateProfilePicture.mutateAsync({
          userId,
          file: selectedFile,
        });
      }

      // Update user profile
      await updateUser.mutateAsync({
        userId,
        data: {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          username: username.trim() || undefined,
          phone: phone.trim() || undefined,
          bio: bio.trim() || undefined,
        },
      });

      showToast("success", "User profile updated successfully!");

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/users/${userId}`);
      }, 1500);
    } catch (error: any) {
      showToast("error", error.message || "Failed to update user profile");
    }
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2ECC71] border-t-transparent"></div>
          <p className="mt-4 text-[#1A1A40] font-medium">Loading user...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1A1A40] mb-2">
              User Not Found
            </h3>
            <p className="text-gray-600 mb-4">Unable to load user details.</p>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = updateUser.isPending || updateProfilePicture.isPending;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Toast Notification */}
          {toast.show && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
              <div
                className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg ${
                  toast.type === "success"
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <p
                  className={`font-medium ${
                    toast.type === "success" ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {toast.message}
                </p>
                <button
                  onClick={() => setToast({ ...toast, show: false })}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/admin/users/${userId}`}
              className="inline-flex items-center gap-2 text-[#1A1A40] hover:text-[#2ECC71] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to User Details</span>
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A40]">
                  Edit User Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Update information for {user.firstname} {user.lastname}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1A1A40] mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#2ECC71]" />
                Profile Picture
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Current/Preview Avatar */}
                <div className="flex-shrink-0">
                  {previewUrl || user.profilePic?.path ? (
                    <Image
                      src={previewUrl || user.profilePic!.path!}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="rounded-full object-cover border-4 border-gray-200 w-30
                      h-30"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1A1A40] to-[#2a2a60] border-4 border-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {getInitials(user.firstname, user.lastname)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="profile-picture"
                  />
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <label
                        htmlFor="profile-picture"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-lg font-medium transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </label>
                      {(previewUrl || selectedFile) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      JPG, PNG or GIF. Max size 1MB.
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-green-600 font-medium">
                        ✓ New image selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1A1A40] mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#2ECC71]" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-[#1A1A40] mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-[#202020] placeholder:text-gray-400"
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-[#1A1A40] mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-[#202020] placeholder:text-gray-400"
                    placeholder="Doe"
                  />
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#1A1A40] mb-2"
                  >
                    <AtSign className="w-4 h-4 inline mr-1" />
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-[#202020] placeholder:text-gray-400"
                    placeholder="johndoe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#1A1A40] mb-2"
                  >
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-[#202020] placeholder:text-gray-400"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-[#1A1A40] mb-2"
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none resize-none text-[#202020] placeholder:text-gray-400"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Read-Only Information */}
            <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Read-Only Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {user.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">User ID:</span>{" "}
                  <span className="font-mono text-xs text-gray-900">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href={`/admin/users/${userId}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#1A1A40] rounded-lg font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Suspense>
  );
}
