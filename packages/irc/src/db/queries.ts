import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import db from "./"
import { Nullable } from "../types"
import { Store, StoreType } from "./types"
import {
  storeAtIndex0 as storeAtIndex0Decoder,
  insertResult as insertResultDecoder
} from "./decoders"
import parseStoreType from "./utils/parse-store-type"

export const selectStore = (owner: string): Promise<Nullable<Store>> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `store` WHERE `owner` = ? LIMIT 1",
      [owner],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectStore", error })
        } else {
          match(Json.decodeValue(result, storeAtIndex0Decoder), {
            Err: err => {
              resolve(null)
            },
            Ok: data => {
              resolve({ ...data, type: parseStoreType(data.type) })
            }
          })
        }
      }
    )
  })

export const updateStore = (
  type: StoreType,
  owner: string,
  title: string,
  map: string,
  x: number,
  y: number
): Promise<void> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "UPDATE `store` SET `updated_at` = ?, `type` = ?, `title` = ?, `map` = ?, `x` = ?, `y` = ? WHERE `owner` = ?",
      [now, type, title, map, x, y, owner],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.updateStore", error })
        } else {
          resolve()
        }
      }
    )
  })

export const insertStore = (
  type: StoreType,
  owner: string,
  title: string,
  map: string,
  x: number,
  y: number
): Promise<number> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "INSERT INTO `store` (`created_at`, `updated_at`, `type`, `owner`, `title`, `map`, `x`, `y`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [now, now, type, owner, title, map, x, y],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.insertStore", error })
        } else {
          match(Json.decodeValue(result, insertResultDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.insertStore",
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

export const saveStore = (
  type: StoreType,
  owner: string,
  title: string,
  map: string,
  x: number,
  y: number
): Promise<number> =>
  new Promise((resolve, reject) => {
    selectStore(owner)
      .then(store => {
        if (store) {
          return updateStore(type, owner, title, map, x, y).then(() => {
            resolve(store.id)
          })
        } else {
          return insertStore(type, owner, title, map, x, y).then(resolve)
        }
      })
      .catch(error => {
        reject({ type: "db", src: "db.queries.insertStore", error })
      })
  })
