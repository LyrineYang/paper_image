# AI 视频生成评估界面 (Reasoning Card Interface)

这是一个用于展示和评估 AI 视频生成模型性能的前端界面组件。

## 快速开始

### 安装依赖

```shellscript
npm install
# 或
yarn install
# 或
pnpm install
```

### 运行开发服务器

```shellscript
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

---

## 自定义指南

所有的配置都在 `app/page.tsx` 文件中，您可以通过修改传递给 `<ReasoningCard>` 组件的 props 来自定义内容。

### 1. 替换图片

#### 输入图片 (Input Image)

```typescriptreact
inputImage="/placeholder.svg?height=120&width=120"
// 替换为您的图片路径，例如：
inputImage="/images/my-input.jpg"
// 或使用外部 URL：
inputImage="https://example.com/image.jpg"
```

#### 视频帧 (Generated Video Frames)

```typescriptreact
videoFrames={[
  "/placeholder.svg?height=90&width=120",
  "/placeholder.svg?height=90&width=120",
  "/placeholder.svg?height=90&width=120",
  "/placeholder.svg?height=90&width=120",
]}
// 替换为您的 4 张视频帧图片：
videoFrames={[
  "/images/frame1.jpg",
  "/images/frame2.jpg",
  "/images/frame3.jpg",
  "/images/frame4.jpg",
]}
```

#### 模型图标 (Model Icon)

```typescriptreact
modelIcon="/placeholder.svg?height=40&width=40"
// 替换为您的模型 Logo：
modelIcon="/images/gpt-logo.png"
// 或使用外部 URL：
modelIcon="https://example.com/model-icon.png"
```

### 2. 修改评分数据

#### Checklist Scores (柱状图)

```typescriptreact
scores={[
  { module: "R1", score: 10 },
  { module: "R2", score: 10 },
  { module: "R3", score: 7 },
  { module: "R4", score: 8 },
  { module: "R5", score: 9 },
  { module: "R6", score: 6 },
  { module: "R7", score: 8 },
  { module: "R8", score: 7 },
  { module: "R9", score: 5 },
  { module: "R10", score: 1 },
]}
```

**说明**：

- `module`: 模块名称（R1-R10）
- `score`: 分数（1-10 分）
- 共 10 个模块，每个模块的分数范围是 1-10


#### Final Score (最终得分)

```typescriptreact
totalScore={7.33}  // 总分（满分 10 分）
tsr={35.3}         // TSR (Temporal Success Rate) 百分比
```

### 3. 修改文本内容

#### Prompt (提示词)

```typescriptreact
prompt="Zoom in on the black bag with the Apple logo to focus on the logo's color. Static shot."
// 修改为您的提示词
```

#### 模型名称

```typescriptreact
modelName="Sora 2"
// 修改为您的模型名称，例如：
modelName="GPT-4V"
```

#### 难度标签

```typescriptreact
difficulty="Modeling"
// 可选值：任意文本，例如 "Hard", "Easy", "Complex" 等
```

---

## 导出功能

界面右上角有一个 **"导出图片"** 按钮，点击后会将整个评估卡片导出为 PNG 图片文件，方便您保存或分享评估结果。

---

## 完整示例

```typescriptreact
<ReasoningCard
  prompt="A whole potato is dropped from the top of a tall, clear vase."
  modelName="Sora 2"
  modelIcon="/images/sora-icon.png"
  difficulty="Modeling"
  inputImage="/images/input-potato.jpg"
  videoFrames={[
    "/images/frame1.jpg",
    "/images/frame2.jpg",
    "/images/frame3.jpg",
    "/images/frame4.jpg",
  ]}
  scores={[
    { module: "R1", score: 10 },
    { module: "R2", score: 10 },
    { module: "R3", score: 7 },
    { module: "R4", score: 8 },
    { module: "R5", score: 9 },
    { module: "R6", score: 6 },
    { module: "R7", score: 8 },
    { module: "R8", score: 7 },
    { module: "R9", score: 5 },
    { module: "R10", score: 1 },
  ]}
  totalScore={7.33}
  tsr={35.3}
/>
```

---

## 技术栈

- **Next.js 16** - React 框架
- **Tailwind CSS v4** - 样式框架
- **Recharts** - 图表库
- **html2canvas** - 截图导出功能
- **shadcn/ui** - UI 组件库


---

## 样式说明

- **主色调**: `#A4BEC2` (用于 Modeling 标签和柱状图)
- **字体**:

- 标题使用衬线字体 (Serif)
- 正文使用无衬线字体 (Sans-serif)



- **设计风格**: 简洁、学术、专业（类似 Matplotlib 图表风格）


---

## 项目结构

```plaintext
├── app/
│   ├── page.tsx              # 主页面，配置所有参数
│   ├── layout.tsx            # 布局文件
│   └── globals.css           # 全局样式
├── components/
│   └── reasoning-card.tsx    # 评估卡片组件
├── public/                   # 静态资源文件夹（放置图片）
└── README.md                 # 本文档
```

---

## 常见问题

**Q: 如何添加自己的图片？**A: 将图片放入 `public/images/` 文件夹，然后在 `app/page.tsx` 中使用 `/images/your-image.jpg` 路径引用。

**Q: 柱状图的分数范围是多少？**A: 每个模块的分数范围是 1-10 分。

**Q: 可以修改柱状图的颜色吗？**A: 可以，在 `components/reasoning-card.tsx` 中找到 `<Bar>` 组件，修改 `fill` 属性的颜色值。

---

## License

MIT