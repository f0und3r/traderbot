import { Listener, Nullable } from "../types"
import { StoreItems } from "../db/types"
import { selectStoresItems, selectStores } from "../db/queries"
import getItemsNamesByIds from "../utils/get-items-names-by-ids"
import prettyAmount from "../utils/pretty-amount"
import logMessage from "../utils/log-message"

const listener: Listener = (bot, msg, state, updateState, next) => {
  if (
    (state.type === "search-sell" || state.type === "search-buy") &&
    state.id !== null
  ) {
    let items: StoreItems = []

    selectStoresItems(state.id, state.type === "search-sell" ? "sell" : "buy")
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

            let minAmount: Nullable<number> = null
            let maxAmount: Nullable<number> = null

            stores.forEach(store => {
              const storeItems = items.filter(
                item => item.store_id === store.id
              )

              if (storeItems.length > 0) {
                messages.push(
                  "\n",
                  state.type === "search-sell"
                    ? `Магазин [${store.title}] продавца [${store.owner}] в [${
                        store.map
                      }<${store.x}, ${store.y}>]`
                    : `Скупка [${store.title}] продавца [${store.owner}] в [${
                        store.map
                      }<${store.x}, ${store.y}>]`,
                  "\n"
                )

                storeItems.forEach(storeItem => {
                  if (minAmount === null || storeItem.amount < minAmount) {
                    minAmount = storeItem.amount
                  }

                  if (maxAmount === null || storeItem.amount > maxAmount) {
                    maxAmount = storeItem.amount
                  }

                  messages.push(
                    `[${itemNameById(storeItem.item_id)}] за [${prettyAmount(
                      storeItem.amount
                    )}] в количестве [${storeItem.count}]`,
                    "\n"
                  )
                })
              }
            })

            messages.unshift(
              `Разброс цен в диапазоне [${
                minAmount ? prettyAmount(minAmount) : "не определено"
              }] - [${
                maxAmount ? prettyAmount(maxAmount) : "не определено"
              }] (сначала новые магазины)`,
              "\n"
            )

            updateState({ type: "commands" })
            bot.sendMessage(msg.chat.id, messages.join(""))
          })
        } else {
          updateState({ type: "commands" })
          bot.sendMessage(msg.chat.id, "Магазинов не найдено :(")
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
