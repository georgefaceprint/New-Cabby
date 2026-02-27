import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";

// Prevents Next.js from caching this dynamic route
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.json({ error: "Missing booking reference." }, { status: 400 });
        }

        // Attempt to fetch from DB
        const booking = await prisma.booking.findUnique({
            where: { id: reference },
            include: {
                schedule: {
                    include: {
                        route: true,
                        van: true,
                    }
                },
                user: true,
            }
        });

        // We proceed with mock data if the DB is empty (for demo purposes)
        const ticketData = booking ? {
            ref: booking.id.toUpperCase().substring(0, 8),
            passengerName: booking.user?.name || "Guest",
            from: booking.schedule.route.origin,
            to: booking.schedule.route.destination,
            departure: booking.schedule.departureTime.toLocaleString(),
            seat: booking.seatNumber.toString(),
            paid: `ZMW ${booking.amount}`,
            van: booking.schedule.van.licensePlate,
        } : {
            ref: reference.toUpperCase().substring(0, 8),
            passengerName: "Cabby Passenger",
            from: "Lusaka",
            to: "Ndola",
            departure: new Date().toLocaleString(),
            seat: "4",
            paid: "ZMW 250",
            van: "ZMB-1234",
        };

        // Generate the PDF as a buffer
        const pdfBuffer = await new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];

            doc.on("data", chunk => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            // --- PDF DESIGN ---

            // Header
            doc.rect(0, 0, 612, 120).fill("#18181b"); // Dark header
            doc.fillColor("#f59e0b").fontSize(36).text("Cabby", 50, 45, { align: "left" });
            doc.fillColor("#ffffff").fontSize(12).text("Premium Inter-city Travel", 50, 85);

            // E-Ticket Badge
            doc.rect(420, 60, 100, 30).fill("#22c55e");
            doc.fillColor("#ffffff").fontSize(14).font("Helvetica-Bold").text("CONFIRMED", 430, 68);

            // Main Content Box
            doc.moveDown(6);
            doc.rect(50, 150, 512, 380).lineWidth(2).stroke("#f59e0b");

            // Details
            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Booking Reference:", 80, 180);
            doc.fillColor("#4b5563").fontSize(14).font("Helvetica").text(ticketData.ref, 80, 205);

            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Passenger Name:", 350, 180);
            doc.fillColor("#4b5563").fontSize(14).font("Helvetica").text(ticketData.passengerName, 350, 205);

            doc.moveTo(80, 240).lineTo(532, 240).lineWidth(1).strokeColor("#e5e7eb").stroke();

            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Route:", 80, 270);
            doc.fillColor("#4b5563").fontSize(14).font("Helvetica").text(`${ticketData.from} - ${ticketData.to}`, 80, 295);

            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Departure:", 350, 270);
            doc.fillColor("#4b5563").fontSize(14).font("Helvetica").text(ticketData.departure, 350, 295);

            doc.moveTo(80, 330).lineTo(532, 330).lineWidth(1).strokeColor("#e5e7eb").stroke();

            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Seat Number:", 80, 360);
            doc.fillColor("#f59e0b").fontSize(24).font("Helvetica-Bold").text(ticketData.seat, 80, 385);

            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Van Plate:", 250, 360);
            doc.fillColor("#4b5563").fontSize(14).font("Helvetica").text(ticketData.van, 250, 390);

            doc.fillColor("#09090b").fontSize(16).font("Helvetica-Bold").text("Total Paid:", 400, 360);
            doc.fillColor("#16a34a").fontSize(20).font("Helvetica-Bold").text(ticketData.paid, 400, 385);

            // Footer Notes
            doc.fillColor("#9ca3af").fontSize(10).font("Helvetica").text(
                "Please present this E-Ticket and a valid ID to the driver 30 minutes before departure.",
                50, 560, { align: "center" }
            );
            doc.text("All sales are final. For support, contact +260971234567.", 50, 580, { align: "center" });

            doc.end();
        });

        // Return the PDF buffer as a downloadable File stream
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Cabby_Ticket_${ticketData.ref}.pdf"`,
            },
        });

    } catch (error) {
        console.error("PDF Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate E-Ticket PDF." }, { status: 500 });
    }
}
