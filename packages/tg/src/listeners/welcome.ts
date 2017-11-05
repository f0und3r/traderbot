import { Listener } from "../types"

const welcomeText = "Добро пожаловать!"

export const subscribeSellText = "Подписка на продажу"
export const subscribeBuyText = "Подписка на скупку"
export const subscribeListText = "Список подписок"
export const subscribeDeleteText = "Удаление подписки"
export const searchSellText = "Поиск по магазинам"
export const searchBuyText = "Поиск по скупкам"

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

const listener: Listener = (bot, msg, state, updateState, next) => {
  bot.sendMessage(msg.chat.id, welcomeText, welcomeOptions)
}

export default listener
