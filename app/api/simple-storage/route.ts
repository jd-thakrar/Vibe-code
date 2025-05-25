import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

// Simple file-based storage as alternative to complex databases
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, payload } = data

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data")
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    const timestamp = new Date().toISOString()
    const filename = `${type}_${Date.now()}.json`
    const filepath = path.join(dataDir, filename)

    const record = {
      id: `${type}_${Date.now()}`,
      timestamp,
      type,
      ...payload,
    }

    await fs.writeFile(filepath, JSON.stringify(record, null, 2))

    // Also append to a master log file
    const logFile = path.join(dataDir, "master_log.jsonl")
    const logEntry = JSON.stringify(record) + "\n"

    try {
      await fs.appendFile(logFile, logEntry)
    } catch {
      await fs.writeFile(logFile, logEntry)
    }

    return NextResponse.json({
      success: true,
      id: record.id,
      message: "Data stored successfully",
    })
  } catch (error) {
    console.error("Storage error:", error)
    return NextResponse.json({ error: "Failed to store data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const dataDir = path.join(process.cwd(), "data")

    try {
      await fs.access(dataDir)
    } catch {
      return NextResponse.json({ data: [] })
    }

    const files = await fs.readdir(dataDir)
    const dataFiles = files.filter((file) => file.endsWith(".json") && file !== "master_log.jsonl")

    const records = []
    for (const file of dataFiles) {
      if (!type || file.startsWith(type)) {
        const content = await fs.readFile(path.join(dataDir, file), "utf-8")
        records.push(JSON.parse(content))
      }
    }

    // Sort by timestamp, newest first
    records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ data: records })
  } catch (error) {
    console.error("Retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve data" }, { status: 500 })
  }
}
