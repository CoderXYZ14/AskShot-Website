import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

import { URLS } from "@/lib/constants";
import { Download, Play } from "lucide-react";
import Link from "next/link";
const Demo = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            See It In Action
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Watch how AskShot transforms the way you interact with visual
            content
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-3xl p-12 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-border/50 group hover:border-purple-500/30 transition-all duration-500">
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Play className="h-20 w-20 mx-auto mb-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </motion.div>
                <p className="text-xl text-muted-foreground mb-6">
                  Interactive Demo Coming Soon
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={URLS.CHROME_EXTENSION}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-xl shadow-purple-500/25"
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Extension
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Demo;
