import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { Sidebar } from "@/components/platform/Sidebar";
import { Header } from "@/components/platform/Header";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/community";

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return (
    <div className="shell">
      <Sidebar
        role={session.role}
        currentPath={pathname}
        organizationName={session.organizationName}
      />
      <div className="main-content">
        <Header
          userName={user?.name ?? "Usuário"}
          role={session.role}
        />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
