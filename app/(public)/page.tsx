"use client";

// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8, Target, Users, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #c27aff 1px, transparent 1px),
            linear-gradient(to bottom, #c27aff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #c27aff 2px, #c27aff 4px)',
          animation: 'scan 8s linear infinite'
        }}
      />

      {/* Gradient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary opacity-20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#fb64b6] opacity-15 blur-[140px] rounded-full"
        style={{ animation: 'float 20s ease-in-out infinite' }}
      />
      <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-success opacity-10 blur-[100px] rounded-full"
        style={{ animation: 'float 15s ease-in-out infinite reverse' }}
      />

      {/* Floating clock decorations */}
      <div className="absolute top-[15%] left-[8%] opacity-10 animate-spin-slow">
        <Clock8 className="w-24 h-24 text-secondary" strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[20%] right-[12%] opacity-10"
        style={{ animation: 'float 12s ease-in-out infinite' }}
      >
        <Clock8 className="w-32 h-32 text-[#fb64b6]" strokeWidth={1} />
      </div>
      <div className="absolute top-[60%] left-[15%] opacity-10"
        style={{ animation: 'float 18s ease-in-out infinite reverse' }}
      >
        <Clock8 className="w-20 h-20 text-success" strokeWidth={2} />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-5xl w-full text-center space-y-12">

          {/* Logo & Title */}
          <div className="space-y-6 animate-fade-in">
            {/* Glowing clock icon */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <Clock8
                  className="w-20 h-20 text-secondary drop-shadow-[0_0_25px_rgba(194,122,255,0.6)]"
                  strokeWidth={2.5}
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                />
                <div className="absolute inset-0 bg-secondary opacity-30 blur-xl rounded-full animate-ping"
                  style={{ animationDuration: '3s' }}
                />
              </div>
            </div>

            {/* Brand title */}
            <h1
              className="text-6xl sm:text-7xl md:text-8xl font-bold text-heading tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="inline-block">P</span>
              <Clock8
                className="inline-block w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-1 sm:mx-2 text-secondary"
                strokeWidth={2.75}
              />
              <span className="inline-block">cket Heist</span>
            </h1>

            {/* Tagline */}
            <p
              className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-secondary via-[#fb64b6] to-secondary bg-clip-text text-transparent"
              style={{
                fontFamily: 'var(--font-display)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite'
              }}
            >
              Tiny missions. Big office mischief.
            </p>
          </div>

          {/* Description */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-body max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-1"
            style={{ fontFamily: 'var(--font-body-alt)' }}
          >
            Transform your workplace into an adventure zone. Create covert missions,
            assign harmless pranks to your teammates, and track completed heists—all
            while keeping the fun alive and morale sky-high.
          </p>

          {/* CTA Button */}
          <div className="pt-6 animate-fade-in-delay-2">
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-secondary text-heading text-xl font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(194,122,255,0.6)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-[#fb64b6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className="relative z-10">Start Your First Heist</span>
              <Sparkles className="relative z-10 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 animate-fade-in-delay-3">
            <FeatureCard
              icon={<Target className="w-10 h-10" />}
              title="Quick Missions"
              description="Create playful tasks in seconds. From sticky note mysteries to coffee run challenges."
              delay="0s"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Team Adventures"
              description="Assign heists to teammates and build office camaraderie through harmless mischief."
              delay="0.1s"
            />
            <FeatureCard
              icon={<Clock8 className="w-10 h-10" />}
              title="Track Progress"
              description="Monitor active missions, celebrate completed pranks, and relive the best moments."
              delay="0.2s"
            />
          </div>

        </div>
      </div>

      {/* Custom animations in style tag */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 25px rgba(194, 122, 255, 0.6));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(194, 122, 255, 0.9));
            transform: scale(1.05);
          }
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-delay-1 {
          opacity: 0;
          animation: fade-in 1s ease-out 0.3s forwards;
        }
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 1s ease-out 0.6s forwards;
        }
        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 1s ease-out 0.9s forwards;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="group relative p-8 bg-lighter border border-secondary/20 rounded-2xl transition-all duration-500 hover:border-secondary/60 hover:shadow-[0_0_30px_rgba(194,122,255,0.2)] hover:scale-105 hover:-translate-y-2"
      style={{
        animation: `fade-in 1s ease-out ${delay} forwards`,
        opacity: 0
      }}
    >
      {/* Card glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10 space-y-4">
        <div className="text-secondary group-hover:text-[#fb64b6] transition-colors duration-300 flex justify-center group-hover:scale-110 transform transition-transform">
          {icon}
        </div>
        <h3
          className="text-heading font-bold text-xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
        <p
          className="text-body text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-body-alt)' }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
