import { PersistentSocket } from "@/core/common/persistent-socket";
import type { MessagePayloadMap, SendPayloadMap } from "@/core/network/types";
import { EventBus } from "@/core/common/event-bus";
import { ENV } from "@/env/config";

export class MultiplayerController {
  private socket;
  public send;

  constructor(bus: EventBus<MessagePayloadMap>) {
    this.socket = new PersistentSocket<MessagePayloadMap, SendPayloadMap>({
      url: ENV.WEBSOCKET_URL,
      bus,
    });
    this.send = this.socket.send;
  }

  startMatchmaking(playerName: string) {
    this.socket.connect();
    this.socket.events.once("open", () =>
      this.socket.send("set-name", playerName),
    );
  }

  disconnect() {
    this.socket.close();
  }
}
