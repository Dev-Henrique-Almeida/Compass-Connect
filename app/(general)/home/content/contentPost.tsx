import React, { useEffect, useState } from "react";
import styles from "./contentPost.module.scss";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import tempoIcon from "@/public/icons/timing.png";
import defaultPost from "@/public/defaultImagePost.png";
import defaultPostMobile from "@/public/defaultPostMobile.png";

import {
  Avatar,
  Box,
  Card,
  Divider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";

/* Interfaces */
interface Author {
  id: string;
  name: string;
  image: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
}

interface Post {
  image: string;
  text: string;
  author: Author;
  location: string;
  createdAt: string;
  comments: Comment[];
}

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Arial",
  },
});

/* Funções assíncronas */
const getPosts = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch(`http://localhost:3001/posts`, {
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
      console.error("Erro ao obter informações dos posts:", error);
    }
  }
};

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

const ContentPost = () => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  /* const [inputValue, setInputValue] = useState("Tem algo a dizer?"); */
  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: "",
    image: "",
    id: "",
  });
  const { modalOpen, setId } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const homePostStyle = {
    width: modalOpen ? "calc(83.3% - 350px)" : "83.3%",
    marginLeft: modalOpen ? "350px" : "0",
  };
  const mobileHomePostStyle = {
    width: "92%",
    marginLeft: "-5%",
  };
  const focusedStyle = {
    border: "0.8px solid gray",
    padding: "9.6px 14.4px",
  };

  /* UseEffects */
  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await getPosts();
      if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Função para obter dados do usuário
    const fetchUserData = async () => {
      const userData = await getUserInfo();
      setUserProfile({
        name: userData.name,
        image: userData.image,
        id: userData.id,
      });
    };

    fetchUserData();
  }, []);

  /* Funções */

  // Função para o uso do input
  /*   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }; */

  const handleLikeClick = () => {
    setLikeClicked(!likeClicked);
    setLikeCount((prevCount) => prevCount + 1);
  };

  const handleCommentClick = () => {
    setCommentClicked(!commentClicked);
  };

  const handleShareClick = () => {
    setShareClicked(!shareClicked);
  };

  // Função para redirecionar para a tela de perfil do usuário
  const handleUserClick = (userId: string) => {
    // Navega para a página de perfil do usuário
    setId(userId);
    router.push(`/perfil/id=${userId}`);
  };

  // Função para calcular o tempo decorrido desde a criação do post
  const getTimeSince = (dateString: string) => {
    const postDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const differenceInSeconds = Math.abs((now - postDate) / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutos atrás`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
      return `${differenceInHours} horas atrás`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays < 7) {
      return `${differenceInDays} dias atrás`;
    }

    return postDate.toLocaleString();
  };

  return (
    <section style={{ marginTop: isMobile ? "130px" : "140px" }}>
      <div className={styles.timeline}>
        <Box
          sx={{
            width: isMobile ? "395px" : "auto",
            marginBottom: isMobile ? "15px" : "15px",
          }}
        >
          {posts.map((post, index) => (
            <Box
              key={index}
              className={styles.timelinePost}
              style={isMobile ? mobileHomePostStyle : homePostStyle}
              sx={{
                marginBottom: isMobile ? "15px" : "15px",
              }}
            >
              <Card
                className={styles.container}
                sx={{
                  background: "transparent",
                }}
              >
                <div className={styles.postHeader}>
                  <div
                    className={styles.avatarContainer}
                    onClick={() => {
                      handleUserClick(post.author.id);
                    }}
                  >
                    <Avatar
                      alt={post.author.name}
                      src={post.author.image}
                      style={{
                        width: "32px",
                        height: "32px",
                        marginRight: "16px",
                        border: "1px solid #E9B425",
                      }}
                    />
                    <div className={styles.postInfo}>
                      <div className={styles.nomeUser}>
                        <h4
                          style={{
                            color: "white",
                            fontSize: isMobile ? "14px" : "18px",
                            fontWeight: 500,
                            margin: 0,
                            marginTop: -2,
                          }}
                        >
                          {post.author.name}
                        </h4>
                      </div>
                      <div className={styles.postDate}>
                        <p
                          style={{
                            color: "var(--gray-gray-300, #75767D)",
                            fontSize: isMobile ? "12px" : "14px",

                            fontWeight: 500,
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          <img
                            src={tempoIcon.src}
                            style={{
                              width: isMobile ? "20px" : "20px",
                              height: isMobile ? "20px" : "20px",
                              marginRight: "5px",
                              marginBottom: "-5px",
                            }}
                          />
                          {getTimeSince(post.createdAt)} em{" "}
                          <span style={{ color: "white", fontWeight: 500 }}>
                            {post.location}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: isMobile ? "12px" : "0.9  rem",
                      fontFamily: "MontSerrat",
                      color: "white",
                      pt: "10px",
                      pb: "10px",
                      pr: "10px",
                    }}
                  >
                    {post.text}
                  </Typography>

                  {post.image && (
                    <div>
                      <img
                        src={post.image}
                        alt="imagePost"
                        // Quando ocorrer um erro, a imagem padrão é usada
                        onError={(e) => {
                          e.currentTarget.src = isMobile
                            ? defaultPostMobile.src
                            : defaultPost.src;
                        }}
                        style={{
                          width: "100%",
                          maxHeight: "500px",
                          height: isMobile ? "300px" : "400px",
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.postInteraction}>
                  <div
                    className={`${styles.postLike} ${
                      likeClicked ? styles.clicked : ""
                    }`}
                    onClick={handleLikeClick}
                  >
                    <span
                      className={styles.likeText}
                      id="likeText"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      <ThumbUpIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                          color: "white",
                        }}
                      />
                      Curtiu {likeCount > 0 && `(${likeCount})`}
                    </span>
                    <div className={styles.likesBadge} id="likesBadge">
                      <span
                        className={styles.likesNumber}
                        id="likesNumber"
                      ></span>
                    </div>
                  </div>

                  <div
                    className={`${styles.postComment} ${
                      commentClicked ? styles.clicked : ""
                    }`}
                    onClick={handleCommentClick}
                  >
                    <span
                      className={styles.commentText}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      <ChatIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                          color: "white",
                        }}
                      />
                      Comentários
                    </span>
                    <div className={styles.commentsBadge}>
                      <span className={styles.commentsNumber}></span>
                    </div>
                  </div>

                  <div
                    className={`${styles.postShare} ${
                      shareClicked ? styles.clicked : ""
                    }`}
                    onClick={handleShareClick}
                  >
                    <span
                      className={styles.shareText}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      <ShareIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                          color: "white",
                        }}
                      />
                      Compartilhar
                    </span>
                  </div>
                </div>

                <div className={styles.postComments}>
                  <div
                    className={styles.avatarContainer}
                    style={{
                      marginTop: "16px",
                    }}
                  >
                    <Avatar
                      alt={userProfile.name}
                      src={userProfile.image}
                      style={{
                        width: "32px",
                        height: "32px",
                        marginRight: "16px",

                        border: "1px solid #E9B425",
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
                      /*  value={postData.text} */
                      /* onChange={handleInputChange} */
                      placeholder="Tem algo a dizer?"
                      className={styles.inputBox}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </div>

                  <div className={styles.everyComments}>
                    <span className={styles.everyCommentsText}>
                      Todos os comentários
                    </span>
                  </div>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <div
                        className={styles.avatarContainer}
                        onClick={() => handleUserClick(comment.author.id)}
                      >
                        <Avatar
                          alt={comment.author.name}
                          src={comment.author.image}
                          style={{
                            marginTop: "20px",
                            width: "32px",
                            height: "32px",
                            marginRight: "16px",
                            border: "1px solid #E9B425",
                          }}
                        />
                        <div className={styles.commentContent}>
                          <Typography
                            variant="h4"
                            sx={{
                              color: "white",
                              marginTop: "20px",

                              fontSize: isMobile ? "14px" : "15px",
                              fontWeight: 500,
                            }}
                          >
                            {comment.author.name} {""}:{" "}
                            <span style={{ fontWeight: "300" }}>
                              {comment.content}
                            </span>
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Divider style={{ marginTop: "16px" }} />

                  <div className={styles.seeAllComments}>
                    <p
                      className={styles.seeAllCommentsText}
                      style={{ marginTop: "16px", cursor: "pointer" }}
                    >
                      Ver todos os comentários
                    </p>
                  </div>
                </div>
              </Card>
            </Box>
          ))}
        </Box>
      </div>
    </section>
  );
};

export default ContentPost;
