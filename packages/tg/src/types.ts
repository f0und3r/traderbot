import * as TelegramBot from "node-telegram-bot-api"

export interface Config {
  token: string
  admin: number[]
  tickTimeout: number
}

export type Nullable<T> = null | T

// export interface WelcomeState {
//   type: "welcome"
// }

// export interface SubscribeSellState {
//   type: "subscribe-sell"
//   id: null | number
// }

// export interface SubscribeBuyState {
//   type: "subscribe-buy"
//   id: null | number
// }

// export interface SubscribeDeleteState {
//   type: "subscribe-delete"
// }

// export interface SearchSellState {
//   type: "search-sell"
// }

// export interface SearchBuyState {
//   type: "search-buy"
// }

// export type State =
//   | WelcomeState
//   | SubscribeSellState
//   | SubscribeBuyState
//   | SubscribeDeleteState
//   | SearchSellState
//   | SearchBuyState
export interface CommandsState {
  type: "commands"
}

export interface SubscribeSell {
  type: "subscribe-sell"
  step: "message" | "input"
  id: Nullable<number>
  amount: Nullable<number>
}

export interface SubscribeBuy {
  type: "subscribe-buy"
  step: "message" | "input"
  id: Nullable<number>
  amount: Nullable<number>
}

export interface SubscribeList {
  type: "subscribe-list"
}

export interface SubscribeDelete {
  type: "subscribe-delete"
  id: Nullable<number>
}

export interface SearchSell {
  type: "search-sell"
  id: Nullable<number>
}

export interface SearchBuy {
  type: "search-buy"
  id: Nullable<number>
}

export interface SearchCards {
  type: "search-cards"
  id: Nullable<number>
}

export type State =
  | CommandsState
  | SubscribeSell
  | SubscribeBuy
  | SubscribeList
  | SubscribeDelete
  | SearchSell
  | SearchBuy
  | SearchCards

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
