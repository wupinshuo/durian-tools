"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface InputDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function InputDialog({
  isOpen,
  title,
  message,
  defaultValue = "",
  placeholder = "",
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
}: InputDialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
      // 聚焦输入框并选中文本
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
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
        onKeyDown={handleKeyDown}
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
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={faEdit} className="text-xl" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* 消息内容 */}
        {message && (
          <div className="mb-4">
            <p style={{ color: "var(--text-light)" }}>{message}</p>
          </div>
        )}

        {/* 输入表单 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              className="input w-full"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              {cancelText}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!inputValue.trim()}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}