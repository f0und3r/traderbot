import { Listener } from "../types"
import { subscribeSellText } from "./welcome"
import { selectItems, saveWatch } from "../db/queries"

const inputIdText = "Введите идентификатор предмета (0 - для выхода)"
const inputIdInvalidText =
  "Введен некорректный идентификатор, попробуйте, еще (0 - для выхода)"
const processStoppedText = "Процесс добавления подписки остановлен"
const inputAmountText = "Введите максимальную сумму продажи (0 - любая)"
const inputAmountInvalidText =
  "Введена некорректная сумма, попробуйте, еще (0 - любая)"
const itemNotFindedText = "Предмет не найден, попробуйте, еще (0 - для выхода)"

const numberRegExp = /^\d+$/

const listener: Listener = (bot, msg, state, updateState, next) => {
  const chatId = msg.chat.id
  const text = msg.text || ""

  if (state.type === "welcome" && text === subscribeSellText) {
    updateState({ type: "subscribe-sell", id: null })
    bot.sendMessage(chatId, inputIdText)
  } else if (state.type === "subscribe-sell") {
    const matches = text.match(numberRegExp)

    if (state.id === null && matches === null) {
      bot.sendMessage(chatId, inputIdInvalidText)
    }

    if (state.id === null && matches !== null) {
      const itemId = parseInt(matches[0]) || 0

      if (itemId !== 0) {
        selectItems([itemId])
          .then(items => {
            if (items.length > 0) {
              updateState({ type: "subscribe-sell", id: itemId })
              bot.sendMessage(chatId, inputAmountText)
            } else {
              bot.sendMessage(chatId, itemNotFindedText)
            }
          })
          .catch(error => {
            updateState({ type: "welcome" })
            // @TODO logMessage
            console.error("Ошибка при проверке вещи в БД", error)
            bot.sendMessage(chatId, "Упс, кажется что-то пошло не так :(")
          })
      } else {
        updateState({ type: "welcome" })
        bot.sendMessage(chatId, processStoppedText)
      }
    }

    if (state.id !== null && matches === null) {
      bot.sendMessage(chatId, inputAmountInvalidText)
    }

    if (state.id !== null && matches !== null) {
      const maxAmount = parseInt(matches[0]) || 0

      updateState({ type: "welcome" })

      saveWatch(chatId, state.id, "sell", maxAmount)
        .then(watchId => {
          bot.sendMessage(chatId, `Подписка ${watchId} успешно сохранена!`)
        })
        .catch(error => {
          // @TODO logMessage
          console.error("Ошибка при добавлении подписки в БД", error)
          bot.sendMessage(chatId, "Упс, кажется что-то пошло не так :(")
        })
    }
  } else {
    next()
  }
}

export default listener
