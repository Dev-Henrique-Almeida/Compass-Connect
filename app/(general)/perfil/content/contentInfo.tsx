import {
  Box,
  Card,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import phoneIcon from "@/public/icons/phone-perfil.png";
import emailIcon from "@/public/icons/email-perfil.png";
import enderecoIcon from "@/public/icons/endereco-perfil.png";
import dataIcon from "@/public/icons/data-perfil.png";
import generoIcon from "@/public/icons/genero-perfil.png";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito",
  },
});

const ContentInfo = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: isMobile ? 1 : 4,
          ml: isMobile ? 0 : -195,
        }}
      >
        <Card
          sx={{
            position: "relative",
            width: isMobile ? 550 : 368,
            borderRadius: 4,
            height: 400,
            border: "2px solid #97979b",
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
            <Typography variant="subtitle1">Masculino</Typography>
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
              Nascido em 26 de Junho, 1980
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
              2239 Hog Camp Road Schaumburg
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
            <img src={emailIcon.src} alt="Email Icon" width={20} height={20} />
            <Typography variant="subtitle1"> charles5182@ummoh.com</Typography>
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
            <Typography variant="subtitle1">(33) 75700-5467</Typography>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default ContentInfo;
