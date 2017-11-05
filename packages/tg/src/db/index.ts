import * as config from "config"
import * as mysql from "mysql"
import { Config } from "./types"

const cfg: Config = config.get("db")
const db = mysql.createConnection(cfg.uri)
const tick = () => db.query("SELECT 1")

db.on("error", err => {
  // @TODO logMessage
  console.error("Проблема с соединением к БД", err)
})

setInterval(tick, cfg.aliveInterval)

export default db
