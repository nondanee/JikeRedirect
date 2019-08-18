# Jike Redirect

一个把 Jike API 重定向到 Jellow API 的代理

晚上用即漏，视力好；白天用即刻，不会瞎

爱护眼睛从我做起 (狗头)

~~可以点赞动态 (悄咪咪说)~~

框架来自 *UnblockNeteaseMusic*

## Preview

<img src="https://user-images.githubusercontent.com/26399680/63162256-a33d4c00-c054-11e9-95e4-dd216ec8b8a6.jpg" width="50%"/><img src="https://user-images.githubusercontent.com/26399680/63162257-a3d5e280-c054-11e9-90bc-0f4bc3c2e1bd.jpg" width="50%"/>

## Prerequisites

因为即刻的 targetSdkVersion 为 26 ([>= 24 不会使用用户添加的 CA 证书](https://stackoverflow.com/a/40743463))，需要 JustTrustMe (Xposed)，然后安装根证书

(这次给了 CA 私钥，放心，和 UnblockNeteaseMusic CA 的私钥不一样的)

## Known Issues

- 如果之前登录了，请注销重登 (不要清除数据，不要重新安装，不然只能 `am start`)

- 第一次加载动态页可能要很久

- 圈子，广场，推荐，电台，聊天等等都还没回来，等呗！

- ~~因聊天页无法打开 (想 hook 但是不知道返回数据结构长啥样，反编译了但是看不懂 =.=)，查看通知请长按~~ 蠢了，`content-length` 没去掉

## License

MIT License
