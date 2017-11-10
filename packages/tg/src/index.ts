import * as config from "config"
import * as TelegramBot from "node-telegram-bot-api"
import { Config, States, WelcomeState, State } from "./types"
import listeners from "./listeners"
import {
  selectUpdatedStores,
  updateFailureStores,
  selectStoresItemsByIds,
  getWatches,
  updateStores
} from "./db/queries"
import { StoreItems } from "./db/types"
import getItemsNamesByIds from "./utils/get-items-names-by-ids"
import getMerchantText from "./utils/get-merchant-text"
import logMessage from "./utils/log-message"

const cfg: Config = config.get("tg")
const bot = new TelegramBot(cfg.token, { polling: true })

const states: States = {}
const defaultState: WelcomeState = { type: "welcome" }

bot.on("message", (msg: TelegramBot.Message) => {
  const messageListeners = listeners.slice()
  const id = msg.chat.id
  const state = states[id] || defaultState

  const updateState = (state: State) => {
    states[id] = state
  }

  const next = () => {
    const listener = messageListeners.shift()
    if (listener) {
      listener(bot, msg, state, updateState, next)
    }
  }

  next()
})

const tick = () => {
  Promise.all([selectUpdatedStores(), updateFailureStores()])
    .then(results => {
      const stores = results[0]

      logMessage("debug", "tg->tick->stores", stores)

      if (stores.length > 0) {
        let storesItems: StoreItems = []

        return selectStoresItemsByIds(
          stores.map(store => store.id)
        ).then(result => {
          const itemsIds: number[] = []

          storesItems = result

          if (storesItems.length > 0) {
            storesItems.forEach(storeItem => {
              if (itemsIds.indexOf(storeItem.item_id) === -1) {
                itemsIds.push(storeItem.item_id)
              }
            })

            return Promise.all([
              getWatches(itemsIds),
              getItemsNamesByIds(itemsIds)
            ]).then(result => {
              const watches = result[0]
              const itemNameById = result[1]

              stores.forEach(store => {
                const storeItems = storesItems.filter(
                  storeItem => storeItem.store_id === store.id
                )
                storeItems.forEach(storeItem => {
                  watches.forEach(watch => {
                    if (watch.type !== store.type) {
                      return
                    }

                    if (watch.item_id !== storeItem.item_id) {
                      return
                    }

                    if (watch.amount !== 0) {
                      if (
                        watch.type === "sell" &&
                        watch.amount < storeItem.amount
                      ) {
                        return
                      }

                      if (
                        watch.type === "buy" &&
                        watch.amount > storeItem.amount
                      ) {
                        return
                      }
                    }

                    bot.sendMessage(
                      watch.chat_id,
                      getMerchantText(watch, store, storeItem, itemNameById)
                    )
                  })
                })
              })

              return updateStores(stores.map(store => store.id)).then(() => {
                setTimeout(tick, cfg.tickTimeout)
              })
            })
          } else {
            setTimeout(tick, cfg.tickTimeout)
          }
        })
      } else {
        setTimeout(tick, cfg.tickTimeout)
      }
    })
    .catch(error => {
      logMessage("error", "Ошибка при обновлении данных в БД", error)
      setTimeout(tick, cfg.tickTimeout)
    })
}

setTimeout(tick, cfg.tickTimeout)
