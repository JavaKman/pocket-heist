// components
import Navbar from "@/components/Navbar"
import DashboardGuard from "./DashboardGuard";

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DashboardGuard>
      <Navbar />
      <main>{children}</main>
    </DashboardGuard>
  )
}
