import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import db from "./"
import {
  WatchType,
  Watch,
  Watches,
  Item,
  Items,
  StoreType,
  StoreItems,
  Stores,
  Cards
} from "./types"
import { Nullable } from "../types"
import {
  watchAtIndex0 as watchAtIndex0Decoder,
  insertResult as insertResultDecoder,
  updateResult as updateResultDecoder,
  deleteResult as deleteResultDecoder,
  watches as watchesDecoder,
  items as itemsDecoder,
  storeItems as storeItemsDecoder,
  stores as storesDecoder,
  cards as cardsDecoder,
  chatsIds as chatsIdsDecoder
} from "./decoders"
import parseWatchType from "./utils/parse-watch-type"
import parseStoreState from "./utils/parse-store-state"
import parseStoreType from "./utils/parse-store-type"

export const selectWatch = (
  chatId: number,
  itemId: number,
  type: WatchType
): Promise<Nullable<Watch>> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `watch` WHERE `chat_id` = ? AND `item_id` = ? AND `type` = ? LIMIT 1",
      [chatId, itemId, type],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectWatch", error })
        } else {
          match(Json.decodeValue(results, watchAtIndex0Decoder), {
            Err: err => {
              resolve(null)
            },
            Ok: data => {
              resolve({ ...data, type: parseWatchType(data.type) })
            }
          })
        }
      }
    )
  })

export const insertWatch = (
  chatId: number,
  itemId: number,
  type: WatchType,
  amount: number
): Promise<number> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "INSERT INTO `watch` (`chat_id`, `item_id`, `created_at`, `updated_at`, `type`, `amount`) VALUES (?, ?, ?, ?, ?, ?)",
      [chatId, itemId, now, now, type, amount],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.insertWatch", error })
        } else {
          match(Json.decodeValue(result, insertResultDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.insertWatch",
                error: err
              })
            },
            Ok: data => {
              resolve(data.insertId)
            }
          })
        }
      }
    )
  })

export const updateWatch = (
  chatId: number,
  itemId: number,
  type: WatchType,
  amount: number
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "UPDATE `watch` SET `updated_at` = ?, `amount` = ? WHERE `chat_id` = ? AND `item_id` = ? AND `type` = ?",
      [now, amount, chatId, itemId, type],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.updateWatch", error })
        } else {
          match(Json.decodeValue(result, updateResultDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.updateWatch",
                error: err
              })
            },
            Ok: data => {
              resolve(data.affectedRows > 0)
            }
          })
        }
      }
    )
  })

export const saveWatch = (
  chatId: number,
  itemId: number,
  type: WatchType,
  amount: number
): Promise<number> =>
  new Promise((resolve, reject) => {
    selectWatch(chatId, itemId, type)
      .then(watch => {
        if (watch) {
          return updateWatch(chatId, itemId, type, amount).then(() => {
            return watch.id
          })
        } else {
          return insertWatch(chatId, itemId, type, amount)
        }
      })
      .then(resolve)
      .catch(reject)
  })

export const deleteWatch = (
  chatId: number,
  watchId: number
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM `watch` WHERE `chat_id` = ? AND `id` = ?",
      [chatId, watchId],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.deleteWatch", error })
        } else {
          match(Json.decodeValue(result, deleteResultDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.deleteWatch",
                error: err
              })
            },
            Ok: data => {
              resolve(data.affectedRows > 0)
            }
          })
        }
      }
    )
  })

export const selectWatches = (chatId: number): Promise<Watches> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `watch` WHERE `chat_id` = ? ORDER BY `id` DESC",
      [chatId],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectWatches", error })
        } else {
          match(Json.decodeValue(results, watchesDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectWatches",
                error: err
              })
            },
            Ok: data => {
              resolve(
                data.map(watch => ({
                  ...watch,
                  type: parseWatchType(watch.type)
                }))
              )
            }
          })
        }
      }
    )
  })

export const selectItem = (idOrName: string): Promise<Nullable<Item>> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT `id`, `name_japanese` FROM `item_db` WHERE `id` = ? OR `name_english` = ? OR `name_japanese` = ? LIMIT 1",
      [idOrName, idOrName, idOrName],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectItem", error })
        } else {
          match(Json.decodeValue(result, itemsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectItem",
                error: err
              })
            },
            Ok: data => {
              resolve(data.length > 0 ? data[0] : null)
            }
          })
        }
      }
    )
  })

