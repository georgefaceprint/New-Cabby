import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { scheduleId, seatNumber, amount } = await req.json();

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

        // 1. Verify Seat Availability
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

        // 2. Create Confirmed Booking (Cash)
        const booking = await prisma.booking.create({
            data: {
                scheduleId: validScheduleId,
                seatNumber: parseInt(seatNumber),
                amount: parseFloat(amount),
                paymentMethod: "CASH",
                status: "CONFIRMED", // Cash bookings might be confirmed immediately or pending manual verification
            }
        });

        // 3. Return Success
        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            redirectUrl: `/book/confirmation?reference=${booking.id}`
        });

    } catch (error) {
        console.error("Cash Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
