"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/auth";
import {
  FormField,
  getModuleDefinition,
  ModuleOperation,
} from "@/lib/moduleDefinitions";

interface ModuleEntry {
  id: string;
  operation: string;
  title: string;
  description?: string | null;
  amount: number;
  quantity: number;
  reference?: string | null;
  partyName?: string | null;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  stockQty: number;
  warehouse: string;
  status: string;
}

interface Party {
  id: string;
  code: string;
  name: string;
  status: string;
}

interface ModuleWorkspaceProps {
  moduleKey: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function emptyValues(fields: FormField[]) {
  return Object.fromEntries(
    fields.map((field) => [
      field.key,
      field.type === "number" ? "0" : field.options?.[0] ?? "",
    ])
  );
}

export default function ModuleWorkspace({ moduleKey }: ModuleWorkspaceProps) {
  const definition = getModuleDefinition(moduleKey);
  const operations = definition?.operations ?? [];
  const [activeOp, setActiveOp] = useState(operations[0]?.key ?? "general");
  const operation = useMemo(
    () => operations.find((item) => item.key === activeOp) ?? operations[0],
    [operations, activeOp]
  );

  const [values, setValues] = useState<Record<string, string>>(
    emptyValues(operation?.fields ?? [])
  );
  const [entries, setEntries] = useState<ModuleEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!operation) return;
    setValues(emptyValues(operation.fields));
  }, [operation]);

  const authHeaders = () => {
    const token = auth.getToken();
    if (!token) throw new Error("Please login again.");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadEntries = async (opKey?: string) => {
    const headers = authHeaders();
    const query = opKey ? `?operation=${encodeURIComponent(opKey)}` : "";
    const response = await fetch(`${apiUrl}/api/modules/${moduleKey}${query}`, {
      headers,
    });
    if (!response.ok) throw new Error("Unable to load records.");
    setEntries((await response.json()) as ModuleEntry[]);
  };

  const loadCatalog = async () => {
    if (!definition || definition.showCatalog === "none") {
      setProducts([]);
      setParties([]);
      return;
    }

    const headers = authHeaders();
    if (definition.showCatalog === "products") {
      const response = await fetch(`${apiUrl}/api/catalog/products`, { headers });
      if (response.ok) setProducts((await response.json()) as Product[]);
      return;
    }

    const endpoint =
      definition.showCatalog === "customers"
        ? "/api/catalog/customers"
        : "/api/catalog/suppliers";
    const response = await fetch(`${apiUrl}${endpoint}`, { headers });
    if (response.ok) setParties((await response.json()) as Party[]);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        await Promise.all([loadEntries(activeOp), loadCatalog()]);
      } catch {
        // Keep UI usable even if API/DB is offline.
      }
    };
    void boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, activeOp]);

  if (!definition || !operation) {
    return <p className="text-sm text-slate-600">Module definition not found.</p>;
  }

  const updateField = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const buildPayload = (op: ModuleOperation) => {
    const payload: Record<string, unknown> = {
      operation: op.key,
      title: "",
      description: "",
      amount: 0,
      quantity: 0,
      reference: "",
      partyName: "",
      status: "draft",
      metadata: {},
    };

    for (const field of op.fields) {
      const raw = values[field.key] ?? "";
      const mapsTo = field.mapsTo ?? field.key;
      if (mapsTo === "amount" || mapsTo === "quantity") {
        payload[mapsTo] = Number(raw || 0);
      } else if (
        mapsTo === "title" ||
        mapsTo === "description" ||
        mapsTo === "reference" ||
        mapsTo === "partyName" ||
        mapsTo === "status"
      ) {
        payload[mapsTo] = raw;
      } else {
        (payload.metadata as Record<string, unknown>)[field.key] = raw;
      }
    }

    return payload;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload = buildPayload(operation);

      // Retail "Add Product" also creates a catalog product.
      if (moduleKey === "retail" && operation.key === "add_product") {
        const productResponse = await fetch(`${apiUrl}/api/catalog/products`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            sku: String(payload.reference || `RET-${Date.now()}`),
            name: String(payload.title),
            category: String(payload.partyName || "General"),
            unitPrice: Number(payload.amount || 0),
            stockQty: Number(payload.quantity || 0),
            description: String(payload.description || ""),
            status: String(payload.status || "active"),
          }),
        });
        if (!productResponse.ok) {
          throw new Error("Unable to create product in catalog.");
        }
      }

      const response = await fetch(`${apiUrl}/api/modules/${moduleKey}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to save operation.");

      setValues(emptyValues(operation.fields));
      setMessage(`${operation.label} saved successfully.`);
      await Promise.all([loadEntries(operation.key), loadCatalog()]);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Submission failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/modules/${moduleKey}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error("Unable to delete record.");
      await loadEntries(activeOp);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed."
      );
    }
  };

  return (
    <section className="space-y-6">
      <header className="border border-[var(--line)] bg-white p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Module workspace
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-deep)]">
          {definition.label}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          {definition.summary}
        </p>
        <ul className="mt-4 grid gap-2 md:grid-cols-3">
          {definition.highlights.map((item) => (
            <li
              key={item}
              className="border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </header>

      <div className="flex flex-wrap gap-2">
        {operations.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveOp(item.key)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeOp === item.key
                ? "bg-[var(--brand)] text-white"
                : "border border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--accent)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-[var(--line)] bg-white p-5"
        >
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--foreground)]">
              {operation.label}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{operation.description}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {operation.fields.map((field) => (
              <label
                key={field.key}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <span className="mb-1.5 block text-sm font-medium">
                  {field.label}
                  {field.required ? " *" : ""}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="min-h-24 w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--accent)]"
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--accent)]"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={field.required}
                    type={field.type}
                    value={values[field.key] ?? ""}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--accent)]"
                    placeholder={field.placeholder}
                    min={field.type === "number" ? 0 : undefined}
                  />
                )}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-50"
          >
            {loading ? "Saving..." : operation.submitLabel}
          </button>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
        </form>

        <aside className="space-y-4">
          {definition.showCatalog === "products" ? (
            <div className="border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--foreground)]">Product catalog</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Shared products used by retail, POS, and inventory.
              </p>
              <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
                {products.length === 0 ? (
                  <li className="text-sm text-[var(--muted)]">No products yet.</li>
                ) : (
                  products.map((product) => (
                    <li key={product.id} className="border border-[var(--line)] p-2 text-sm">
                      <p className="font-medium">
                        {product.name}{" "}
                        <span className="text-[var(--muted)]">({product.sku})</span>
                      </p>
                      <p className="text-[var(--muted)]">
                        {product.category} · ${product.unitPrice.toFixed(2)} · Qty{" "}
                        {product.stockQty}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}

          {definition.showCatalog === "customers" ||
          definition.showCatalog === "suppliers" ? (
            <div className="border border-[var(--line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--foreground)]">
                {definition.showCatalog === "customers" ? "Customers" : "Suppliers"}
              </h3>
              <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
                {parties.length === 0 ? (
                  <li className="text-sm text-[var(--muted)]">No records yet.</li>
                ) : (
                  parties.map((party) => (
                    <li key={party.id} className="border border-[var(--line)] p-2 text-sm">
                      <p className="font-medium">
                        {party.name}{" "}
                        <span className="text-[var(--muted)]">({party.code})</span>
                      </p>
                      <p className="text-[var(--muted)]">Status: {party.status}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}

          <div className="border border-[var(--line)] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--foreground)]">
                {operation.label} records
              </h3>
              <button
                type="button"
                onClick={() => void loadEntries(activeOp)}
                className="border border-[var(--line)] px-2 py-1 text-xs"
              >
                Refresh
              </button>
            </div>
            <ul className="max-h-80 space-y-2 overflow-auto">
              {entries.length === 0 ? (
                <li className="text-sm text-[var(--muted)]">No records for this operation.</li>
              ) : (
                entries.map((entry) => (
                  <li key={entry.id} className="border border-[var(--line)] p-2 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{entry.title}</p>
                        <p className="text-[var(--muted)]">
                          {entry.partyName || "—"} · {entry.reference || "No ref"}
                        </p>
                        <p className="text-[var(--muted)]">
                          Qty {entry.quantity} · Amt {entry.amount} · {entry.status}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDelete(entry.id)}
                        className="text-xs text-[var(--danger)]"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
