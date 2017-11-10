import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import db from "./"
import { Nullable } from "../types"
import {
  Stores,
  Store,
  StoreType,
  StoreState,
  SaveStoreItem,
  Items
} from "./types"
import {
  stores as storesDecoder,
  storeAtIndex0 as storeAtIndex0Decoder,
  insertResult as insertResultDecoder,
  items as itemsDecoder
} from "./decoders"
import parseStoreType from "./utils/parse-store-type"
import parseStoreState from "./utils/parse-store-state"

export const selectCreatedStores = (): Promise<Stores> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `store` WHERE `state` = ?",
      ["created"],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.selectCreatedStores", error })
        } else {
          match(Json.decodeValue(results, storesDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.selectCreatedStores",
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
              resolve({
                ...data,
                type: parseStoreType(data.type),
                state: parseStoreState(data.state)
              })
            }
          })
        }
      }
    )
  })

export const deleteStoreItems = (storeId: number): Promise<void> =>
  new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM `store_items` WHERE `store_id` = ?",
      [storeId],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.deleteStoreItems", error })
        } else {
          resolve()
        }
      }
    )
  })

export const saveStoreItem = (
  storeId: number,
  itemId: number,
  count: number,
  amount: number
): Promise<void> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "INSERT INTO `store_items` (`created_at`, `updated_at`, `store_id`, `item_id`, `count`, `amount`) VALUES (?, ?, ?, ?, ?, ?)",
      [now, now, storeId, itemId, count, amount],
      (error, result) => {
        if (error) {
          reject({ type: "db", src: "db.queries.saveStoreItem", error })
        } else {
          resolve()
        }
      }
    )
  })

export const updateStore = (
  type: StoreType,
  state: StoreState,
  owner: string,
  title: string,
  map: string,
  x: number,
  y: number
): Promise<void> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "UPDATE `store` SET `updated_at` = ?, `type` = ?, `state` = ?, `title` = ?, `map` = ?, `x` = ?, `y` = ? WHERE `owner` = ?",
      [now, type, state, title, map, x, y, owner],
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
  state: StoreState,
  owner: string,
  title: string,
  map: string,
  x: number,
  y: number
): Promise<number> =>
  new Promise((resolve, reject) => {
    const now = new Date()

    db.query(
      "INSERT INTO `store` (`created_at`, `updated_at`, `type`, `state`, `owner`, `title`, `map`, `x`, `y`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [now, now, type, state, owner, title, map, x, y],
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
  state: StoreState,
  owner: string,
  title: string,
  map: string,
  x: number,
  y: number,
  items: SaveStoreItem[]
): Promise<number> =>
  new Promise((resolve, reject) => {
    selectStore(owner)
      .then(store => {
        if (store) {
          return deleteStoreItems(store.id)
            .then(() => {
              return Promise.all(
                items.map(item =>
                  saveStoreItem(store.id, item.item, item.count, item.amount)
                )
              )
            })
            .then(() => updateStore(type, state, owner, title, map, x, y))
            .then(() => resolve(store.id))
        } else {
          return insertStore(
            type,
            "created",
            owner,
            title,
            map,
            x,
            y
          ).then(id => {
            Promise.all(
              items.map(item =>
                saveStoreItem(id, item.item, item.count, item.amount)
              )
            )
              .then(() => updateStore(type, state, owner, title, map, x, y))
              .then(() => resolve(id))
          })
        }
      })
      .catch(reject)
  })

export const getItemsByNames = (names: string[]): Promise<Items> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT `id`, `name_japanese` FROM `item_db` WHERE `name_japanese` IN (?)",
      [names],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.getItemsByNames", error })
        } else {
          match(Json.decodeValue(results, itemsDecoder), {
            Err: err => {
              reject({
                type: "elow",
                src: "db.queries.getItemsByNames",
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
