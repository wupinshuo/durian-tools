"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/ui/ToolCard";
import FirstVisitGuide from "@/components/ui/FirstVisitGuide";
import AlertContainer from "@/components/ui/AlertContainer";
import {
  faCheckCircle,
  faCode,
  faKey,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [currentTool, setCurrentTool] = useState<string>("todo");

  // 在组件挂载时恢复上次使用的工具
  useState(() => {
    if (typeof window !== "undefined") {
      const savedTool = localStorage.getItem("currentTool");
      if (savedTool) {
        setCurrentTool(savedTool);
      }
    }
  });

  // 切换工具
  const switchTool = (tool: string) => {
    setCurrentTool(tool);
    localStorage.setItem("currentTool", tool);
  };

  return (
    <>
      <Navbar />

      <main className="container py-8">
        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div onClick={() => switchTool("todo")}>
            <ToolCard
              title="待办事项"
              description="创建和管理您的待办事项清单"
              icon={faCheckCircle}
              href="/todo"
            />
          </div>

          <div onClick={() => switchTool("json")}>
            <ToolCard
              title="JSON对比"
              description="比较两个JSON数据的差异"
              icon={faCode}
              href="/json"
            />
          </div>

          <div onClick={() => switchTool("jwt")}>
            <ToolCard
              title="JWT解析"
              description="解析JWT令牌的内容"
              icon={faKey}
              href="/jwt"
            />
          </div>

          <ToolCard
            title="更多工具"
            description="即将推出更多实用工具"
            icon={faPlus}
            href="#"
            disabled
          />
        </div>

        {/* 工具预览 */}
        <div className="durian-tool-preview">
          <div className="durian-tool-preview-header">
            <h2 className="durian-tool-preview-title">工具预览</h2>
          </div>
          <div className="durian-tool-preview-content">
            <iframe
              className="w-full h-full border-0"
              src={`/${currentTool}`}
              title={`${currentTool} 工具预览`}
            />
          </div>
        </div>
      </main>

      <Footer />
      <FirstVisitGuide />
      <AlertContainer />
    </>
  );
}
