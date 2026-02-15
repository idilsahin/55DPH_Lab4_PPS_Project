import { Doughnut } from "react-chartjs-2";

export default function SlotStatusDoughnut({ labels = [], values = [] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Slot status",
        data: values,

        // 🎨 RENKLER
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",   // green → available
          "rgba(239, 68, 68, 0.7)",   // red → booked
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-semibold mb-3">
        Slot status distribution
      </h2>

      <Doughnut
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
}
