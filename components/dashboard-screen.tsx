"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Home, Settings, Info, Car, LogOut, Battery, Wifi, WifiOff } from 'lucide-react'
import { motion } from "framer-motion"
import { useAuthContext } from "./auth-context"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import type { ParkingSlot, Sensor } from "@/lib/types"

interface DashboardScreenProps {
  onNavigate: (screen: "login" | "dashboard" | "booking" | "about") => void
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { user, isGuest, logout } = useAuthContext()
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([])
  const [sensors, setSensors] = useState<Record<string, Sensor>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mendapatkan data slot parkir dari Firebase
  useEffect(() => {
    const slotsRef = ref(database, "parkingSlots")
    const sensorsRef = ref(database, "sensors")
    
    // Subscribe ke perubahan slot parkir
    const unsubscribeSlots = onValue(
      slotsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const slots: ParkingSlot[] = []
          snapshot.forEach((childSnapshot) => {
            slots.push({
              id: childSnapshot.key as string,
              ...childSnapshot.val(),
            })
          })
          setParkingSlots(slots)
        } else {
          setParkingSlots([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error getting parking slots:", error)
        setError("Gagal memuat data slot parkir")
        setLoading(false)
      }
    )
    
    // Subscribe ke perubahan sensor
    const unsubscribeSensors = onValue(
      sensorsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const sensorsData: Record<string, Sensor> = {}
          snapshot.forEach((childSnapshot) => {
            sensorsData[childSnapshot.key as string] = {
              id: childSnapshot.key as string,
              ...childSnapshot.val(),
            }
          })
          setSensors(sensorsData)
        }
      },
      (error) => {
        console.error("Error getting sensors:", error)
      }
    )
    
    return () => {
      unsubscribeSlots()
      unsubscribeSensors()
    }
  }, [])

  // Fungsi untuk menangani klik pada slot parkir
  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === "available") {
      onNavigate("booking")
    } else {
      // Tampilkan informasi slot yang sudah terisi/dibooking
      alert(`Slot ${slot.id} ${slot.status === "occupied" ? "sedang terisi" : "sudah dibooking"}`)
    }
  }

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      await logout()
      onNavigate("login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // Fungsi untuk mendapatkan warna berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600"
      case "occupied":
        return "text-red-600"
      case "booked":
        return "text-orange-500"
      default:
        return "text-gray-600"
    }
  }

  // Fungsi untuk mendapatkan border berdasarkan status
  const getStatusBorder = (status: string) => {
    switch (status) {
      case "available":
        return "border-green-400"
      case "occupied":
        return "border-red-400"
      case "booked":
        return "border-orange-400"
      default:
        return "border-gray-400"
    }
  }

  // Fungsi untuk mendapatkan sensor berdasarkan ID
  const getSensor = (sensorId: string) => {
    return sensors[sensorId]
  }

  // Fungsi untuk mendapatkan ikon battery berdasarkan level
  const getBatteryIcon = (level: number) => {
    if (level > 75) return "bg-green-500"
    if (level > 50) return "bg-yellow-500"
    if (level > 25) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <motion.div
      className="flex flex-col h-[600px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <div className="bg-[#1a1a3a] text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => onNavigate("login")}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
        </div>
        <div className="flex items-center">
          <button onClick={handleLogout} className="flex items-center">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-4 overflow-y-auto">
        {/* Status pengguna */}
        <motion.div className="mb-4 p-3 bg-gray-100 rounded-lg" variants={itemVariants}>
          <p className="text-sm">
            Status: <span className="font-medium">{isGuest ? "Tamu" : "Pengguna Terdaftar"}</span>
          </p>
          <p className="text-xs text-gray-500">
            {isGuest
              ? "Anda hanya dapat melihat status dan membayar dengan QRIS"
              : "Anda dapat menggunakan ID Card untuk akses"}
          </p>
        </motion.div>

        {/* Judul slot parkir */}
        <motion.h2 className="text-lg font-semibold mb-3" variants={itemVariants}>
          Status Slot Parkir
        </motion.h2>

        {loading ? (
          // Loading state
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-lg flex flex-col items-center justify-center p-4 bg-gray-100 animate-pulse"
                variants={itemVariants}
              />
            ))}
          </div>
        ) : error ? (
          // Error state
          <motion.div className="p-4 bg-red-100 text-red-700 rounded-lg" variants={itemVariants}>
            {error}
          </motion.div>
        ) : (
          // Grid slot parkir
          <div className="grid grid-cols-2 gap-4">
            {parkingSlots.map((slot) => {
              const sensor = getSensor(slot.sensorId)
              
              return (
                <motion.button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center p-4 bg-[#e8e8f7] relative overflow-hidden border-2 ${getStatusBorder(
                    slot.status
                  )}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Car className={`h-10 w-10 mb-2 ${getStatusColor(slot.status)}`} />
                  <span className={`text-sm font-medium ${getStatusColor(slot.status)}`}>
                    {slot.status === "available"
                      ? "Tersedia"
                      : slot.status === "occupied"
                      ? "Terisi"
                      : "Dibooking"}
                  </span>
                  <span className="text-xs mt-1 text-gray-500">Slot {slot.id.replace("slot", "")}</span>
                  
                  {/* Indikator sensor */}
                  {sensor && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {/* Status koneksi */}
                      {sensor.status === "online" ? (
                        <Wifi className="h-3 w-3 text-green-500" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-red-500" />
                      )}
                      
                      {/* Battery level */}
                      {sensor.batteryLevel !== undefined && (
                        <div className="w-6 h-3 bg-gray-200 rounded-sm overflow-hidden">
                          <div
                            className={`h-full ${getBatteryIcon(sensor.batteryLevel)}`}
                            style={{ width: `${sensor.batteryLevel}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Indikator update terakhir */}
                  <div className="absolute bottom-1 right-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        Date.now() - slot.updatedAt < 10000 ? "bg-green-500 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Legenda */}
        <motion.div className="mt-4 flex flex-wrap gap-3 text-xs" variants={itemVariants}>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Tersedia</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Terisi</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
            <span>Dibooking</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center p-2 text-[#4f46e5]">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
          <button onClick={() => onNavigate("about")} className="flex flex-col items-center p-2 text-gray-500">
            <Info className="h-6 w-6" />
            <span className="text-xs mt-1">About</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
