# CLAUDE.md - 榴莲工具项目指南

## 项目概述

榴莲工具 (Durian Tools) 是一个实用工具聚合平台，采用 Next.js + TypeScript + Tailwind CSS 技术栈构建。项目提供多种开发和日常使用的工具，包括待办事项管理、JSON 对比、JWT 解析、CSV 查询等功能。

## 技术栈信息

- **框架**: Next.js 15.4.2 (App Router)
- **语言**: TypeScript 5.0
- **UI框架**: React 19.1.0
- **样式**: Tailwind CSS 3.4.1
- **主题**: next-themes 0.4.6 (支持暗色/亮色模式)
- **图标**: FontAwesome 6.7.2
- **包管理器**: pnpm
- **特殊功能**:
  - 拖拽排序: @dnd-kit
  - CSV解析: papaparse 5.5.3
  - 图片导出: html2canvas 1.4.1
- **部署**: Cloudflare Pages (使用 @opennextjs/cloudflare)

## 开发命令

```bash
# 开发环境 (推荐使用 Turbopack)
pnpm dev

# 类型检查
pnpm run lint

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# Cloudflare 预览
pnpm preview

# Cloudflare 部署
pnpm deploy
```

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── csv/page.tsx       # CSV查询工具
│   ├── json/page.tsx      # JSON对比工具
│   ├── jwt/page.tsx       # JWT解析工具
│   ├── todo/page.tsx      # 待办事项工具
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
├── components/
│   ├── layout/           # 布局组件
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── ui/              # UI 组件
│   │   ├── Alert.tsx
│   │   ├── AlertContainer.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── FirstVisitGuide.tsx
│   │   ├── InputDialog.tsx
│   │   └── ToolCard.tsx
│   └── ThemeProvider.tsx # 主题提供者
└── types/
    └── global.d.ts      # 全局类型定义
```

## 核心功能特性

### 已实现的工具

1. **待办事项管理** (`/todo`)
   - 任务创建、编辑、删除
   - 拖拽排序功能
   - 任务归档
   - 本地存储持久化

2. **JSON 对比工具** (`/json`)
   - 可视化JSON差异对比
   - 语法高亮
   - 格式化显示

3. **JWT 解析工具** (`/jwt`)
   - JWT令牌解析
   - Header/Payload/Signature显示
   - 验证功能

4. **CSV 查询工具** (`/csv`)
   - 本地文件上传解析
   - 智能字段排序（数字/字符串）
   - 字段显示/隐藏控制
   - 分页浏览 (25/50/100/200)
   - 导出表格为图片
   - 数据统计信息

### 主题与样式

- 支持暗色/亮色主题切换
- 响应式设计，适配桌面和移动设备
- 使用 CSS 变量定义主题色彩
- FontAwesome 图标集成

## 开发指南

### 添加新工具

1. 在 `src/app/` 下创建新目录和 `page.tsx`
2. 在首页 `src/app/page.tsx` 添加 ToolCard
3. 在导航栏 `src/components/layout/Navbar.tsx` 添加链接

### 样式开发

- 主要使用 Tailwind CSS 类名
- 自定义CSS变量在 `globals.css` 中定义
- 响应式断点: sm/md/lg/xl

### 组件开发原则

- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 保持组件单一职责
- 使用 FontAwesome 图标库

## 配置文件说明

- `tailwind.config.ts`: Tailwind CSS 配置，包含自定义主题变量
- `tsconfig.json`: TypeScript 配置，使用 `@/*` 路径映射
- `package.json`: 项目依赖和脚本命令

## 部署说明

项目支持 Cloudflare Pages 部署：
- 使用 `@opennextjs/cloudflare` 适配器
- 运行 `pnpm deploy` 进行部署
- 支持预览模式 `pnpm preview`

## 注意事项

- 项目使用中文作为主要语言
- 默认主题为暗色模式
- FontAwesome 配置为防止图标闪烁
- 使用 suppressHydrationWarning 处理主题水合问题