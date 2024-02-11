import express from "express";
import userRoutes from "./routes/userRoutes";
import { initializeBirthdayReminder, initializeBirthdayReminderRefresh } from "./services/initializeReminder";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

initializeBirthdayReminder();
initializeBirthdayReminderRefresh();
