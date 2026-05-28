# my-habit-app 项目开发指南

##  项目概述

每日习惯打卡应用 - 基于 uni-app Vue 3 开发的跨平台习惯追踪应用

### 核心功能
- **今日** - 按时间段分组的习惯打卡
- **全部** - 习惯管理与数据统计
- **番茄钟** - 专注计时功能
- **我的** - 个人中心与设置

## ️ 技术栈

- **框架**: uni-app (Vue 3 + Composition API)
- **语言**: TypeScript
- **构建工具**: Vite 5.2
- **UI 组件**: Wot Design Uni
- **图标**: IconPark (字节跳动开源)
- **样式**: SCSS (`sass@1.100.0` + `sass-loader@14`)
- **状态管理**: Pinia (待实现)
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
├── store/              # Pinia 状态管理
│   ── modules/
│       ├── habits.ts   # 习惯数据
│       └── user.ts     # 用户数据
├── api/                # API 接口
├── utils/              # 工具函数
├── static/             # 静态资源
│   └── tabbar/        # TabBar 图标
├── App.vue             # 应用根组件
├── main.js             # 入口文件
└── pages.json          # 页面配置
```

## 🎨 设计规范

### 颜色主题
- 主色调：`#7ec699` (治愈绿)
- 马卡龙色系：
  - 粉色：`#ffb6c1`
  - 紫色：`#c4b5fd`
  - 蓝色：`#a8d8d8`
  - 黄色：`#f9e5b5`
  - 绿色：`#a8d8c9`
  - 橙色：`#ffd6a5`

### 尺寸单位
- 使用 `rpx` 进行响应式布局
- 1rpx = 0.5px (750 设计稿)

### 图标风格
- 使用 IconPark 图标库
- 圆形图标 + 描边
- 统一的圆角风格

## 📝 开发规范

### 组件开发
- 使用 Vue 3 Composition API (`<script setup>`)
- 使用 `ref`、`computed`、`watch` 等响应式 API
- 样式使用 `<style lang="scss" scoped>`

### 页面开发流程
1. 在 `src/pages/` 下创建页面文件夹
2. 创建 `index.vue` 文件
3. 在 `pages.json` 中注册页面
4. 配置 tabBar（如需要）

### 状态管理
- 习惯数据统一存储在 Pinia
- 使用本地存储持久化
- 模块化管理：`habits`、`user`

### 提交规范
- 功能：`feat: 添加 xxx 功能`
- 修复：`fix: 修复 xxx 问题`
- 样式：`style: 调整 xxx 样式`
- 重构：`refactor: 重构 xxx 模块`

## 🚀 开发命令

```bash
# 安装依赖
yarn install

# 开发 H5
yarn dev:h5

# 构建 H5
yarn build:h5

# 开发微信小程序
yarn dev:mp-weixin

# 构建微信小程序
yarn build:mp-weixin

# 开发 App
yarn dev:app-plus

# 构建 App
yarn build:app-plus
```

## ✅ 已完成

- [x] 创建 Vue 3 项目（uni-app + Vite）
- [x] 安装 Wot UI 组件库
- [x] 安装 IconPark 图标库
- [x] 配置全局主题色（马卡龙色系）
- [x] 创建基础页面结构（今日、全部、番茄钟、我的）
- [x] 配置底部 TabBar
- [x] 实现基础交互动效（按钮点击、打卡切换）

## 📋 待办事项

### 近期目标
- [ ] 实现习惯数据管理（Pinia + 本地存储）
- [ ] 完善番茄钟计时功能（正计时/倒计时切换）
- [ ] 实现习惯打卡成功动画
- [ ] 替换 TabBar 图标为真实图标
- [ ] 添加 Wot UI 的 Toast 提示组件

### 中期目标
- [ ] 添加习惯数据统计图表
- [ ] 实现成就徽章系统
- [ ] 添加提醒通知功能
- [ ] 数据同步功能

## 🔗 参考资源

- [uni-app Vue 3 文档](https://uniapp.dcloud.net.cn/)
- [Wot Design Uni 组件库](https://wot-ui.cn)
- [IconPark 图标库](https://iconpark.oceanengine.com)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
