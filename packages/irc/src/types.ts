import { StoreType } from "./db/types"

export interface Config {
  host: string
  nick: string
  channels: string[]
  server: string
  operator: string
  tickTimeout: number
  queueTimeout: number
}

export interface QueueItem {
  type: StoreType
  owner: string
}

export type Queue = QueueItem[]

export type Nullable<T> = null | T

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

export interface RefineBreakMessage {
  type: "refine-break"
  owner: string
  refine: number
  item: string
}

export type Message =
  | TextMessage
  | CardMessage
  | RefineMessage
  | BuyMessage
  | SellMessage
  | RefineBreakMessage

export interface TextPm {
  type: "text"
  text: string
}

export interface OwnerPm {
  type: "owner"
  title: string
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
