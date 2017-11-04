export interface Config {
  uri: string
  aliveInterval: number
}

export type StoreType = "sell" | "buy"

export interface Store {
  id: number
  createdAt: Date
  updatedAt: Date
  type: StoreType
  owner: string
  title: string
  map: string
  x: number
  y: number
}
