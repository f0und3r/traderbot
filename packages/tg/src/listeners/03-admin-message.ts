import { Listener } from "../types"
import { getChatsIds } from "../db/queries"
import logMessage from "../utils/log-message"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (state.type === "admin-message" && state.message !== null) {
    const mes = state.message

    getChatsIds()
      .then(chatsIds => {
        chatsIds.forEach(chatId => {
          bot.sendMessage(chatId, mes)
        })
        updateState({ type: "commands" })
      })
      .catch(error => {
        updateState({ type: "commands" })
        logMessage("error", "Ошибка при поиске вещей в БД", error)
        bot.sendMessage(msg.chat.id, "Упс, кажется что-то пошло не так :(")
      })
  } else {
    next()
  }
}

export default listener
