import type { Metadata } from "next";
import "./page.module.scss";

export const metadata: Metadata = {
  title: "Compass Connect",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          backgroundColor:
            "background: linear-gradient(180deg, #2e2f36 0%, #17181c 100%)",
          blockSize: "100%",
        }}
      >
        {children}
      </body>
    </html>
  );
}
