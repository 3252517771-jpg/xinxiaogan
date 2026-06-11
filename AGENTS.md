# 小心肝 · Agent 宪法（员工手册）

> 生效日期：2026-06-10
> 适用范围：任何AI代理首次进入 `D:\xinxiaogan` 项目时
> 本文件仅660余字，阅读耗时＜2分钟，但每条都是红线。

---

## 一、项目身份卡

| 属性 | 值 |
|------|------|
| 项目名 | 小心肝（XiaoXinGan） |
| 技术栈 | React 18 + TS + Vite / Tailwind 3.4 / Python FastAPI / PostgreSQL |
| 后端Python环境 | Conda `D:\conda-envs\claude-code`（通过 `A:\python1\Scripts\conda.exe run -p D:\conda-envs\claude-code ...` 执行） |
| 动画引擎 | GSAP + React Bits（二者互补，不互替） |
| 部署 | 阿里云 ECS + 七牛云 CDN |
| 素材路径 | `A:\网站素材\图片\|视频\` → 七牛云外链 |
| 核心文档 | 见第五条引用 |

---

## 二、执行铁律（按优先级排列）

### 原则1：架构 > 设计 > 样式

改代码前**必须先确认**：
1. 这个改动是否符合目录结构（`src/pages/` / `src/features/` / `src/components/` 分层）
2. 是否违反模块依赖规则（components 不能引用 features，services 不能引用 components）
3. 再谈 UI 和样式

违反任意一条 → 退回重写。

### 原则2：前端优先，Mock先行

第一期**不给后端写真实业务逻辑**。API 层只返回 mock 数据，后端只跑通注册/登录/JWT。真实 API 替换＝只改 `BASE_URL`。

### 原则2.1：后端固定 Conda 环境

后端 Python 命令必须优先使用 Conda 环境 `D:\conda-envs\claude-code`，不要直接调用系统 `python` 或 base 环境。统一命令格式：

```powershell
& 'A:\python1\Scripts\conda.exe' run -p 'D:\conda-envs\claude-code' python ...
```

如后端依赖缺失，先在该环境内执行 `python -m pip install -r backend\requirements.txt`，再运行验证。

### 原则3：一文件一职责

- 一个 `.tsx` 文件只导出一个组件
- 一个 `.ts` 文件只负责一个功能（config / types / utils 各自分开）
- 超过 300 行的组件必须拆解

### 原则4：不动现有素材

`A:\网站素材\` 下的视频/图片**禁止删除、移动、重命名**。前端通过 `assetUrl()` 函数引用，路径/文件名在 `config/assetUrls.ts` 中管理。如需新增素材 → 走 CDN 上传，更新 CSV 和配置。

---

## 三、项目边界（红线清单）

### ✅ 这是这个项目要做的

- 7 个页面（首页 / 作息 / 饮食 / 运动 / 压力 / 风险 / 个人主页）
- 1 个登录模态（无独立路由，Context 控制显隐）
- 5 个 IP 角色 + 视频状态机（开心 / 平静 / 担心 / 反馈）
- GooeyNav 底部导航（仅详情页显示）
- 开发维护模式（管理员密码 → 右侧侧边栏调参 → JSON 导出）
- 所有数据 Mock，评分规则已定但第一期不做后端计算

### ❌ 这个项目明确不做

- 推送通知（第一期不碰）
- 机器学习模型（第一期不碰）
- 智能设备 API 对接（第一期不碰）
- 移动端 / 响应式适配（第一期 1920×1080 桌面端专供）
- 第三方登录 / 邮箱验证 / 社交功能
- 付费 / 会员体系
- 在线问诊 / 医疗诊断

**任何AI建议做上述"不做"清单中的内容 → 直接否决，不予讨论。**

---

## 四、代码规范

### 命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件名 | PascalCase | `SleepForm.tsx` |
| 普通函数/变量 | camelCase | `useVideoState` |
| 常量/枚举 | UPPER_SNAKE | `SCORE_THRESHOLDS` |
| CSS 类名 | kebab-case（Tailwind） | `glass-light` |
| 数据库表/字段 | snake_case | `sleep_records`, `sleep_time` |
| 文件/文件夹 | kebab-case | `border-glow.tsx` |
| 接口类型 | PascalCase + 无I前缀 | `UserProfile`, `SleepRecord` |

### 受保护文件（修改必须确认）

| 文件 | 原因 |
|------|------|
| `src/config/routes.ts` | 路由表，改一个影响全页面 |
| `src/config/constants.ts` | IP映射表，所有页面/组件依赖 |
| `src/config/assetUrls.ts` | 素材URL管理器，开发/生产切换 |
| `src/types/*.ts` | 类型定义，前端/后端/数据库三端对齐 |
| `src/components/background/BackgroundLayer.tsx` | 背景层z-index体系，改错整站断层 |
| `src/components/ip/IPVideoPlayer.tsx` | IP状态机核心，改错影响5个页面 |
| `src/services/api.ts` | 统一请求层，所有接口依赖 |
| `src/styles/glass.css` | 玻璃质感全局Token |

### 危险操作（必须提问确认）

1. **注入新前端框架/库**（超出了 React Bits / GSAP / Recharts 的技术栈）
2. **修改目录结构**（`src/pages/` / `src/features/` / `src/components/` 三层划分是定死的）
3. **改动z-index体系**（背景层z-0→z-10→z-50是全局约定的）
4. **删除已有素材引用**（可能导致首页图/场景图404）
5. **合并 Sprint 或调整 Sprint 顺序**（7个Sprint的依赖关系是强制的）

---

## 五、交付验证标准

每个 Sprint 完成后验证清单：

### 完成后自问 4 个问题

1. **能跑吗？** → `npm run dev` 无报错，`tsc --noEmit` 通过
2. **符合规范吗？** → 目录放对了吗？命名规范了吗？引用正确的类型了吗？
3. **引用文档了吗？** → 是否参照 `项目立项文档.md` / `前端技术方案与实施计划.md` / `数据库设计.md` 中的定义？不要凭记忆写代码。
4. **人工验收通过了吗？** → 是否已把验证流程推送给人工确认？人工验收是否通过？

### 提交前 3 不提交

- ❌ 有 console.log 调试代码 → 删干净再提交
- ❌ 有 `any` 类型 → 必须定义类型
- ❌ 有未处理的边界情况（空数据/加载中/错误）→ 必须处理

---

## 六、核心引用文档

| 文档 | 作用 | 必须阅读时机 |
|------|------|------------|
| `项目立项文档.md` | 功能定义、产品逻辑、验收标准 | 每次进入项目 |
| `docs/前端技术方案与实施计划.md` | 目录结构、模块边界、接口协议、Sprint计划 | 改代码前 |
| `docs/数据库设计.md` | 11张表完整建表SQL、TS类型定义、评分公式 | 建后端模型/类型前 |

---

---

## 七、阶段里程碑提交规则

### 7.1 规则（不可跳过）

每个明确的完成节点，必须走完以下流程才能进入下一个阶段：

```
阶段性任务完成
        ↓
[代理人] 自检：npm run dev 无报错 + tsc --noEmit 通过
        ↓
[代理人] 准备提交清单（改了哪些文件 + 完成了什么 + 还有哪些已知问题）
        ↓
[人] 确认：人工验收，认为可以提交
        ↓
[代理人] 记录存档：更新 memory/YYYY-MM-DD.md 记录本次阶段完成的内容
        ↓
[代理人] 提交 git：git add → git commit -m "清晰描述性信息" → git push
        ↓
进入下一阶段
```

### 7.2 哪些节点必须触发此流程

以下节点每完成一个，都必须执行一次完整的**自检→确认→记录→提交**流程，**不允许攒到一起提交**：

| # | 里程碑节点 | 预计产出 |
|---|----------|---------|
| M1 | 项目脚手架搭建 | Vite + React + TS + Tailwind 初始化，`npm run dev` 正常打开空白页 |
| M2 | 目录结构 + 空壳组件 | 完整 tree 落地，每个文件夹有占位文件，路由能空转 |
| M3 | 全局样式 + 基础UI组件 | GlassCard / PillButton / SlimTag 可渲染，玻璃Token生效 |
| M4 | 首页可运行 | BackgroundLayer + PillNav + 标语 + ScrollStack卡 + 趋势图，完整首页展示 |
| M5 | API Mock 层完成 | 所有接口 Mock 数据返回正常，前端渲染不报错 |
| M6 | 数据库连接（后端） | FastAPI + PostgreSQL 启动，第一条 SQL 可通过 |
| M7 | 登录/注册全流程 | 注册→登录→JWT→AuthGuard 解锁页面 |
| M8 | 5个详情页完成 | 作息/饮食/运动/压力/风险 全可访问+表单可交互 |
| M9 | IP视频状态机 | 过渡视频+评分态切换+反馈视频 完整运转 |
| M10 | 个人主页 | 资料编辑+历史记录+导出 可用 |
| M11 | GooeyNav 底部导航 | 详情页之间切换正常 |
| M12 | 开发维护模式 | 管理员激活→选中→调参→导出JSON 全链条 |
| M13 | 部署上线 | ECS + Nginx + CDN 全链路跑通 |

### 7.3 违反代价

- ❌ 跳过人工确认直接提交 → 回滚 commit，重走流程
- ❌ 攒多个里程碑一起提交 → 逐个回滚，逐个重新提交
- ✅ 提交信息不清（如 "fix bug" "update"）→ 重写 commit message

### 7.4 存档格式

每次里程碑完成后，在 `memory/` 目录下记录：

```markdown
# memory/YYYY-MM-DD.md

## 里程碑完成: M{N} - {名称}

**确认人：** 小洋裙
**确认时间：** YYYY-MM-DD HH:MM
**Commit：** `<commit hash>`

### 本次完成内容
- xxx
- xxx

### 当前已知问题
- xxx（如无可不写）

### 下一阶段
- 即将进入 M{N+1}：{名称}
```

---

**宪法到此结束。如果你看不懂以上任何一条 → 先读文档，再动手。**
