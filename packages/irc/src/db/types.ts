export interface Config {
  uri: string
  aliveInterval: number
}

export type StoreType = "sell" | "buy"
export type StoreState = "created" | "updated" | "sended"

export interface Store {
  id: number
  createdAt: Date
  updatedAt: Date
  type: StoreType
  state: StoreState
  owner: string
  title: string
  map: string
  x: number
  y: number
}

export type Stores = Store[]

export interface SaveStoreItem {
  item: number
  amount: number
  count: number
}

export interface Item {
  id: number
  name_japanese: string
}

export type Items = Item[]
