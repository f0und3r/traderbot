import { Listener } from "../types"
import { deleteWatch } from "../db/queries"
import logMessage from "../utils/log-message"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (state.type === "subscribe-delete" && state.id !== null) {
    deleteWatch(msg.chat.id, state.id)
      .then(deleted => {
        if (deleted) {
          updateState({ type: "commands" })
          bot.sendMessage(msg.chat.id, "Подписка успешно удалена!")
        } else {
          updateState({ type: "commands" })
          bot.sendMessage(
            msg.chat.id,
            "У Вас нет прав на удаление этой подписки"
          )
        }
      })
      .catch(error => {
        updateState({ type: "commands" })
        logMessage("error", "Ошибка при удалении подписки из БД", error)
        bot.sendMessage(msg.chat.id, "Упс, кажется что-то пошло не так :(")
      })
  } else {
    next()
  }
}

export default listener
