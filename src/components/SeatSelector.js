"use client";

import React, { useState } from "react";
import { Info, CheckCircle2 } from "lucide-react";

export default function SeatSelector({ bookedSeats = [], onSelect }) {
    const [selectedSeat, setSelectedSeat] = useState(null);

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return;

        // Allow unselecting if already selected
        const newSelection = selectedSeat === seatNumber ? null : seatNumber;
        setSelectedSeat(newSelection);
        if (onSelect) onSelect(newSelection);
    };

    const renderSeat = (seatNumber) => {
        const isBooked = bookedSeats.includes(seatNumber);
        const isSelected = selectedSeat === seatNumber;

        return (
            <button
                key={seatNumber}
                disabled={isBooked}
                className={`w-14 h-16 rounded-xl flex items-center justify-center font-bold text-lg transition-all
          ${isBooked ? "bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/30" : ""}
          ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105 border border-primary/50" : ""}
          ${!isBooked && !isSelected ? "bg-slate-100 dark:bg-[#27272a] text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3f3f46] border border-slate-300/50 dark:border-white/10" : ""}
        `}
                onClick={() => handleSeatClick(seatNumber)}
            >
                {seatNumber}
            </button>
        );
    };

    return (
        <div className="w-full max-w-sm mx-auto surface p-8 rounded-3xl border border-white/10 shadow-xl bg-card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="text-primary" /> Select a Seat</h3>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-8 justify-center text-sm font-medium">
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-300/50 dark:border-white/10"></div> Available</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div> Booked</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-primary border bg-primary/50"></div> Selected</div>
            </div>

            {/* Van Layout UI */}
            <div className="relative mx-auto w-[240px] px-4 py-8 rounded-[40px] border-4 border-slate-200 dark:border-zinc-800 bg-white dark:bg-black/50 overflow-hidden shadow-inner">

                {/* Driver Dashboard Visual */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-slate-100 dark:bg-zinc-900 border-b-2 border-slate-200 dark:border-zinc-800 flex justify-center items-center rounded-t-[36px]">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Dashboard</span>
                </div>

                <div className="mt-6 flex flex-col gap-6 items-center w-full">

                    {/* Front Row (1 Seat + Driver Placeholder) */}
                    <div className="flex justify-between w-full px-2">
                        {renderSeat(1)}
                        <div className="w-14 h-16 rounded-xl flex items-center justify-center font-bold text-lg bg-zinc-800 text-white cursor-not-allowed border border-zinc-700">
                            <span className="text-xs">Driver</span>
                        </div>
                    </div>

                    {/* Middle Row (3 Seats) */}
                    <div className="flex justify-between w-full gap-2">
                        {renderSeat(2)}
                        {renderSeat(3)}
                        {renderSeat(4)}
                    </div>

                    {/* Back Row (3 Seats) */}
                    <div className="flex justify-between w-full gap-2">
                        {renderSeat(5)}
                        {renderSeat(6)}
                        {renderSeat(7)}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-sm text-gray-500 bg-blue-500/10 p-4 rounded-xl text-blue-400">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p>Vans are strictly 7-seaters. Select one seat to proceed to final checkout and tickets.</p>
            </div>
        </div>
    );
}
