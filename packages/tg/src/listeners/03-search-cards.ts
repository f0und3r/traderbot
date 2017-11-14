import { Card } from "../db/types"
import { Listener } from "../types"
import { getCardsOwners } from "../db/queries"
import prettyDate from "../utils/pretty-date"
import logMessage from "../utils/log-message"

const prettyCardMessage = (c: Card): string => {
  return `[${c.owner}] выбил [${prettyDate(c.created_at)}]`
}

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (state.type === "search-cards" && state.id !== null) {
    getCardsOwners(state.id)
      .then(cards => {
        if (cards.length > 0) {
          bot.sendMessage(msg.chat.id, cards.map(prettyCardMessage).join("\n"))
        } else {
          bot.sendMessage(msg.chat.id, "Таких карт мы ещё не отследили :(")
        }

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
