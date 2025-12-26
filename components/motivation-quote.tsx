"use client"

import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Quote, RefreshCw } from "lucide-react"
import { Button } from "./ui/button"

export function MotivationQuote() {
  const [quote, setQuote] = useState("Loading your daily motivation...")
  const [isLoading, setIsLoading] = useState(false)

  const fetchMotivationQuote = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/motivation", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch motivation quote")
      }

      const data = await response.json()
      setQuote(data.quote)
    } catch (error) {
      console.error("Error fetching motivation quote:", error)
      setQuote("Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMotivationQuote()
  }, [])

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Daily Motivation</h3>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Getting your quote...</p>
            </div>
          ) : (
            <p className="text-foreground italic text-lg leading-relaxed">"{quote}"</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchMotivationQuote}
          className="shrink-0 hover:bg-primary/10 rounded-lg"
          aria-label="Get new quote"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </Card>
  )
}
