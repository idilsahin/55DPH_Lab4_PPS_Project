import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { apiGet, apiPost } from "../data/api";

export default function ClientBooking() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [remaining, setRemaining] = useState(1); // lab 4: paket logic backend’e taşınmadı, frontend mock kaldı

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle|loading|error|success

  const availableSlots = useMemo(() => slots, [slots]);

  // fetch slots from backend
  useEffect(() => {
    (async () => {
      setStatus({ type: "loading", message: "Loading slots..." });
      try {
        const data = await apiGet("/slots");
        setSlots(data);
        setStatus({ type: "idle", message: "" });
      } catch (e) {
        setStatus({ type: "error", message: "Failed to load slots from backend." });
      }
    })();
  }, []);

  function openConfirm(slot) {
    setSelectedSlot(slot);
    setIsModalOpen(true);
    setStatus({ type: "idle", message: "" });
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedSlot(null);
  }

  async function confirmBooking() {
    setStatus({ type: "loading", message: "Booking in progress..." });

    await new Promise((r) => setTimeout(r, 400));

    if (remaining <= 0) {
      setStatus({ type: "error", message: "No remaining sessions in your package." });
      return;
    }

    try {
      await apiPost("/bookings", { slotId: selectedSlot.id });

      setRemaining((p) => p - 1);
      setBookings((prev) => [
        { id: Date.now(), date: selectedSlot.date, time: selectedSlot.time, status: "confirmed" },
        ...prev,
      ]);

      // refresh slots to reflect booked status
      const updated = await apiGet("/slots");
      setSlots(updated);

      setStatus({ type: "success", message: "Booking confirmed successfully!" });

      setTimeout(() => {
        closeModal();
        setStatus({ type: "idle", message: "" });
      }, 700);
    } catch (e) {
      setStatus({ type: "error", message: "Slot not available (backend validation)." });
    }
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Client Booking</h1>
            <p className="text-gray-600 mt-1">
              Slots are loaded from the backend API (Lab 4).
            </p>
          </div>

          <div className="rounded-2xl border bg-white px-4 py-3">
            <div className="text-sm text-gray-500">Remaining sessions</div>
            <div className="text-xl font-semibold">{remaining}</div>
          </div>
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
          <h2 className="text-lg font-semibold">Slots</h2>

          <div className="mt-4 grid gap-3">
            {availableSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <div className="font-medium">
                    {slot.date} — {slot.time}
                  </div>
                  <div className="text-sm text-gray-500">
                    Instructor: {slot.instructor} • Status: {slot.status}
                  </div>
                </div>

                <Button
                  disabled={slot.status !== "available"}
                  onClick={() => openConfirm(slot)}
                  className={slot.status !== "available" ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Book
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Your Bookings (Preview)</h2>

          {bookings.length === 0 ? (
            <div className="mt-3 rounded-xl border bg-gray-50 p-4 text-gray-600">
              Empty state: You have no bookings yet.
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-xl border p-4">
                  <div className="font-medium">
                    {b.date} — {b.time}
                  </div>
                  <div className="text-sm text-gray-500">Status: {b.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal title="Confirm Booking" onClose={closeModal}>
          <p className="text-gray-700">
            Confirm booking for:
            <span className="font-semibold">
              {" "}
              {selectedSlot?.date} — {selectedSlot?.time}
            </span>
          </p>

          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={closeModal}
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>

            <Button onClick={confirmBooking}>
              {status.type === "loading" ? "Booking..." : "Confirm"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
