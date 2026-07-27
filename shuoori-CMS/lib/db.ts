import dns from "node:dns"
import mongoose from "mongoose"

type CachedConnection = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: CachedConnection | undefined
}

const cached: CachedConnection = global.mongooseConnection ?? {
  conn: null,
  promise: null,
}

if (!global.mongooseConnection) {
  global.mongooseConnection = cached
}

async function normalizeMongoUri(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri
  }

  const servers = process.env.MONGODB_DNS_SERVERS || "1.1.1.1,8.8.8.8"
  dns.setServers(servers.split(",").map((server) => server.trim()).filter(Boolean))

  const parsed = new URL(uri)
  const records = await dns.promises.resolveSrv(`_mongodb._tcp.${parsed.hostname}`)
  const hosts = records.map((record) => `${record.name}:${record.port}`).join(",")
  const params = new URLSearchParams(parsed.search)

  try {
    const txtRecords = await dns.promises.resolveTxt(parsed.hostname)

    for (const record of txtRecords) {
      const txtParams = new URLSearchParams(record.join(""))

      txtParams.forEach((value, key) => {
        if (!params.has(key)) {
          params.set(key, value)
        }
      })
    }
  } catch {
    // TXT records provide Atlas options like replicaSet/authSource; keep going if unavailable.
  }

  if (!params.has("ssl") && !params.has("tls")) {
    params.set("ssl", "true")
  }

  const auth = parsed.username ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ""}@` : ""
  const dbPath = parsed.pathname === "/" ? "/" : parsed.pathname
  const query = params.toString()

  return `mongodb://${auth}${hosts}${dbPath}${query ? `?${query}` : ""}`
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI")
  }

  const normalizedUri = await normalizeMongoUri(uri)

  cached.promise ??= mongoose.connect(normalizedUri, {
    bufferCommands: false,
  })

  cached.conn = await cached.promise
  return cached.conn
}
