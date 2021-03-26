"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*
 * @Author: Summer
 * @LastEditors: Summer
 * @Description:
 * @Date: 2021-03-23 16:45:37 +0800
 * @LastEditTime: 2021-03-24 18:12:26 +0800
 * @FilePath: /ssocket-sserver-node/src/index.ts
 */
const network_node_server_1 = __importDefault(require("../../network-node-server"));
const ssocket_1 = __importStar(require("../../ssocket"));
/**消息同步的Key */
const MessageEventKey = "MessageEventKey";
class SSScoket extends ssocket_1.default {
    constructor(config) {
        super(Object.assign({ port: config.server ? null : config.websocket_port }, config));
        this.config = config;
        this.sserver = new network_node_server_1.default({
            username: config.username,
            password: config.password,
            centralUrl: config.centralUrl,
            ip: config.ip,
            port: config.sserver_port,
            signKey: config.signKey,
        });
        this.sserver.on(MessageEventKey, (id, event, data, status, msg) => {
            let client = this.adapter.get(id);
            if (client) {
                client.response(event, status, msg, 0, data);
            }
        });
    }
    start(cb) {
        this.sserver.start(() => {
            var _a;
            this.adapter.data_redis = this.sserver.redis;
            if (this.config.server) {
                (_a = this.config.server) === null || _a === void 0 ? void 0 : _a.listen(this.config.websocket_port, () => cb && cb());
            }
            else {
                cb && cb();
            }
        });
    }
    /**
     * 发送多服同步消息
     * @param id
     * @param event
     * @param data
     */
    sendSocketMessage(id, event, data, status = ssocket_1.CODE[200][0], msg = ssocket_1.CODE[200][1]) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sserver.emit(MessageEventKey, id, event, data, status, msg);
        });
    }
    /**
     * 发送房间消息
     * @param room
     * @param event
     * @param data
     * @param status
     * @param msg
     */
    sendRoomMessage(room, event, data, status = ssocket_1.CODE[200][0], msg = ssocket_1.CODE[200][1]) {
        return __awaiter(this, void 0, void 0, function* () {
            let clientids = yield this.getClientidByroom(room);
            for (let id of clientids) {
                this.sendSocketMessage(id, event, data);
            }
        });
    }
    /**
     * 发送广播消息
     * @param event
     * @param data
     * @param status
     * @param msg
     */
    sendBroadcast(event, data, status = ssocket_1.CODE[200][0], msg = ssocket_1.CODE[200][1]) {
        return __awaiter(this, void 0, void 0, function* () {
            let roomids = yield this.getRoomall();
            for (let roomid of roomids) {
                this.sendRoomMessage(roomid, event, data, status, msg);
            }
        });
    }
}
module.exports = SSScoket;
