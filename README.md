# 🥭 榴莲工具 (Durian Tools)

> 实用工具聚合平台 - 一站式开发者工具集合

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📖 项目简介

榴莲工具是一个现代化的工具聚合平台，为开发者和日常用户提供各种实用工具。采用 Next.js + TypeScript + Tailwind CSS 技术栈，提供流畅的用户体验和响应式设计。

## ✨ 功能特性

### 🎯 已实现功能

- **待办事项管理** - 简洁高效的任务管理工具
- **JSON 格式对比** - 可视化 JSON 数据差异对比
- **JWT 令牌解析** - 解析和验证 JWT 令牌内容
- **主题切换** - 支持亮色/暗色主题
- **响应式设计** - 完美适配桌面和移动设备

### 🚀 即将推出

- 更多实用工具正在开发中...

## 🛠️ 技术栈

- **前端框架**: Next.js 15.4.2
- **开发语言**: TypeScript 5.0
- **UI 框架**: React 19.1.0
- **样式方案**: Tailwind CSS 3.4.1
- **图标库**: FontAwesome 6.7.2
- **主题管理**: next-themes 0.4.6
- **包管理器**: pnpm
- **Node.js**: 20.16.0

## 🚀 快速开始

### 环境要求

- Node.js >= 20.16.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/wupinshuo/durian-tools.git
cd durian-tools

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 使用 Turbopack (更快的构建)
pnpm dev --turbopack
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 📁 项目结构

```
durian-tools/
├── public/                 # 静态资源
│   ├── durian_logo.svg    # 榴莲 Logo
│   └── ...
├── src/                   # 源代码
│   ├── app/              # Next.js App Router
│   │   ├── globals.css   # 全局样式
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 首页
│   └── components/       # React 组件
│       └── layout/       # 布局组件
│           └── Navbar.tsx
├── *.html                # 工具页面 (iframe 嵌入)
├── package.json          # 项目配置
├── tailwind.config.ts    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 项目文档
```

## 🎨 设计理念

### 视觉设计

- **简洁明了**: 界面简洁，功能明确
- **一致性**: 所有工具保持统一的设计语言
- **现代化**: 采用现代 UI 设计趋势
- **可访问性**: 符合 WCAG 2.1 AA 级标准

### 色彩方案

- **主色调**: `#3B82F6` (蓝色)
- **辅助色**: `#10B981` (绿色)、`#EF4444` (红色)
- **中性色**: `#1F2937` (深灰)、`#F3F4F6` (浅灰)
- **榴莲橙**: `#FF9500` (品牌色)

## 🔧 开发指南

### 添加新工具

1. 在根目录创建新的 HTML 文件 (如 `new-tool.html`)
2. 在首页添加工具卡片
3. 更新导航和路由配置

### 样式开发

- 使用 Tailwind CSS 进行样式开发
- 自定义样式在 `src/app/globals.css` 中定义
- 遵循响应式设计原则

### 组件开发

- 所有组件使用 TypeScript
- 遵循 React Hooks 最佳实践
- 保持组件的单一职责原则

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型

- 🐛 Bug 修复
- ✨ 新功能开发
- 📝 文档改进
- 🎨 UI/UX 优化
- ⚡ 性能优化
- 🧪 测试覆盖

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目主页: [GitHub Repository](https://github.com/wupinshuo/durian-tools)
- 问题反馈: [Issues](https://github.com/wupinshuo/durian-tools/issues)
- 功能建议: [Discussions](https://github.com/wupinshuo/durian-tools/discussions)

---

<div align="center">
  <img src="public/durian_logo.svg" alt="榴莲工具" width="64" height="64">
  <br>
  <strong>榴莲工具 © 2025</strong>
  <br>
  <em>让工具使用更简单</em>
</div>
