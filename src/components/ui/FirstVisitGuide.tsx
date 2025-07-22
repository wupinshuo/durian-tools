"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCode,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

export default function FirstVisitGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查是否是首次访问
    const isFirstVisit = localStorage.getItem("visited") !== "true";
    if (isFirstVisit) {
      setVisible(true);
    }
  }, []);

  const closeGuide = () => {
    setVisible(false);
    localStorage.setItem("visited", "true");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="rounded-lg p-8 shadow-lg"
        style={{ backgroundColor: "var(--background)", maxWidth: "28rem" }}
      >
        <h2 className="text-xl font-bold mb-4">欢迎使用工具聚合网站</h2>
        <p className="mb-4">
          这是一个集合多种实用工具的平台，目前包含以下功能：
        </p>
        <ul className="mb-4 ml-4">
          <li className="mb-2 flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-primary mr-2"
            />
            <span>待办事项管理</span>
          </li>
          <li className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faCode} className="text-primary mr-2" />
            <span>JSON格式对比</span>
          </li>
          <li className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faKey} className="text-primary mr-2" />
            <span>JWT令牌解析</span>
          </li>
        </ul>
        <p className="mb-4">点击工具卡片即可开始使用对应的工具。</p>
        <button onClick={closeGuide} className="btn btn-primary w-full">
          开始使用
        </button>
      </div>
    </div>
  );
}
