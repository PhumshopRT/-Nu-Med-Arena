"use client";

import mqtt, { MqttClient } from "mqtt";
import { NaAccount, getNaAccounts, saveNaAccounts } from "./user";

const BROKER_SERVERS = [
  "wss://broker.emqx.io:8084/mqtt",
  "wss://broker.hivemq.com:8884/mqtt"
];
const GLOBAL_ACCOUNTS_TOPIC = "nucmed_arena_v1/global_accounts_sync_v3";

export type AccountSyncMessage =
  | { type: "REQUEST_ACCOUNTS"; clientId: string }
  | { type: "ACCOUNTS_BATCH"; accounts: NaAccount[]; clientId: string; timestamp: number }
  | { type: "ACCOUNT_UPSERT"; account: NaAccount; clientId: string; timestamp: number };

let globalClient: MqttClient | null = null;
let isInitialized = false;
let isConnected = false;
const clientId = typeof window !== "undefined" 
  ? `nuc_acc_${Math.random().toString(36).substring(2, 9)}`
  : "nuc_acc_server";

const statusListeners = new Set<(connected: boolean) => void>();

export function getAccountSyncStatus(): boolean {
  return isConnected;
}

export function subscribeAccountSyncStatus(listener: (connected: boolean) => void): () => void {
  statusListeners.add(listener);
  listener(isConnected);
  return () => {
    statusListeners.delete(listener);
  };
}

function notifyStatus(connected: boolean) {
  isConnected = connected;
  statusListeners.forEach((fn) => {
    try {
      fn(connected);
    } catch {}
  });
}

/**
 * Merge two lists of NaAccounts with union logic and conflict resolution.
 */
export function mergeAccountLists(local: NaAccount[], incoming: NaAccount[]): { merged: NaAccount[]; hasChanges: boolean } {
  let hasChanges = false;
  const map = new Map<string, NaAccount>();

  // Populate local accounts first
  for (const acc of local) {
    if (acc && acc.studentId) {
      map.set(acc.studentId.trim().toUpperCase(), { ...acc });
    }
  }

  // Merge incoming accounts
  for (const inc of incoming) {
    if (!inc || !inc.studentId) continue;
    const key = inc.studentId.trim().toUpperCase();
    const existing = map.get(key);

    if (!existing) {
      // New account from another device!
      map.set(key, { ...inc });
      hasChanges = true;
    } else {
      // Conflict resolution: compare timestamp or highest progress
      const incTime = new Date(inc.lastLoginAt || inc.createdAt || 0).getTime();
      const existTime = new Date(existing.lastLoginAt || existing.createdAt || 0).getTime();

      let shouldUpdate = false;

      // If incoming has later login/activity, take incoming
      if (incTime > existTime) {
        shouldUpdate = true;
      } else if (inc.coins !== existing.coins || inc.xp !== existing.xp || inc.disabled !== existing.disabled) {
        // If coins or xp differs, take the higher or more recent
        if (inc.coins > existing.coins || inc.xp > existing.xp) {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        const mergedAccount: NaAccount = {
          ...existing,
          ...inc,
          // Union inventories
          inventory: Array.from(new Set([...(existing.inventory || []), ...(inc.inventory || [])])),
          // Merge coin history without duplicates
          coinHistory: Array.from(
            new Map(
              [...(existing.coinHistory || []), ...(inc.coinHistory || [])].map((h) => [
                `${h.timestamp}_${h.delta}_${h.reason}`,
                h
              ])
            ).values()
          ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        };
        map.set(key, mergedAccount);
        hasChanges = true;
      }
    }
  }

  const merged = Array.from(map.values()).sort((a, b) => {
    // Sort by coins desc, then name asc
    if (b.coins !== a.coins) return b.coins - a.coins;
    return a.studentId.localeCompare(b.studentId);
  });

  return { merged, hasChanges };
}

/**
 * Initialize global account synchronization across all devices.
 */
export function initAccountSync(): () => void {
  if (typeof window === "undefined" || isInitialized) {
    return () => {};
  }
  isInitialized = true;

  // 1. Same-device BroadcastChannel for instant multi-tab sync
  let broadcastChannel: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      broadcastChannel = new BroadcastChannel("nucmed_accounts_bc");
      broadcastChannel.onmessage = (event) => {
        if (event.data) {
          handleIncomingMessage(event.data, false);
        }
      };
    }
  } catch {}

  // 2. Multi-device MQTT WebSocket connection
  try {
    const client = mqtt.connect(BROKER_SERVERS[0], {
      clientId,
      clean: true,
      connectTimeout: 8000,
      reconnectPeriod: 4000,
      keepalive: 30
    });
    globalClient = client;

    client.on("connect", () => {
      notifyStatus(true);
      client.subscribe(GLOBAL_ACCOUNTS_TOPIC, { qos: 1 }, (err) => {
        if (!err) {
          // Send request to pull all existing accounts from active devices
          sendSyncMessage({ type: "REQUEST_ACCOUNTS", clientId });
          // Announce local accounts to help new peers
          const localAccounts = getNaAccounts();
          if (localAccounts.length > 0) {
            sendSyncMessage({
              type: "ACCOUNTS_BATCH",
              accounts: localAccounts,
              clientId,
              timestamp: Date.now()
            });
          }
        }
      });
    });

    client.on("message", (topic, payload) => {
      if (topic === GLOBAL_ACCOUNTS_TOPIC) {
        try {
          const parsed = JSON.parse(payload.toString()) as AccountSyncMessage;
          // Ignore own messages
          if (parsed.clientId === clientId) return;
          handleIncomingMessage(parsed, true);
        } catch {}
      }
    });

    client.on("offline", () => notifyStatus(false));
    client.on("error", () => notifyStatus(false));
  } catch (err) {
    console.warn("MQTT global account sync init error:", err);
  }

  function handleIncomingMessage(msg: AccountSyncMessage, fromNetwork: boolean) {
    switch (msg.type) {
      case "REQUEST_ACCOUNTS": {
        // Another device requested accounts, broadcast local accounts
        const local = getNaAccounts();
        if (local.length > 0) {
          sendSyncMessage({
            type: "ACCOUNTS_BATCH",
            accounts: local,
            clientId,
            timestamp: Date.now()
          });
        }
        break;
      }
      case "ACCOUNTS_BATCH": {
        if (Array.isArray(msg.accounts) && msg.accounts.length > 0) {
          const local = getNaAccounts();
          const { merged, hasChanges } = mergeAccountLists(local, msg.accounts);
          if (hasChanges) {
            saveNaAccounts(merged, true);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("na_accounts_updated", { detail: merged }));
            }
          }
        }
        break;
      }
      case "ACCOUNT_UPSERT": {
        if (msg.account && msg.account.studentId) {
          const local = getNaAccounts();
          const { merged, hasChanges } = mergeAccountLists(local, [msg.account]);
          if (hasChanges) {
            saveNaAccounts(merged, true);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("na_accounts_updated", { detail: merged }));
            }
          }
        }
        break;
      }
    }
  }

  function sendSyncMessage(msg: AccountSyncMessage) {
    try {
      broadcastChannel?.postMessage(msg);
    } catch {}
    if (globalClient && isConnected) {
      try {
        globalClient.publish(GLOBAL_ACCOUNTS_TOPIC, JSON.stringify(msg), { qos: 1 });
      } catch {}
    }
  }

  // 3. Listen to local custom events from user.ts
  const handleLocalSaved = (e: Event) => {
    const custom = e as CustomEvent<NaAccount[]>;
    if (custom.detail && Array.isArray(custom.detail)) {
      sendSyncMessage({
        type: "ACCOUNTS_BATCH",
        accounts: custom.detail,
        clientId,
        timestamp: Date.now()
      });
    }
  };

  const handleLocalUpserted = (e: Event) => {
    const custom = e as CustomEvent<NaAccount>;
    if (custom.detail && custom.detail.studentId) {
      sendSyncMessage({
        type: "ACCOUNT_UPSERT",
        account: custom.detail,
        clientId,
        timestamp: Date.now()
      });
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("na_accounts_saved", handleLocalSaved);
    window.addEventListener("na_account_upserted", handleLocalUpserted);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("na_accounts_saved", handleLocalSaved);
      window.removeEventListener("na_account_upserted", handleLocalUpserted);
    }
    try {
      broadcastChannel?.close();
    } catch {}
    try {
      globalClient?.end();
    } catch {}
    isInitialized = false;
    notifyStatus(false);
  };
}

