import * as Json from "elow/lib/Json/Decode"

export const card = Json.map4(
  (a0, a1, a2, a3) => ({
    id: a0,
    item_id: a1,
    created_at: a2,
    owner: a3
  }),
  Json.field("id", Json.number),
  Json.field("item_id", Json.number),
  Json.field("created_at", Json.date),
  Json.field("owner", Json.string)
)

export const cards = Json.list(card)

export const item = Json.map2(
  (a0, a1) => ({
    id: a0,
    name_japanese: a1
  }),
  Json.field("id", Json.number),
  Json.field("name_japanese", Json.string)
)

export const items = Json.list(item)
