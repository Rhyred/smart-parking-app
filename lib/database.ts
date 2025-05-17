import { ref, set, push, get, update } from "firebase/database"
import { database } from "@/lib/firebase"
import type { BookingCreate, Booking, User } from "@/lib/types"

// Helper function to check if database is initialized
function checkDatabase() {
  if (!database) {
    throw new Error("Database not initialized")
  }
}

/**
 * Initialize database 
 */
export async function initializeDatabase() {
  checkDatabase()

  try {
    // Check if data already exists
    const dbRef = ref(database, "/")
    const snapshot = await get(dbRef)

    if (snapshot.exists()) {
      console.log("Database already initialized")
      return
    }

    // Import data from JSON file
    const data = {
      parkingSlots: {
        slot1: {
          id: "slot1",
          status: "available",
          sensorId: "sensor1",
          zone: "A",
          updatedAt: Date.now(),
        },
        slot2: {
          id: "slot2",
          status: "occupied",
          sensorId: "sensor2",
          zone: "A",
          updatedAt: Date.now(),
        },
        slot3: {
          id: "slot3",
          status: "available",
          sensorId: "sensor3",
          zone: "A",
          updatedAt: Date.now(),
        },
        slot4: {
          id: "slot4",
          status: "booked",
          sensorId: "sensor4",
          zone: "B",
          updatedAt: Date.now(),
        },
        slot5: {
          id: "slot5",
          status: "available",
          sensorId: "sensor5",
          zone: "B",
          updatedAt: Date.now(),
        },
        slot6: {
          id: "slot6",
          status: "available",
          sensorId: "sensor6",
          zone: "B",
          updatedAt: Date.now(),
        },
        slot7: {
          id: "slot7",
          status: "occupied",
          sensorId: "sensor7",
          zone: "C",
          updatedAt: Date.now(),
        },
        slot8: {
          id: "slot8",
          status: "available",
          sensorId: "sensor8",
          zone: "C",
          updatedAt: Date.now(),
        },
        slot9: {
          id: "slot9",
          status: "available",
          sensorId: "sensor9",
          zone: "C",
          updatedAt: Date.now(),
        },
        slot10: {
          id: "slot10",
          status: "booked",
          sensorId: "sensor10",
          zone: "D",
          updatedAt: Date.now(),
        },
      },
      sensors: {
        sensor1: {
          id: "sensor1",
          status: "online",
          batteryLevel: 85,
          lastPing: Date.now(),
        },
        sensor2: {
          id: "sensor2",
          status: "online",
          batteryLevel: 72,
          lastPing: Date.now(),
        },
        sensor3: {
          id: "sensor3",
          status: "offline",
          batteryLevel: 30,
          lastPing: Date.now() - 1000 * 60 * 60, // 1 hour ago
        },
        sensor4: {
          id: "sensor4",
          status: "online",
          batteryLevel: 95,
          lastPing: Date.now(),
        },
        sensor5: {
          id: "sensor5",
          status: "online",
          batteryLevel: 65,
          lastPing: Date.now(),
        },
        sensor6: {
          id: "sensor6",
          status: "online",
          batteryLevel: 78,
          lastPing: Date.now(),
        },
        sensor7: {
          id: "sensor7",
          status: "online",
          batteryLevel: 92,
          lastPing: Date.now(),
        },
        sensor8: {
          id: "sensor8",
          status: "offline",
          batteryLevel: 15,
          lastPing: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        },
        sensor9: {
          id: "sensor9",
          status: "online",
          batteryLevel: 88,
          lastPing: Date.now(),
        },
        sensor10: {
          id: "sensor10",
          status: "online",
          batteryLevel: 76,
          lastPing: Date.now(),
        },
      },
    }

    // Set data to Firebase
    await set(dbRef, data)

    console.log("Database initialized with demo data")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

/**
 * Create a new user
 */
export async function createUser(userId: string, userData: Partial<User>): Promise<User> {
  checkDatabase()

  const userRef = ref(database, `users/${userId}`)

  const user: User = {
    id: userId,
    name: userData.name || "Guest User",
    email: userData.email || "guest@example.com",
    role: userData.role || "user",
    createdAt: Date.now(),
  }

  await set(userRef, user)
  return user
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  checkDatabase()

  const userRef = ref(database, `users/${userId}`)
  const snapshot = await get(userRef)

  if (snapshot.exists()) {
    return snapshot.val() as User
  }

  return null
}

/**
 * Update parking slot status
 */
export async function updateParkingSlotStatus(
  slotId: string,
  status: "available" | "occupied" | "booked",
): Promise<void> {
  checkDatabase()

  const slotRef = ref(database, `parkingSlots/${slotId}`)
  await update(slotRef, {
    status,
    updatedAt: Date.now(),
  })
}

/**
 * Update sensor status
 */
export async function updateSensorStatus(
  sensorId: string,
  status: "online" | "offline",
  batteryLevel?: number,
): Promise<void> {
  checkDatabase()

  const sensorRef = ref(database, `sensors/${sensorId}`)
  await update(sensorRef, {
    status,
    batteryLevel: batteryLevel || undefined,
    lastPing: Date.now(),
  })
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: BookingCreate): Promise<Booking> {
  checkDatabase()

  const bookingsRef = ref(database, "bookings")
  const newBookingRef = push(bookingsRef)

  const bookingId = newBookingRef.key as string

  const booking: Booking = {
    ...bookingData,
    id: bookingId,
  }

  await set(newBookingRef, booking)

  // Update slot status to booked
  await updateParkingSlotStatus(bookingData.slotId, "booked")

  return booking
}

/**
 * Update booking payment status
 */
export async function updateBookingPayment(
  bookingId: string,
  paymentMethod: "qris" | "idcard",
  paymentStatus: "pending" | "paid" | "failed",
): Promise<void> {
  checkDatabase()

  const bookingRef = ref(database, `bookings/${bookingId}`)
  await update(bookingRef, {
    paymentMethod,
    paymentStatus,
    updatedAt: Date.now(),
  })
}

/**
 * Get bookings by user ID
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  checkDatabase()

  const bookingsRef = ref(database, "bookings")
  const snapshot = await get(bookingsRef)

  if (snapshot.exists()) {
    const bookings: Booking[] = []
    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val() as Booking
      if (booking.userId === userId) {
        bookings.push(booking)
      }
    })
    return bookings
  }

  return []
}
