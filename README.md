# OPC 亲子 AI 机器人沙龙 H5 课件

静态 Vite + React + TypeScript + TailwindCSS 课件，用于 2 小时 OPC 社区亲子 AI 机器人沙龙。

## 当前课程版本

本版是现场执行口令版：

- 课程为 16 页，加入“一键烧录”和“多模态 AI 大脑”两个正式环节。
- 主线从普通讲解改为 8 个任务关卡：检查零件、一键烧录、开机、联网、AI 大脑、起名字、选性格、展示。
- 学生/投屏视图只保留“大标题 + 任务步骤 + 过关标准”，减少投屏文字密度。
- 老师视图采用口令版：每页 `script` 基本只有一句可直接照读的话，`actions` 是现场动作，`notes` 是边界提醒，`emergency` 是失败处理。
- 烧录环节只做一键体验，不讲驱动、串口、编译和开发环境。
- 多模态 AI 大脑只讲“听、看、读、记”，不讲 Transformer、embedding、VLM 等模型术语。
- 最后两页用于回家升级、合影领奖、家长登记和作品上传。

上线前必须替换 `src/data/course.json` 里的二维码占位链接：

- `https://example.com/replace-opc-signup`
- `https://example.com/replace-opc-showcase`

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
