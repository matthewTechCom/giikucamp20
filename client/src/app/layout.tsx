import { UserProvider } from "../context/UserContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
