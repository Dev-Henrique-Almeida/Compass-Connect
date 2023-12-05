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
} from "@mui/material";
import styles from "./contentCard.module.scss";
import ProfileModal from "./contentProfile";
import ContentInfo from "./contentInfo";
import useStore from "../../../../store/store";
import { useRouter } from "next/navigation";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [avatar, setAvatar] = useState("");
  const { modalOpen } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardMarginLeft = modalOpen ? "1%" : "";

  const router = useRouter();

  // Função para o conteúdo seguir o menu
  const homePostStyle = {
    width: modalOpen ? "calc(100% - 330px)" : "100%",
    marginLeft: modalOpen ? "330px" : "0",
  };

  // Função para verificar se o usuário está logado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token; // Retorna true se o token existir, false caso contrário
  };

  // Função para verificar se o usuário está logado e redirecionar para outra tela
  useEffect(() => {
    if (!isUserLoggedIn()) {
      // Se o usuário não estiver logado, redirecione para a página de login
      router.push("/login");
    }
  }, []);

  // Função responsável por buscar os dados do usuário de forma assíncrona
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
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <section style={homePostStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: isMobile ? 1 : 4,
            marginLeft: isMobile ? "" : cardMarginLeft,
            pt: isMobile ? 0 : 2,
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
              background: "#17181C",
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
              <div>
                <Button
                  type="submit"
                  className={styles.buttonEdit}
                  onClick={() => setIsModalOpen(true)}
                  sx={{
                    ml: isMobile ? -40 : 120,
                    background:
                      "linear-gradient(45deg, #ad2d14 30%, #f42e07 90%)",
                    color: "#ffffff",
                    borderRadius: "35px",
                    height: " 54px",
                    marginTop: isMobile ? "50px" : "-35px",

                    textTransform: "none",
                    fontWeight: "bold",
                    transition: "color 0.3s",
                    width: "140px",
                    fontSize: "15px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#000000")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FFFFFF")
                  }
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
      </section>
      <ContentInfo />
    </ThemeProvider>
  );
}
