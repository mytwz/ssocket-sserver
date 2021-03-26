/*
 * @Author: Summer
 * @LastEditors: Summer
 * @Description: 
 * @Date: 2021-03-23 17:48:22 +0800
 * @LastEditTime: 2021-03-25 16:25:59 +0800
 * @FilePath: /ssocket-sserver-node/test/index.js
 */
const http = require("http")
const WebSocekt = require("../");
const app = new WebSocekt({
    server: http.createServer(),
    verifyClient: ({ origin, secure, req }, callback) => {
        callback(true/**返回 false 的话，连接就会中断并给前端返回 403 的HTTP错误码 */)
    }, // 非必传
    perMessageDeflate: true, // 非必传
    maxPayload: 1024 * 1024 * 10, // 最大传输单位 10M // 非必传
    /**本地网络Ip */
    ip: "10.9.16.24",
    /**WebSocket 端口号 */
    websocket_port: +process.argv[2],
    /**分布式消息服务的 端口号 */
    sserver_port: +process.argv[3],
    /**入网用户名 */
    username: "summer",
    /**入网帐号密码 */
    password: "summer",
    /**与中心服务器通信的签名Key */
    signKey: "signKey",
    /**中心服务地址 */
    centralUrl: "http://10.9.16.24:8080",
    serverName:"summer"+process.argv[2]
})

app.router.ONPath("join", function(ctx, next){
    ctx.app.join(ctx.socket.id, ctx.socket.roomid = ctx.data.roomid);
    let { os, browser, device } = ctx.socket;
    return { os, browser, device }
})

app.router.ONPath("message", function(ctx, next){
    ctx.app.sendRoomMessage(ctx.socket.roomid, "message", ctx.data);
})

app.start(function () {
    console.log("启动成功")
})
