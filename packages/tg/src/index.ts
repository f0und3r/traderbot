import * as config from "config"
import * as TelegramBot from "node-telegram-bot-api"
import { Config } from "./types"

const cfg: Config = config.get("tg")
const bot = new TelegramBot(cfg.token, { polling: true })

bot.on("message", msg => {
  console.log(msg)
})
