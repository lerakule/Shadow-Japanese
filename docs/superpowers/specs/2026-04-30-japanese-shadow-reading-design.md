# 日语影子阅读练习应用 - 设计文档

**创建日期**：2026-04-30  
**版本**：v1.0

---

## 1. 项目概述

### 1.1 项目名称
**Shadow Japanese** - 日语影子阅读练习助手

### 1.2 核心价值
帮助日语学习者通过"影子跟读法"提升听力、口语和发音能力，提供沉浸式、专注的学习体验。

### 1.3 目标用户
- N5-N3 级别日语学习者
- 希望提升口语表达能力的学习者
- 喜欢新闻/影视学日语的用户

---

## 2. 功能模块

### 2.1 每日精选内容
- 每日自动展示 3-5 篇日语内容
- 内容来源：内置示例文章（新闻、影视片段）
- 每篇内容包含：
  - 日语标题和正文
  - 中文翻译（可选显示）
  - 配套音频 mp3
  - 预估阅读时间（2分钟左右）
  - 难度等级标签（N5/N4/N3）

### 2.2 影子跟读练习
- **音频播放控制**：
  - 播放/暂停/停止
  - 进度条拖拽
  - 播放速度调节（0.5x / 0.75x / 1x）
  - 循环播放（单句/全文）
- **录音跟读**：
  - 一键开始录音
  - 实时显示录音时长
  - 支持暂停/继续录音
  - 自动保存录音

### 2.3 录音复盘
- **波形可视化对比**：
  - 原音音频波形
  - 用户跟读音频波形
  - 时间轴对齐显示
- **录音历史**：
  - 保存每次练习录音
  - 支持回听历史录音
  - 记录练习日期和内容
- **复盘面板**：
  - 播放原音
  - 播放用户录音
  - 并排对比播放

### 2.4 语法精讲
- 内置每篇文章的语法注释
- 语法点支持：
  - 语法结构说明
  - 接续方式
  - 使用场景
  - 例句
- 预留 AI 语法分析接口（扩展用）

### 2.5 完成日历与激励
- **完成记录**：
  - 自动记录每日完成状态
  - 标记完成/未完成
- **日历展示**：
  - 月历视图
  - 完成日高亮显示
  - 连续打卡天数统计
- **数据管理**：
  - LocalStorage 本地存储
  - 支持导出 JSON 备份
  - 支持导入恢复

---

## 3. 技术架构

### 3.1 技术栈
| 技术 | 选择 | 说明 |
|------|------|------|
| 前端框架 | React 18 | 组件化开发 |
| 构建工具 | Vite | 快速构建 |
| 样式方案 | CSS Modules + CSS Variables |  scoped 样式 |
| 音频处理 | Web Audio API | 波形可视化 |
| 录音 | MediaRecorder API | 浏览器录音 |
| 存储 | LocalStorage | 本地数据持久化 |
| 状态管理 | React Context + useReducer | 轻量级状态 |

### 3.2 项目结构
```
src/
├── components/          # UI 组件
│   ├── AudioPlayer/     # 音频播放器
│   ├── Recorder/        # 录音组件
│   ├── Waveform/        # 波形可视化
│   ├── Calendar/        # 完成日历
│   └── Grammar/         # 语法注释
├── pages/               # 页面组件
│   ├── Home/           # 首页-内容列表
│   ├── Practice/       # 练习页-跟读
│   ├── Grammar/        # 语法页
│   └── MyProgress/     # 我的进度
├── hooks/              # 自定义 Hooks
├── context/            # 全局状态
├── data/               # 内置内容数据
├── utils/              # 工具函数
└── styles/            # 全局样式
```

### 3.3 数据模型

#### Content（内容）
```typescript
interface Content {
  id: string;
  title: string;
  titleCn: string;
  body: string;
  bodyCn: string;
  audioUrl: string;
  duration: number; // 秒
  difficulty: 'N5' | 'N4' | 'N3';
  category: 'news' | 'drama' | 'anime';
  grammars: Grammar[];
}
```

#### Grammar（语法）
```typescript
interface Grammar {
  pattern: string;
  meaning: string;
  formation: string;
  examples: string[];
}
```

