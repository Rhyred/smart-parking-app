"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginScreen from "@/components/login-screen"
import DashboardScreen from "@/components/dashboard-screen"
import BookingConfirmationScreen from "@/components/booking-confirmation-screen"
import AboutScreen from "@/components/about-screen"
import { AnimatePresence } from "framer-motion"
import { AuthProvider } from "@/components/auth-context"
import { initializeDatabase } from "@/lib/database"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "dashboard" | "booking" | "about">("login")
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const router = useRouter()

  // Inisialisasi database Firebase
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase()
        setIsInitialized(true)
      } catch (error) {
        console.error("Error initializing database:", error)
        setInitError(error instanceof Error ? error.message : "Terjadi kesalahan saat inisialisasi")
        setIsInitialized(true) // Set to true anyway to continue
      }
    }

    init()
  }, [])

  const navigateTo = (screen: "login" | "dashboard" | "booking" | "about") => {
    setCurrentScreen(screen)
  }

  if (!isInitialized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="w-16 h-16 border-4 border-t-[#4f46e5] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat aplikasi...</p>
          <p className="text-gray-600">Ngopi Dulu kawan hehe</p>
        </div>
      </main>
    )
  }

  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        {initError && (
          <div className="w-full max-w-md mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error:</p>
            <p>{initError}</p>
          </div>
        )}
        <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-lg">
          <AnimatePresence mode="wait">
            {currentScreen === "login" && <LoginScreen key="login" onNavigate={navigateTo} />}
            {currentScreen === "dashboard" && <DashboardScreen key="dashboard" onNavigate={navigateTo} />}
            {currentScreen === "booking" && <BookingConfirmationScreen key="booking" onNavigate={navigateTo} />}
            {currentScreen === "about" && <AboutScreen key="about" onNavigate={navigateTo} />}
          </AnimatePresence>
        </div>
      </main>
    </AuthProvider>
  )
}
