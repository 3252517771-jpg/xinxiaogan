# 小心肝后端

M6 只提供 FastAPI 启动、开发数据库连接和第一条 SQL 验证，不包含真实业务 API。

## 本地启动

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8006
```

## 验证入口

- `GET /health`：验证 FastAPI 服务启动
- `GET /db/ping`：执行 `SELECT 1`，验证数据库连接

默认开发数据库为 SQLite：`backend/dev.db`。后续部署到 ECS 时，可通过 `.env` 覆盖 `DATABASE_URL` 切换到 PostgreSQL。
