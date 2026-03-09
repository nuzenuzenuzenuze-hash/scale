import Sidebar from "@/components/sidebar";
import { getUser } from "@/lib/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        userName={user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario"}
        userEmail={user?.email || ""}
        userAvatar={user?.user_metadata?.avatar_url}
      />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
