import * as irc from "irc"
import * as config from "config"
import { Config } from "./types"
import parseMessage from "./utils/parse-message"
import parsePm from "./utils/parse-pm"

const cfg: Config = config.get("irc")
const con = new irc.Client(cfg.host, cfg.nick, { channels: cfg.channels })

// const queue

con.addListener("message", (from: string, to: string, mes: string) => {
  // @NOTE Обрабатываем сообщения в #main только от Server
  if (from !== cfg.server) {
    return
  }

  const message = parseMessage(mes)
})

con.addListener("pm", (from: string, mes: string) => {
  // @NOTE Обрабатываем сообщения в ПМ только от FreeRO
  if (from !== cfg.operator) {
    return
  }

  const pm = parsePm(mes)
})

con.addListener("error", err => {
  // @TODO logMessage
  console.error("Проблема с соединением к IRC", err)
})
