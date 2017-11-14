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

export type StoreType = "sell" | "buy"
export type StoreState = "created" | "updated" | "sended" | "failure"

export interface Store {
  id: number
  created_at: Date
  updated_at: Date
  type: StoreType
  state: StoreState
  owner: string
  title: string
  map: string
  x: number
  y: number
}

export type Stores = Store[]

export interface StoreItem {
  id: number
  created_at: Date
  updated_at: Date
  store_id: number
  item_id: number
  count: number
  amount: number
}

export type StoreItems = StoreItem[]

export interface Card {
  id: number
  item_id: number
  created_at: Date
  owner: string
}

export type Cards = Card[]
