// components/users/UserTableRow.tsx
"use client";
import { useState } from "react";
import { User } from "@/lib/types/user";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  ExternalLink,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";
import { useDeleteUser } from "@/lib/query/hooks/users/useDeleteUser";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  const deleteUser = useDeleteUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (user: User) => {
    if (user.isSuspended) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3" />
          Suspended
        </span>
      );
    }
    if (!user.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          <Clock className="w-3 h-3" />
          Inactive
        </span>
      );
    }
    if (!user.isEmailVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
          <AlertCircle className="w-3 h-3" />
          Unverified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        <CheckCircle className="w-3 h-3" />
        Verified
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F1C40F] to-[#F39C12] text-white">
          ADMIN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
        USER
      </span>
    );
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser.mutateAsync({ userId: user.id });
      // Close modal
      setIsDeleteModalOpen(false);
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        isDeleting={deleteUser.isPending}
        itemName={`${user.firstname} ${user.lastname}`}
      />

      <tr className="hover:bg-gray-50 transition-colors">
        {/* User Info */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.profilePic?.path ? (
                <Image
                  src={user.profilePic.path}
                  alt={`${user.firstname} ${user.lastname}`}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1A40] to-[#2a2a60] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {getInitials(user.firstname, user.lastname)}
                  </span>
                </div>
              )}
            </div>
            {/* Name and Username */}
            <div>
              <div className="font-medium text-[#1A1A40]">
                {user.firstname} {user.lastname}
              </div>
              {user.username && (
                <div className="text-xs text-gray-500">@{user.username}</div>
              )}
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <Mail className="w-3.5 h-3.5 text-[#2ECC71] flex-shrink-0" />
              <span className="truncate max-w-[200px]" title={user.email}>
                {user.email}
              </span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Phone className="w-3.5 h-3.5 text-[#2ECC71] flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </td>

        {/* Role */}
        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

        {/* Status */}
        <td className="px-6 py-4">{getStatusBadge(user)}</td>

        {/* Joined Date */}
        <td className="px-6 py-4 text-sm text-gray-600">
          {format(new Date(user.createdAt), "MMM dd, yyyy")}
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/users/${user.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2ECC71] hover:bg-[#27AE60] text-white text-xs font-medium rounded-md transition-colors"
              title="View Details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </Link>
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#1A1A40] hover:bg-[#1A1A40] text-[#1A1A40] hover:text-white text-xs font-medium rounded-md transition-colors"
              title="Edit User"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Link>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleteUser.isPending}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-colors border border-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Delete User"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
