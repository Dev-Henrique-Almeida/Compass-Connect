"use client";
import React, { useState } from "react";

import {
  Card,
  CardMedia,
  Avatar,
  Button,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  Modal,
  TextField,
} from "@mui/material";
import styles from "./contentCard.module.scss";
import Link from "next/link";
import ProfileModal from "./contentProfile";
import ContentInfo from "./contentInfo";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito",
  },
});

export default function MyPerfil() {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", justifyContent: "center", p: isMobile ? 1 : 4 }}
      >
        <Card
          sx={{
            position: "relative",
            width: 1920,
            borderRadius: 4,
            height: isMobile ? 330 : 400,
            border: "2px solid #97979b",
            background: "linear-gradient(0deg, #1E1F23, #2E2F36)",
          }}
          elevation={5}
        >
          <CardMedia
            sx={{
              borderRadius: 4,
            }}
            component="img"
            height={isMobile ? "200" : "280"}
            image={isMobile ? "/capa-perfil-mobile.png" : "/capa-perfil.png"}
            alt="Capa do perfil"
          />
          <Avatar
            alt="Imagem do Perfil"
            src=""
            sx={{
              width: isMobile ? 150 : 180,
              height: isMobile ? 150 : 180,
              position: "absolute",
              top: isMobile ? 70 : 150,
              left: isMobile ? 15 : 60,
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pt: isMobile ? 2 : 5,

              pl: isMobile ? 23 : 27,
              pb: isMobile ? 1 : 2,

              pr: 2,
            }}
          >
            <Box
              sx={{
                pb: 2,
                pr: 2,
                color: "#E9B425",
                width: isMobile ? "100%" : "30",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "600",
                  wordBreak: "break-word",
                  fontSize: isMobile ? 21 : 34,
                }}
              >
                Eduarda Pereira
              </Typography>

              <Typography variant="subtitle1">UI/UX Designer</Typography>
            </Box>
            <div>
              <Button
                type="submit"
                className={styles.buttonEdit}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  ml: isMobile ? -43 : 130,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              >
                Editar Perfil
              </Button>
              <ProfileModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </Box>
        </Card>
      </Box>
      <ContentInfo />
    </ThemeProvider>
  );
}
