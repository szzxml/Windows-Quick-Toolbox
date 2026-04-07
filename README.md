# Windows Quick Toolbox

一个基于 Electron、Vue 3 和 TypeScript 的 Windows 桌面工具箱，用来把常用系统维护操作集中到一个 Fluent 风格界面里。

## 项目简介

`Windows Quick Toolbox` 面向日常 Windows 运维和开发环境整理场景，当前版本已经集成环境变量管理、Hosts 编辑、系统信息查看、临时文件清理、进程管理、网络诊断，以及若干系统控制台和控制面板快捷入口。

应用采用 Electron 主进程 + Vue 渲染进程架构，桌面能力通过 IPC 暴露给前端，适合继续扩展更多本机管理能力。

## 功能特性

- 环境变量管理
  - 查看用户变量和系统变量
  - 新增、编辑、删除环境变量
  - 对 `PATH` 提供可视化条目编辑
- 系统工具入口
  - 快速打开设备管理器、服务管理、磁盘管理、事件查看器、系统信息等
- 控制面板快捷入口
  - 快速跳转网络连接、防火墙、电源选项、程序和功能、系统属性、Windows 更新
- 高级工具
  - 直接读取和保存 `hosts` 文件
  - 实时展示 CPU、内存、磁盘概况
  - 扫描常见临时目录并按目录清理
  - 查看高占用进程并结束指定进程
  - 执行 `ipconfig /flushdns` 与 `ipconfig /all`
- 权限处理
  - 涉及系统级修改时会触发管理员授权

## 技术栈

- Electron
- Vue 3
- TypeScript
- Pinia
- Vue Router
- electron-vite
- electron-builder
- PowerShell
- systeminformation

## 运行环境

- Windows 10 或 Windows 11
- Node.js 20+，建议配合 npm 10+
- 部分功能需要管理员权限

## 快速开始

```bash
npm install
npm run dev
```

开发模式会启动 Electron 应用。

## 常用命令

```bash
npm run dev
npm run typecheck
npm run build
npm run dist
```

- `npm run dev`：启动本地开发环境
- `npm run typecheck`：执行前后端 TypeScript 类型检查
- `npm run build`：构建 Electron 主进程、预加载和渲染进程产物
- `npm run dist`：使用 `electron-builder` 生成 Windows 安装包

## 项目结构

```text
.
├─ electron/            # Electron 主进程、IPC 注册、系统服务
├─ src/                 # Vue 渲染进程源码
│  ├─ components/       # 通用 UI、布局和共享组件
│  ├─ composables/      # 组合式逻辑
│  ├─ stores/           # Pinia 状态管理
│  ├─ views/            # 页面与高级工具视图
│  └─ assets/styles/    # 主题和基础样式
├─ resources/           # 静态资源
├─ electron.vite.config.ts
└─ package.json
```

## 权限说明

- 修改系统环境变量时，需要管理员授权。
- 保存 `hosts` 文件时，需要管理员授权。
- 打开部分系统控制台或注册表编辑器时，会以提升权限方式启动。

如果只使用查询类功能，例如系统信息、进程查看、读取网络配置，通常不需要额外授权。

## 打包说明

项目已经配置 `electron-builder`，默认输出目录为 `release/`，当前目标平台为 Windows `nsis x64`。

## 后续可扩展方向

- 增加系统服务启停、计划任务、注册表模板等更深层工具
- 为危险操作补充确认弹窗和操作日志
- 增加自动化测试与 CI 发布流程

## 许可证

MIT

## 致谢

[LINUX DO 社区](https://linux.do/)
