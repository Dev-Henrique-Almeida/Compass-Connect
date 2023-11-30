"use client";
import React, { useEffect, useState } from "react";

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

const getUserInfo = async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  if (token && userId) {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Erro ao obter informações do usuário:", error);
    }
  }
};

export default function MyPerfil() {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setNome(userInfo.name);
        setCargo(userInfo.occupation);
        setAvatar(userInfo.image);
      }
    };

    fetchData();
  }, [open]);
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
            src={avatar}
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
                  fontSize: isMobile ? 21 : 30,
                }}
              >
                {nome}
              </Typography>

              <Typography variant="subtitle1">{cargo}</Typography>
            </Box>
            <div>
              <Button
                type="submit"
                className={styles.buttonEdit}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  ml: isMobile ? -43 : 120,
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
