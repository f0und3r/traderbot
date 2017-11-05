import * as config from "config"
import * as TelegramBot from "node-telegram-bot-api"
import { Config, States, WelcomeState, State } from "./types"
import listeners from "./listeners"

const cfg: Config = config.get("tg")
const bot = new TelegramBot(cfg.token, { polling: true })

const states: States = {}
const defaultState: WelcomeState = { type: "welcome" }

bot.on("message", (msg: TelegramBot.Message) => {
  const messageListeners = listeners.slice()
  const id = msg.chat.id
  const state = states[id] || defaultState

  const updateState = (state: State) => {
    states[id] = state
  }

  const next = () => {
    const listener = messageListeners.shift()
    if (listener) {
      listener(bot, msg, state, updateState, next)
    }
  }

  next()
})
