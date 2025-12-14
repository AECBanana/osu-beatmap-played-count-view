# osu!玩家信息看板

一个用于查看osu!玩家beatmap played count进度的信息看板，专为完成全rank图通关目标设计。

## 功能特性

- 📊 **玩家信息展示**: 显示玩家头像、用户名、等级、PP、全球排名等基本信息
- 🎮 **Beatmap Played Count**: 追踪总拥有排名数图和已玩不同谱面数量
- ⏱️ **游玩时间统计**: 显示总游玩时间（小时/天）
- 📈 **分数统计**: 显示Ranked分数和总分数
- 🎯 **进度可视化**: 使用进度条和图表直观展示通关进度
- 🌓 **深色模式**: 支持系统深色/浅色主题
- 📱 **响应式设计**: 适配桌面和移动设备

## 快速开始

### 1. 环境要求

- Node.js 18+ 
- npm 或 yarn
- osu! API v2 客户端ID和密钥

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置环境变量

复制环境变量示例文件并填写你的osu! API信息：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
# osu! API v2 配置
# 从 https://osu.ppy.sh/home/account/edit 获取客户端ID和密钥
OSU_CLIENT_ID=your_client_id_here
OSU_CLIENT_SECRET=your_client_secret_here

# 要查看的玩家ID（数字ID，不是用户名）
OSU_PLAYER_ID=your_player_id_here
```

### 4. 获取osu! API凭证

1. 访问 [osu!账号设置页面](https://osu.ppy.sh/home/account/edit)
2. 滚动到 "OAuth" 部分
3. 点击 "New OAuth Application"
4. 填写应用信息并创建
5. 复制 "Client ID" 和 "Client Secret"

### 5. 获取玩家ID

1. 访问玩家的osu!个人资料页面
2. 从URL中获取数字ID（例如：https://osu.ppy.sh/users/1234567）
3. 将数字ID（1234567）填入 `OSU_PLAYER_ID`

### 6. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用

## API使用说明

### 获取玩家数据

应用通过内部API路由 `/api/osu/player` 获取数据，该路由：

1. 使用osu! API v2 OAuth 2.0客户端凭证流程获取访问令牌
2. 调用osu! API获取玩家信息和统计数据
3. 返回格式化后的JSON数据

## 故障排除

### 常见问题

1. **"获取数据失败"错误**
   - 检查 `.env.local` 文件配置是否正确
   - 部署vercel请配置好环境变量
   - 确认osu! API密钥未过期
   - 验证玩家ID是否正确

2. **"无法获取osu! API访问令牌"**
   - 检查网络连接
   - 确认客户端ID和密钥正确
   - 确保osu! API服务可用

### 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 注意事项

- 本项目为**非官方**osu!应用
- 使用osu! API需遵守[osu! API使用条款](https://osu.ppy.sh/docs/index.html#legal)
- 数据更新可能有延迟（取决于osu! API）
- 请勿频繁调用API以避免被限制

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 致谢

- [mirror.nekoha.moe](https://mirror.nekoha.moe/) - 提供beatmap数量
- [osu!](https://osu.ppy.sh/) - 优秀的音乐游戏和API
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
