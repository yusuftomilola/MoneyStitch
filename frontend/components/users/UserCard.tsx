// components/users/UserCard.tsx
import { User } from "@/lib/types/user";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  User as UserIcon,
  ExternalLink,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (user: User) => {
    if (user.isSuspended) return "bg-red-50 text-red-700 border-red-200";
    if (!user.isActive) return "bg-gray-50 text-gray-700 border-gray-200";
    if (!user.isEmailVerified)
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const getStatusText = (user: User) => {
    if (user.isSuspended) return "Suspended";
    if (!user.isActive) return "Inactive";
    if (!user.isEmailVerified) return "Unverified";
    return "Active";
  };

  const getStatusIcon = (user: User) => {
    if (user.isSuspended) return <XCircle className="w-4 h-4 text-red-600" />;
    if (!user.isActive) return <Clock className="w-4 h-4 text-gray-600" />;
    if (!user.isEmailVerified)
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Card Header with Gradient */}
      <div className="h-24 bg-gradient-to-r from-[#2ECC71] via-[#27AE60] to-[#229954] relative">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      {/* User Avatar - Overlapping Header */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="inline-block">
          {user.profilePic?.path ? (
            <Image
              src={user.profilePic.path}
              alt={`${user.firstname} ${user.lastname}`}
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1A1A40] to-[#2a2a60] border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials(user.firstname, user.lastname)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 pt-4 pb-6">
        {/* Name and Username */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#1A1A40] mb-1">
            {user.firstname} {user.lastname}
          </h3>
          {user.username && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <UserIcon className="w-3 h-3" />@{user.username}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <Mail className="w-4 h-4 text-[#2ECC71] mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 break-all">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
              <span className="text-gray-600">{user.phone}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic border-l-2 border-[#F1C40F] pl-3">
            {user.bio}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Role Badge */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Role
            </span>
            <span
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                user.role === "admin"
                  ? "bg-gradient-to-r from-[#F1C40F] to-[#F39C12] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Status</span>
            <span
              className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                user
              )}`}
            >
              {getStatusIcon(user)}
              {getStatusText(user)}
            </span>
          </div>
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <Calendar className="w-3.5 h-3.5" />
          <span>Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/admin/users/${user.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#229954] text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View</span>
          </Link>
          <Link
            href={`/admin/users/${user.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#1A1A40] hover:bg-[#1A1A40] text-[#1A1A40] hover:text-white rounded-lg font-medium transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
