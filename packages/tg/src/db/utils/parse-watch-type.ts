import { WatchType } from "../types"

export default (str: string): WatchType => {
  if (str === "sell") {
    return "sell"
  }

  return "buy"
}
