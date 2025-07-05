"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: "free" | "pro" | "enterprise";
  memberSince: string;
  extensionVersion: string;
  planStatus: "active" | "inactive" | "expired";
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Failed to load profile data", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const openExtension = () => {
    window.postMessage({ type: "OPEN_ASKSHOT_EXTENSION" }, "*");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 sm:space-y-8 px-1 sm:px-0"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
        <Card className="relative bg-background/80 backdrop-blur-sm border-border/50 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                {profile?.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(profile?.name || "")}
                  </div>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.name}
              </h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                {profile?.plan === "pro"
                  ? "Pro Member"
                  : profile?.plan === "enterprise"
                  ? "Enterprise Member"
                  : "Free Member"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Account Information
            </h3>
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extension Version</span>
              <span className="text-foreground font-semibold">
                {profile?.extensionVersion}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground font-semibold">
                {profile?.memberSince}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan Status</span>
              <Badge
                className={`${
                  profile?.planStatus === "active"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : profile?.planStatus === "inactive"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {profile?.planStatus?.charAt(0).toUpperCase() ||
                  "Unknown" + profile?.planStatus?.slice(1) ||
                  "Unknown"}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/50 p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Extension Access
            </h3>
            <ExternalLink className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Launch the AskShot extension to start capturing and analyzing
            screenshots.
          </p>
          <Link
            href="https://chromewebstore.google.com/detail/kanioaflpfaoldkjeflbidhncicaobac?utm_source=item-share-cb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={openExtension}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open AskShot Extension
            </Button>
          </Link>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
