// components/common/ConfirmDeleteModal.tsx
"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  message?: string;
  itemName?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete User",
  message = "Are you sure you want to delete this user? This action cannot be undone.",
  itemName,
}: ConfirmDeleteModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        {!isDeleting && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-[#1A1A40] mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-gray-600 mb-2">{message}</p>

          {/* Item Name (if provided) */}
          {itemName && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-center">
                <span className="text-gray-600">User: </span>
                <span className="font-semibold text-red-700">{itemName}</span>
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6">
            <p className="text-xs text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. All user
              data will be permanently deleted.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete User</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal outside of the current DOM hierarchy
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
