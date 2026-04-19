// Exact match with your backend documentStatus enum
export const statusConfig: Record<string, { label: string; color: string }> = {
  unverified: { label: "Unverified", color: "#6B7280" },
  pending: { label: "Pending", color: "#F59E0B" },
  approved: { label: "Approved", color: "#10B981" },
  declined: { label: "Declined", color: "#EF4444" },
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
    case "terminated":
      return "#4B5563";
    default:
      return "#000";
  }
};