#### PracticeRecord（练习记录）
```typescript
interface PracticeRecord {
  id: string;
  contentId: string;
  date: string; // YYYY-MM-DD
  audioBlob: Blob;
  duration: number;
  completed: boolean;
}
```

#### UserProgress（用户进度）
```typescript
interface UserProgress {
  date: string;
  completedContents: string[]; // contentId[]
  totalPracticeTime: number;
}
```

---

## 4. UI/UX 设计

### 4.1 设计风格
- **主题**：简约日式风格
- **配色**：
  - 主色：#2D3436（墨色）
  - 辅色：#636E72（灰墨）
  - 强调色：#E17055（朱红）
  - 背景色：#FAFAFA（素白）
  - 卡片色：#FFFFFF
- **字体**：
  - 日语：Noto Sans JP
  - 中文：Noto Sans SC
  - 英文：Inter

### 4.2 布局结构
- **移动优先**：适配手机屏幕
- **底部导航**：固定底部 4 个 Tab
  - 首页（📚 内容列表）
  - 练习（🎤 跟读）
  - 语法（📖 精讲）
  - 我的（📊 进度）
- **卡片式设计**：内容以卡片形式展示

### 4.3 核心页面

#### 首页
- 顶部：日期 + 今日目标（X/5篇）
- 今日内容列表（卡片）
- 每张卡片：标题 + 难度 + 时长 + 状态

#### 练习页
- 内容展示区（日语正文）
- 音频控制条
- 波形显示区
- 录音按钮
- 复盘面板（录音后展开）

#### 语法页
- 语法点列表
- 展开详情（接续、含义、例句）

#### 我的进度
- 完成日历（月历）
- 连续打卡天数
- 录音历史列表
- 数据导出按钮

---

## 5. MVP 功能优先级

### Phase 1：核心体验（本次实现）
1. ✅ 内容列表展示
2. ✅ 音频播放控制
3. ✅ 录音跟读
4. ✅ 波形可视化对比
5. ✅ 完成日历记录

### Phase 2：完善体验
1. 🔲 语法精讲面板
2. 🔲 录音历史回听
3. 🔲 数据导出/导入

### Phase 3：功能增强
1. 🔲 AI 语法分析接口
2. 🔲 录音打分系统
3. 🔲 学习数据分析

---

## 6. 内置内容示例

### 文章 1：NHK 新闻
```
标题：東京の桜が見頃に
正文：今日は穏やかな晴天続き東京地方...
音频：hanami-news.mp3
难度：N3
语法点：～に、～そうだ、～によると
```

### 文章 2：动漫台词
```
标题：スパイファミリー
正文：アーニャ：爸爸，我们去学校吧...
音频：spy-family-clip.mp3
难度：N4
语法点：～吧、～吗、～呢
```

### 文章 3：日常对话
```
标题：ディズに行く約束
正文：今天的约定是去迪士尼乐园...
音频：disney-dialogue.mp3
难度：N5
语法点：～ましょう、～たい、～ている
```

---

## 7. 扩展接口预留

### 7.1 AI 语法分析接口
```typescript
interface GrammarAnalyzer {
  analyze(text: string): Promise<Grammar[]>;
}
```

### 7.2 音频评分接口
```typescript
interface AudioScorer {
  score(original: Blob, recorded: Blob): Promise<Score>;
}
```

### 7.3 内容 API 接口
```typescript
interface ContentAPI {
  getDailyContent(): Promise<Content[]>;
  getContentById(id: string): Promise<Content>;
}
```

---

## 8. 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

**必需 API**：
- MediaRecorder API（录音）
- Web Audio API（波形）
- LocalStorage

---

## 9. 验收标准

### 功能验收
- [ ] 可浏览每日精选内容列表
- [ ] 可播放日语音频并控制播放
- [ ] 可进行录音跟读
- [ ] 可查看原音与录音的波形对比
- [ ] 可记录每日完成状态
- [ ] 可查看完成日历
- [ ] 可导出/导入数据

### 体验验收
- [ ] 页面加载时间 < 3s
- [ ] 音频播放无明显延迟
- [ ] 录音功能响应及时
- [ ] 波形渲染流畅
- [ ] 移动端适配良好

### 质量验收
- [ ] 无控制台错误
- [ ] 所有交互有反馈
- [ ] 数据存储稳定

---

**设计文档版本**：1.0  
**最后更新**：2026-04-30
