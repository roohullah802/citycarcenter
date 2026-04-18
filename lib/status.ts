export const statusConfig: Record<string, { label: string; color: string }> = {
  verified: { label: "Verified", color: "#10B981" },
  notVerified: { label: "Not Verified", color: "#F59E0B" },
  rejected: { label: "Rejected", color: "#EF4444" },
};

type LeaseStatus = "active" | "expired" | "upcoming" | "terminated";

export const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString();
};

export const statusColor = (s: LeaseStatus) => {
  switch (s) {
    case "active":
      return "#16a34a";
    case "expired":
      return "#dc2626";
    case "upcoming":
      return "#f59e0b";
    default:
      return "#000";
  }
};
