import { Listener } from "../types"
import { getLastTenCards } from "../db/queries"
import logMessage from "../utils/log-message"
import getItemsNamesByIds from "../utils/get-items-names-by-ids"
import prettyDate from "../utils/pretty-date"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (state.type === "search-last-ten-cards") {
    getLastTenCards()
      .then(cards => {
        if (cards.length > 0) {
          return getItemsNamesByIds(
            cards.map(card => card.item_id)
          ).then(getItemNameById => {
            bot.sendMessage(
              msg.chat.id,
              cards
                .map(card => {
                  return `[${card.owner}] выбил [${getItemNameById(
                    card.item_id
                  )}] [${prettyDate(card.created_at)}]`
                })
                .join("\n")
            )
            updateState({ type: "commands" })
          })
        } else {
          bot.sendMessage(msg.chat.id, "Пока ничего нет :(")
          updateState({ type: "commands" })
        }
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
