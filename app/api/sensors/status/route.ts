import { type NextRequest, NextResponse } from "next/server"
import { ref, get } from "firebase/database"
import { database } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sensorId = searchParams.get("id")

    if (sensorId) {
      // Get single sensor
      const sensorRef = ref(database, `sensors/${sensorId}`)
      const snapshot = await get(sensorRef)

      if (snapshot.exists()) {
        return NextResponse.json(snapshot.val())
      } else {
        return NextResponse.json({ error: "Sensor not found" }, { status: 404 })
      }
    } else {
      // Get all sensors
      const sensorsRef = ref(database, "sensors")
      const snapshot = await get(sensorsRef)

      if (snapshot.exists()) {
        return NextResponse.json(snapshot.val())
      } else {
        return NextResponse.json({})
      }
    }
  } catch (error) {
    console.error("Error getting sensor status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
