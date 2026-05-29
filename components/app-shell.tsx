import Link from "next/link";
import { Building2, FileText, Home, LayoutDashboard, Receipt, ReceiptText, Sparkles, Users } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/assistant", label: "Assistant", icon: Sparkles },
  { href: "/biens", label: "Biens", icon: Building2 },
  { href: "/locataires", label: "Locataires", icon: Users },
  { href: "/loyers", label: "Loyers", icon: ReceiptText },
  { href: "/charges", label: "Charges", icon: Receipt },
  { href: "/documents", label: "Documents", icon: FileText },
];

export function AppShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cloud">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-white px-5 py-6 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-pine text-white">
            <Home size={24} />
          </span>
          <span>
            <span className="block text-lg font-bold text-ink">Immo Clair</span>
            <span className="block text-sm text-ink/55">Gestion immobilière simple</span>
          </span>
        </Link>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-ink/72 hover:bg-mint hover:text-pine"
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
            </div>
            <AuthButton />
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-line bg-cloud px-3 text-sm font-semibold text-ink">
                <item.icon size={17} />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
