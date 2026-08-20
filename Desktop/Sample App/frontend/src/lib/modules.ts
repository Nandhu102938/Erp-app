export const modules = [
  { key: "pos", label: "POS" },
  { key: "procurement", label: "Procurement" },
  { key: "inventory", label: "Inventory" },
  { key: "retail", label: "Retail" },
  { key: "production", label: "Production" },
  { key: "wholesale", label: "Wholesale" },
  { key: "forecasting", label: "Forecasting" },
  { key: "finance", label: "Finance" },
  { key: "reports", label: "Reports" },
  { key: "admin-utilities", label: "Admin Utilities" },
  { key: "notifications", label: "Notifications" },
  { key: "service", label: "Service" },
] as const;

export type ModuleKey = (typeof modules)[number]["key"];

export const moduleMap = Object.fromEntries(
  modules.map((moduleItem) => [moduleItem.key, moduleItem.label])
) as Record<string, string>;
