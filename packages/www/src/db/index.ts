import * as config from "config"
import * as mysql from "mysql"
import { Config } from "./types"
import logMessage from "../utils/log-message"

const cfg: Config = config.get("db")
const db = mysql.createConnection(cfg.uri)
const tick = () => db.query("SELECT 1")

db.on("error", err => {
  logMessage("error", "Проблема с соединением к БД", err)
})

setInterval(tick, cfg.aliveInterval)

export default db
