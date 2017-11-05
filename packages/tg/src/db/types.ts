export interface Config {
  uri: string
  aliveInterval: number
}

export type WatchType = "sell" | "buy"

export interface Watch {
  id: number
  chat_id: number
  item_id: number
  created_at: Date
  updated_at: Date
  type: WatchType
  amount: number
}

export type Watches = Watch[]

export interface Item {
  id: number
  name_japanese: string
}

export type Items = Item[]
