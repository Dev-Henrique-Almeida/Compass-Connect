import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  styled,
  useTheme,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import styles from "./navBar.module.scss";
import planetaIcon from "../../../public/icons/planeta.png";
import sinoIcon from "../../../public/icons/sino.png";
import rightArrowIcon from "../../../public/icons/rightArrow.png";
import leftArrowIcon from "../../../public/icons/leftArrow.png";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import { Card, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, Arial",
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

const drawerWidth = 350;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: ` -${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface NavbarProps {
  open: boolean;
  selectedItem: string;
  modalOpen: boolean;
  setOpen: (value: boolean) => void;
  setSelectedItem: (item: string) => void;
  setModalOpen: (value: boolean) => void;
}

export default function NavBar({
  open,
  selectedItem,
  modalOpen,
  setOpen,
  setSelectedItem,
  setModalOpen,
}: NavbarProps) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [nome, setNome] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();

      if (userInfo) {
        setNome(userInfo.name);
        setImage(userInfo.image);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (path: string, itemName: string) => {
    if (itemName === "Sair") {
      /* Limpa o localStorage para ter que fazer o acesso novamente */
      localStorage.clear();
      router.push("/login");
    } else {
      setSelectedItem(itemName);
      setModalOpen(false);
      setOpen(false);
      router.push(path);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    setModalOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        className={styles.main}
        sx={{
          fontFamily: "MontSerrat",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar
              sx={{
                backgroundColor: "#17181c",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {modalOpen ? null : (
                  <img
                    src={rightArrowIcon.src}
                    alt="Abrir menu"
                    style={{
                      width: isMobile ? "30px" : "50px",
                      height: isMobile ? "30px" : "50px",
                      cursor: "pointer",
                      marginRight: "16px",
                    }}
                    onClick={handleDrawerOpen}
                  />
                )}

                <DrawerHeader>
                  {open && (
                    <img
                      src={leftArrowIcon.src}
                      alt="Fechar menu"
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                        marginLeft: "16px",
                      }}
                      onClick={handleDrawerClose}
                    />
                  )}
                </DrawerHeader>

                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontSize: 16,
                    "@media (max-width: 767px)": {
                      display: "none",
                    },
                    fontFamily: "MontSerrat",
                  }}
                >
                  Social Compass
                </Typography>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={planetaIcon.src}
                  alt="Planeta Icon"
                  style={{
                    width: "25px",
                    height: "25px",
                    filter: "invert(100%)",
                    marginRight: "15px",
                  }}
                />
                <img
                  src={sinoIcon.src}
                  alt="Sino Icon"
                  style={{
                    width: "25px",
                    height: "25px",
                    filter: "invert(100%)",
                    marginRight: "15px",
                  }}
                />

                <Typography
                  variant="body1"
                  sx={{
                    marginRight: isMobile ? 0.9 : 2,
                    color: "white",
                    fontSize: isMobile ? "16px" : "16px",
                    fontFamily: "MontSerrat",
                  }}
                >
                  {nome}
                </Typography>
                <Link href="/perfil" passHref>
                  <Avatar
                    alt=""
                    src={image}
                    style={{
                      border: "1.5px solid #E9B425",
                      width: isMobile ? "34px" : "50px",
                      height: isMobile ? "34px" : "50px",
                      cursor: "pointer",
                    }}
                  />
                </Link>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              display: "flex",
              justifyContent: "center",
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                backgroundColor: "#1E1F23",
                color: "white",
                "@media (max-width: 767px)": {
                  width: "100%",
                },
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <img
              src="/compass-logo.png"
              alt="Login Home"
              style={{
                width: isMobile ? "250px" : "240px",
                marginLeft: isMobile ? 70 : 50,
              }}
            />
            <Card
              sx={{
                marginLeft: isMobile ? "80px" : " 55px",
                borderRadius: 0,
                display: "flex",
                color: "white",
                background: "transparent",
                width: "240px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid var(--gray-gray-600, #2e2f36)",
              }}
            >
              <Link
                href="/home"
                passHref
                className={`${styles.linkFull} ${
                  selectedItem === "Página inicial" ? styles.activeLink : ""
                }`}
                onClick={() => handleItemClick("/home", "Página inicial")}
              >
                Página inicial
              </Link>
              <Link
                href="/perfil"
                passHref
                className={`${styles.linkFull} ${
                  selectedItem === "Meu Perfil" ? styles.activeLink : ""
                }`}
                onClick={() => handleItemClick("/perfil", "Meu Perfil")}
              >
                Meu Perfil
              </Link>
              <Link
                href="/marketplace"
                passHref
                className={`${styles.linkFull} ${
                  selectedItem === "MarketPlace" ? styles.activeLink : ""
                }`}
                onClick={() => handleItemClick("/marketplace", "MarketPlace")}
              >
                Marktplace
              </Link>
              <Link
                href="/"
                passHref
                className={`${styles.linkFull} ${
                  selectedItem === "Sair" ? styles.activeLink : ""
                }`}
                onClick={() => handleItemClick("/", "Sair")}
              >
                Sair
              </Link>
            </Card>
          </Drawer>

          <Main open={open}>
            <DrawerHeader />
          </Main>
        </Box>
      </Card>
    </ThemeProvider>
  );
}
