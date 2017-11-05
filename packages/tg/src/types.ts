export interface Config {
  token: string
  admin: string[]
}

export type Nullable<T> = null | T

export interface WelcomeStep {
  type: "welcome"
}

export interface SubscribeSellStep {
  type: "subscribe-sell"
  id: null | number
}

export interface SubscribeBuyStep {
  type: "subscribe-buy"
  id: null | number
}

export interface SubscribeDeleteStep {
  type: "subscribe-delete"
}

export interface SearchSellStep {
  type: "search-sell"
}

export interface SearchBuyStep {
  type: "search-buy"
}

export type Step =
  | WelcomeStep
  | SubscribeSellStep
  | SubscribeBuyStep
  | SubscribeDeleteStep
  | SearchSellStep
  | SearchBuyStep

export interface ChatsSteps {
  [id: number]: Step
}
