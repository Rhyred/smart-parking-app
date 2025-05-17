"use client"

import { useState } from "react"
import { ArrowLeft } from 'lucide-react'
import Image from "next/image"
import { motion } from "framer-motion"
import { useAuthContext } from "./auth-context"
import { FcGoogle } from "react-icons/fc"

interface LoginScreenProps {
  onNavigate: (screen: "login" | "dashboard" | "booking" | "about") => void
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const { login, signup, loginWithGoogle, continueAsGuest } = useAuthContext()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (isSignUp) {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
      onNavigate("dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await loginWithGoogle()
      onNavigate("dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login dengan Google")
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await continueAsGuest()
      onNavigate("dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat masuk sebagai tamu")
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.1,
      },
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
        <ArrowLeft className="h-6 w-6" />
        <h1 className="text-2xl font-bold mx-auto pr-6">{isSignUp ? "Sign Up" : "Login"}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-6 flex flex-col">
        <motion.div className="flex justify-center mb-8" variants={logoVariants}>
          <div className="w-20 h-20 bg-[#1a1a3a] rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">SP</span>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
          {isSignUp && (
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                placeholder="Masukkan nama Anda"
                required={isSignUp}
                disabled={loading}
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
              placeholder="email@example.com"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            className="w-full py-3 bg-[#4f46e5] text-white rounded-md font-medium mt-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? "Memproses..." : isSignUp ? "Sign up" : "Log in"}
          </motion.button>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full py-3 bg-white text-[#4f46e5] border border-[#4f46e5] rounded-md font-medium disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {isSignUp ? "Sudah punya akun? Login" : "Belum punya akun? Sign up"}
          </motion.button>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-3 bg-white text-[#4f46e5] border border-[#4f46e5] rounded-md font-medium disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            Lanjutkan tanpa akun
          </motion.button>

          <motion.div variants={itemVariants} className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="mx-4 text-gray-500">atau</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 rounded-md disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            <FcGoogle className="h-5 w-5" />
            <span>Login dengan Google</span>
          </motion.button>
        </form>

        {/* Bottom spacer to mimic mobile app */}
        <div className="h-10 flex justify-center items-end">
          <div className="w-1/3 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  )
}
