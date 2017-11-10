export type LogLevel = "error" | "debug"

export default (level: LogLevel, ...argv: any[]): void => {
  const d = new Date()
  if (level === "error") {
    console.error(`[${d.toISOString()}]`, ...argv)
  } else {
    console.log(`[${d.toISOString()}]`, ...argv)
  }
}
