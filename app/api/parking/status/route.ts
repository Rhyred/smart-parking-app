import { type NextRequest, NextResponse } from "next/server"
import { ref, get } from "firebase/database"
import { database } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slotId = searchParams.get("id")

    if (slotId) {
      // Get single slot
      const slotRef = ref(database, `parkingSlots/${slotId}`)
      const snapshot = await get(slotRef)

      if (snapshot.exists()) {
        return NextResponse.json(snapshot.val())
      } else {
        return NextResponse.json({ error: "Parking slot not found" }, { status: 404 })
      }
    } else {
      // Get all slots
      const slotsRef = ref(database, "parkingSlots")
      const snapshot = await get(slotsRef)

      if (snapshot.exists()) {
        return NextResponse.json(snapshot.val())
      } else {
        return NextResponse.json({})
      }
    }
  } catch (error) {
    console.error("Error getting parking status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
