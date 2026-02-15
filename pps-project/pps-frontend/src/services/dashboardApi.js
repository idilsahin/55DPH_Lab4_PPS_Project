import { apiGet } from "../data/api";

export async function fetchDashboardData() {
  const [monthly, dist, slots] = await Promise.all([
    apiGet("/api/v1/bookings/stats/monthly-count"),
    apiGet("/api/v1/slots/stats/status-distribution"),
    apiGet("/slots"),
  ]);

  return { monthly, dist, slots };
}
