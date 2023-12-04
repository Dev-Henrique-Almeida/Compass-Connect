"use client";
import React, { useEffect, useState } from "react";
import ContentInfo from "./contentInfo";
import useStore from "@/store/store";

import {
  Card,
  CardMedia,
  Avatar,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito",
  },
});

// Função responsável por buscar os dados do usuário de forma assíncrona
const getUserInfo = async (userId: string) => {
  const token = localStorage.getItem("token");
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

export default function MyIdPerfil() {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [avatar, setAvatar] = useState("");
  const { modalOpen, id } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardMarginLeft = modalOpen ? "1%" : "";

  // Função para o conteúdo seguir o menu
  const homePostStyle = {
    width: modalOpen ? "calc(100% - 330px)" : "100%",
    marginLeft: modalOpen ? "330px" : "0",
  };

  // Função para buscar os dados do usuário baseado no id do mesmo
  useEffect(() => {
    console.error(id);
    const fetchData = async () => {
      if (id) {
        let isMounted = true;
        try {
          const userInfo = await getUserInfo(id);
          if (userInfo && isMounted) {
            setNome(userInfo.name);
            setCargo(userInfo.occupation);
            setAvatar(userInfo.image);
          }
        } catch (error) {
          console.error("Erro ao obter informações do usuário:", error);
        }
        return () => {
          isMounted = false;
        };
      }
    };

    fetchData();
  }, [id]);

  return (
    <ThemeProvider theme={theme}>
      <section style={homePostStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: isMobile ? 1 : 4,
            marginLeft: isMobile ? "" : cardMarginLeft,

            pt: 2,
          }}
        >
          <Card
            sx={{
              position: "relative",
              marginTop: isMobile ? 5 : 0,
              borderRadius: 4,
              height: isMobile ? 380 : 400,
              width: isMobile ? 380 : "100%",
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
              height={isMobile ? "250" : "280"}
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
                border: "2px solid #E9B425",
                top: isMobile ? 130 : 150,
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
                  width: isMobile ? "140px" : "30",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "600",
                    wordBreak: "break-word",
                    width: isMobile ? "100%" : "380%",

                    fontSize: isMobile ? 21 : 30,
                  }}
                >
                  {nome}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    width: isMobile ? "150%" : "250%",
                  }}
                >
                  {cargo}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </section>
      <ContentInfo />
    </ThemeProvider>
  );
}
