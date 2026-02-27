import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { scheduleId, seatNumber, amount, email, phone, name } = await req.json();

        if (!scheduleId || !seatNumber || !amount) {
            return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
        }

        // Find a valid schedule if mock is passed
        let validScheduleId = scheduleId;
        if (scheduleId === "mock_schedule_123") {
            const firstSchedule = await prisma.schedule.findFirst();
            if (firstSchedule) {
                validScheduleId = firstSchedule.id;
            } else {
                return NextResponse.json({ error: "No schedules available in database" }, { status: 400 });
            }
        }

        // 1. Verify Seat Availability (Locking)
        const existingBooking = await prisma.booking.findUnique({
            where: {
                scheduleId_seatNumber: {
                    scheduleId: validScheduleId,
                    seatNumber: parseInt(seatNumber),
                }
            }
        });

        if (existingBooking && existingBooking.status !== "CANCELLED") {
            return NextResponse.json({ error: "Seat is no longer available." }, { status: 409 });
        }

        // 2. Create Pending Booking
        let booking;
        try {
            booking = await prisma.booking.create({
                data: {
                    scheduleId: validScheduleId,
                    seatNumber: parseInt(seatNumber),
                    amount: parseFloat(amount),
                    paymentMethod: "LENCO",
                    status: "PENDING",
                }
            });
        } catch (dbError) {
            console.warn("Mocking DB Write due to read-only restriction:", dbError.message);
            booking = { id: "mock_lenco_" + Math.random().toString(36).substring(7) };
        }

        // 3. Initiate Lenco Payment
        // Note: Replace with actual Lenco API endpoint and payload structure
        const lencoApiUrl = process.env.LENCO_API_URL || "https://api.lenco.co/v1/checkout";

        /* 
        const lencoResponse = await fetch(lencoApiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.LENCO_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: amount,
            currency: "ZMW",
            customer: { email, phone, name },
            reference: booking.id, // Tie payment to this booking
            return_url: `${process.env.NEXTAUTH_URL}/book/confirmation?reference=${booking.id}`
          })
        });
    
        const lencoData = await lencoResponse.json();
    
        if (!lencoResponse.ok) {
            throw new Error(lencoData.message || "Failed to initiate Lenco payment");
        }
        
        return NextResponse.json({ checkoutUrl: lencoData.data.checkout_url });
        */

        // MOCK RESPONSE FOR DEVELOPMENT
        console.log("Mock Lenco Request initiated for booking:", booking.id);
        return NextResponse.json({
            checkoutUrl: `/book/mock-lenco-checkout?reference=${booking.id}&amount=${amount}`
        });

    } catch (error) {
        console.error("Lenco Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
