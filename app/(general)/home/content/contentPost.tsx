import React, { useEffect, useState } from "react";
import styles from "./contentPost.module.scss";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import tempoIcon from "@/public/icons/timing.png";
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

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, Arial",
  },
});

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

const ContentPost = () => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { modalOpen } = useStore();
  const [inputValue, setInputValue] = useState("Tem algo a dizer?");

  const [nome, setNome] = useState("");
  const [imageAuthor, setImageAuthor] = useState("");
  const [imagePost, setImagePost] = useState("");
  const [texto, setTexto] = useState("");
  const [loc, setLoc] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const posts = await getPosts();

      if (posts && posts.length > 0) {
        const firstPost = posts[1];
        setImagePost(firstPost.image);
        setImageAuthor(firstPost.author.image);
        setNome(firstPost.author.name);
        setTexto(firstPost.text);
        setLoc(firstPost.location);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
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

  const homePostStyle = {
    width: modalOpen ? "calc(83.3% - 350px)" : "83.3%",
    marginLeft: modalOpen ? "350px" : "0",
  };
  const mobileHomePostStyle = {
    width: "92%",
    marginLeft: "-5%",
  };

  return (
    <section style={{ marginTop: isMobile ? "130px" : "140px" }}>
      <div className={styles.timeline}>
        <Box
          sx={{
            width: isMobile ? "390px" : "auto",
          }}
        >
          <section
            className={styles.timelinePost}
            style={isMobile ? mobileHomePostStyle : homePostStyle}
          >
            <Card
              className={styles.container}
              sx={{
                background: "transparent",
              }}
            >
              <div className={styles.postHeader}>
                <div className={styles.avatarContainer}>
                  <Avatar
                    alt={nome}
                    src={imageAuthor}
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
                        {nome}
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
                        12 minutos atrás em{" "}
                        <span style={{ color: "white", fontWeight: 500 }}>
                          {loc}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "12px",
                    fontFamily: "Poppins",
                    color: "white",
                    pt: "10px",
                    pb: "10px",
                    pr: "10px",
                  }}
                >
                  {texto}
                </Typography>

                <div className={styles.postImage}>
                  <img
                    src={imagePost}
                    alt="imagePost"
                    style={{
                      width: "100%",
                      maxHeight: "500px",
                      margin: 0,
                      padding: 0,
                    }}
                  />
                </div>
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
                    alt={nome}
                    src={imageAuthor}
                    style={{
                      width: "32px",
                      height: "32px",
                      marginRight: "16px",
                      border: "1px solid #E9B425",
                    }}
                  />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    className={styles.textBox}
                    style={{
                      fontFamily: "Poppins",
                      background: "transparent",
                      color: "white",
                      border: "1px solid gray",
                    }}
                  />
                </div>

                <div className={styles.everyComments}>
                  <span className={styles.everyCommentsText}>
                    Todos os comentários
                  </span>
                </div>

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
          </section>
        </Box>
      </div>
    </section>
  );
};

export default ContentPost;
