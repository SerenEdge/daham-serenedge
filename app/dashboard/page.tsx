import { notFound } from "next/navigation";
import { getProjectsAction } from "./actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const data = await getProjectsAction();
  return <DashboardClient initial={data} />;
}
