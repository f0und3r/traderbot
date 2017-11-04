import * as irc from "irc"
import * as config from "config"
import { Config, QueueItem, Queue, Nullable, Pm, ItemPm } from "./types"
import parseMessage from "./utils/parse-message"
import parsePm from "./utils/parse-pm"
import { saveStore } from "./db/queries"

const cfg: Config = config.get("irc")
const con = new irc.Client(cfg.host, cfg.nick, { channels: cfg.channels })

const queue: Queue = []

let buf: Pm[] = []
let item: Nullable<QueueItem> = null
let timeout: Nullable<NodeJS.Timer> = null

// @NOTE Очистка текущего тика и подготовка следующего
const flushAndTick = () => {
  buf = []
  item = null
  timeout = setTimeout(tick, cfg.queueTimeout)
}

const tick = () => {
  if (item === null) {
    item = queue.shift() || null

    if (item) {
      const cmd = item.type === "sell" ? "shop" : "buy"
      con.say(cfg.operator, `@${cmd} ${item.owner}`)

      // @NOTE Добавляем двойной таймаут на тот случай, если в PM вдруг ответа не будет
      timeout = setTimeout(tick, cfg.queueTimeout * 2)
    }
  } else {
    // @TODO TypeScript пока не слишком умный (as ItemPm[])
    const owner = buf.find(pm => pm.type === "owner")
    const items = buf.filter(pm => pm.type === "item") as ItemPm[]

    // @TODO TypeScript пока не слишком умный (owner.type === "owner")
    if (owner && owner.type === "owner" && items.length > 0) {
      // @TODO
    } else {
      flushAndTick()
    }
  }
}

con.addListener("message", (from: string, to: string, mes: string) => {
  // @NOTE Обрабатываем сообщения в #main только от FreeRO
  if (from !== cfg.server) {
    return
  }

  const message = parseMessage(mes)

  if (message.type === "sell") {
    queue.push({
      type: "sell",
      owner: message.owner
    })
  } else if (message.type === "buy") {
    queue.push({
      type: "buy",
      owner: message.owner
    })
  }

  // @NOTE Запускаем tick только в том случае, если очередь не пустая, а предыдущий tick полностью закончен
  if (queue.length !== 0 && item === null && timeout !== null) {
    timeout = setTimeout(tick, cfg.queueTimeout)
  }
})

con.addListener("pm", (from: string, mes: string) => {
  // @NOTE Обрабатываем сообщения в ПМ только от FreeRO
  if (from !== cfg.operator) {
    return
  }

  const pm = parsePm(mes)

  // @NOTE Добавляем сообщение к обработке только в том случае, если есть активный tick и сообщение не текст
  if (item !== null && pm.type !== "text") {
    buf.push(pm)

    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(tick, cfg.queueTimeout)
  }
})

con.addListener("error", err => {
  // @TODO logMessage
  console.error("Проблема с соединением к IRC", err)
})
