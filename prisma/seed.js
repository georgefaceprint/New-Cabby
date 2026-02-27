const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up old data...");
    await prisma.booking.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.route.deleteMany();
    await prisma.van.deleteMany();

    console.log("🌱 Seeding DB...");

    // 1. Seed Vans (5 Toyota Noah, 5 Toyota Alphard)
    console.log("Creating Vans...");
    const vans = [];
    for (let i = 1; i <= 5; i++) {
        const noah = await prisma.van.create({
            data: { licensePlate: `NOAH-00${i}` } // Identifying model via Plate for now
        });
        const alphard = await prisma.van.create({
            data: { licensePlate: `ALPH-00${i}` }
        });
        vans.push(noah, alphard);
    }
    // Now vans array has exactly 10 vehicles.

    // 2. Seed Routes
    console.log("Creating Routes...");
    const routesData = [
        { origin: "Lusaka", destination: "Ndola", price: 250, estimatedDuration: 240 }, // 4 hrs
        { origin: "Ndola", destination: "Lusaka", price: 250, estimatedDuration: 240 },
        { origin: "Lusaka", destination: "Kitwe", price: 300, estimatedDuration: 300 }, // 5 hrs
        { origin: "Kitwe", destination: "Lusaka", price: 300, estimatedDuration: 300 },
        { origin: "Ndola", destination: "Kitwe", price: 100, estimatedDuration: 60 },  // 1 hr
        { origin: "Kitwe", destination: "Ndola", price: 100, estimatedDuration: 60 },
        { origin: "Kitwe", destination: "Kasumbalesa", price: 150, estimatedDuration: 90 }, // 1.5 hrs
        { origin: "Kasumbalesa", destination: "Kitwe", price: 150, estimatedDuration: 90 },
    ];

    const routes = [];
    for (const r of routesData) {
        const route = await prisma.route.create({ data: r });
        routes.push(route);
    }

    // 3. Seed Schedules for the next 14 days at multiple time slots
    console.log("Creating Schedules for the next 14 days...");
    const today = new Date();
    // Reset to start of day for cleaner slots
    today.setUTCHours(0, 0, 0, 0);

    const timeSlots = [8, 14]; // 08:00 AM and 14:00 PM

    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
        let globalVanIndex = 0; // use a global van index that shifts across time-slots
        for (const slotHour of timeSlots) {

            for (const route of routes) {
                // Circular wrap to make sure all 10 vans get continuously rotated out
                let van = vans[globalVanIndex % vans.length];

                const departureTime = new Date(today);
                departureTime.setUTCDate(departureTime.getUTCDate() + dayOffset);
                departureTime.setUTCHours(slotHour, 0, 0, 0);

                const arrivalTime = new Date(departureTime.getTime() + (route.estimatedDuration * 60000));

                await prisma.schedule.create({
                    data: {
                        routeId: route.id,
                        vanId: van.id,
                        departureTime: departureTime,
                        arrivalTime: arrivalTime,
                        status: "SCHEDULED"
                    }
                });

                globalVanIndex++;
            }
        }
    }

    console.log(`✅ successfully allocated 10 Vans across 8 routes globally for 14 days!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
