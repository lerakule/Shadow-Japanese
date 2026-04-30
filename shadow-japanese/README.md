# 🌸 Shadow Japanese - 日语影子阅读练习

一个帮助日语学习者通过"影子跟读法"提升听力、口语和发音能力的 Web 应用。

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 功能特点

### 📚 每日精选内容
- 每日自动展示 3-5 篇日语内容
- 内容来源：内置示例文章（新闻、动漫、影视）
- 每篇内容包含日语标题、正文、中文翻译、配套音频、难度等级

### 🎧 影子跟读练习
- **音频播放控制**：播放/暂停、进度拖拽、速度调节（0.5x/0.75x/1x）
- **录音跟读**：一键开始录音，实时显示录音时长
- **波形可视化**：原音与录音波形对比，直观了解语速差异

### 📝 语法精讲
- 内置每篇文章的语法注释
- 语法点包含：结构说明、接续方式、使用场景、例句
- 预留 AI 语法分析接口（扩展用）

### 📅 完成日历
- 自动记录每日完成状态
- 月历视图展示打卡记录
- 连续打卡天数统计
- LocalStorage 本地存储
- 支持导出/导入 JSON 备份

## 🚀 快速开始

### 安装依赖

```bash
cd shadow-japanese
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
shadow-japanese/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # UI 组件
│   │   ├── AudioPlayer/    # 音频播放器
│   │   ├── Calendar/        # 完成日历
│   │   ├── ContentCard/     # 内容卡片
│   │   ├── Grammar/         # 语法注释
│   │   ├── Recorder/        # 录音组件
│   │   ├── TabBar/          # 底部导航
│   │   └── Waveform/        # 波形可视化
│   ├── context/             # 全局状态管理
│   ├── data/                # 内置内容数据
│   ├── hooks/               # 自定义 Hooks
│   ├── pages/               # 页面组件
│   │   ├── Home/           # 首页
│   │   ├── Practice/       # 练习页
│   │   ├── GrammarPage/     # 语法页
│   │   └── MyProgress/      # 我的进度
│   ├── styles/              # 全局样式
│   ├── utils/               # 工具函数
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 设计风格

采用**简约日式风格**：
- 大量留白，柔和配色
- 类似日语学习教材的质感
- 给人平静、专注的学习氛围

### 配色方案

| 颜色 | 色值 | 用途 |
|------|------|------|
| 墨色 | #2D3436 | 主色 |
| 灰墨 | #636E72 | 辅色 |
| 朱红 | #E17055 | 强调色 |
| 素白 | #FAFAFA | 背景色 |

## 🛠 技术栈

- **React 18** - 组件化开发
- **Vite** - 快速构建
- **CSS Modules** - 样式隔离
- **Web Audio API** - 波形可视化
- **MediaRecorder API** - 浏览器录音
- **LocalStorage** - 本地数据持久化

## 📱 使用说明

### 影子跟读练习步骤

1. **选择内容**：在首页浏览今日精选内容
2. **阅读正文**：查看日语原文和中文翻译
3. **播放音频**：点击播放按钮，可调节播放速度
4. **开始跟读**：点击录音按钮，跟随音频进行跟读
5. **录音保存**：练习完成后保存录音
6. **波形复盘**：查看原音与录音的波形对比
7. **完成标记**：点击完成按钮，记录今日学习

### 数据备份

- **导出数据**：点击"导出备份"下载 JSON 文件
- **导入数据**：点击"导入数据"选择备份文件恢复

## 🔮 未来扩展

- [ ] 接入真实日语新闻 API
- [ ] AI 语法分析功能
- [ ] 录音打分系统
- [ ] 学习数据分析
- [ ] 多设备数据同步

## 📄 License

MIT License
