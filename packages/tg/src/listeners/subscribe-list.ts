import { Listener } from "../types"
import { subscribeListText } from "./welcome"
import { selectWatches } from "../db/queries"
import getItemsNamesByIds from "../utils/get-items-names-by-ids"
import getWatchText from "../utils/get-watch-text"
import logMessage from "../utils/log-message"

const emptyText = "Ваш список подписок пока пуст"

const listener: Listener = (bot, msg, state, updateState, next) => {
  const chatId = msg.chat.id
  const text = msg.text || ""

  if (state.type === "welcome" && text === subscribeListText) {
    selectWatches(chatId)
      .then(watches => {
        if (watches.length > 0) {
          return getItemsNamesByIds(
            watches.map(watch => watch.item_id)
          ).then(itemIdToName => {
            bot.sendMessage(
              chatId,
              watches.map(watch => getWatchText(watch, itemIdToName)).join("\n")
            )
          })
        } else {
          bot.sendMessage(chatId, emptyText)
        }
      })
      .catch(error => {
        logMessage("error", "Ошибка при получении списка", error)
        bot.sendMessage(chatId, "Упс, кажется что-то пошло не так :(")
      })
  } else {
    next()
  }
}

export default listener
