import { Listener } from "../types"
import { selectItem } from "../db/queries"
import logMessage from "../utils/log-message"

const idOrNameRegExp = /^[0-9a-z '_]+$/i

const listener: Listener = (bot, msg, state, updateState, next) => {
  const text = msg.text || ""

  if (
    (state.type === "subscribe-sell" ||
      state.type === "subscribe-buy" ||
      state.type === "search-sell" ||
      state.type === "search-buy" ||
      state.type === "search-cards") &&
    state.id === null
  ) {
    if (idOrNameRegExp.test(text)) {
      const idOrNameAsInt = parseInt(text)

      if (idOrNameAsInt !== 0) {
        selectItem(text)
          .then(item => {
            if (item !== null) {
              updateState({ ...state, id: item.id })
              bot.sendMessage(
                msg.chat.id,
                `Предмет найден - ${item.name_japanese} [${item.id}]`
              )
              next()
            } else {
              bot.sendMessage(
                msg.chat.id,
                "Не удалось найти предмет, попробуйте еще (0 - для выхода)"
              )
            }
          })
          .catch(error => {
            logMessage(
              "error",
              "Ошибка при получении предмета по идентификатору/названию",
              error
            )
            updateState({ type: "commands" })
            bot.sendMessage(msg.chat.id, "Упс, кажется что-то пошло не так :(")
          })
      } else {
        updateState({ type: "commands" })
        bot.sendMessage(msg.chat.id, "Процесс ввода предмета успешно отменен!")
      }
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Введите идентификатор или название предмета (0 - для выхода)"
      )
    }
  } else {
    next()
  }
}

export default listener
