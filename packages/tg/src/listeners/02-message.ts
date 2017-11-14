import { Listener } from "../types"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (state.type === "admin-message" && state.message === null) {
    const text = msg.text || ""

    if (state.step === "input") {
      if (text === "0") {
        updateState({ type: "commands" })
        bot.sendMessage(msg.chat.id, "Процесс ввода сообщения остановлен")
      } else {
        updateState({ ...state, message: text })
        next()
      }
    } else {
      updateState({ ...state, step: "input" })
      bot.sendMessage(msg.chat.id, "Введите сообщение (0 - для выхода)")
    }
  } else {
    next()
  }
}

export default listener
