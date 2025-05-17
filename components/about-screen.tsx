"use client"

import { ArrowLeft, Home, Settings, Info, Github, Linkedin, Mail } from 'lucide-react'
import { motion } from "framer-motion"

interface AboutScreenProps {
  onNavigate: (screen: "login" | "dashboard" | "booking" | "about") => void
}

export default function AboutScreen({ onNavigate }: AboutScreenProps) {
  // Data tim
  const teamMembers = [
    {
      name: "Najwa hikmatyar",
      role: "Embedded Systems Engineer/IoT Dev",
      image: "/placeholder.svg?height=80&width=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "anggota1@example.com",
    },
    {
      name: "Robi Rizki Permana",
      role: "Iot Stack Dev and  Backend Developer",
      image: "/placeholder.svg?height=80&width=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "robigold9@gmail.com",
    },
    {
      name: "Putri",
      role: "prototyper and documentation",
      image: "/placeholder.svg?height=80&width=80",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "anggota3@example.com",
    },
  ]

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
        <h1 className="text-2xl font-bold mx-auto pr-6">About</h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <h2 className="text-xl font-bold mb-2">Smart Parking App</h2>
          <p className="text-gray-600">Aplikasi manajemen parkir pintar berbasis web</p>
        </motion.div>

        <motion.div className="mb-8" variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-3">Tentang Proyek</h3>
          <p className="text-gray-700 mb-3">
            Smart Parking App adalah aplikasi yang memungkinkan pengguna untuk melihat ketersediaan slot parkir secara
            real-time, melakukan booking, dan melakukan pembayaran secara digital.
          </p>
          <p className="text-gray-700">
            Aplikasi ini menggunakan teknologi sensor TTP226/ESP32 untuk mendeteksi keberadaan kendaraan di slot parkir
            dan menyimpan data booking di database.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4">Tim Pengembang</h3>
          <div className="space-y-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                  <div className="flex mt-2 space-x-2">
                    <a href={member.github} className="text-gray-600 hover:text-gray-900">
                      <Github className="h-4 w-4" />
                    </a>
                    <a href={member.linkedin} className="text-gray-600 hover:text-gray-900">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-gray-900">
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          <p>© 2025 Smart Parking Team. All rights reserved.</p>
          <p className="mt-1">Versi 1.0.0</p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button onClick={() => onNavigate("dashboard")} className="flex flex-col items-center p-2 text-gray-500">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
          <button className="flex flex-col items-center p-2 text-[#4f46e5]">
            <Info className="h-6 w-6" />
            <span className="text-xs mt-1">About</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