export const selectItems = (ids: number[]): Promise<Items> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT `id`, `name_japanese` FROM `item_db` WHERE `id` IN (?)",
      [ids],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectItems", error })
        } else {
          match(Json.decodeValue(results, itemsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectItems",
                error: err
              })
            },
            Ok: data => {
              resolve(data)
            }
          })
        }
      }
    )
  })

export const selectStoresItems = (
  itemId: number,
  storeType: StoreType
): Promise<StoreItems> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT `store_items`.* FROM `store`, `store_items` WHERE `store`.`id` = `store_items`.`store_id` AND `item_id` = ? AND `store`.`type` = ?",
      [itemId, storeType],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectStoresItems", error })
        } else {
          match(Json.decodeValue(results, storeItemsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectStoresItems",
                error: err
              })
            },
            Ok: data => {
              resolve(data)
            }
          })
        }
      }
    )
  })

export const selectStores = (storeIds: number[]): Promise<Stores> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `store` WHERE `id` IN (?)",
      [storeIds],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectStores", error })
        } else {
          match(Json.decodeValue(results, storesDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectStores",
                error: err
              })
            },
            Ok: data => {
              resolve(
                data.map(store => ({
                  ...store,
                  type: parseStoreType(store.type),
                  state: parseStoreState(store.state)
                }))
              )
            }
          })
        }
      }
    )
  })

export const selectUpdatedStores = (): Promise<Stores> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `store` WHERE `state` = ?",
      ["updated"],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectUpdatedStores", error })
        } else {
          match(Json.decodeValue(results, storesDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectUpdatedStore",
                error: err
              })
            },
            Ok: data => {
              resolve(
                data.map(store => ({
                  ...store,
                  type: parseStoreType(store.type),
                  state: parseStoreState(store.state)
                }))
              )
            }
          })
        }
      }
    )
  })

export const updateFailureStores = (): Promise<void> =>
  new Promise((resolve, reject) => {
    db.query(
      "UPDATE `store` SET `updated_at` = NOW(), `state` = ? WHERE `updated_at` < DATE_SUB(NOW(), INTERVAL 1 HOUR) AND `state` = ?",
      ["created", "failure"],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.updateFailuredStores", error })
        } else {
          resolve()
        }
      }
    )
  })

export const selectStoresItemsByIds = (
  storeId: number[]
): Promise<StoreItems> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `store_items` WHERE `store_id` IN (?)",
      [storeId],
      (error, results) => {
        if (error) {
          reject({
            type: "db",
            src: "db.queries.selectStoresItemsByIds",
            error
          })
        } else {
          match(Json.decodeValue(results, storeItemsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectStoresItemsByIds",
                error: err
              })
            },
            Ok: data => {
              resolve(data)
            }
          })
        }
      }
    )
  })

export const getWatches = (itemsIds: number[]): Promise<Watches> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `watch` WHERE `item_id` IN (?)",
      [itemsIds],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.getWatches", error })
        } else {
          match(Json.decodeValue(results, watchesDecoder), {
            Err: err => {
              reject({ type: "elow", src: "db.queries.getWatches", error: err })
            },
            Ok: data => {
              resolve(
                data.map(watch => ({
                  ...watch,
                  type: parseWatchType(watch.type)
                }))
              )
            }
          })
        }
      }
    )
  })

export const updateStores = (ids: number[]): Promise<void> =>
  new Promise((resolve, reject) => {
    db.query(
      "UPDATE `store` SET `state` = ? WHERE `id` IN (?)",
      ["sended", ids],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.updateStores", error })
        } else {
          resolve()
        }
      }
    )
  })

export const getCardsOwners = (id: number): Promise<Cards> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `cards` WHERE `item_id` = ? ORDER BY `id` DESC LIMIT 10",
      [id],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.getCardsOwners", error })
        } else {
          match(Json.decodeValue(results, cardsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.getCardsOwners",
                error: err
              })
            },
            Ok: data => {
              resolve(data)
            }
          })
        }
      }
    )
  })

export const getLastTenCards = (): Promise<Cards> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `cards` ORDER BY `id` DESC LIMIT 10",
      [],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.getLastTenCards", error })
        } else {
          match(Json.decodeValue(results, cardsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.getLastTenCards",
                error: err
              })
            },
            Ok: data => {
              resolve(data)
            }
          })
        }
      }
    )
  })

export const getChatsIds = (): Promise<number[]> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT DISTINCT(`chat_id`) as `chat_id` FROM `watch`",
      [],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.getChatsIds", error })
        } else {
          match(Json.decodeValue(results, chatsIdsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.getChatsIds",
                error: err
              })
            },
            Ok: data => {
              resolve(data)
            }
          })
        }
      }
    )
  })
