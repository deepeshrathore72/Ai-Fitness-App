"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Dumbbell, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { motion } from "framer-motion"

export function HeroSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const authenticated = localStorage.getItem("isAuthenticated") === "true"
      setIsLoggedIn(authenticated)
    }
    
    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("fitnessFormData")
    setIsLoggedIn(false)
    router.push("/auth")
  }

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full px-4 py-6 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold">FitCoach AI</span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Link href="/auth">Get Started</Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Fitness Coach</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance"
          >
            Transform Your <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-green-400">Fitness Journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            Get personalized workout and diet plans powered by AI. Voice guidance, visual demonstrations, and daily
            motivation—all in one app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/50"
              >
                <Link href="/auth">
                  <Dumbbell className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-xl bg-transparent border-2"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center items-center pt-8 text-sm text-muted-foreground"
          >
            <span>AI Workout Plans</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Custom Diet Plans</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Voice Guidance</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Image Generation</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
