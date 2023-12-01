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
import { Card, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import cameraIcon from "@/public/icons/camera.png";
import galeriaIcon from "@/public/icons/galeria.png";
import clipIcon from "@/public/icons/clip.png";
import enderecoIcon from "@/public/icons/endereco.png";
import emojiIcon from "@/public/icons/emoji.png";
import Image from "next/image";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, Arial",
  },
});

interface User {
  id: string;
  name: string;
  image: string;
}

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [inputValue, setInputValue] = useState("No que você está pensando?");
  const [users, setUsers] = useState<User[]>([]);
  const [image, setImage] = useState("");
  const { modalOpen, setId } = useStore();
  const homePostStyle = {
    width: modalOpen ? "calc(80% - 350px)" : "80%",
    marginLeft: modalOpen ? "350px" : "0",
  };
  const mobileHomePostStyle = {
    width: "92%",
    marginLeft: "-5%",
  };

  const [shouldScroll, setShouldScroll] = useState(false);

  // Função para verificar se o usuário está logado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token; // Retorna true se o token existir, false caso contrário
  };

  useEffect(() => {
    if (!isUserLoggedIn()) {
      // Se o usuário não estiver logado, redirecione para a página de login
      router.push("/login");
    }
  }, []);
  useEffect(() => {
    if (users.length > 4) {
      setShouldScroll(true);
    } else {
      setShouldScroll(false);
    }
  }, [users]);

  const router = useRouter();

  const handleUserClick = (userId: string) => {
    // Navega para a página de perfil do usuário
    setId(userId);
    router.push(`/perfil/id=${userId}`);
  };

  /* useEffect para o usuário logado */
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          borderRadius: 0,
          p: " 0px 36px",
          pt: "20px",
          height: "55rem",
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
                style={{ fontFamily: "MontSerrat" }}
                type="text"
                value={inputValue}
                onChange={handleChange}
                className={styles.inputBox}
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
              className={styles.galeria}
            />
            <Image src={clipIcon} alt={"Clip Icon"} className={styles.clip} />
            <Image
              src={enderecoIcon}
              alt={"Endereço Icon"}
              className={styles.endereco}
            />
            <Image
              src={emojiIcon}
              alt={"Emoji Icon"}
              className={styles.emoji}
            />

            <div className={styles.buttonPost}>
              <button type="submit" className={styles.postContainer}>
                Postar
              </button>
            </div>
          </div>
        </Card>

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
                expandIcon={<ExpandMoreIcon />}
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
                border: "2px solid var(--gray-gray-600, #2E2F36)",
                background: "var(--gray-gray-700, #1E1F23)",
                color: "white",
                marginTop: "20px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Itens em Destaque </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  style={{
                    width: isMobile ? "20px" : "32px",
                    height: "32px",
                  }}
                />
                <Typography>Armário Grande</Typography>
              </AccordionDetails>
              <AccordionDetails
                style={{
                  display: "flex",
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={""}
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                />
                <Typography>Armário Grande</Typography>
              </AccordionDetails>{" "}
              <AccordionDetails
                style={{
                  display: "flex",
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={""}
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                />
                <Typography>Armário Grande</Typography>
              </AccordionDetails>
              <AccordionDetails
                style={{
                  display: "flex",
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={""}
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                />
                <Typography>Armário Grande</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </Card>
    </ThemeProvider>
  );
}
