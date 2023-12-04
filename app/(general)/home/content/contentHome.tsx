"use client";
import styles from "./contentHome.module.scss";
import React, { useEffect, useState } from "react";
import useStore from "../../../../store/store";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";

import {
  Box,
  Button,
  Card,
  Fade,
  Modal,
  TextField,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import cameraIcon from "@/public/icons/camera.png";
import galeriaIcon from "@/public/icons/galeria.png";
import clipIcon from "@/public/icons/clip.png";
import enderecoIcon from "@/public/icons/endereco.png";
import emojiIcon from "@/public/icons/emoji.png";
import Image from "next/image";
import ContentPost from "./contentPost";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, Arial",
  },
});

/* Interfaces */
interface User {
  id: string;
  name: string;
  image: string;
}

interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  vendido: boolean;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
  buyerId: string | null;
}

/* Funções assíncronas */
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

const getMarketItems = async (): Promise<MarketItem[]> => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3001/market", {
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
    console.error("Erro ao obter itens do mercado:", error);
  }
  return [];
};

const getUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:3001/users/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const usersData: User[] = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          image: user.image,
        }));
        return usersData;
      }
    } catch (error) {
      console.error("Erro ao obter informações dos usuários:", error);
    }
  }
  return []; // Aqui vai retornar um array vazio se houver um erro ou se o token não existir
};

