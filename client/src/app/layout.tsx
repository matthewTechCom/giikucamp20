import { UserProvider } from "../context/UserContext";
import {MapProvider} from "@/context/MapContext"
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <UserProvider>
          <MapProvider>
          {children}
          </MapProvider>
        </UserProvider>
      </body>
    </html>
  );
}
