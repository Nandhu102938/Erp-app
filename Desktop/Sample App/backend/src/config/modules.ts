export const erpModules = [
  "pos",
  "procurement",
  "inventory",
  "retail",
  "production",
  "wholesale",
  "forecasting",
  "finance",
  "reports",
  "admin-utilities",
  "notifications",
  "service",
] as const;

export type ErpModule = (typeof erpModules)[number];

export const moduleLabelMap: Record<ErpModule, string> = {
  pos: "POS",
  procurement: "Procurement",
  inventory: "Inventory",
  retail: "Retail",
  production: "Production",
  wholesale: "Wholesale",
  forecasting: "Forecasting",
  finance: "Finance",
  reports: "Reports",
  "admin-utilities": "Admin Utilities",
  notifications: "Notifications",
  service: "Service",
};

export const isValidModule = (value: string): value is ErpModule =>
  erpModules.includes(value as ErpModule);
