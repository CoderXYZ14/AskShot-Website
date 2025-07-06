import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Play, Sparkles } from "lucide-react";
import { Chrome } from "lucide-react";
import { Button } from "./ui/button";
import { URLS } from "@/lib/constants";
import Link from "next/link";
import { steps } from "@/utils/data";
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="mb-8 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
              AI-Powered Screenshot Analysis
            </Badge>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Ask Anything. Visually.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Draw on any webpage. Capture a region. Ask AI anything about it.
            Perfect for developers, researchers, students, and designers.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={URLS.CHROME_EXTENSION}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-2xl shadow-purple-500/25 px-8 py-4 text-lg"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Try the Extension
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Play className="h-5 w-5 mr-2" />
                View Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl p-10 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.2 + index * 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      y: -10,
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
