# my-habit-app 项目开发指南

##  项目概述

每日习惯打卡应用 - 基于 uni-app 开发的跨平台习惯追踪应用

### 核心功能
- **今日** - 按时间段分组的习惯打卡
- **全部** - 习惯管理与数据统计
- **番茄钟** - 专注计时功能
- **我的** - 个人中心与设置

##  技术栈

- **框架**: uni-app (Vue 2)
- **语言**: TypeScript
- **样式**: Less (`less@4.6.4` + `less-loader@11`)
- **状态管理**: Vuex
- **目标平台**: H5、小程序、App

## 📁 项目结构

```
src/
├── pages/              # 页面目录
│   ├── index/         # 今日（首页）
│   ├── habits/        # 习惯管理
│   ├── pomodoro/      # 番茄钟
│   └── mine/          # 我的
├── components/         # 公共组件
├── store/              # Vuex 状态管理
│   └── modules/
│       ├── habits.ts   # 习惯数据
│       └── user.ts     # 用户数据
├── api/                # API 接口
├── utils/              # 工具函数
├── static/             # 静态资源
│   └── tabbar/        # TabBar 图标
├── main.ts             # 入口文件
├── App.vue             # 应用根组件
└── pages.json          # 页面配置
```

## 🎨 设计规范

### 颜色主题
- 主色调：`#07c160` (微信绿)
- 辅助色：马卡龙色系（粉、紫、蓝、黄）
- 背景：`#F8F8F8`

### 尺寸单位
- 使用 `rpx` 进行响应式布局
- 1rpx = 0.5px (750 设计稿)

### 图标风格
- 圆形图标 + 描边
- Emoji 占位，后续替换为真实图标

## 📝 开发规范

### 组件开发
- 使用 `Vue.extend()` 定义组件
- TypeScript 使用 `<script lang="ts">`
- 模板使用 `<template>`
- 样式使用 `<style lang="less">`

### 页面开发流程
1. 在 `src/pages/` 下创建页面文件夹
2. 创建 `index.vue` 文件
3. 在 `pages.json` 中注册页面
4. 配置 tabBar（如需要）

### 状态管理
- 习惯数据统一存储在 Vuex
- 使用本地存储持久化
- 模块化管理：`habits`、`user`

### 提交规范
- 功能：`feat: 添加 xxx 功能`
- 修复：`fix: 修复 xxx 问题`
- 样式：`style: 调整 xxx 样式`
- 重构：`refactor: 重构 xxx 模块`

## 🚀 开发命令

```bash
# 开发 H5
yarn serve
# 或
yarn dev:h5

# 构建 H5
yarn build

# 构建小程序
yarn dev:mp-weixin
yarn build:mp-weixin

# 构建 App
yarn dev:app-plus
yarn build:app-plus
```

##  待办事项

### 已完成 ✅
- [x] 创建基础页面结构（今日、全部、番茄钟、我的）
- [x] 配置底部 TabBar
- [x] 安装并配置 Less 预处理器
- [x] 创建 AGENTS.md 开发文档

### 近期目标
- [ ] 实现习惯数据管理（Vuex + 本地存储）
- [ ] 实现番茄钟计时功能（正计时/倒计时）
- [ ] 实现习惯打卡交互
- [ ] 替换 TabBar 图标为真实图标

### 中期目标
- [ ] 添加习惯数据统计图表
- [ ] 实现成就徽章系统
- [ ] 添加提醒通知功能
- [ ] 数据同步功能

## 🔗 参考资源

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [uni-app AI 开发助手](https://uniapp.dcloud.net.cn/ai/)
- [Vue 2 文档](https://v2.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
