import * as config from "config"
import { Config, Listener } from "../types"
import getRandomInt from "../utils/get-random-int"

const subscribeSellText = "Подписка на продажу"
const subscribeBuyText = "Подписка на скупку"
const subscribeListText = "Список подписок"
const subscribeDeleteText = "Удаление подписки"
const searchSellText = "Поиск по магазинам"
const searchBuyText = "Поиск по скупкам"
const searchCardsText = "Поиск по картам"
const searchLastTenCardsText = "Последние 10 карт"
const adminMessageText = "Отправка сообщения"

const welcomeTexts = [
  "Вы сегодня очень красивы!",
  "Добро пожаловать!",
  "И мне тоже скучно",
  "Как у Вас дела?",
  "Лучше Вас никого на свете нету :3",
  "Не хотите на прогулку? ^_^",
  "Может чаю? :)",
  "Еще немножко текста, еще!",
  "Строго между нами... Тут карты навыпадали, не смотрел?",
  ":O"
]

const getRandomWelcomeText = () =>
  welcomeTexts[getRandomInt(0, welcomeTexts.length - 1)]

const welcomeOptions = {
  reply_markup: {
    keyboard: [
      [{ text: subscribeSellText }, { text: subscribeListText }],
      [{ text: subscribeBuyText }, { text: subscribeDeleteText }],
      [{ text: searchSellText }, { text: searchBuyText }],
      [{ text: searchCardsText }, { text: searchLastTenCardsText }]
    ]
  }
}

const welcomeAdminOptions = {
  reply_markup: {
    keyboard: [
      [{ text: adminMessageText }],
      ...welcomeOptions.reply_markup.keyboard
    ]
  }
}

const cfg: Config = config.get("tg")

const listener: Listener = (bot, msg, state, updateState, next) => {
  let runNext = true
  let isAdmin = cfg.admin.indexOf(msg.chat.id) !== -1

  if (state.type === "commands") {
    const text = msg.text || ""
    if (text === subscribeSellText) {
      updateState({
        type: "subscribe-sell",
        step: "message",
        id: null,
        amount: null
      })
    } else if (text === subscribeBuyText) {
      updateState({
        type: "subscribe-buy",
        step: "message",
        id: null,
        amount: null
      })
    } else if (text === subscribeListText) {
      updateState({ type: "subscribe-list" })
    } else if (text === subscribeDeleteText) {
      updateState({ type: "subscribe-delete", id: null })
    } else if (text === searchSellText) {
      updateState({ type: "search-sell", id: null })
    } else if (text === searchBuyText) {
      updateState({ type: "search-buy", id: null })
    } else if (text === searchCardsText) {
      updateState({ type: "search-cards", id: null })
    } else if (text === searchLastTenCardsText) {
      updateState({ type: "search-last-ten-cards" })
    } else if (text === adminMessageText && isAdmin) {
      updateState({ type: "admin-message", step: "message", message: null })
    } else {
      bot.sendMessage(
        msg.chat.id,
        getRandomWelcomeText(),
        isAdmin ? welcomeAdminOptions : welcomeOptions
      )
      runNext = false
    }
  }

  if (runNext) {
    next()
  }
}

export default listener
