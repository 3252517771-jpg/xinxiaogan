# 小心肝 · Agent 宪法（员工手册）

> 生效日期：2026-06-10 ｜ v2.0 更新：2026-06-11
> 适用范围：任何AI代理首次进入 `D:\xinxiaogan` 项目时
> 本文件包含 v1.0 存续条款 + v2.0「AI 陪伴版」新增条款。

---

## 一、项目身份卡

| 属性 | 值 |
|------|------|
| 项目名 | 小心肝（XiaoXinGan） |
| 当前迭代 | v2.0「AI 陪伴版」（基于 v1.0 M1-M11 已完成） |
| 技术栈 | React 18 + TS + Vite / Tailwind 3.4 / Python FastAPI / SQLite |
| ML 栈 | scikit-learn + joblib（FastAPI 内嵌推理，不额外部署 ML 服务） |
| AI 建议 | DeepSeek API（外部调用，数据经 Privacy Guard 脱敏后发送） |
| 推送 | Server酱（微信通知，用户自备 SendKey） |
| 定时任务 | APScheduler（FastAPI 内嵌，无需 Celery） |
| 后端Python环境 | Conda `D:\conda-envs\claude-code`（通过 `A:\python1\Scripts\conda.exe run -p D:\conda-envs\claude-code ...` 执行） |
| 动画引擎 | GSAP + React Bits（二者互补，不互替） |
| 部署 | 阿里云 ECS `121.43.146.242` + 七牛云 CDN |
| 部署方式 | git（本地推送 GitHub 主仓 + Gitee 镜像；ECS 仅从 Gitee clone/pull） |
| 域名 | `xinxiaogan.moomlostdress.cn`（HTTPS via Certbot） |
| 后端进程 | Uvicorn（Supervisor 守护，端口 8001） |
| 生产数据库 | SQLite（`/opt/xinxiaogan/xinxiaogan.db`） |
| Git 工作流 | 本地 → 推送 GitHub（主力）+ 推送 Gitee（国内镜像）；ECS → 从 Gitee `git clone` / `git pull` 拉代码 |
| 素材路径 | `A:\网站素材\图片|视频\` → 七牛云外链 |
| 核心文档 | 见第六条引用 |

---

## 二、执行铁律（按优先级排列）

### 原则1：架构 > 设计 > 样式

改代码前**必须先确认**：
1. 这个改动是否符合目录结构（`src/pages/` / `src/features/` / `src/components/` 分层）
2. 是否违反模块依赖规则（components 不能引用 features，services 不能引用 components）
3. 再谈 UI 和样式

违反任意一条 → 退回重写。

### 原则2：真实后端接口优先，禁止默认 Mock

从 v2.0 起，前端页面和表单提交**必须真实对接 FastAPI 后端接口**，不得再以 Mock 数据作为默认运行路径。`npm run dev` 必须走真实 `/api` 请求，开发者工具 Network 中应能看到对应接口调用。

Mock 只允许作为显式调试模式存在：必须通过 `VITE_USE_MOCK_API=true` 或 `npm run dev:mock` 手动开启。任何 Sprint 验收、功能联调、提交前自检，都必须基于真实后端接口返回结果完成，不能用 Mock 结果冒充完成。

### 原则2.1：后端固定 Conda 环境

后端 Python 命令必须优先使用 Conda 环境 `D:\conda-envs\claude-code`，不要直接调用系统 `python` 或 base 环境。统一命令格式：

```powershell
& 'A:\python1\Scripts\conda.exe' run -p 'D:\conda-envs\claude-code' python ...
```

如后端依赖缺失，先在该环境内执行 `python -m pip install -r backend\requirements.txt`，再运行验证。

> v2.0 新增依赖：`scikit-learn`, `joblib`, `openai`, `apscheduler`, `httpx`。ML 训练环境同样使用此 Conda 环境。

### 原则2.2：M13 部署必须走 Gitee 拉取

M13 部署上线只能使用 Git 拉取流程：

1. 本地先提交并推送到 GitHub 主仓。
2. 本地同步推送到 Gitee 国内镜像。
3. ECS 服务器只允许从 Gitee 执行 `git clone` 或 `git pull` 拉取项目代码。

禁止把本地项目打包后上传到服务器作为部署方式；禁止在服务器上直接接收本地压缩包覆盖代码。若 Gitee 镜像不可用，先修复 Gitee 同步链路，再继续部署。

### 原则3：一文件一职责

- 一个 `.tsx` 文件只导出一个组件
- 一个 `.ts` 文件只负责一个功能（config / types / utils 各自分开）
- 超过 300 行的组件必须拆解

### 原则4：不动现有素材

`A:\网站素材\` 下的视频/图片**禁止删除、移动、重命名**。前端通过 `assetUrl()` 函数引用，路径/文件名在 `config/assetUrls.ts` 中管理。如需新增素材 → 走 CDN 上传，更新 CSV 和配置。

### 🆕 原则5：零新增原则（v2.0 新增）

v2.0 迭代严格遵守**最小化变更原则**：
1. **零新增数据库表** — 只扩展现有 `user_profiles` 表字段
2. **零新增独立 API 路由** — 唯一例外：`/api/user/push-test`
3. **零新增前端组件文件** — 所有新能力通过扩展现有 .tsx 实现
4. **零新增前端依赖** — 不加 npm 包

违反任意一条 → 退回重写，确认是否真的有必要。

### 🆕 原则6：Privacy Guard 红线（v2.0 新增）

调用 DeepSeek API 前**必须**经过 Privacy Guard 脱敏：
1. **禁止**将 username / nickname / age / gender / height / weight / user_id 送入 LLM
2. **禁止**将精确数值（如 "02:30"）送入 LLM → 改为等级描述（如 "凌晨入睡"）
3. **禁止**将精确日期和时间戳送入 LLM
4. 数据送入 LLM 前必须调用 `anonymize_for_llm()` 函数
5. 后端日志**禁止**记录 LLM 的请求/响应内容（生产环境）

违反任意一条 → 退回升级 Privacy Guard 实现。

---

## 三、项目边界（红线清单）

### ✅ 这是这个项目要做的（v1.0 + v2.0）

- 7 个页面（首页 / 作息 / 饮食 / 运动 / 压力 / 风险 / 个人主页）
- 1 个登录模态（无独立路由，Context 控制显隐）
- 5 个 IP 角色 + 视频状态机（开心 / 平静 / 担心 / 反馈）
- GooeyNav 底部导航（仅详情页显示）
- 开发维护模式（管理员密码 → 右侧侧边栏调参 → JSON 导出，留 v2.0 之后做）
- 所有数据 Mock，评分规则已定但第一期不做后端计算
- **🆕 ML 风险预测**（scikit-learn 本地推理，体征数据 → 风险等级）
- **🆕 行为识别**（规则引擎，6 种行为模式检测）
- **🆕 AI 个性化建议**（Privacy Guard 脱敏 → DeepSeek API）
- **🆕 推送通知**（Server酱 微信推送 + 定时任务）

### ❌ 这个项目明确不做（v1.0 存续 + v2.0 新增红线）

#### 全版本不允许

- 智能设备 API 对接（所有版本不碰）
- 移动端 / 响应式适配（1920×1080 桌面端专供）
- 第三方登录 / 邮箱验证 / 社交功能
- 付费 / 会员体系
- 在线问诊 / 医疗诊断
- 本地部署大模型

#### 🆕 v2.0 不做（即使技术可行）

- M12 开发维护模式（留到 v2.0 之后）
- ML 模型深度学习 / 神经网络（本期只做 scikit-learn）
- 多渠道推送（本期只做 Server酱 微信推送）
- 推送数据统计 / 用户留存分析
- 自动解绑 / 过期检测微信 SendKey

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
| 🆕 ML 模型文件 | snake_case | `risk_classifier.joblib` |
| 🆕 服务文件（Python services） | snake_case | `risk_predictor.py`, `push_service.py` |

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
| 🆕 `backend/ml_models/*.joblib` | ML 模型文件，删掉需要重新训练 |
| 🆕 `backend/app/services/ai_advice.py` | Privacy Guard 核心实现，改错可能泄露用户数据 |
| 🆕 `backend/app/services/push_service.py` | 推送服务，包含 SendKey 和定时任务 |

### 危险操作（必须提问确认）

1. **注入新前端框架/库**（超出了 React Bits / GSAP / Recharts 的技术栈）
2. **修改目录结构**（`src/pages/` / `src/features/` / `src/components/` 三层划分是定死的）
3. **改动z-index体系**（背景层z-0→z-10→z-50是全局约定的）
4. **删除已有素材引用**（可能导致首页图/场景图404）
5. **合并 Sprint 或调整 Sprint 顺序**（7个Sprint的依赖关系是强制的）
6. 🆕 **修改 Privacy Guard 脱敏逻辑**（改错可能将用户数据泄露至 DeepSeek）
7. 🆕 **更换 ML 模型框架**（scikit-learn 是定好的，不可换成 torch/tf）
8. 🆕 **直接在 FastAPI 路由中操作 ML 模型**（模型加载必须放在 `@app.on_event("startup")`，推理必须通过 services 层）

---

## 五、交付验证标准

每个 Sprint 完成后验证清单：

### 完成后自问 4 个问题

1. **能跑吗？** → `npm run dev` 无报错，`tsc --noEmit` 通过；Python service 单元测试通过
2. **符合规范吗？** → 目录放对了吗？命名规范了吗？引用正确的类型了吗？
3. **引用文档了吗？** → 是否参照 `项目立项文档.md` / `前端技术方案与实施计划.md` / `数据库设计.md` / `v2.0-ai-companion-design.md` 中的定义？不要凭记忆写代码。
4. **人工验收通过了吗？** → 是否已把验证流程推送给人工确认？人工验收是否通过？

### 🆕 v2.0 新增自检项

5. **Privacy Guard 检查** → `anonymize_for_llm()` 输出是否包含 user_id / nickname / age / height / weight / gender？
6. **ML 模型检查** → `risk_predictor.py` 的 `load_models()` 是否在 FastAPI startup 事件中调用？
7. **SendKey 安全检查** → API 响应和日志中没有泄露 SendKey？
8. **AI 建议 fallback 检查** → DeepSeek API 挂了是否自动降级到规则模板？

### 🆕 验收成本控制

验收阶段只做**简单业务逻辑验证 + 人工验证**，禁止把验收扩展成长链路、全量链路、重复截图、反复抓包或多脚本交叉验真。代理人只需完成以下最小证据：

1. 关键命令通过：如 `npm run build` / 后端启动健康检查 / 当前 Sprint 的 1 条核心接口冒烟。
2. 关键业务闭环通过：用最少步骤证明主功能能跑通，例如“注册/登录 → 提交一条记录 → 页面或接口返回预期字段”。
3. 把验收入口、操作步骤和已知风险交给人工确认。

除非人工明确要求，不再追加复杂自动化验证；不能为了“证明得更真”消耗大量 token、时间和脚本产物。

### 提交前 3 不提交

- ❌ 有 console.log 调试代码 → 删干净再提交
- ❌ 有 `any` 类型 → 必须定义类型
- ❌ 有未处理的边界情况（空数据/加载中/错误/LLM API 不可用）→ 必须处理

---

## 六、核心引用文档

| 文档 | 作用 | 必须阅读时机 |
|------|------|------------|
| `项目立项文档.md` | 功能定义、产品逻辑、验收标准 | 每次进入项目 |
| `docs/前端技术方案与实施计划.md` | 目录结构、模块边界、接口协议、Sprint计划 | 改代码前 |
| `docs/数据库设计.md` | 11张表完整建表SQL、TS类型定义、评分公式 | 建后端模型/类型前 |
| 🆕 `docs/v2.0-ai-companion-design.md` | v2.0 架构设计、API扩展、Privacy Guard、推送方案 | 实施 v2.0 Sprint 前 |
| 🆕 `xinxiaogan-m13-deployment-plan.md` | M13 部署方案（域名/Nginx/Git工作流/部署流程） | M13 部署前 |

---

## 七、阶段里程碑提交规则

### 7.1 规则（不可跳过）

每个明确的完成节点，必须走完以下流程才能进入下一个阶段：

```
阶段性任务完成
        ↓
[代理人] 自检：npm run dev 无报错 + tsc --noEmit 通过 + v2.0 新增自检项
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

#### v1.0 里程碑（已完成 M1-M11，M12-M13 延后）

| # | 里程碑节点 | 状态 |
|---|----------|------|
| M1 | 项目脚手架搭建 | ✅ |
| M2 | 目录结构 + 空壳组件 | ✅ |
| M3 | 全局样式 + 基础UI组件 | ✅ |
| M4 | 首页可运行 | ✅ |
| M5 | API Mock 层完成 | ✅ |
| M6 | 数据库连接（后端） | ✅ |
| M7 | 登录/注册全流程 | ✅ |
| M8 | 5个详情页完成 | ✅ |
| M9 | IP视频状态机 | ✅ |
| M10 | 个人主页 | ✅ |
| M11 | 底部导航 + 首版收口 | ✅ |
| M12 | 开发维护模式 | ⏳ 延后 |
| M13 | 部署上线 | ✅ 已完成 |

#### 🆕 v2.0 里程碑

| # | 里程碑节点 | 预计产出 |
|---|----------|---------|
| S1 | ML 风险预测 | 使用真实公开数据集训练 ML 模型 + FastAPI 启动加载 + 风险页预警展示 |
| S2 | 行为识别 | 6 条规则引擎 + POST 提交返回行为标签 |
| S3 | AI 个性化建议 | Privacy Guard + DeepSeek API + 各详情页建议展示 |
| S4 | 推送通知 | 个人主页 SendKey 绑定 + APScheduler 定时推送 |
| S5 | 集成验证 | 全链路联调 + 自检 + 人工验收 |

### 7.3 违反代价

- ❌ 跳过人工确认直接提交 → 回滚 commit，重走流程
- ❌ 攒多个里程碑一起提交 → 逐个回滚，逐个重新提交
- ✅ 提交信息不清（如 "fix bug" "update"）→ 重写 commit message

### 7.4 存档格式

每次里程碑完成后，在 `memory/` 目录下记录：

```markdown
# memory/YYYY-MM-DD.md

## 里程碑完成: M{N} - {名称} 或 S{N} - {名称}

**确认人：** 小洋裙
**确认时间：** YYYY-MM-DD HH:MM
**Commit：** `<commit hash>`

### 本次完成内容
- xxx
- xxx

### 当前已知问题
- xxx（如无可不写）

### 下一阶段
- 即将进入 M{N+1} / S{N+1}：{名称}
```

---

**宪法到此结束。如果你看不懂以上任何一条 → 先读文档，再动手。**
