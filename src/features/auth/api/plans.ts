import api from "../axios";


export async function getPlans() {
  try {
    // console.log("Fetching membership plans...");

    const res = await api.get("/membership-plan");

    console.log("Plans API FULL RESPONSE:", res.data);

    if (!res.data?.status) {
      throw new Error(res.data?.message || "Failed to fetch plans");
    }

    return res.data.data;
  } catch (err: any) {
    console.error("Plans API ERROR:", err);
    throw new Error(err.message || "Plans fetch failed");
  }
}