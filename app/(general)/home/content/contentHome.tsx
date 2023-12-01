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
  const { modalOpen } = useStore();
  const homePostStyle = {
    width: modalOpen ? "calc(80% - 350px)" : "80%",
    marginLeft: modalOpen ? "350px" : "0",
  };
  const mobileHomePostStyle = {
    width: "92%",
    marginLeft: "-5%",
  };

  const router = useRouter();

  const handleUserClick = (userId: string) => {
    // Navega para a página de perfil do usuário
    router.push(`/perfil/${userId}`);
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
            <svg
              className={styles.faPhoto}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              color="white"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>

            <svg
              className={styles.faImg}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              color="white"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>

            <svg
              className={styles.faClip}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              color="white"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
              />
            </svg>

            <svg
              className={styles.faMap}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              color="white"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>

            <svg
              className={styles.faSmile}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              color="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>

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
              }}
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
                  onClick={() => handleUserClick(user.id)}
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
