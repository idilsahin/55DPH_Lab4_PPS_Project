import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ---------------- MOCK DATA ----------------
let users = [
  { id: 1, role: "client", email: "client@pulsepilates.com", password: "123456", name: "Client User" },
  { id: 2, role: "staff", email: "staff@pulsepilates.com", password: "123456", name: "Staff User" },
];

let slots = [
  { id: 1, date: "2026-01-22", time: "10:00", instructor: "Instructor A", status: "available" },
  { id: 2, date: "2026-01-22", time: "11:00", instructor: "Instructor A", status: "booked" },
];

let bookings = [];

// ---------------- AUTH ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
});

// ---------------- CLIENT ----------------
app.get("/slots", (req, res) => {
  res.json(slots);
});

app.post("/bookings", (req, res) => {
  const { slotId } = req.body;
  const slot = slots.find(s => s.id === slotId);

  if (!slot || slot.status !== "available") {
    return res.status(400).json({ message: "Slot not available" });
  }

  slot.status = "booked";
  bookings.push({ id: Date.now(), slotId, status: "confirmed" });

  res.json({ message: "Booking confirmed" });
});

// ---------------- STAFF ----------------
app.post("/slots", (req, res) => {
  const { date, time, instructor } = req.body;

  const conflict = slots.some(s => s.date === date && s.time === time);
  if (conflict) {
    return res.status(400).json({ message: "Slot conflict" });
  }

  const newSlot = {
    id: Date.now(),
    date,
    time,
    instructor,
    status: "available",
  };

  slots.push(newSlot);
  res.json(newSlot);
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.post("/bookings", (req, res) => {
  const { slotId } = req.body;

  const slot = slots.find((s) => s.id === slotId);

  if (!slot || slot.status !== "available") {
    return res.status(400).json({ message: "Slot not available" });
  }

  slot.status = "booked";

  bookings.push({
    id: Date.now(),
    slotId,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  });

  res.json({ message: "Booking confirmed" });
});

// ---------------- STATS (Lab 5) ----------------
app.get("/api/v1/bookings/stats/monthly-count", (req, res) => {
  // bookings createdAt ay bazında say
  const counts = new Map(); // "YYYY-MM" -> count

  for (const b of bookings) {
    const d = new Date(b.createdAt || Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const labels = Array.from(counts.keys()).sort();
  const values = labels.map((k) => counts.get(k));

  res.json({ labels, values });
});

app.get("/api/v1/slots/stats/status-distribution", (req, res) => {
  const available = slots.filter((s) => s.status === "available").length;
  const booked = slots.filter((s) => s.status === "booked").length;

  res.json({
    labels: ["available", "booked"],
    values: [available, booked],
  });
});

