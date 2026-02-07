import { Connection } from "@solana/web3.js";
import { DEVNET_RPC } from "./constants";

let _connection: Connection | null = null;

export function getConnection(): Connection {
  if (!_connection) {
    _connection = new Connection(DEVNET_RPC, {
      commitment: "confirmed",
      wsEndpoint: DEVNET_RPC.replace("https://", "wss://"),
    });
  }
  return _connection;
}
