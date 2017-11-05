import { Listener } from "../types"
import { searchBuyText } from "./welcome"
import { selectStoresItems, selectStores } from "../db/queries"
import { StoreItems } from "../db/types"
import getItemsNamesByIds from "../utils/get-items-names-by-ids"
import prettyAmount from "../utils/pretty-amount"

const inputIdText = "Введите идентификатор предмета (0 - для выхода)"
const inputIdInvalidText =
  "Введен некорректный идентификатор, попробуйте, еще (0 - для выхода)"
const processStoppedText = "Процесс поиска остановлен"
const emptyResultText = "Магазинов не найдено :("

const numberRegExp = /^\d+$/

const listener: Listener = (bot, msg, state, updateState, next) => {
  const chatId = msg.chat.id
  const text = msg.text || ""

  if (state.type === "welcome" && text === searchBuyText) {
    updateState({ type: "search-buy" })
    bot.sendMessage(chatId, inputIdText)
  } else if (state.type === "search-buy") {
    const matches = text.match(numberRegExp)

    if (matches) {
      const itemId = parseInt(matches[0]) || 0
      if (itemId !== 0) {
        let items: StoreItems = []

        selectStoresItems(itemId, "buy")
          .then(result => {
            const storesIds: number[] = []
            const itemsIds: number[] = []

            items = result
            items.forEach(item => {
              if (storesIds.indexOf(item.store_id) === -1) {
                storesIds.push(item.store_id)
              }

              if (itemsIds.indexOf(item.item_id) === -1) {
                itemsIds.push(item.item_id)
              }
            })

            if (storesIds.length > 0 && itemsIds.length > 0) {
              return Promise.all([
                selectStores(storesIds),
                getItemsNamesByIds(itemsIds)
              ]).then(result => {
                const stores = result[0]
                const itemNameById = result[1]
                const messages: string[] = []

                stores.forEach(store => {
                  const storeItems = items.filter(
                    item => item.store_id === store.id
                  )

                  if (storeItems.length > 0) {
                    messages.push(
                      `Скупка [${store.title}] продавца [${store.owner}] в [${store.map}<${store.x}, ${store.y}>]`
                    )
                    storeItems.forEach(storeItem => {
                      messages.push(
                        `[${itemNameById(
                          storeItem.item_id
                        )}] за [${prettyAmount(
                          storeItem.amount
                        )}] в количестве [${storeItem.count}]`
                      )
                    })
                    messages.push("\n")
                  }
                })

                updateState({ type: "welcome" })
                bot.sendMessage(chatId, messages.join("\n"))
              })
            } else {
              updateState({ type: "welcome" })
              bot.sendMessage(chatId, emptyResultText)
            }
          })
          .catch(error => {
            updateState({ type: "welcome" })
            // @TODO logMessage
            console.error("Ошибка при поиске вещей в БД", error)
            bot.sendMessage(chatId, "Упс, кажется что-то пошло не так :(")
          })
      } else {
        updateState({ type: "welcome" })
        bot.sendMessage(chatId, processStoppedText)
      }
    } else {
      bot.sendMessage(chatId, inputIdInvalidText)
    }
  } else {
    next()
  }
}

export default listener
