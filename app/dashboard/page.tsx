import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * The dashboard is a local-authoring tool, not part of the public site.
 * `noindex, nofollow` here is belt-and-braces alongside the /dashboard
 * disallow in robots.ts — a disallowed URL can still be indexed from an
 * external link, but a noindex it is allowed to read cannot be.
 */
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardPage() {
  // Bail before touching ./actions. That module pulls in `sharp`, a native
  // binary that fails to initialise on the serverless runtime, so importing
  // it at module scope made this route return 500 in production instead of
  // the intended 404. Deferring the import keeps production off that path.
  if (process.env.NODE_ENV === "production") notFound();

  const [{ getProjectsAction }, { default: DashboardClient }] = await Promise.all([
    import("./actions"),
    import("./DashboardClient"),
  ]);

  const data = await getProjectsAction();
  return <DashboardClient initial={data} />;
}
