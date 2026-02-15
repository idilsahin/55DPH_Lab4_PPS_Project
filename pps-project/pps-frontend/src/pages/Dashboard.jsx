import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MonthlyBookingsBar from "../components/charts/MonthlyBookingsBar";
import SlotStatusDoughnut from "../components/charts/SlotStatusDoughnut";
import { fetchDashboardData } from "../services/dashboardApi";
import { downloadCsv } from "../utils/exportCsv";

export default function Dashboard() {
  const [monthly, setMonthly] = useState({ labels: [], values: [] });
  const [dist, setDist] = useState({ labels: [], values: [] });
  const [slots, setSlots] = useState([]);

  const [state, setState] = useState({
    type: "loading", // loading | ok | error
    message: "Loading dashboard...",
  });

  useEffect(() => {
    (async () => {
      try {
        setState({ type: "loading", message: "Loading dashboard..." });

        const data = await fetchDashboardData();
        setMonthly(data.monthly);
        setDist(data.dist);
        setSlots(data.slots);

        setState({ type: "ok", message: "" });
      } catch (e) {
        setState({
          type: "error",
          message: "Failed to load dashboard data from backend.",
        });
      }
    })();
  }, []);

  function onDownload() {
    downloadCsv("pulsepilates-slots.csv", slots);
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
            <p className="text-gray-600 mt-1">Lab 5: metrics + charts + export</p>
          </div>

          <button
            onClick={onDownload}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            Download CSV
          </button>
        </div>

        {state.type === "loading" && (
          <div className="mt-6 rounded-xl border bg-gray-50 p-4">Loading…</div>
        )}

        {state.type === "error" && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {state.message}
          </div>
        )}

        {state.type === "ok" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <MonthlyBookingsBar labels={monthly.labels} values={monthly.values} />
            <SlotStatusDoughnut labels={dist.labels} values={dist.values} />
          </div>
        )}
      </div>
    </>
  );
}
