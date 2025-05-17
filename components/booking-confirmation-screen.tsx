"use client"

import { useState } from "react"
import { ArrowLeft, Home, Settings, Info, CreditCard, QrCode, Calendar, Clock } from 'lucide-react'
import { motion } from "framer-motion"
import { useAuthContext } from "./auth-context"
import { createBooking, updateBookingPayment } from "@/lib/database"

interface BookingConfirmationScreenProps {
  onNavigate: (screen: "login" | "dashboard" | "booking" | "about") => void
}

export default function BookingConfirmationScreen({ onNavigate }: BookingConfirmationScreenProps) {
  const { user, isGuest } = useAuthContext()
  const [bookingDate, setBookingDate] = useState(new Date())
  const [duration, setDuration] = useState(1)
  const [showQRCode, setShowQRCode] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Format tanggal
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format waktu
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Hitung harga berdasarkan durasi
  const calculatePrice = () => {
    const basePrice = 5000 // Rp 5.000 per jam
    return basePrice * duration
  }

  // Handle konfirmasi booking
  const handleConfirmBooking = async (method: "idcard" | "qris") => {
    setLoading(true)
    setError(null)
    
    try {
      // Untuk demo, kita gunakan slot1
      const slotId = "slot1"
      const startTime = bookingDate.getTime()
      const endTime = startTime + duration * 60 * 60 * 1000
      
      // Buat booking
      const booking = await createBooking({
        userId: user?.id || null,
        slotId,
        startTime,
        endTime,
        duration,
        status: "pending",
        paymentMethod: method,
        paymentStatus: "pending",
        amount: calculatePrice(),
        createdAt: Date.now(),
      })
      
      setBookingId(booking.id)
      
      if (method === "qris") {
        setShowQRCode(true)
      } else {
        // Simulasi konfirmasi langsung dengan ID Card
        await updateBookingPayment(booking.id, "idcard", "paid")
        setBookingConfirmed(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat membuat booking")
    } finally {
      setLoading(false)
    }
  }

  // Handle pembayaran QRIS berhasil
  const handlePaymentSuccess = async () => {
    if (!bookingId) return
    
    setLoading(true)
    setError(null)
    
    try {
      await updateBookingPayment(bookingId, "qris", "paid")
      setBookingConfirmed(true)
      setShowQRCode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pembayaran")
    } finally {
      setLoading(false)
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

  return (
    <motion.div
      className="flex flex-col h-[600px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <div className="bg-[#1a1a3a] text-white p-4 flex items-center">
        <button onClick={() => onNavigate("dashboard")}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold mx-auto pr-6">Booking Confirmation</h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        {bookingConfirmed ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Booking Berhasil!</h2>
            <p className="text-gray-600 text-center mb-6">Slot parkir telah berhasil dibooking.</p>
            <div className="bg-gray-100 p-4 rounded-lg w-full mb-6">
              <p className="font-semibold">ID #{bookingId}</p>
              <p>{formatDate(bookingDate)}</p>
              <p>Waktu: {formatTime(bookingDate)}</p>
              <p>Durasi: {duration} jam</p>
            </div>
            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full py-3 bg-[#4f46e5] text-white rounded-md font-medium"
            >
              Kembali ke Dashboard
            </button>
          </motion.div>
        ) : showQRCode ? (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold mb-4">Scan QRIS untuk Pembayaran</h2>
            <div className="bg-white p-2 border border-gray-300 rounded-lg mb-4">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Total: Rp {calculatePrice().toLocaleString("id-ID")}</p>
            <p className="text-xs text-gray-500 mb-6">Silakan scan kode QR di atas untuk melakukan pembayaran</p>

            {/* Simulasi tombol pembayaran berhasil */}
            <button
              onClick={handlePaymentSuccess}
              className="w-full py-3 bg-green-600 text-white rounded-md font-medium mb-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Simulasi Pembayaran Berhasil"}
            </button>
            <button
              onClick={() => setShowQRCode(false)}
              className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-md font-medium disabled:opacity-50"
              disabled={loading}
            >
              Kembali
            </button>
          </motion.div>
        ) : (
          <>
            <motion.p className="text-gray-800 mb-6" variants={itemVariants}>
              Silakan konfirmasi detail booking Anda dan lanjutkan dengan pembayaran.
            </motion.p>

            <motion.div className="bg-gray-100 p-4 rounded-lg mb-6" variants={itemVariants}>
              <p className="font-semibold">Slot Parkir: A1</p>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <p>{formatDate(bookingDate)}</p>
              </div>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <p>Waktu: {formatTime(bookingDate)}</p>
              </div>
              <p className="mt-2">Durasi: {duration} jam</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="font-medium">Total: Rp {calculatePrice().toLocaleString("id-ID")}</p>
              </div>
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Durasi</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setDuration(hours)}
                    className={`flex-1 py-2 rounded-md text-sm ${
                      duration === hours ? "bg-[#4f46e5] text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {hours} jam
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              <h3 className="font-medium mb-2">Metode Akses & Pembayaran</h3>

              {!isGuest && (
                <button
                  onClick={() => handleConfirmBooking("idcard")}
                  className="w-full flex items-center gap-3 bg-[#e8e8f7] p-4 rounded-lg hover:bg-[#d8d8f0] transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <CreditCard className="h-6 w-6" />
                  <div className="text-left">
                    <span className="font-medium block">Gunakan ID Card</span>
                    <span className="text-xs text-gray-500">Untuk pengguna terdaftar</span>
                  </div>
                </button>
              )}

              <button
                onClick={() => handleConfirmBooking("qris")}
                className="w-full flex items-center gap-3 bg-[#e8e8f7] p-4 rounded-lg hover:bg-[#d8d8f0] transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <QrCode className="h-6 w-6" />
                <div className="text-left">
                  <span className="font-medium block">Bayar dengan QRIS</span>
                  <span className="text-xs text-gray-500">Untuk semua pengguna</span>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button onClick={() => onNavigate("dashboard")} className="flex flex-col items-center p-2 text-[#4f46e5]">
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
