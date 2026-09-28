"use client";

import mqtt, { MqttClient } from "mqtt";
import { PublicRoomState, PublicPlayer } from "@nucmed/shared";

export type SyncMessage =
  | { type: "PLAYER_JOIN"; player: PublicPlayer }
  | { type: "REQUEST_ROOM_STATE"; player: PublicPlayer }
  | { type: "PLAYER_LEAVE"; playerId: string }
  | { type: "ROOM_STATE_SYNC"; room: PublicRoomState }
  | { type: "PLAYER_READY"; playerId: string; ready: boolean }
  | { type: "PLAYER_LOCK"; playerId: string; locked: boolean; answer?: { rpId: string; mechId: string } }
  | { type: "MATCH_START"; roomCode: string }
  | { type: "ROUND_ADVANCE"; roundIndex: number; caseId: string }
  | { type: "ROUND_REVEAL"; roundIndex: number; caseId: string; results?: any }
  | { type: "CHAT_MESSAGE"; message: { id: string; sender: string; text: string; avatar?: string } }
  | { type: "EMOJI_REACTION"; playerId: string; emoji: string };

const BROKER_SERVERS = [
  "wss://broker.emqx.io:8084/mqtt",
  "wss://broker.hivemq.com:8884/mqtt"
];

export interface RoomSyncHandle {
  publish: (msg: SyncMessage) => void;
  destroy: () => void;
  isConnected: () => boolean;
}

export function createRoomSync(
  roomCode: string,
  onMessage: (msg: SyncMessage) => void,
  onStatusChange?: (connected: boolean) => void
): RoomSyncHandle {
  const cleanCode = roomCode.trim().toUpperCase();
  const topic = `nucmed_arena_v1/rooms/${cleanCode}`;
  const clientId = `nuc_${Math.random().toString(36).substring(2, 9)}`;

  let client: MqttClient | null = null;
  let isConnected = false;
  let broadcastChannel: BroadcastChannel | null = null;
  const outgoingQueue: SyncMessage[] = [];

  // 1. Same-device / local-tab communication via BroadcastChannel
  try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      broadcastChannel = new BroadcastChannel(`nucmed_bc_${cleanCode}`);
      broadcastChannel.onmessage = (event) => {
        if (event.data) {
          onMessage(event.data);
        }
      };
    }
  } catch {
    // BroadcastChannel unsupported or blocked
  }

  const flushQueue = () => {
    if (client && isConnected && outgoingQueue.length > 0) {
      while (outgoingQueue.length > 0) {
        const item = outgoingQueue.shift();
        if (item) {
          try {
            client.publish(topic, JSON.stringify(item), { qos: 0 });
          } catch {
            // Drop on fail
          }
        }
      }
    }
  };

  // 2. Cross-device communication via public secure WebSocket MQTT
  try {
    client = mqtt.connect(BROKER_SERVERS[0], {
      clientId,
      clean: true,
      connectTimeout: 7000,
      reconnectPeriod: 3000,
      keepalive: 30,
    });

    client.on("connect", () => {
      isConnected = true;
      if (onStatusChange) onStatusChange(true);
      client?.subscribe(topic, { qos: 0 }, (err) => {
        if (!err) {
          flushQueue();
        }
      });
    });

    client.on("message", (recvTopic, payload) => {
      if (recvTopic === topic) {
        try {
          const parsed = JSON.parse(payload.toString());
          onMessage(parsed);
        } catch {
          // Ignore malformed payloads
        }
      }
    });

    client.on("offline", () => {
      isConnected = false;
      if (onStatusChange) onStatusChange(false);
    });

    client.on("error", () => {
      isConnected = false;
      if (onStatusChange) onStatusChange(false);
    });
  } catch (err) {
    console.warn("MQTT connection error, relying on local sync:", err);
  }

  const publish = (msg: SyncMessage) => {
    // 1. Broadcast to local tabs immediately
    try {
      broadcastChannel?.postMessage(msg);
    } catch {
      // Ignore
    }

    // 2. Publish to MQTT or queue if connecting
    if (client && isConnected) {
      try {
        client.publish(topic, JSON.stringify(msg), { qos: 0 });
      } catch {
        outgoingQueue.push(msg);
      }
    } else {
      outgoingQueue.push(msg);
    }
  };

  const destroy = () => {
    try {
      broadcastChannel?.close();
    } catch {
      // Ignore
    }
    try {
      client?.end(true);
    } catch {
      // Ignore
    }
  };

  return {
    publish,
    destroy,
    isConnected: () => isConnected,
  };
}
