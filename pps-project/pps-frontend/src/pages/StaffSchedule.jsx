import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { apiGet, apiPost } from "../data/api";

export default function StaffSchedule() {
  const [slots, setSlots] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [date, setDate] = useState("2026-01-23");
  const [time, setTime] = useState("09:00");
  const [instructor, setInstructor] = useState("Instructor A");

  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle|loading|error|success

  const sortedSlots = useMemo(() => {
    return [...slots].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );
  }, [slots]);

  async function loadSlots() {
    setStatus({ type: "loading", message: "Loading slots..." });
    try {
      const data = await apiGet("/slots");
      setSlots(data);
      setStatus({ type: "idle", message: "" });
    } catch (e) {
      setStatus({ type: "error", message: "Failed to load slots from backend." });
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  function openModal() {
    setStatus({ type: "idle", message: "" });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function createSlot() {
    setStatus({ type: "loading", message: "Creating slot..." });

    try {
      await apiPost("/slots", { date, time, instructor });
      setStatus({ type: "success", message: "Slot created successfully!" });

      await loadSlots();

      setTimeout(() => {
        closeModal();
        setStatus({ type: "idle", message: "" });
      }, 600);
    } catch (e) {
      setStatus({ type: "error", message: "Conflict: a slot already exists at this date/time." });
    }
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Staff Schedule</h1>
            <p className="text-gray-600 mt-1">
              Slots are loaded and created via backend API (Lab 4).
            </p>
          </div>

          <Button onClick={openModal}>Create Slot</Button>
        </div>

        {status.type !== "idle" && (
          <div
            className={[
              "mt-5 rounded-xl border p-4",
              status.type === "loading" ? "bg-gray-50" : "",
              status.type === "error" ? "bg-red-50 border-red-200" : "",
              status.type === "success" ? "bg-green-50 border-green-200" : "",
            ].join(" ")}
          >
            <p className="font-medium">{status.message}</p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Daily Slots</h2>

          <div className="mt-4 grid gap-3">
            {sortedSlots.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <div className="font-medium">
                    {s.date} — {s.time}
                  </div>
                  <div className="text-sm text-gray-500">
                    {s.instructor} • Status: {s.status}
                  </div>
                </div>

                <span
                  className={[
                    "text-xs rounded-full px-3 py-1 border",
                    s.status === "available" ? "bg-green-50 border-green-200 text-green-700" : "",
                    s.status === "booked" ? "bg-gray-50 border-gray-200 text-gray-700" : "",
                  ].join(" ")}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal title="Create New Slot" onClose={closeModal}>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="mt-1 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:MM"
                className="mt-1 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Instructor</label>
              <input
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="mt-1 w-full rounded-xl border p-3"
              />
            </div>

            {status.type === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                {status.message}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>

              <Button onClick={createSlot}>
                {status.type === "loading" ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
