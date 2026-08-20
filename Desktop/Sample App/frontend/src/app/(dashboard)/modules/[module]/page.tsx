import { notFound } from "next/navigation";
import ModuleWorkspace from "@/components/ModuleWorkspace";
import { modules } from "@/lib/modules";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const resolvedParams = await params;
  const moduleKey = resolvedParams.module;
  const validModule = modules.some((moduleItem) => moduleItem.key === moduleKey);

  if (!validModule) {
    notFound();
  }

  return <ModuleWorkspace moduleKey={moduleKey} />;
}
