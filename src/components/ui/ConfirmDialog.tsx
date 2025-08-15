"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "btn btn-danger";
      case "warning":
        return "btn btn-secondary";
      case "info":
        return "btn btn-primary";
      default:
        return "btn btn-secondary";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="relative p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onCancel}
          aria-label="关闭"
        >
          <FontAwesomeIcon
            icon={faTimes}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          />
        </button>

        {/* 图标和标题 */}
        <div className="flex items-center mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              type === "danger"
                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                : type === "warning"
                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
            }`}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* 消息内容 */}
        <div className="mb-6">
          <p style={{ color: "var(--text-light)" }}>{message}</p>
        </div>

        {/* 按钮组 */}
        <div className="flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={getConfirmButtonClass()} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}