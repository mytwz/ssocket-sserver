import SScoket from "../../ssocket";
import { SOptions } from "../../ssocket/types/application";
interface Config extends SOptions {
    /**入网用户名 */
    username: string;
    /**入网帐号密码 */
    password: string;
    /**中心服务地址 */
    centralUrl: string;
    /**本地网络Ip */
    ip: string;
    /**WebSocket 端口号 */
    websocket_port: number;
    /**分布式消息服务的 端口号 */
    sserver_port: number;
    /**与中心服务器通信的签名Key */
    signKey: string;
}
declare class SSScoket extends SScoket {
    private config;
    private sserver;
    constructor(config: Config);
    start(cb: Function): void;
    /**
     * 发送多服同步消息
     * @param id
     * @param event
     * @param data
     */
    sendSocketMessage(id: string, event: string, data: any, status?: number, msg?: string): Promise<void>;
    /**
     * 发送房间消息
     * @param room
     * @param event
     * @param data
     * @param status
     * @param msg
     */
    sendRoomMessage(room: string, event: string, data: any, status?: number, msg?: string): Promise<void>;
    /**
     * 发送广播消息
     * @param event
     * @param data
     * @param status
     * @param msg
     */
    sendBroadcast(event: string, data: any, status?: number, msg?: string): Promise<void>;
}
export = SSScoket;
