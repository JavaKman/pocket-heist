import PublicGuard from "./PublicGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PublicGuard>
      <main className="public">
        {children}
      </main>
    </PublicGuard>
  )
}
