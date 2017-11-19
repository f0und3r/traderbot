import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import { Cards, Items } from "./types"
import db from "./"
import { cards as cardsDecoder, items as itemsDecoder } from "./decoders"

export const getCards = (skip: number, limit: number): Promise<Cards> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `cards` ORDER BY `id` DESC LIMIT ?, ?",
      [skip, limit],
      (error, results) => {
        if (error) {
          reject({ type: "db", src: "db.queries.getCards", error })
        } else {
          match(Json.decodeValue(results, cardsDecoder), {
            Err: err => {
              reject({ type: "elow", src: "db.queries.getCards", error: err })
            },
            Ok: data => {
              resolve(data)
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
