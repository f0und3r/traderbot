import * as config from "config"
import * as TelegramBot from "node-telegram-bot-api"
import { Config, ChatsSteps, WelcomeStep } from "./types"
import { selectWatches, saveWatch } from "./db/queries"
import getItemsNamesByIds from "./utils/get-items-names-by-ids"
import getWatchText from "./utils/get-watch-text"

const cfg: Config = config.get("tg")
const bot = new TelegramBot(cfg.token, { polling: true })

const chatsSteps: ChatsSteps = {}
const defaultStep: WelcomeStep = { type: "welcome" }

const subscribeSellText = "Подписка на продажу"
const subscribeBuyText = "Подписка на скупку"
const subscribeListText = "Список подписок"
const subscribeDeleteText = "Удаление подписки"
const searchSellText = "Поиск по магазинам"
const searchBuyText = "Поиск по скупкам"

const inputIdText = "Введите идентификатор предмета (0 - для выхода)"
const welcomeText = "Добро пожаловать!"
const inputIdInvalidText = "Введено некорректное число"

const defaultOptions = { reply_markup: { keyboard: [] } }
const welcomeOptions = {
  reply_markup: {
    keyboard: [
      [
        { text: subscribeSellText },
        { text: subscribeListText },
        { text: searchSellText }
      ],
      [
        { text: subscribeBuyText },
        { text: subscribeDeleteText },
        { text: searchBuyText }
      ]
    ]
  }
}

const numberRegExp = /^\d+$/

bot.on("message", (msg: TelegramBot.Message) => {
  const id = msg.chat.id
  const text = msg.text || ""
  const username =
    msg.chat.username || (msg.from && msg.from.username) || "Unknown"

  const chatStep = chatsSteps[id] || defaultStep

  // bot.sendMessage(
  //   id,
  //   `Состояние на начало чата: ${JSON.stringify(chatsSteps[id] || chatStep)}`
  // )

  if (chatStep.type === "welcome") {
    if (text === subscribeSellText) {
      chatsSteps[id] = { type: "subscribe-sell", id: null }
      bot.sendMessage(id, inputIdText)
    } else if (text === subscribeBuyText) {
      chatsSteps[id] = { type: "subscribe-buy", id: null }
      bot.sendMessage(id, inputIdText)
    } else if (text === subscribeListText) {
      selectWatches(id)
        .then(watches => {
          if (watches.length > 0) {
            getItemsNamesByIds(watches.map(watch => watch.item_id))
              .then(itemIdToName => {
                bot.sendMessage(
                  id,
                  watches
                    .map(watch => getWatchText(watch, itemIdToName))
                    .join("\n")
                )
              })
              .catch(error => {
                // @TODO logMessage
                console.error(
                  "Ошибка при получении списка",
                  id,
                  username,
                  error
                )
                bot.sendMessage(id, "Упс, кажется что-то пошло не так :(")
              })
          } else {
            bot.sendMessage(id, "Ваш список подписок пока пуст")
          }
        })
        .catch(error => {
          // @TODO logMessage
          console.error("Ошибка при получении списка", id, username, error)
          bot.sendMessage(id, "Упс, кажется что-то пошло не так :(")
        })
    } else if (text === subscribeDeleteText) {
      chatsSteps[id] = { type: "subscribe-delete" }
      bot.sendMessage(id, inputIdText)
    } else if (text === searchSellText) {
      chatsSteps[id] = { type: "search-buy" }
      bot.sendMessage(id, inputIdText)
    } else if (text === searchBuyText) {
      chatsSteps[id] = { type: "search-sell" }
      bot.sendMessage(id, inputIdText)
    } else {
      bot.sendMessage(id, welcomeText, welcomeOptions)
    }
  } else if (chatStep.type === "subscribe-sell") {
    const matches = text.match(numberRegExp)

    if (!matches) {
      bot.sendMessage(id, inputIdInvalidText)
    } else {
      if (chatStep.id === null) {
        const matchId = parseInt(matches[0]) || 0

        if (matchId === 0) {
          chatsSteps[id] = { type: "welcome" }
        } else {
          chatStep.id = matchId
          bot.sendMessage(id, "Введите максимальную сумму продажи (0 - любая)")
        }
      } else {
        const matchAmount = parseInt(matches[1]) || 0
        saveWatch(id, chatStep.id, "sell", matchAmount)
          .then(watchId => {
            bot.sendMessage(id, `Подписка ${watchId} успешно сохранена!`)
          })
          .catch(error => {
            // @TODO logMessage
            console.error("Ошибка при сохранении подписки", id, username, error)
            bot.sendMessage(id, "Упс, кажется что-то пошло не так :(")
          })
      }
    }
  } else if (chatStep.type === "subscribe-buy") {
  } else if (chatStep.type === "subscribe-delete") {
  } else if (chatStep.type === "search-buy") {
  } else if (chatStep.type === "search-sell") {
  }

  // bot.sendMessage(
  //   id,
  //   `Состояние на конец чата: ${JSON.stringify(chatsSteps[id] || chatStep)}`
  // )
})
