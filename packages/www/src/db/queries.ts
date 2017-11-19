import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import { Cards } from "./types"
import db from "./"
import { cards as cardsDecoder } from "./decoders"

export const getCards = (skip: number, limit: number): Promise<Cards> =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `cards` LIMIT ?, ?",
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
