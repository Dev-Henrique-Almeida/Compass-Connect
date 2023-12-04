import {
  Box,
  Card,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import phoneIcon from "@/public/icons/phone-perfil.png";
import emailIcon from "@/public/icons/email-perfil.png";
import enderecoIcon from "@/public/icons/endereco-perfil.png";
import dataIcon from "@/public/icons/data-perfil.png";
import generoIcon from "@/public/icons/genero-perfil.png";
import useStore from "../../../../store/store";
import ContentPost from "../../home/content/contentPost";
import ContentMyPosts from "./contentPosts";

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

const ContentInfo = () => {
  const [sexo, setSexo] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const { modalOpen } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardMarginLeft = modalOpen ? "-50%" : "-57.5%";
  const homePostStyle = {
    width: modalOpen ? "calc(100% - 330px)" : "100%",
    marginLeft: modalOpen ? "330px" : "0",
  };

  // Função para obter o nome do mês em português
  const getMonthName = (monthIndex: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[monthIndex];
  };

  const formatSex = (sex: string) => {
    switch (sex) {
      case "Male":
        return "Masculino";
      case "Female":
        return "Feminino";
      default:
        return "";
    }
  };

  // Função responsável por buscar os dados do usuário de forma assíncrona
  useEffect(() => {
    const fetchData = async () => {
      let isMounted = true;
      const userInfo = await getUserInfo();
      const dateObject = new Date(userInfo.birthdate);
      const day = dateObject.getDate();
      const monthName = getMonthName(dateObject.getMonth());
      const year = dateObject.getFullYear();

      if (userInfo) {
        setTelefone(userInfo.phone);
        setEmail(userInfo.email);
        setEndereco(userInfo.address);
        setNascimento(`Nascido em ${day} de ${monthName}, ${year}`);

        /* Checa se vem algo do response, para setar */
        if (userInfo && isMounted) {
          const formattedSex = formatSex(userInfo.sex);
          setSexo(formattedSex);
        }
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

            flexDirection: isMobile ? "column" : "",
            justifyContent: "center",
            p: isMobile ? 1 : 4,
            marginTop: isMobile ? 2 : -4,
          }}
        >
          <Card
            sx={{
              position: "relative",
              width: isMobile ? "400" : 368,
              borderRadius: 4,
              height: 410,

              marginLeft: isMobile ? "" : cardMarginLeft,
              border: "2px solid #97979b",
              color: "white",

              background: "linear-gradient(0deg, #1E1F23, #2E2F36)",
            }}
            elevation={5}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "600",
                wordBreak: "break-word",
                padding: 2,
                paddingTop: 3,
                paddingBottom: 3,
                paddingLeft: 3,
                fontSize: isMobile ? 18 : 22,
              }}
            >
              Sobre
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingLeft: 2.8,
                paddingBottom: 5,
              }}
            >
              <img
                src={generoIcon.src}
                alt="Gênero Icon"
                width={20}
                height={20}
              />
              <Typography variant="subtitle1">
                {sexo || "Não Informado"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingBottom: 5,
                paddingLeft: 2.8,
              }}
            >
              <img
                src={dataIcon.src}
                alt="Data de Nascimento Icon"
                width={20}
                height={20}
              />
              <Typography variant="subtitle1">
                {nascimento || "Não Informado"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,

                paddingBottom: 5,
                paddingLeft: 2.8,
              }}
            >
              <img
                src={enderecoIcon.src}
                alt="Endereço Icon"
                width={20}
                height={20}
              />
              <Typography variant="subtitle1">
                {endereco || "Não Informado"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingLeft: 3,
                paddingBottom: 5,
              }}
            >
              <img
                src={emailIcon.src}
                alt="Email Icon"
                width={20}
                height={20}
              />
              <Typography variant="subtitle1">
                {email || "Não Informado"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingLeft: 2.8,
              }}
            >
              <img
                src={phoneIcon.src}
                alt="Telefone Icon"
                width={20}
                height={20}
              />
              <Typography variant="subtitle1">
                {telefone || "Não Informado"}
              </Typography>
            </Box>
          </Card>
          <Box
            sx={{
              mt: 2,
              ml: isMobile ? 1 : 5,

              width: isMobile ? "100%" : "20%",
            }}
          >
            <Card
              sx={{
                display: "flex",
                color: "#E9B425",
                ml: isMobile ? -1 : 3.7,

                width: isMobile ? "370px" : "1360px",
                background: "transparent",
                marginTop: isMobile ? "10px" : "0",
                height: "50px",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: 16,
                  fontWeight: "50",
                  marginLeft: isMobile ? 10 : 60,
                }}
              >
                Followers
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: 16,
                  fontWeight: "50",
                  marginLeft: isMobile ? 3 : 10,
                }}
              >
                Following
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",

                  marginLeft: isMobile ? 3 : 10,
                }}
              >
                Posts
              </Typography>
            </Card>
          </Box>
        </Box>
      </section>
      <ContentMyPosts />
    </ThemeProvider>
  );
};

export default ContentInfo;
