import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compass Connect",
  description: "Rede Social",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <body
        style={{
          margin: 0,
          backgroundColor: "linear-gradient(180deg, #2e2f36 0%, #17181c 100%)",
          blockSize: "100%",
        }}
      >
        {children}
      </body>
    </>
  );
}
