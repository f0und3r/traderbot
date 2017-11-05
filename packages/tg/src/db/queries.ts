import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import db from "./"
import { WatchType, Watch } from "./types"
import { Nullable } from "../types"
import {
  watchAtIndex0 as watchAtIndex0Decoder,
  insertResult as insertResultDecoder,
  updateResult as updateResultDecoder,
  deleteResult as deleteResultDecoder
} from "./decoders"
import parseWatchType from "./utils/parse-watch-type"

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
