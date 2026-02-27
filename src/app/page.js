"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState("Lusaka");
  const [to, setTo] = useState("Ndola");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    // Navigate to the booking page with query parameters
    router.push(`/book?from=${from}&to=${to}&date=${date}`);
  };
  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient simulating a vibrant sunset/metallic dark look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#f59e0b]/20 z-0"></div>
        {/* Abstract shapes for glassmorphism */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] z-0"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-[80px] z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
          <span className="px-4 py-1.5 rounded-full glass text-primary text-sm font-semibold mb-6 tracking-wide uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            Premium Inter-city Travel in Zambia
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Your Journey, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">
              Elevated.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light">
            Experience airline-style comfort on the road. Book opulent 6-seater vans travelling between Lusaka, Ndola, Kitwe, and Kasumbalesa.
          </p>

          {/* Search/Booking Widget */}
          <div className="w-full max-w-4xl glass rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-end transition-all hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm text-gray-400 font-medium px-1 flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-medium">
                <option value="Lusaka">Lusaka</option>
                <option value="Ndola">Ndola</option>
                <option value="Kitwe">Kitwe</option>
                <option value="Kasumbalesa">Kasumbalesa</option>
              </select>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-sm text-gray-400 font-medium px-1 flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-medium">
                <option value="Ndola">Ndola</option>
                <option value="Kitwe">Kitwe</option>
                <option value="Kasumbalesa">Kasumbalesa</option>
                <option value="Lusaka">Lusaka</option>
              </select>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-sm text-gray-400 font-medium px-1 flex items-center gap-2">
                <Calendar size={14} className="text-primary" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary font-medium [color-scheme:dark]"
              />
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto h-[50px] px-8 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/50 group">
                <Search size={18} className="group-hover:scale-110 transition-transform" />
                Find Rides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The Cabby Difference</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Skip the crowded buses. Enjoy dedicated 1/3/3 seating in our premium vans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-card border border-white/5 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Spacious Seating</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Guarantee your spot with our interactive seat selector. 1 seat in front, 3 in the middle, and 3 in the back.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-white/5 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Local Payments</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Pay securely via Mobile Money using the Lenco gateway, or reserve your seat and pay with Cash.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-white/5 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Instant E-Tickets</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Receive downloadable PDF tickets instantly, alongside email and push notifications for your trip.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
