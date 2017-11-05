import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import db from "./"
import {
  WatchType,
  Watch,
  Watches,
  Items,
  StoreType,
  StoreItems,
  Stores
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
  stores as storesDecoder
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
      "SELECT * FROM `watch` WHERE `chat_id` = ?",
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
