import * as irc from "irc"
import * as config from "config"
import { Config, QueueItem, Queue, Nullable, Pm, ItemPm } from "./types"
import parseMessage from "./utils/parse-message"
import parsePm from "./utils/parse-pm"
import { selectCreatedStores, saveStore, getCard, saveCard } from "./db/queries"
import getItemsByNames from "./utils/get-items-ids-by-names"
import { SaveStoreItem } from "./db/types"
import logMessage from "./utils/log-message"

const cfg: Config = config.get("irc")
const con = new irc.Client(cfg.host, cfg.nick, { channels: cfg.channels })

const queue: Queue = []

let queueBuf: Pm[] = []
let queueItem: Nullable<QueueItem> = null
let queueTimeout: Nullable<NodeJS.Timer> = null

const flushAndTick = () => {
  queueBuf = []
  queueItem = null
  queueTimeout = null

  tick()
}

// @NOTE Обработчик записей очереди
const handleQueue = () => {
  if (queueItem !== null) {
    // @TODO TypeScript пока не слишком умный (queueItem === null, as ItemPm[])
    const type = queueItem.type
    const owner = queueItem.owner
    const ownerPm = queueBuf.find(pm => pm.type === "owner")
    const itemsPm = queueBuf.filter(pm => pm.type === "item") as ItemPm[]

    // @TODO TypeScript пока не слишком умный (owner.type === "owner")
    if (ownerPm && ownerPm.type === "owner" && itemsPm.length > 0) {
      getItemsByNames(itemsPm.map(item => item.item))
        .then(itemNameById => {
          const items: SaveStoreItem[] = []

          // @NOTE Так как на один текст может быть несколько ID
          itemsPm.forEach(item => {
            const ids = itemNameById(item.item)

            ids.forEach(id => {
              items.push({
                item: id,
                amount: item.amount,
                count: item.count
              })
            })
          })

          return saveStore(
            type,
            "updated",
            owner,
            ownerPm.title,
            ownerPm.map,
            ownerPm.x,
            ownerPm.y,
            items
          )
        })
        .then(id => {
          flushAndTick()
        })
        .catch(error => {
          logMessage("error", "Ошибка при сохранении магазина", error)
          flushAndTick()
        })
    } else {
      // @NOTE Здесь может быть никнейм, который ушел с венда, а мы ждем и пингуем
      saveStore(type, "failure", owner, "", "", 0, 0, [])
        .then(id => {
          flushAndTick()
        })
        .catch(error => {
          logMessage("error", "Ошибка при сохранении магазина", error)
          flushAndTick()
        })
    }
  } else {
    queueItem = queue.shift() || null

    if (queueItem) {
      const cmd = queueItem.type === "sell" ? "shop" : "buy"
      con.say(cfg.operator, `@${cmd} ${queueItem.owner}`)

      // @NOTE Добавляем двойной таймаут на тот случай, если в PM вдруг ответа не будет
      queueTimeout = setTimeout(handleQueue, cfg.queueTimeout * 2)
    } else {
      // @NOTE Ничего нету, запускаем обработчик записей из БД
      tick()
    }
  }
}

// @NOTE Обработчик записей из БД
const tick = () => {
  selectCreatedStores()
    .then(stores => {
      logMessage("debug", "irc->tick->stores", stores)

      if (stores.length === 0) {
        setTimeout(tick, cfg.tickTimeout)
      } else {
        stores.forEach(store =>
          queue.push({
            type: store.type,
            owner: store.owner
          })
        )

        // @NOTE Начинаем обработку очереди
        handleQueue()
      }
    })
    .catch(error => {
      logMessage("error", "Ошибка при запросе магазинов", error)

      setTimeout(tick, cfg.tickTimeout)
    })
}

con.addListener("message", (from: string, to: string, mes: string) => {
  // @NOTE Обрабатываем сообщения в #main только от FreeRO
  if (from !== cfg.server) {
    return
  }

  const message = parseMessage(mes)

  if (cfg.ignoreMessagesTypes.indexOf(message.type) !== -1) {
    return
  }

  if (message.type === "sell" || message.type === "buy") {
    saveStore(
      message.type,
      "created",
      message.owner,
      message.title,
      message.map,
      message.x,
      message.y,
      []
    )
      .then(id => {})
      .catch(err => {
        logMessage("error", "Ошибка при создании/обновлении магазина", err)
      })
  } else if (message.type === "card") {
    getCard(message.item)
      .then(card => {
        if (card !== null) {
          return saveCard(card.id, message.owner).then(id => {})
        }
      })
      .catch(err => {
        logMessage("error", "Ошибка при получении/сохранении карты", err)
      })
  }
})

con.addListener("pm", (from: string, mes: string) => {
  // @NOTE Обрабатываем сообщения в ПМ только от FreeRO
  if (from !== cfg.operator) {
    return
  }

  const pm = parsePm(mes)

  // @NOTE Добавляем сообщение к обработке только в том случае, если есть активный элемент очереди и сообщение не текст
  if (queueItem !== null && pm.type !== "text") {
    queueBuf.push(pm)

    if (queueTimeout !== null) {
      clearTimeout(queueTimeout)
    }

    queueTimeout = setTimeout(handleQueue, cfg.queueTimeout)
  }
})

con.addListener("error", err => {
  logMessage("error", "Проблема с соединением к IRC", err)
})

// @NOTE Запускаем обработку из БД
setTimeout(tick, cfg.tickTimeout)
