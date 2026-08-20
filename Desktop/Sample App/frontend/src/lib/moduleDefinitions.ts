export type FieldType = "text" | "number" | "textarea" | "select";

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  mapsTo?: "title" | "description" | "amount" | "quantity" | "reference" | "partyName" | "status";
}

export interface ModuleOperation {
  key: string;
  label: string;
  description: string;
  fields: FormField[];
  submitLabel: string;
}

export interface ModuleDefinition {
  key: string;
  label: string;
  summary: string;
  highlights: string[];
  operations: ModuleOperation[];
  showCatalog?: "products" | "customers" | "suppliers" | "none";
}

export const moduleDefinitions: Record<string, ModuleDefinition> = {
  pos: {
    key: "pos",
    label: "POS",
    summary:
      "Point of sale for walk-in and retail counter transactions, payments, and receipts.",
    highlights: [
      "Create counter sales and capture payment method",
      "Link customer and product SKUs to each ticket",
      "Track open, paid, and voided transactions",
    ],
    showCatalog: "products",
    operations: [
      {
        key: "new_sale",
        label: "New Sale",
        description: "Register a POS sale with items and payment.",
        submitLabel: "Post Sale",
        fields: [
          { key: "title", label: "Sale title", type: "text", required: true, mapsTo: "title", placeholder: "Counter sale #..." },
          { key: "partyName", label: "Customer", type: "text", mapsTo: "partyName", placeholder: "Walk-in customer" },
          { key: "reference", label: "SKU / barcode", type: "text", mapsTo: "reference", placeholder: "RET-1001" },
          { key: "quantity", label: "Quantity", type: "number", mapsTo: "quantity" },
          { key: "amount", label: "Total amount", type: "number", mapsTo: "amount" },
          {
            key: "status",
            label: "Payment status",
            type: "select",
            mapsTo: "status",
            options: ["paid", "pending", "void"],
          },
          { key: "description", label: "Notes", type: "textarea", mapsTo: "description" },
        ],
      },
      {
        key: "refund",
        label: "Refund / Return",
        description: "Process returns against a previous receipt.",
        submitLabel: "Process Refund",
        fields: [
          { key: "title", label: "Refund reason", type: "text", required: true, mapsTo: "title" },
          { key: "reference", label: "Original receipt", type: "text", mapsTo: "reference" },
          { key: "amount", label: "Refund amount", type: "number", mapsTo: "amount" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["approved", "pending", "rejected"] },
        ],
      },
    ],
  },
  procurement: {
    key: "procurement",
    label: "Procurement",
    summary: "Purchase orders, supplier management, and goods receipt workflows.",
    highlights: [
      "Create and approve purchase orders",
      "Track supplier lead times and receipts",
      "Record goods received against PO references",
    ],
    showCatalog: "suppliers",
    operations: [
      {
        key: "purchase_order",
        label: "Purchase Order",
        description: "Raise a PO for inventory replenishment.",
        submitLabel: "Create PO",
        fields: [
          { key: "title", label: "PO title", type: "text", required: true, mapsTo: "title", placeholder: "PO for raw materials" },
          { key: "partyName", label: "Supplier", type: "text", mapsTo: "partyName", placeholder: "Global Supplies Co" },
          { key: "reference", label: "PO number", type: "text", mapsTo: "reference", placeholder: "PO-2026-001" },
          { key: "quantity", label: "Order qty", type: "number", mapsTo: "quantity" },
          { key: "amount", label: "Order value", type: "number", mapsTo: "amount" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["draft", "submitted", "approved", "received"] },
          { key: "description", label: "Line items / notes", type: "textarea", mapsTo: "description" },
        ],
      },
      {
        key: "goods_receipt",
        label: "Goods Receipt",
        description: "Confirm received stock against a purchase order.",
        submitLabel: "Receive Goods",
        fields: [
          { key: "title", label: "Receipt title", type: "text", required: true, mapsTo: "title" },
          { key: "reference", label: "PO reference", type: "text", mapsTo: "reference" },
          { key: "quantity", label: "Received qty", type: "number", mapsTo: "quantity" },
          { key: "status", label: "QC status", type: "select", mapsTo: "status", options: ["accepted", "partial", "rejected"] },
        ],
      },
    ],
  },
  inventory: {
    key: "inventory",
    label: "Inventory",
    summary: "Stock levels, warehouses, adjustments, and transfer movements.",
    highlights: [
      "Monitor on-hand quantity and reorder points",
      "Post stock adjustments and cycle counts",
      "Transfer stock between warehouses",
    ],
    showCatalog: "products",
    operations: [
      {
        key: "stock_adjustment",
        label: "Stock Adjustment",
        description: "Increase or decrease stock after count or damage.",
        submitLabel: "Post Adjustment",
        fields: [
          { key: "title", label: "Adjustment reason", type: "text", required: true, mapsTo: "title" },
          { key: "reference", label: "SKU", type: "text", mapsTo: "reference" },
          { key: "quantity", label: "Qty change (+/-)", type: "number", mapsTo: "quantity" },
          { key: "partyName", label: "Warehouse", type: "text", mapsTo: "partyName", placeholder: "Main Warehouse" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["posted", "draft", "review"] },
          { key: "description", label: "Notes", type: "textarea", mapsTo: "description" },
        ],
      },
      {
        key: "stock_transfer",
        label: "Warehouse Transfer",
        description: "Move inventory between locations.",
        submitLabel: "Create Transfer",
        fields: [
          { key: "title", label: "Transfer title", type: "text", required: true, mapsTo: "title" },
          { key: "reference", label: "SKU", type: "text", mapsTo: "reference" },
          { key: "quantity", label: "Transfer qty", type: "number", mapsTo: "quantity" },
          { key: "partyName", label: "From → To warehouse", type: "text", mapsTo: "partyName", placeholder: "Main → Retail Store A" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["in_transit", "completed", "cancelled"] },
        ],
      },
    ],
  },
  retail: {
    key: "retail",
    label: "Retail",
    summary: "Retail product catalog, pricing, promotions, and store assortment.",
    highlights: [
      "Add and maintain retail products",
      "Set selling price, category, and store stock",
      "Manage promotions and assortment plans",
    ],
    showCatalog: "products",
    operations: [
      {
        key: "add_product",
        label: "Add Product",
        description: "Create a retail product for catalog and POS.",
        submitLabel: "Save Product",
        fields: [
          { key: "title", label: "Product name", type: "text", required: true, mapsTo: "title", placeholder: "Cotton T-Shirt" },
          { key: "reference", label: "SKU", type: "text", required: true, mapsTo: "reference", placeholder: "RET-1003" },
          { key: "partyName", label: "Category", type: "text", mapsTo: "partyName", placeholder: "Apparel" },
          { key: "amount", label: "Unit price", type: "number", mapsTo: "amount" },
          { key: "quantity", label: "Opening stock", type: "number", mapsTo: "quantity" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["active", "inactive", "seasonal"] },
          { key: "description", label: "Product description", type: "textarea", mapsTo: "description" },
        ],
      },
      {
        key: "promotion",
        label: "Promotion",
        description: "Create store promotions and discount campaigns.",
        submitLabel: "Launch Promotion",
        fields: [
          { key: "title", label: "Promotion name", type: "text", required: true, mapsTo: "title" },
          { key: "reference", label: "SKU / category", type: "text", mapsTo: "reference" },
          { key: "amount", label: "Discount %", type: "number", mapsTo: "amount" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["scheduled", "live", "ended"] },
          { key: "description", label: "Campaign details", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  production: {
    key: "production",
    label: "Production",
    summary: "Work orders, bill of materials planning, and manufacturing runs.",
    highlights: [
      "Create manufacturing work orders",
      "Track planned vs completed quantity",
      "Record material consumption notes",
    ],
    showCatalog: "products",
    operations: [
      {
        key: "work_order",
        label: "Work Order",
        description: "Plan a production run for finished goods.",
        submitLabel: "Create Work Order",
        fields: [
          { key: "title", label: "Work order title", type: "text", required: true, mapsTo: "title" },
          { key: "reference", label: "Finished good SKU", type: "text", mapsTo: "reference" },
          { key: "quantity", label: "Planned qty", type: "number", mapsTo: "quantity" },
          { key: "amount", label: "Estimated cost", type: "number", mapsTo: "amount" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["planned", "in_progress", "completed"] },
          { key: "description", label: "BOM / routing notes", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  wholesale: {
    key: "wholesale",
    label: "Wholesale",
    summary: "Bulk customer orders, distributor pricing, and credit sales.",
    highlights: [
      "Create wholesale bulk sales orders",
      "Apply distributor and tier pricing",
      "Track fulfillment and credit terms",
    ],
    showCatalog: "customers",
    operations: [
      {
        key: "bulk_order",
        label: "Bulk Order",
        description: "Capture a wholesale sales order.",
        submitLabel: "Create Order",
        fields: [
          { key: "title", label: "Order title", type: "text", required: true, mapsTo: "title" },
          { key: "partyName", label: "Distributor / customer", type: "text", mapsTo: "partyName" },
          { key: "reference", label: "SKU", type: "text", mapsTo: "reference" },
          { key: "quantity", label: "Bulk qty", type: "number", mapsTo: "quantity" },
          { key: "amount", label: "Order value", type: "number", mapsTo: "amount" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["confirmed", "picking", "shipped", "invoiced"] },
          { key: "description", label: "Delivery terms", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  forecasting: {
    key: "forecasting",
    label: "Forecasting",
    summary: "Demand planning, seasonality forecasts, and replenishment targets.",
    highlights: [
      "Create demand forecasts by SKU or category",
      "Capture planned vs actual confidence",
      "Support procurement and production planning",
    ],
    showCatalog: "products",
    operations: [
      {
        key: "demand_forecast",
        label: "Demand Forecast",
        description: "Enter expected demand for a planning period.",
        submitLabel: "Save Forecast",
        fields: [
          { key: "title", label: "Forecast name", type: "text", required: true, mapsTo: "title", placeholder: "Q3 Apparel Demand" },
          { key: "reference", label: "SKU / category", type: "text", mapsTo: "reference" },
          { key: "quantity", label: "Forecast qty", type: "number", mapsTo: "quantity" },
          { key: "amount", label: "Confidence %", type: "number", mapsTo: "amount" },
          { key: "status", label: "Horizon", type: "select", mapsTo: "status", options: ["weekly", "monthly", "quarterly"] },
          { key: "description", label: "Assumptions", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  finance: {
    key: "finance",
    label: "Finance",
    summary: "Invoices, payments, expenses, and basic ledger entries.",
    highlights: [
      "Issue customer invoices and record payments",
      "Track expenses and payable amounts",
      "Maintain financial document status",
    ],
    showCatalog: "customers",
    operations: [
      {
        key: "invoice",
        label: "Invoice",
        description: "Create a customer or supplier invoice.",
        submitLabel: "Create Invoice",
        fields: [
          { key: "title", label: "Invoice title", type: "text", required: true, mapsTo: "title" },
          { key: "partyName", label: "Customer / vendor", type: "text", mapsTo: "partyName" },
          { key: "reference", label: "Invoice number", type: "text", mapsTo: "reference", placeholder: "INV-1001" },
          { key: "amount", label: "Invoice amount", type: "number", mapsTo: "amount" },
          { key: "status", label: "Status", type: "select", mapsTo: "status", options: ["draft", "sent", "paid", "overdue"] },
          { key: "description", label: "Line description", type: "textarea", mapsTo: "description" },
        ],
      },
      {
        key: "expense",
        label: "Expense",
        description: "Record operating expenses.",
        submitLabel: "Post Expense",
        fields: [
          { key: "title", label: "Expense title", type: "text", required: true, mapsTo: "title" },
          { key: "partyName", label: "Payee", type: "text", mapsTo: "partyName" },
          { key: "amount", label: "Amount", type: "number", mapsTo: "amount" },
          { key: "status", label: "Category", type: "select", mapsTo: "status", options: ["utilities", "logistics", "payroll", "other"] },
          { key: "description", label: "Notes", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  reports: {
    key: "reports",
    label: "Reports",
    summary: "Operational and financial report requests with filters and exports.",
    highlights: [
      "Request sales, inventory, and finance reports",
      "Store report parameters for reuse",
      "Track generated vs pending report jobs",
    ],
    showCatalog: "none",
    operations: [
      {
        key: "generate_report",
        label: "Generate Report",
        description: "Queue a standard ERP report.",
        submitLabel: "Queue Report",
        fields: [
          { key: "title", label: "Report name", type: "text", required: true, mapsTo: "title", placeholder: "Monthly Sales Summary" },
          {
            key: "reference",
            label: "Report type",
            type: "select",
            mapsTo: "reference",
            options: ["sales", "inventory", "procurement", "finance", "production"],
          },
          { key: "status", label: "Format", type: "select", mapsTo: "status", options: ["pdf", "csv", "xlsx"] },
          { key: "description", label: "Filters / period", type: "textarea", mapsTo: "description", placeholder: "Last 30 days, all warehouses" },
        ],
      },
    ],
  },
  "admin-utilities": {
    key: "admin-utilities",
    label: "Admin Utilities",
    summary: "System configuration, master data utilities, and admin tasks.",
    highlights: [
      "Maintain system settings and utilities",
      "Run master-data cleanup tasks",
      "Track administrative actions",
    ],
    showCatalog: "none",
    operations: [
      {
        key: "system_setting",
        label: "System Setting",
        description: "Update a configuration value.",
        submitLabel: "Save Setting",
        fields: [
          { key: "title", label: "Setting name", type: "text", required: true, mapsTo: "title", placeholder: "Default tax rate" },
          { key: "reference", label: "Setting key", type: "text", mapsTo: "reference", placeholder: "tax.default_rate" },
          { key: "description", label: "Value / notes", type: "textarea", mapsTo: "description" },
          { key: "status", label: "Scope", type: "select", mapsTo: "status", options: ["global", "branch", "module"] },
        ],
      },
      {
        key: "maintenance_task",
        label: "Maintenance Task",
        description: "Log an admin maintenance action.",
        submitLabel: "Log Task",
        fields: [
          { key: "title", label: "Task title", type: "text", required: true, mapsTo: "title" },
          { key: "status", label: "Priority", type: "select", mapsTo: "status", options: ["low", "medium", "high"] },
          { key: "description", label: "Details", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  notifications: {
    key: "notifications",
    label: "Notifications",
    summary: "Operational alerts, reminders, and broadcast messages.",
    highlights: [
      "Create stock and payment alerts",
      "Send reminders to teams",
      "Track unread and resolved notifications",
    ],
    showCatalog: "none",
    operations: [
      {
        key: "alert",
        label: "Create Alert",
        description: "Publish an operational notification.",
        submitLabel: "Send Alert",
        fields: [
          { key: "title", label: "Alert title", type: "text", required: true, mapsTo: "title" },
          { key: "partyName", label: "Audience", type: "text", mapsTo: "partyName", placeholder: "Inventory team" },
          { key: "status", label: "Severity", type: "select", mapsTo: "status", options: ["info", "warning", "critical"] },
          { key: "description", label: "Message", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
  service: {
    key: "service",
    label: "Service",
    summary: "Customer service tickets, warranties, and field service requests.",
    highlights: [
      "Open and assign service tickets",
      "Track SLA and resolution status",
      "Link tickets to products and customers",
    ],
    showCatalog: "customers",
    operations: [
      {
        key: "service_ticket",
        label: "Service Ticket",
        description: "Create a support or warranty ticket.",
        submitLabel: "Open Ticket",
        fields: [
          { key: "title", label: "Ticket subject", type: "text", required: true, mapsTo: "title" },
          { key: "partyName", label: "Customer", type: "text", mapsTo: "partyName" },
          { key: "reference", label: "Product / asset", type: "text", mapsTo: "reference" },
          { key: "status", label: "Priority", type: "select", mapsTo: "status", options: ["low", "medium", "high", "urgent"] },
          { key: "description", label: "Issue details", type: "textarea", mapsTo: "description" },
        ],
      },
    ],
  },
};

export function getModuleDefinition(moduleKey: string): ModuleDefinition | null {
  return moduleDefinitions[moduleKey] ?? null;
}
