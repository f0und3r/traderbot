import * as Json from "elow/lib/Json/Decode"

export const store = Json.map2(
  (t0, t1) => ({
    id: t0[0],
    createdAt: t0[1],
    updatedAt: t0[2],
    type: t0[3],
    owner: t0[4],
    title: t0[5],
    map: t0[6],
    x: t0[7],
    y: t1[0]
  }),
  Json.mapTuple8(
    Json.field("id", Json.number),
    Json.field("created_at", Json.date),
    Json.field("updated_at", Json.date),
    Json.field("type", Json.string),
    Json.field("owner", Json.string),
    Json.field("title", Json.string),
    Json.field("map", Json.string),
    Json.field("x", Json.number)
  ),
  Json.mapTuple1(Json.field("y", Json.number))
)

export const stores = Json.list(store)
export const storeAtIndex0 = Json.index(0, store)

export const insertResult = Json.map(
  a0 => ({
    insertId: a0
  }),
  Json.field("insertId", Json.number)
)
