import * as Json from "elow/lib/Json/Decode"

export const getCards = Json.map2(
  (a0, a1) => ({
    skip: a0,
    limit: a1
  }),
  Json.field("skip", Json.string),
  Json.field("limit", Json.string)
)
