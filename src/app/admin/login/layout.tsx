/**
 * Login Layout (Minimal)
 * No authentication check, standalone page
 */

export const metadata = {
  title: "Admin Login",
  description: "Login to Admin Dashboard",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
