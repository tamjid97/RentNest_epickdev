import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        await prisma.$connect();
        console.log("db connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the serve:", error);
        await prisma.$connect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map