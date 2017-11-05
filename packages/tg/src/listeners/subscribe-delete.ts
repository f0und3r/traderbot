import { Listener } from "../types"

const listener: Listener = (bot, msg, state, updateState, next) => {
  next()
}

export default listener
