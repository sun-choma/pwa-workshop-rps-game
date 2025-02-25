import { GameMode } from "@/core/game/types";
import { GAME_MODES } from "@/core/game/constants";
import { MultiplayerController } from "@/core/network/modes/multiplayer-controller";
import { SingleplayerController } from "@/core/network/modes/singleplayer-controller";
import { EventBus } from "@/core/common/event-bus";
import type { MessagePayloadMap } from "@/core/network/types";
import { SOCKET_EVENTS } from "@/core/network/constants";

export class SessionManager {
  private bus = new EventBus<MessagePayloadMap>(SOCKET_EVENTS);
  public addEventListener = this.bus.addEventListener;
  public addEventListeners = this.bus.addEventListeners;
  public removeEventListener = this.bus.removeEventListener;
  public removeEventListeners = this.bus.removeEventListeners;

  private controller: SingleplayerController | MultiplayerController =
    new SingleplayerController(this.bus);
  public send = this.controller.send;

  launch(playerName: string, mode: GameMode) {
    switch (mode) {
      case GAME_MODES.MULTIPLAYER:
        this.controller = new MultiplayerController(this.bus);
        break;
      case GameMode.SINGLEPLAYER:
        this.controller = new SingleplayerController(this.bus);
        break;
    }
    this.send = this.controller.send;

    switch (true) {
      case this.controller instanceof MultiplayerController:
        this.controller.startMatchmaking(playerName);
        break;
      case this.controller instanceof SingleplayerController:
        this.controller.startGame();
        break;
    }
  }

  suspend() {
    switch (true) {
      case this.controller instanceof MultiplayerController:
        this.controller.disconnect();
        break;
      case this.controller instanceof SingleplayerController:
        this.controller.endGame();
        break;
    }
  }
}
