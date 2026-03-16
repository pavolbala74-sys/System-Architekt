// Root layout — next-intl middleware handles locale-based routing.
// The full HTML shell and metadata live in app/[locale]/layout.tsx.
// Next.js App Router requires this file; it stays minimal.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
