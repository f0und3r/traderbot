export interface Config {
  host: string
  nick: string
  channels: string[]
  server: string
  operator: string
}

export interface TextMessage {
  type: "text"
  text: string
}

export interface CardMessage {
  type: "card"
  owner: string
  item: string
}

export interface RefineMessage {
  type: "refine"
  owner: string
  refine: number
  item: string
}

export interface BuyMessage {
  type: "buy"
  owner: string
  title: string
  map: string
  x: number
  y: number
}

export interface SellMessage {
  type: "sell"
  owner: string
  title: string
  map: string
  x: number
  y: number
}

export type Message =
  | TextMessage
  | CardMessage
  | RefineMessage
  | BuyMessage
  | SellMessage

export interface TextPm {
  type: "text"
  text: string
}

export interface OwnerPm {
  type: "owner"
  owner: string
  map: string
  x: number
  y: number
}

export interface ItemPm {
  type: "item"
  item: string
  amount: number
  count: number
}

export type Pm = TextPm | OwnerPm | ItemPm
