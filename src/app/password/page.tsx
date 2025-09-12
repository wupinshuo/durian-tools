"use client";

import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faRefresh,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
}

export default function PasswordPage() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // 生成密码的字符集
  const generateCharacterSet = useCallback((opts: PasswordOptions) => {
    let chars = "";
    if (opts.includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (opts.includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts.includeNumbers) chars += "0123456789";
    if (opts.includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    return chars;
  }, []);

  // 生成密码
  const generatePassword = useCallback(
    (opts: PasswordOptions) => {
      const chars = generateCharacterSet(opts);
      if (chars === "") return "";

      let result = "";
      for (let i = 0; i < opts.length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    [generateCharacterSet]
  );

  // 更新选项并生成新密码
  const updateOptions = useCallback(
    (newOptions: Partial<PasswordOptions>) => {
      const updatedOptions = { ...options, ...newOptions };
      setOptions(updatedOptions);
      const newPassword = generatePassword(updatedOptions);
      setPassword(newPassword);
    },
    [options, generatePassword]
  );

  // 初始生成密码
  useEffect(() => {
    const initialPassword = generatePassword(options);
    setPassword(initialPassword);
  }, []);

  // 复制密码到剪贴板
  const copyPassword = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      if (window.showAlert) {
        window.showAlert("密码已复制到剪贴板", "success");
      }
    } catch (error) {
      if (window.showAlert) {
        window.showAlert("复制失败", "error");
      }
    }
  };

  // 重新生成密码
  const regeneratePassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);

    if (window.showAlert) {
      window.showAlert("已生成新密码", "success");
    }
  };

  // 检查是否至少选择了一个字符类型
  const hasValidOptions =
    options.includeLowercase ||
    options.includeUppercase ||
    options.includeNumbers ||
    options.includeSymbols;

  return (
    <>
      <Navbar />
      <div className="container py-4 flex-1">
        <div className="mx-auto" style={{ maxWidth: "36rem" }}>
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">随机密码</h1>
          </div>

          {/* 密码类型选择 */}
          {/* <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">密码类型</h2>
            <div
              className="p-1 border border-border rounded-lg"
              style={{ backgroundColor: "var(--background-alt)" }}
            >
              <div className="p-3 rounded-md bg-primary text-white text-center">
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                随机密码
              </div>
            </div>
          </div> */}

          {/* 密码长度设置 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">自定义密码设置</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">长度</label>
                <div className="bg-white dark:bg-gray-800 border border-border rounded-lg px-3 py-1 min-w-[3rem] text-center text-lg font-semibold">
                  {options.length}
                </div>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                value={options.length}
                onChange={(e) =>
                  updateOptions({ length: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${
                    ((options.length - 4) / (64 - 4)) * 100
                  }%, #e5e7eb ${
                    ((options.length - 4) / (64 - 4)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>
          </div>

          {/* 字符类型开关 */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex items-center justify-between p-3 border border-border rounded-lg"
                style={{ backgroundColor: "var(--background-alt)" }}
              >
                <span className="font-medium">数字</span>
                <button
                  type="button"
                  onClick={() =>
                    updateOptions({ includeNumbers: !options.includeNumbers })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    options.includeNumbers
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      options.includeNumbers
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div
                className="flex items-center justify-between p-3 border border-border rounded-lg"
                style={{ backgroundColor: "var(--background-alt)" }}
              >
                <span className="font-medium">符号</span>
                <button
                  type="button"
                  onClick={() =>
                    updateOptions({ includeSymbols: !options.includeSymbols })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    options.includeSymbols
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      options.includeSymbols
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div
                className="flex items-center justify-between p-3 border border-border rounded-lg"
                style={{ backgroundColor: "var(--background-alt)" }}
              >
                <span className="font-medium">大写字母</span>
                <button
                  type="button"
                  onClick={() =>
                    updateOptions({
                      includeUppercase: !options.includeUppercase,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    options.includeUppercase
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      options.includeUppercase
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div
                className="flex items-center justify-between p-3 border border-border rounded-lg"
                style={{ backgroundColor: "var(--background-alt)" }}
              >
                <span className="font-medium">小写字母</span>
                <button
                  type="button"
                  onClick={() =>
                    updateOptions({
                      includeLowercase: !options.includeLowercase,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    options.includeLowercase
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      options.includeLowercase
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 密码显示区域 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">生成的密码</h2>
            {hasValidOptions ? (
              <div
                className="p-4 border border-border rounded-lg text-center"
                style={{ backgroundColor: "var(--background-alt)" }}
              >
                <div
                  className="text-lg font-mono break-all mb-4 min-h-[2rem] flex items-center justify-center"
                  style={{ color: "var(--text)" }}
                >
                  {password || "点击生成密码"}
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={copyPassword}
                    disabled={!password}
                    className={`btn ${
                      copied ? "btn-secondary" : "btn-primary"
                    } disabled:opacity-50 disabled:cursor-not-allowed min-w-[6rem]`}
                  >
                    <FontAwesomeIcon
                      icon={copied ? faCheck : faCopy}
                      className="mr-2"
                    />
                    {copied ? "已复制" : "复制密码"}
                  </button>

                  <button
                    type="button"
                    onClick={regeneratePassword}
                    disabled={!password}
                    className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
                    重新生成
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="p-4 border border-border rounded-lg text-center"
                style={{ backgroundColor: "var(--background-alt)" }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-4xl mb-3 text-red-500"
                />
                <p className="text-red-500 mb-2">请至少选择一种字符类型</p>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  数字、符号、大写字母或小写字母
                </p>
              </div>
            )}
          </div>

          {/* 使用说明 */}
          <div
            className="border border-border rounded-lg p-4"
            style={{ backgroundColor: "var(--background-alt)" }}
          >
            <h3 className="text-md font-semibold mb-3">使用说明</h3>
            <div
              className="text-sm space-y-2"
              style={{ color: "var(--text-light)" }}
            >
              <p>
                <strong>密码安全建议：</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>建议使用至少12位长度的密码</li>
                <li>包含数字、字母（大小写）和特殊符号</li>
                <li>不要在多个账户使用相同密码</li>
                <li>定期更新重要账户的密码</li>
              </ul>
              <p className="mt-3">
                <strong>功能特点：</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>实时生成：修改任何设置都会自动生成新密码</li>
                <li>灵活配置：可自由选择字符类型和长度</li>
                <li>一键复制：生成的密码可直接复制使用</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
