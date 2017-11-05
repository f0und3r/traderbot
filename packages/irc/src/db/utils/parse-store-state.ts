import { StoreState } from "../types"

export default (str: string): StoreState => {
  if (str === "created") {
    return "created"
  }

  if (str === "updated") {
    return "updated"
  }

  if (str === "failure") {
    return "failure"
  }

  return "sended"
}