/**
 * Manually trigger a broadcast of an updated or newly registered account to all devices.
 */
export function broadcastAccountUpsert(account: NaAccount): void {
  const msg: AccountSyncMessage = {
    type: "ACCOUNT_UPSERT",
    account,
    clientId,
    timestamp: Date.now()
  };
  try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("nucmed_accounts_bc");
      bc.postMessage(msg);
      bc.close();
    }
  } catch {}
  if (globalClient && globalClient.connected) {
    try {
      globalClient.publish(GLOBAL_ACCOUNTS_TOPIC, JSON.stringify(msg), { qos: 1 });
    } catch {}
  }
}

/**
 * Request all connected devices (Computer, iPad, Phone) to send their accounts.
 */
export function requestAccountsSync(): void {
  const msg: AccountSyncMessage = {
    type: "REQUEST_ACCOUNTS",
    clientId
  };
  try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("nucmed_accounts_bc");
      bc.postMessage(msg);
      bc.close();
    }
  } catch {}
  if (globalClient && globalClient.connected) {
    try {
      globalClient.publish(GLOBAL_ACCOUNTS_TOPIC, JSON.stringify(msg), { qos: 1 });
    } catch {}
  }
}

/**
 * Broadcast entire local accounts batch to all online devices.
 */
export function broadcastAllAccounts(): void {
  const accounts = getNaAccounts();
  const msg: AccountSyncMessage = {
    type: "ACCOUNTS_BATCH",
    accounts,
    clientId,
    timestamp: Date.now()
  };
  try {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("nucmed_accounts_bc");
      bc.postMessage(msg);
      bc.close();
    }
  } catch {}
  if (globalClient && globalClient.connected) {
    try {
      globalClient.publish(GLOBAL_ACCOUNTS_TOPIC, JSON.stringify(msg), { qos: 1, retain: true });
    } catch {}
  }
}
