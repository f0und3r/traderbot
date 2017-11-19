export interface Config {
  uri: string
  aliveInterval: number
}

export interface Card {
  id: number
  item_id: number
  created_at: Date
  owner: string
}

export type Cards = Card[]