export default function ContentHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [image, setImage] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [shouldScrollDestaque, setshouldScrollDestaque] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const { modalOpen, setId } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  // Para estilização do input
  const focusedStyle = {
    border: "0.8px solid gray",
    padding: "9.6px 14.4px",
  };

  // Para o conteúdo seguir o menu
  const homePostStyle = {
    width: modalOpen ? "calc(80% - 350px)" : "80%",
    marginLeft: modalOpen ? "350px" : "0",
  };

  // Checagem se a tela é mobile
  const mobileHomePostStyle = {
    width: "92%",
    marginLeft: "-5%",
  };

  const [postData, setPostData] = useState({
    text: "",
    location: "",
    image: "",
    authorId: "",
  });

  /* useEffect para checar se o usuário está logado */
  useEffect(() => {
    if (!isUserLoggedIn()) {
      // Se o usuário não estiver logado, redirecione para a página de login
      router.push("/login");
    }
  }, []);

  /* useEffect para mostrar apenas 4 usuários na aba "Meus amigos" */
  useEffect(() => {
    if (users.length > 4) {
      setShouldScroll(true);
    } else {
      setShouldScroll(false);
    }
  }, [users]);

  useEffect(() => {
    setshouldScrollDestaque(marketItems.length > 4);
  }, [marketItems]);

  useEffect(() => {
    const fetchData = async () => {
      const items = await getMarketItems();
      setMarketItems(items);
    };
    fetchData();
  }, []);

  /* useEffect para o usuário logado */
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();

      if (userInfo) {
        setImage(userInfo.image);
        setLoggedInUserId(userInfo.id); // checar se o usuário já está logado
      }
    };

    fetchData();
  }, []);

  /* useEffect para buscar os usuários cadastrados */
  useEffect(() => {
    const fetchData = async () => {
      const usersInfo: User[] = await getUsers();

      // Ordenando os usuários em ordem alfabética pelo nome
      const sortedUsers = usersInfo.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Adicionando um filtro para os usuários, os quais retornarão um array
      const filteredUsers = sortedUsers.filter(
        (user) => user.id !== loggedInUserId
      );

      setUsers(filteredUsers);
    };

    fetchData();
  }, [loggedInUserId]);

  /* Só para visualização/testes */
  useEffect(() => {
    console.log(postData.text);
  }, [postData.text]);

  /* Funções */

  // Função para abrir o modal de input de imagem
  const handleGalleryClick = () => {
    setIsGalleryModalOpen(true);
  };

  // Função para abrir o modal de input da localização
  const handleLocationClick = () => {
    setIsLocationModalOpen(true);
  };

  const handleSetLocation = () => {
    setPostData((prev) => ({ ...prev, location: tempLocation }));
    setIsLocationModalOpen(false);
  };

  // Função para verificar se o usuário está logado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token; // Retorna true se o token existir, false caso contrário
  };

  // Função para redirecionar para a tela de perfil do usuário selecionado
  const handleUserClick = (userId: string) => {
    // Navega para a página de perfil do usuário
    setId(userId);
    router.push(`/perfil/id=${userId}`);
  };

  // Função para funcionar o input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função responsável por postar o item
  const handlePostClick = async () => {
    const token = localStorage.getItem("token");
    const updatedPostData = {
      ...postData,
      authorId: loggedInUserId,
    };

    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPostData),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Post enviado com sucesso:", responseData);
      setPostData({ text: "", location: "", image: "", authorId: "" });
    } else {
      console.error("Falha ao enviar post:", response.status);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          borderRadius: 0,
          p: " 0px 36px",
          pt: "20px",
          height: "auto",
          background: "#17181c",
          fontfamily: "MontSerrat",
        }}
      >
        <Card
          style={isMobile ? mobileHomePostStyle : homePostStyle}
          sx={{
            display: "flex",
            background: "#1e1f23",
            justifyContent: "flex-start",
            position: "absolute",
            padding: "16px",
            border: "1px solid #2e2f36",
            borderRadius: "16px",
            height: "120px",
            flex: "none",
            order: 0,
            flexGrow: 0,
          }}
        >
          <div className={styles.container}>
            <div className={styles.avatarContainer}>
              <Avatar
                alt="Avatar"
                src={image}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #E9B425",

                  marginRight: "16px",
                }}
              />

              <input
                style={{
                  fontFamily: "MontSerrat",
                  background: "transparent",
                  border: "1px solid gray",
                  color: "white",
                  padding: "10px 15px",
                  outline: "none",
                  ...(isFocused && focusedStyle),
                }}
                type="text"
                name="text"
                value={postData.text}
                onChange={handleInputChange}
                placeholder="No que você está pensando?"
                className={styles.inputBox}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>

            <Image
              src={cameraIcon}
              alt={"Câmera Icon"}
              className={styles.camera}
            />
            <Image
              src={galeriaIcon}
              alt={"Galeria Icon"}
              onClick={handleGalleryClick}
              className={styles.galeria}
              style={{
                cursor: "pointer",
              }}
            />
            <Image src={clipIcon} alt={"Clip Icon"} className={styles.clip} />
            <Image
              src={enderecoIcon}
              alt={"Endereço Icon"}
              className={styles.endereco}
              style={{
                cursor: "pointer",
              }}
              onClick={handleLocationClick}
            />
            <Image
              src={emojiIcon}
              alt={"Emoji Icon"}
              className={styles.emoji}
            />

            <div className={styles.buttonPost}>
              <button
                type="submit"
                onClick={handlePostClick}
                className={styles.postButton}
              >
                Postar
              </button>
            </div>
          </div>
        </Card>
        <ContentPost />

        <div className={styles.accordions}>
          <div>
            <Accordion
              style={{
                width: "272px",
                borderRadius: "16px",
                color: "white",
                border: "2px solid var(--gray-gray-600, #2E2F36)",
                background: "var(--gray-gray-700, #1E1F23)",
                display: "block",
                maxHeight: shouldScroll ? "270px" : "none",
              }}
              className={shouldScroll ? styles.scrollHidden : ""}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Meus amigos</Typography>
              </AccordionSummary>
              {users.map((user, index) => (
                <AccordionDetails
                  key={index}
                  style={{ display: "flex", cursor: "pointer" }}
                  onClick={() => {
                    handleUserClick(user.id);
                  }}
                >
                  <Avatar
                    alt={user.name}
                    src={user.image}
                    style={{
                      width: "32px",
                      height: "32px",
                      marginRight: "10px",
                      marginTop: "-5px",
                    }}
                  />
                  <Typography>{user.name}</Typography>
                </AccordionDetails>
              ))}
            </Accordion>
          </div>

          <div>
            <Accordion
              style={{
                width: "272px",
                borderRadius: "16px",
                color: "white",
                border: "2px solid var(--gray-gray-600, #2E2F36)",
                background: "var(--gray-gray-700, #1E1F23)",
                marginTop: "20px",
                maxHeight: shouldScrollDestaque ? "345px" : "none",
              }}
              className={
                shouldScrollDestaque ? styles.scrollHiddenDestaque : ""
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ color: "white" }}>
                  Itens em Destaque{" "}
                </Typography>
              </AccordionSummary>
              {marketItems.map((item, index) => (
                <AccordionDetails
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt={item.name}
                    src={item.image || ""}
                    style={{
                      width: "32px",
                      height: "32px",
                      marginRight: "16px",
                    }}
                  />
                  <div className={styles.productInfo}>
                    <Typography>{item.name}</Typography>
                    <Typography className={styles.productPrice}>
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </Typography>
                  </div>
                </AccordionDetails>
              ))}
            </Accordion>
          </div>
        </div>
      </Card>

      {/* Modal para a imagem */}
      <Modal
        open={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isGalleryModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? 350 : 400,
              bgcolor: "background.paper",
              background: "#17181c",
              boxShadow: 24,
              p: 4,
              outline: "none",
              borderRadius: "40px",
            }}
          >
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "white", display: "flex", justifyContent: "center" }}
            >
              Adicionar imagem
            </Typography>

            <TextField
              label="Insira o URL da imagem"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
              InputProps={{
                style: {
                  color: "white",
                },
                classes: {
                  notchedOutline: styles.whiteBorder,
                },
              }}
              InputLabelProps={{
                style: { color: "#757575" },
              }}
            />
            <Button
              sx={{
                color: "white",
                borderRadius: "46px",
                border: "1px solid var(--orange, #9e1a00)",
                fontFamily: "MontSerrat",
                fontWeight: "bold",
                cursor: "pointer",
                background:
                  "var(--gradient-button,linear-gradient(180deg, #ad2d14 0%, #f42e07 100%))",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
              fullWidth
              onClick={() => {
                setPostData((prev) => ({ ...prev, image: tempImageUrl }));
                setIsGalleryModalOpen(false);
              }}
            >
              Definir URL da imagem
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal para a localização */}
      <Modal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isLocationModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? 350 : 400,
              bgcolor: "background.paper",
              background: "#17181c",
              boxShadow: 24,
              p: 4,
              outline: "none",
              borderRadius: "40px",
            }}
          >
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "white", display: "flex", justifyContent: "center" }}
            >
              Definir localização
            </Typography>

            <TextField
              label="Insira a localização"
              value={tempLocation}
              onChange={(e) => setTempLocation(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
              InputProps={{
                style: {
                  color: "white",
                },
                classes: {
                  notchedOutline: styles.whiteBorder,
                },
              }}
              InputLabelProps={{
                style: { color: "#757575" },
              }}
            />

            <Button
              sx={{
                color: "white",
                borderRadius: "46px",
                border: "1px solid var(--orange, #9e1a00)",
                fontFamily: "MontSerrat",
                fontWeight: "bold",
                cursor: "pointer",
                background:
                  "var(--gradient-button,linear-gradient(180deg, #ad2d14 0%, #f42e07 100%))",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
              fullWidth
              onClick={handleSetLocation}
            >
              Definir localização
            </Button>
          </Box>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
}
