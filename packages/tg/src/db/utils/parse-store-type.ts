import { StoreType } from "../types"

export default (str: string): StoreType => {
  if (str === "sell") {
    return "sell"
  }

  return "buy"
}
