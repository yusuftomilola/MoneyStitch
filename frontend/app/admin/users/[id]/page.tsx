// app/admin/users/[id]/page.tsx
"use client";

import { useUser } from "@/lib/query/hooks/users/useUser";
import { useDeleteUser } from "@/lib/query/hooks/users/useDeleteUser";
import { useSuspendUser, useActivateUser } from "@/lib/query/hooks";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  Ban,
  CheckCheck,
  User as UserIcon,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();

  const handleSuspendUser = async () => {
    suspendUser.mutate(userId);
  };

  const handleActivateUser = async () => {
    activateUser.mutateAsync(userId);
  };

  const { data: user, isLoading, isError } = useUser({ userId });
  const deleteUser = useDeleteUser();

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteUser = async () => {
    try {
      await deleteUser.mutateAsync({ userId });
      // Close modal
      setIsDeleteModalOpen(false);
      // Wait a moment for the toast to show
      setTimeout(() => {
        // Redirect to users list
        router.push("/admin/users");
      }, 1000);
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to delete user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2ECC71] border-t-transparent"></div>
          <p className="mt-4 text-[#1A1A40] font-medium">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
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

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getStatusInfo = () => {
    if (user.isSuspended) {
      return {
        icon: <XCircle className="w-5 h-5" />,
        text: "Suspended",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      };
    }
    if (!user.isActive) {
      return {
        icon: <Clock className="w-5 h-5" />,
        text: "Inactive",
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
      };
    }
    if (!user.isEmailVerified) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        text: "Unverified",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
      };
    }
    return {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Active",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          isDeleting={deleteUser.isPending}
          itemName={`${user.firstname} ${user.lastname}`}
        />

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-[#1A1A40] hover:text-[#2ECC71] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Users</span>
          </Link>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
          {/* Cover/Header Background */}
          <div className="h-32 bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#229954]"></div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  {user.profilePic?.path ? (
                    <Image
                      src={user.profilePic.path}
                      alt={`${user.firstname} ${user.lastname}`}
                      width={128}
                      height={128}
                      className="rounded-full object-cover border-4 border-white shadow-lg w-30
                      h-30"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1A1A40] to-[#2a2a60] border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {getInitials(user.firstname, user.lastname)}
                      </span>
                    </div>
                  )}

                  {/* Status Badge on Avatar */}
                  {/* <div
                    className={`absolute bottom-2 right-2 p-2 rounded-full ${statusInfo.bgColor} border-2 border-white shadow-md`}
                  >
                    {statusInfo.icon}
                  </div> */}
                </div>

                {/* Name and Username */}
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-[#1A1A40] mb-1">
                    {user.firstname} {user.lastname}
                  </h1>
                  {user.username && (
                    <p className="text-gray-600 flex items-center gap-1 justify-center sm:justify-start">
                      <UserIcon className="w-4 h-4" />@{user.username}
                    </p>
                  )}
                  <div
                    className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full border ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}`}
                  >
                    {statusInfo.icon}
                    <span className="font-medium text-sm">
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end mt-4 md:mt-0">
                <Link
                  href={`/admin/users/${user.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  Edit User
                </Link>

                {user.isSuspended ? (
                  <button
                    onClick={handleActivateUser}
                    disabled={activateUser.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    {activateUser.isPending ? "Activating..." : "Activate"}
                  </button>
                ) : (
                  <button
                    onClick={handleSuspendUser}
                    disabled={suspendUser.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    {suspendUser.isPending ? "Suspending..." : "Suspend"}
                  </button>
                )}

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleteUser.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteUser.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#F1C40F]">
                <p className="text-gray-700 italic">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1A1A40] mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-[#2ECC71]" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Email
                  </p>
                  <p className="text-gray-900 font-medium break-all">
                    {user.email}
                  </p>
                  {user.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {user.phone && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Phone
                    </p>
                    <p className="text-gray-900 font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Role
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-gradient-to-r from-[#F1C40F] to-[#F39C12] text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <LinkIcon className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    User ID
                  </p>
                  <p className="text-gray-900 font-mono text-sm break-all">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1A1A40] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2ECC71]" />
              Account Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      user.isActive ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    {user.isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Account Active
                    </p>
                    <p className="text-xs text-gray-500">
                      User can access the platform
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {user.isActive ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      user.isEmailVerified ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    {user.isEmailVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Email Verified
                    </p>
                    <p className="text-xs text-gray-500">
                      Email address confirmed
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isEmailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isEmailVerified ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      user.isSuspended ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {user.isSuspended ? (
                      <Ban className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCheck className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Suspended
                    </p>
                    <p className="text-xs text-gray-500">
                      Account suspension status
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isSuspended
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.isSuspended ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      user.isDeleted ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {user.isDeleted ? (
                      <Trash2 className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Deleted</p>
                    <p className="text-xs text-gray-500">Soft delete status</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isDeleted
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.isDeleted ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1A1A40] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2ECC71]" />
            Activity Timeline
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <p className="font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-500">
                  {format(
                    new Date(user.createdAt),
                    "MMMM dd, yyyy 'at' hh:mm a"
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(user.createdAt), "EEEE")} •{" "}
                  {Math.floor(
                    (Date.now() - new Date(user.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days ago
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                {user.deletedAt && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-6">
                <p className="font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {format(
                    new Date(user.updatedAt),
                    "MMMM dd, yyyy 'at' hh:mm a"
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(user.updatedAt), "EEEE")} •{" "}
                  {Math.floor(
                    (Date.now() - new Date(user.updatedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days ago
                </p>
              </div>
            </div>

            {user.deletedAt && (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Account Deleted</p>
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(user.deletedAt),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(user.deletedAt), "EEEE")} •{" "}
                    {Math.floor(
                      (Date.now() - new Date(user.deletedAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days ago
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
