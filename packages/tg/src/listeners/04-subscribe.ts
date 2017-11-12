import { Listener } from "../types"
import { saveWatch } from "../db/queries"
import logMessage from "../utils/log-message"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (
    (state.type === "subscribe-sell" || state.type === "subscribe-buy") &&
    state.id !== null &&
    state.amount !== null
  ) {
    // @NOTE TypeScript сносит мозг без этой строчки :/
    const amount = state.amount

    saveWatch(
      msg.chat.id,
      state.id,
      state.type === "subscribe-sell" ? "sell" : "buy",
      amount
    )
      .then(watchId => {
        bot.sendMessage(msg.chat.id, `Подписка ${watchId} успешно сохранена!`)
        updateState({ type: "commands" })
      })
      .catch(error => {
        logMessage("error", "Ошибка при добавлении подписки в БД", error)
        bot.sendMessage(msg.chat.id, "Упс, кажется что-то пошло не так :(")
      })
  } else {
    next()
  }
}

export default listener
