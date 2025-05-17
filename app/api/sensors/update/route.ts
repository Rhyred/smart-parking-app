import { type NextRequest, NextResponse } from "next/server"
import { updateSensorStatus, updateParkingSlotStatus } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body.sensorId || !body.status || !body.slotId) {
      return NextResponse.json({ error: "Sensor ID, status, and slot ID are required" }, { status: 400 })
    }

    // Update sensor status
    await updateSensorStatus(body.sensorId, body.status === "online" ? "online" : "offline", body.batteryLevel)

    // Update parking slot status based on sensor reading
    if (body.isOccupied !== undefined) {
      await updateParkingSlotStatus(body.slotId, body.isOccupied ? "occupied" : "available")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating sensor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
