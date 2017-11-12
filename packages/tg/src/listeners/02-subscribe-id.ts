import { Listener } from "../types"
import logMessage from "../utils/log-message"

const onlyNumbersRegExp = /^\d+$/

const listener: Listener = (bot, msg, state, updateState, next) => {
  const text = msg.text || ""

  if (state.type === "subscribe-delete" && state.id === null) {
    if (onlyNumbersRegExp.test(text)) {
      const id = parseInt(text)

      if (id !== 0) {
        updateState({ type: "subscribe-delete", id })
        next()
      } else {
        updateState({ type: "commands" })
        bot.sendMessage(
          msg.chat.id,
          "Процесс ввода идентификатора успешно отменен!"
        )
      }
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Введите идентификатор подписки (0 - для выхода)"
      )
    }
  } else {
    next()
  }
}

export default listener
