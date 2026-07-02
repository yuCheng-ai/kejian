# OPC 亲子 AI 机器人沙龙 H5 课件

静态 Vite + React + TypeScript + TailwindCSS 课件，用于 2 小时 OPC 社区亲子 AI 机器人沙龙。

## 启动

```bash
npm install
npm run dev
```

`npm run dev` 会同时启动两个服务：

- 课件页面：`http://localhost:5173`
- 同步服务：`ws://localhost:5174`

## 视图

- 学生/投屏视图：`/?mode=student`
- 老师视图：`/?mode=teacher`
- 二维码页：`/?view=qr`
- 打印页：`/?print=tasks`、`/?print=parents`、`/?print=purchase`、`/?print=certificate`

## 双屏同步

推荐现场打开两个浏览器窗口或两个标签页：

- 老师控制台：`http://localhost:5173/?mode=teacher`
- 学生投屏页：`http://localhost:5173/?mode=student`

老师端翻页后，学生投屏页会自动同步到同一页。同步状态来自本地 WebSocket 服务，URL 不再保存页码状态。

默认同步地址是 `ws://localhost:5174`。如果现场需要改端口，可设置 `SYNC_PORT` 启动同步服务；如果前端要连接另一台主控电脑，可设置 `VITE_SYNC_WS_URL` 指定 WebSocket 地址。

学生投屏页默认隐藏顶部控制栏、老师控制按钮、打印入口、素材出处和内部采购信息。学生端左右键不会翻页，避免投屏端误操作；需要全屏时仍可按 `F`。

## 内容维护

- 课程页、学生内容、老师讲稿、预计用时、现场动作、注意事项、故障应急：`src/data/course.json`
- 学生任务卡、家长说明页、购买页、证书：`src/data/printables.json`
- 购买和作品二维码链接：`src/data/course.json` 里的 `meta.qrLinks`
- 课件插画资产：`public/visuals`

## 真实物料图安全说明

- 课件展示层只使用中性文件名和中性文案，不展示供应商、具体型号或内部采购信息。
- 对外投屏前请使用学生视图，并确认 URL 为 `?mode=student`。
- 老师视图用于控制和备课，不应投到学生屏幕。

## 操作

- 左右方向键翻页
- 顶部按钮切换学生/老师视图
- 顶部倒计时可开始、暂停、重置
- 全屏按钮进入投影全屏
- 打印资料下拉框可打开四类打印页
