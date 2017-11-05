import { Listener } from "../types"
import { subscribeDeleteText } from "./welcome"
import { deleteWatch } from "../db/queries"

const inputIdText = "Введите идентификатор подписки (0 - для выхода)"
const inputIdInvalidText =
  "Введен некорректный идентификатор, попробуйте, еще (0 - для выхода)"
const processStoppedText = "Процесс удаления подписки остановлен"

const numberRegExp = /^\d+$/

const listener: Listener = (bot, msg, state, updateState, next) => {
  const chatId = msg.chat.id
  const text = msg.text || ""

  if (state.type === "welcome" && text === subscribeDeleteText) {
    updateState({ type: "subscribe-delete" })
    bot.sendMessage(chatId, inputIdText)
  } else if (state.type === "subscribe-delete") {
    const matches = text.match(numberRegExp)
    if (matches) {
      const watchId = parseInt(matches[0]) || 0

      if (watchId === 0) {
        updateState({ type: "welcome" })
        bot.sendMessage(chatId, processStoppedText)
      } else {
        deleteWatch(chatId, watchId)
          .then(deleted => {
            if (deleted) {
              updateState({ type: "welcome" })
              bot.sendMessage(chatId, "Подписка успешно удалена!")
            } else {
              updateState({ type: "welcome" })
              bot.sendMessage(
                chatId,
                "У Вас нет прав на удаление этой подписки"
              )
            }
          })
          .catch(error => {
            updateState({ type: "welcome" })
            // @TODO logMessage
            console.error("Ошибка при удалении подписки из БД", error)
            bot.sendMessage(chatId, "Упс, кажется что-то пошло не так :(")
          })
      }
    } else {
      bot.sendMessage(chatId, inputIdInvalidText)
    }
  } else {
    next()
  }
}

export default listener
