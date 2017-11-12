import { Listener } from "../types"
import { selectWatches } from "../db/queries"
import getItemsNamesByIds from "../utils/get-items-names-by-ids"
import getWatchText from "../utils/get-watch-text"
import logMessage from "../utils/log-message"

const emptyText = "Ваш список подписок пока пуст"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (state.type === "subscribe-list") {
    selectWatches(msg.chat.id)
      .then(watches => {
        if (watches.length > 0) {
          return getItemsNamesByIds(
            watches.map(watch => watch.item_id)
          ).then(itemIdToName => {
            bot.sendMessage(
              msg.chat.id,
              watches.map(watch => getWatchText(watch, itemIdToName)).join("\n")
            )
          })
        } else {
          bot.sendMessage(msg.chat.id, emptyText)
        }
      })
      .then(() => {
        updateState({ type: "commands" })
      })
      .catch(error => {
        logMessage("error", "Ошибка при получении списка", error)
        bot.sendMessage(msg.chat.id, "Упс, кажется что-то пошло не так :(")
      })
  } else {
    next()
  }
}

export default listener
