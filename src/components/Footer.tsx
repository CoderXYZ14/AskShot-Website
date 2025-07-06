import { URLS } from "@/lib/constants";
import {
  Chrome,
  Coffee,
  Github,
  Linkedin,
  Sparkles,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t border-border/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <motion.div
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AskShot
              </span>
            </motion.div>
            <p className="text-muted-foreground mb-6 max-w-md text-lg leading-relaxed">
              AI-powered screenshot analysis for the modern web. Ask anything
              about any visual content.
            </p>
            <div className="flex space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={URLS.TWITTER}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={URLS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={URLS.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={URLS.EMAIL}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-lg">Product</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
                {
                  name: "Chrome Store",
                  href: URLS.CHROME_EXTENSION,
                },
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item.href.startsWith("#") ? (
                    <Link
                      href={item.href}
                      className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                      target={
                        item.name === "Chrome Store" ? "_blank" : undefined
                      }
                      rel={
                        item.name === "Chrome Store"
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6 text-lg">Company</h3>
            <ul className="space-y-3 text-muted-foreground">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="#"
                  className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  About
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/privacy"
                  className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Privacy
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/terms"
                  className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Terms
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 3 * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/refund-terms"
                  className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Refund
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 4 * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={URLS.EMAIL}
                  className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Contact
                </Link>
              </motion.li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-border/50" />
        <motion.div
          className="flex flex-col items-center justify-center mt-8 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm text-muted-foreground mb-2">Featured on</div>
          <Link
            href="https://www.producthunt.com/posts/askshot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=989044&theme=light&t=1751814643084"
              alt="AskShot on Product Hunt"
              width={150}
              height={32}
              className="hover:opacity-90 transition-opacity"
            />
          </Link>
        </motion.div>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2025 AskShot. All rights reserved.
          </motion.p>

          <motion.div
            className="flex items-center space-x-4 mt-4 sm:mt-0"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href={URLS.BUY_ME_COFFEE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#FFDD00] text-black font-medium hover:bg-[#FFDD00]/90 transition-all mr-4"
            >
              <Coffee className="h-4 w-4 mr-2" />
              <span>Buy me a coffee</span>
            </Link>
            <Badge
              variant="outline"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <Chrome className="h-4 w-4 text-purple-400" />
              <span className="text-sm">Available on Chrome Web Store</span>
            </Badge>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
