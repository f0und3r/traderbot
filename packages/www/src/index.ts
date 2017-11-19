import * as config from "config"
import * as express from "express"
import * as Json from "elow/lib/Json/Decode"
import { match } from "elow/lib/Result"
import { Config } from "./types"
import { getCards as getCardsDecoder } from "./decoders"
import { getCards } from "./db/queries"
import logMessage from "./utils/log-message"
import getItemsNamesByIds from "./utils/get-items-names-by-ids"

const app = express()
const cfg: Config = config.get("www")

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")

  next()
})

app.get("/cards/:skip/:limit", (req, res) => {
  match(Json.decodeValue(req.params, getCardsDecoder), {
    Err: err => {
      res.sendStatus(400)
    },
    Ok: data => {
      const skip = parseInt(data.skip) || 0
      const limit = parseInt(data.limit) || 10

      if (skip < 0 || limit < 0) {
        res.sendStatus(400)
      } else {
        getCards(skip, limit)
          .then(cards => {
            return getItemsNamesByIds(
              cards.map(card => card.item_id)
            ).then(itemNameById => {
              res.json(
                cards.map(card => ({
                  ...card,
                  name: itemNameById(card.item_id)
                }))
              )
            })
          })
          .catch(error => {
            logMessage("error", "Ошибка при запросе карт", error)
            res.sendStatus(500)
          })
      }
    }
  })
})

app.listen(cfg.port, () => {
  console.log(`Listening at http://0.0.0.0:${cfg.port.toString()}`)
})
