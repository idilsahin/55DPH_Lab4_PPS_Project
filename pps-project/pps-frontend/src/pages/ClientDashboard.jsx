import Navbar from "../components/Navbar";

export default function ClientDashboard() {
  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold">Client Dashboard</h1>
        <p className="text-gray-600 mt-1">
          View your upcoming sessions and quick actions.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
            <p className="text-sm text-gray-500 mt-1">Example list (Lab 3)</p>

            <div className="mt-4 grid gap-2">
              <div className="rounded-xl border p-4">
                <div className="font-medium">2026-01-23 — 09:00</div>
                <div className="text-sm text-gray-500">Status: confirmed</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="font-medium">2026-01-25 — 12:00</div>
                <div className="text-sm text-gray-500">Status: pending</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Quick Info</h2>
            <div className="mt-4 rounded-xl border bg-gray-50 p-4 text-gray-700">
              This dashboard is part of Lab 3 implementation and will be connected
              to the backend in Lab 4.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
