"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createUser, getUserById } from "@/lib/database"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isGuest: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  continueAsGuest: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if auth is available (browser environment)
    if (typeof window === "undefined" || !auth) {
      setLoading(false)
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user exists in our database
          let userData = await getUserById(firebaseUser.uid)

          // If not, create a new user
          if (!userData) {
            userData = await createUser(firebaseUser.uid, {
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              role: "user",
            })
          }

          setUser(userData)
          setIsGuest(firebaseUser.isAnonymous)
        } catch (error) {
          console.error("Error getting user data:", error)
        }
      } else {
        setUser(null)
        setIsGuest(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Login with email and password
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Authentication not initialized")

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  // Sign up with email and password
  const signup = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error("Authentication not initialized")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await createUser(userCredential.user.uid, { name, email, role: "user" })
    } catch (error) {
      throw error
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    if (!auth) throw new Error("Authentication not initialized")

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      // Check if user exists, if not create a new user
      const existingUser = await getUserById(userCredential.user.uid)

      if (!existingUser) {
        await createUser(userCredential.user.uid, {
          name: userCredential.user.displayName || "Google User",
          email: userCredential.user.email || "",
          role: "user",
        })
      }
    } catch (error) {
      throw error
    }
  }

  // Continue as guest
  const continueAsGuest = async () => {
    if (!auth) throw new Error("Authentication not initialized")

    try {
      const userCredential = await signInAnonymously(auth)
      await createUser(userCredential.user.uid, {
        name: "Guest User",
        email: "guest@example.com",
        role: "user",
      })
      setIsGuest(true)
    } catch (error) {
      throw error
    }
  }

  // Logout
  const logout = async () => {
    if (!auth) throw new Error("Authentication not initialized")

    try {
      await signOut(auth)
      setUser(null)
      setIsGuest(false)
    } catch (error) {
      throw error
    }
  }

  // Context value
  const value = {
    user,
    isGuest,
    loading,
    login,
    signup,
    loginWithGoogle,
    continueAsGuest,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }

  return context
}
