"use client"

import Image from "next/image"
import Link from "next/link"
import { Sparkles, ChevronDown, Users, Calendar, Award, Zap, ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <header
        className={`py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
      >
        {/* Rest of the component stays the same */}
        {/* This is a placeholder - copy the rest of your component here */}
      </header>

      <main className="flex-1 pt-20">
        {/* Main content of the page */}
      </main>
    </div>
  )
} 