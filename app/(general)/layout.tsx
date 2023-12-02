"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import useStore from "../../store/store";
import NavBar from "../components/navbar/navBar";
import { Card, ThemeProvider, createTheme } from "@mui/material";

export default function RootLayout({ children }: PropsWithChildren) {
  const [showNavBar, setShowNavBar] = useState(true);

  const theme = createTheme({
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
    },
  });

  useEffect(() => {
    const path = window.location.pathname;
    setShowNavBar(!(path === "/register" || path === "/login"));
  }, []);

  const {
    open,
    selectedItem,
    modalOpen,
    setOpen,
    setSelectedItem,
    setModalOpen,
  } = useStore();

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <body
          style={{
            margin: 0,
            backgroundColor: "#17181C",
            blockSize: "100%",
          }}
        >
          {showNavBar && (
            <NavBar
              open={open}
              selectedItem={selectedItem}
              modalOpen={modalOpen}
              setOpen={setOpen}
              setSelectedItem={setSelectedItem}
              setModalOpen={setModalOpen}
            />
          )}
          {children}
        </body>
      </Card>
    </ThemeProvider>
  );
}
