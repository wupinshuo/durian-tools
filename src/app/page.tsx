import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/ui/ToolCard";
import FirstVisitGuide from "@/components/ui/FirstVisitGuide";
import AlertContainer from "@/components/ui/AlertContainer";
import {
  faCheckCircle,
  faCode,
  faKey,
  faTable,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="container py-8 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">榴莲工具</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            实用工具聚合平台，提供多种开发和日常工具
          </p>
        </div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ToolCard
            title="待办事项"
            description="创建和管理您的待办事项清单"
            icon={faCheckCircle}
            href="/todo"
          />

          <ToolCard
            title="JSON对比"
            description="比较两个JSON数据的差异"
            icon={faCode}
            href="/json"
          />

          <ToolCard
            title="JWT解析"
            description="解析JWT令牌的内容"
            icon={faKey}
            href="/jwt"
          />

          <ToolCard
            title="CSV查询"
            description="上传并查询CSV文件数据"
            icon={faTable}
            href="/csv"
          />

          <ToolCard
            title="更多工具"
            description="即将推出更多实用工具"
            icon={faPlus}
            href="#"
            disabled
          />
        </div>
      </main>

      <Footer />
      <FirstVisitGuide />
      <AlertContainer />
    </>
  );
}
