"use client"

import { Card } from "@/components/ui/card"
import { Brain, Utensils, Volume2, ImageIcon, Zap, Target } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI Workout Plans",
    description:
      "Personalized exercise routines with sets, reps, and rest times tailored to your goals and fitness level.",
  },
  {
    icon: Utensils,
    title: "Custom Diet Plans",
    description: "Meal breakdowns for breakfast, lunch, dinner, and snacks based on your dietary preferences.",
  },
  {
    icon: Volume2,
    title: "Voice Guidance",
    description: "Text-to-speech powered by ElevenLabs reads your workout and diet plans aloud.",
  },
  {
    icon: ImageIcon,
    title: "Visual Demonstrations",
    description: "AI-generated images for exercises and meals to help you visualize your plan.",
  },
  {
    icon: Zap,
    title: "Daily Motivation",
    description: "Get inspired with AI-generated motivational quotes and lifestyle tips every day.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Export your plans as PDF, regenerate anytime, and track your fitness journey.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A comprehensive fitness assistant powered by cutting-edge AI technology to help you achieve your goals.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="pt-5 pl-5 pr-5 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 h-full border border-primary/25">
                <motion.div
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 pb-0 pt-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
