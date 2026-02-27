"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, CheckCircle, MapPin } from "lucide-react";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        // In a real app, we would fetch the exact booking details securely from our API
        // For now, we stub it based on the reference ID
        if (reference) {
            setBooking({
                id: reference,
                route: "Lusaka to Ndola",
                departure: "Today, 14:00",
                seat: 4, // Simulated selected seat
                status: "CONFIRMED",
                amount: 250,
            });
        }
    }, [reference]);

    if (!booking) {
        return (
            <div className="min-h-screen bg-background flex justify-center items-center text-white">
                Loading your booking summary...
            </div>
        );
    }

    const handleDownloadPDF = async () => {
        // Navigate to the API endpoint that generates the PDF download
        window.open(`/api/generate-ticket?reference=${booking.id}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-24 px-6 select-none">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">

                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex justify-center items-center mx-auto mb-6">
                        <CheckCircle className="text-green-500 w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-400">Reference: <span className="text-primary tracking-widest">{booking.id.toUpperCase().substring(0, 8)}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* E-Ticket Summary */}
                    <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] translate-x-10 -translate-y-10"></div>

                        <h3 className="text-2xl font-bold mb-8 flex justify-between items-center text-white relative z-10">
                            E-Ticket
                            <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">CONFIRMED</span>
                        </h3>

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-400 text-sm">Trip</span>
                                <span className="font-semibold text-white">{booking.route}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-400 text-sm">Departure</span>
                                <span className="font-semibold text-white">{booking.departure}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-400 text-sm">Seat Number</span>
                                <span className="font-bold text-2xl text-primary">{booking.seat}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-gray-400 text-sm">Total Paid</span>
                                <span className="font-bold text-lg text-white">ZMW {booking.amount}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDownloadPDF}
                            className="w-full mt-10 bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 group"
                        >
                            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            Download PDF Ticket
                        </button>
                    </div>

                    {/* Google Route Tracking Concept */}
                    <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                            <MapPin className="text-primary" /> Live Tracking
                        </h3>

                        <div className="w-full flex-grow rounded-2xl bg-[#27272a]/50 border border-white/5 overflow-hidden flex flex-col justify-center items-center relative min-h-[300px]">
                            {/* Google Map Mock - In real logic, this would be an iframe or @react-google-maps/api instance */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Lusaka,Zambia&zoom=7&size=600x400&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=element:geometry|color:0x242f3e')] bg-cover bg-center"></div>

                            <MapPin className="w-12 h-12 text-primary animate-bounce relative z-10 drop-shadow-lg" />
                            <p className="mt-4 text-sm font-medium text-gray-300 relative z-10 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                                Awaiting Departure...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingConfirmation() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex justify-center items-center text-white">Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
