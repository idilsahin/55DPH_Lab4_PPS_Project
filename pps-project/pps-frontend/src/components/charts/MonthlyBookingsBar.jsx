import { Bar } from "react-chartjs-2";

export default function MonthlyBookingsBar({ labels = [], values = [] }) {
  const data = {
    labels,
    datasets: [{
    label: "Bookings per month",
    data: values,
    backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
    borderColor: "rgba(59, 130, 246, 1)",
    borderWidth: 1,
  }],
  };

  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-semibold mb-3">Monthly bookings</h2>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { display: true } },
        }}
      />
    </div>
  );
}

