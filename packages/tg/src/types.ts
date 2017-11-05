import * as TelegramBot from "node-telegram-bot-api"

export interface Config {
  token: string
  admin: number[]
  tickTimeout: number
}

export type Nullable<T> = null | T

export interface WelcomeState {
  type: "welcome"
}

export interface SubscribeSellState {
  type: "subscribe-sell"
  id: null | number
}

export interface SubscribeBuyState {
  type: "subscribe-buy"
  id: null | number
}

export interface SubscribeDeleteState {
  type: "subscribe-delete"
}

export interface SearchSellState {
  type: "search-sell"
}

export interface SearchBuyState {
  type: "search-buy"
}

export type State =
  | WelcomeState
  | SubscribeSellState
  | SubscribeBuyState
  | SubscribeDeleteState
  | SearchSellState
  | SearchBuyState

export interface States {
  [id: number]: State
}

export type ItemIdToName = (itemId: number) => string

export type Listener = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  state: State,
  updateState: (state: State) => void,
  next: () => void
) => void

export type Listeners = Listener[]
