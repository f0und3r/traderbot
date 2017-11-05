import * as Json from "elow/lib/Json/Decode"

export const watch = Json.map7(
  (a0, a1, a2, a3, a4, a5, a6) => ({
    id: a0,
    chat_id: a1,
    item_id: a2,
    created_at: a3,
    updated_at: a4,
    type: a5,
    amount: a6
  }),
  Json.field("id", Json.number),
  Json.field("chat_id", Json.number),
  Json.field("item_id", Json.number),
  Json.field("created_at", Json.date),
  Json.field("updated_at", Json.date),
  Json.field("type", Json.string),
  Json.field("amount", Json.number)
)

export const watches = Json.list(watch)
export const watchAtIndex0 = Json.index(0, watch)

export const insertResult = Json.map(
  a0 => ({
    insertId: a0
  }),
  Json.field("insertId", Json.number)
)

export const updateResult = Json.map(
  a0 => ({
    affectedRows: a0
  }),
  Json.field("affectedRows", Json.number)
)

export const deleteResult = Json.map(
  a0 => ({
    affectedRows: a0
  }),
  Json.field("affectedRows", Json.number)
)

export const item = Json.map2(
  (a0, a1) => ({
    id: a0,
    name_japanese: a1
  }),
  Json.field("id", Json.number),
  Json.field("name_japanese", Json.string)
)

export const items = Json.list(item)

export const storeItem = Json.map7(
  (a0, a1, a2, a3, a4, a5, a6) => ({
    id: a0,
    created_at: a1,
    updated_at: a2,
    store_id: a3,
    item_id: a4,
    count: a5,
    amount: a6
  }),
  Json.field("id", Json.number),
  Json.field("created_at", Json.date),
  Json.field("updated_at", Json.date),
  Json.field("store_id", Json.number),
  Json.field("item_id", Json.number),
  Json.field("count", Json.number),
  Json.field("amount", Json.number)
)

export const storeItems = Json.list(storeItem)

export const store = Json.map2(
  (t0, t1) => ({
    id: t0[0],
    created_at: t0[1],
    updated_at: t0[2],
    type: t0[3],
    state: t0[4],
    owner: t0[5],
    title: t0[6],
    map: t0[7],
    x: t1[0],
    y: t1[1]
  }),
  Json.mapTuple8(
    Json.field("id", Json.number),
    Json.field("created_at", Json.date),
    Json.field("updated_at", Json.date),
    Json.field("type", Json.string),
    Json.field("state", Json.string),
    Json.field("owner", Json.string),
    Json.field("title", Json.string),
    Json.field("map", Json.string)
  ),
  Json.mapTuple2(Json.field("x", Json.number), Json.field("y", Json.number))
)

export const stores = Json.list(store)
