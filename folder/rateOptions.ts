export type ExtendRateOption = {
  label: string;
  subLabel: string;
  value: number;
  type: "daily" | "weekly" | "monthly";
};

export const rateOptions: ExtendRateOption[] = [
  { label: "Daily Rate", subLabel: "(+20%)", value: 44.4, type: "daily" },
  { label: "Weekly Rate", subLabel: "", value: 295.0, type: "weekly" },
  {
    label: "Monthly Rate",
    subLabel: "(-15%)",
    value: 880.6,
    type: "monthly",
  },
];

export type DetailsRateOption = {
  label: string;
  value: number | string;
};

export const rateOptionsDetails: DetailsRateOption[] = [
  {
    label: "Initial Miles:",
    value: "N/A",
  },
  {
    label: "Miles Allowed:",
    value: "N/A",
  },
];
