"use client";

import React, { useState } from "react";
import SeatSelector from "@/components/SeatSelector";

export default function BookingPage() {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("LENCO");

    const handleCheckout = async () => {
        if (!selectedSeat) return;
        setIsProcessing(true);

        try {
            // Stub data for demonstration since we don't have dynamic routes set up yet
            const payload = {
                scheduleId: "mock_schedule_123", // Would dynamically come from URL/context
                seatNumber: selectedSeat,
                amount: 250,
                email: "rider@example.com",
                phone: "+260971234567",
                name: "Cabby Passenger",
            };

            const endpoint = paymentMethod === "LENCO" ? "/api/checkout/lenco" : "/api/checkout/cash";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Redirect to Lenco checkout page, or confirmation page for cash
            if (data.checkoutUrl) window.location.href = data.checkoutUrl;
            if (data.redirectUrl) window.location.href = data.redirectUrl;

        } catch (err) {
            alert("Checkout failed: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-24 px-6">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300 mb-8 tracking-tight">
                    Select Your Seat
                </h1>
                <p className="text-gray-400 mb-12 text-center max-w-md">
                    Trip: <strong className="text-white">Lusaka to Ndola</strong> <br />
                    Departure: <strong className="text-white">Today 14:00</strong>
                </p>

                <SeatSelector
                    bookedSeats={[2, 5]} // Mocking seats 2 and 5 as booked
                    onSelect={(seat) => setSelectedSeat(seat)}
                />

                {selectedSeat && (
                    <div className="mt-12 p-6 glass border border-primary/20 rounded-2xl w-full text-center">
                        <h3 className="text-2xl font-bold mb-2">Seat {selectedSeat} Selected</h3>
                        <p className="text-gray-400 mb-6">You are to pay <strong className="text-white">ZMW 250</strong> for this trip.</p>

                        <div className="flex gap-4 mb-6 justify-center">
                            <button
                                onClick={() => setPaymentMethod("LENCO")}
                                className={`px-4 py-2 rounded-lg font-bold transition-all border ${paymentMethod === "LENCO" ? "bg-[#eab308] text-black border-[#eab308]" : "bg-black/40 text-gray-400 border-white/10"}`}
                            >
                                Pay with Lenco (Mobile/Card)
                            </button>
                            <button
                                onClick={() => setPaymentMethod("CASH")}
                                className={`px-4 py-2 rounded-lg font-bold transition-all border ${paymentMethod === "CASH" ? "bg-green-600 text-white border-green-500" : "bg-black/40 text-gray-400 border-white/10"}`}
                            >
                                Pay with Cash
                            </button>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className={`w-full ${paymentMethod === "CASH" ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary-hover"} text-white py-4 rounded-xl font-bold transition-all shadow-lg text-lg flex justify-center items-center`}
                        >
                            {isProcessing ? "Processing..." : `Confirm Booking`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
