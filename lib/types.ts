// User types
export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  createdAt: number
}

// Parking Slot types
export interface ParkingSlot {
  id: string
  status: "available" | "occupied" | "booked"
  sensorId: string
  zone: string
  updatedAt: number
}

// Booking types
export interface Booking {
  id: string
  userId: string | null
  slotId: string
  startTime: number
  endTime: number
  duration: number
  status: "pending" | "active" | "completed" | "cancelled"
  paymentMethod: "qris" | "idcard"
  paymentStatus: "pending" | "paid" | "failed"
  amount: number
  createdAt: number
}

// Sensor types
export interface Sensor {
  id: string
  status: "online" | "offline"
  batteryLevel?: number
  lastPing: number
}

// Booking creation type
export type BookingCreate = Omit<Booking, "id">
