"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="pt-20 md:pt-32 pb-8 px-4">
      <motion.div
        className="max-w-4xl mx-auto text-center space-y-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-bold tracking-tight text-balance"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ready to Transform?
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground text-pretty"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Join thousands who have already started their AI-powered fitness journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            <Link href="/auth">Start Free Today</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-20 pt-8 border-t border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">FitCoach AI</span>
          </Link>

          <p className="text-sm text-muted-foreground">© 2025 FitCoach AI. Powered by AI.</p>
        </div>
      </motion.footer>
    </section>
  )
}
