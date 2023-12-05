import React, { useEffect, useState } from "react";
import styles from "./contentPost.module.scss";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import tempoIcon from "@/public/icons/timing.png";
import defaultPost from "@/public/defaultImagePost.png";
import defaultPostMobile from "@/public/defaultPostMobile.png";
import likeIcon from "@/public/icons/likeIcon.png";
import commentIcon from "@/public/icons/commentIcon.png";
import shareIcon from "@/public/icons/shareIcon.png";

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
  id: string;
  image: string;
  text: string;
  author: Author;
  location: string;
  createdAt: string;
  comments: Comment[];
  likes: string;
}

interface PostState {
  likeClicked: boolean;
  commentContent: string;
  hasLiked: boolean;
  isSubmitting: boolean;
}

type ShowAllCommentsState = {
  [key: string]: boolean;
};

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
  const [hasLiked, setHasLiked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { modalOpen, setId } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [showAllCommentsForPost, setShowAllCommentsForPost] =
    useState<ShowAllCommentsState>({});
  const [userProfile, setUserProfile] = useState({
    name: "",
    image: "",
    id: "",
  });

  type PostType = {
    id: string;
    // Outras propriedades do post, como createdAt, comments, etc.
  };
  const [postStates, setPostStates] = useState<{ [key: string]: PostState }>(
    {}
  );
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>(
    {}
  );

  const postStatesInit: { [key: string]: PostState } = {};

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /* UseEffects */

  // Função para obter todos os posts
  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await getPosts();
      if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
        const sortedPosts = fetchedPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
        const counts: { [key: string]: number } = {};

        sortedPosts.forEach((post) => {
          counts[post.id] = post.comments.length;
        });
        setCommentCounts(counts);
      }
    };
    fetchData();
  }, []);

  // Função para obter dados do usuário
  useEffect(() => {
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

  posts.forEach((post) => {
    postStatesInit[post.id] = {
      likeClicked: false,
      commentContent: "",
      hasLiked: false,
      isSubmitting: false,
    };
  });

  useEffect(() => {
    const postStatesInit = {};
    setPostStates(postStatesInit);
  }, [posts]);

  useEffect(() => {
    const postStatesInit: { [key: string]: PostState } = {};

    posts.forEach((post) => {
      postStatesInit[post.id] = {
        likeClicked: false,
        commentContent: "",
        hasLiked: false,
        isSubmitting: false,
      };
    });

    setPostStates(postStatesInit);
  }, [posts]);

  const handleShowAllComments = (postId: string) => {
    setShowAllCommentsForPost((prevState: ShowAllCommentsState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // Função para mandar o like que o usuário deu, para o post que foi escolhido
  const handleLikeClick = async (postId: string) => {
    if (postStates[postId]?.hasLiked) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/posts/like/${postId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();

        setPostStates((prevState) => ({
          ...prevState,
          [postId]: {
            ...prevState[postId],
            hasLiked: true,
            likes: updatedPost.likes,
            likeClicked: !prevState[postId].likeClicked,
          },
        }));
      } else {
        console.error("Falha ao curtir o post");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de curtir:", error);
    }
  };

  // Função para o usuário comentar no post
  const handleCommentClick = async (postId: string) => {
    const postCommentContent = postStates[postId]?.commentContent;

    if (!postCommentContent || !postCommentContent.trim()) return;

    setIsSubmitting(true);

    const commentData = {
      content: postCommentContent,
      authorId: userProfile.id,
      postId: postId,
    };

    try {
      const response = await fetch(`http://localhost:3001/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        setPostStates((prevState) => ({
          ...prevState,
          [postId]: {
            ...prevState[postId],
            commentContent: "",
          },
        }));
      } else {
        console.error("Falha ao enviar comentário");
      }
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            width: isMobile ? "385px" : "auto",
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
                              width: isMobile ? "15px" : "20px",
                              height: isMobile ? "15px" : "20px",
                              marginRight: "5px",
                              marginBottom: isMobile ? "-3px" : "-5px",
                            }}
                          />
                          {getTimeSince(post.createdAt)}
                          {post.location && (
                            <>
                              <span
                                style={{
                                  color: "var(--gray-gray-300, #75767D)",
                                  fontWeight: 500,
                                }}
                              >
                                {" "}
                                em{" "}
                              </span>
                              <span style={{ color: "white", fontWeight: 500 }}>
                                {post.location}
                              </span>
                            </>
                          )}
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
                      postStates[post.id]?.likeClicked ? styles.clicked : ""
                    }`}
                    style={{
                      display: "flex",
                      width: "50px",
                      alignItems: "center",
                      color: "white",
                    }}
                    onClick={() => handleLikeClick(post.id)}
                  >
                    <img
                      src={likeIcon.src}
                      alt="likeIcon"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "8px",
                        marginTop: "-19px",
                        filter: postStates[post.id]?.hasLiked
                          ? "brightness(0) saturate(100%) invert(73%) sepia(62%) saturate(629%) hue-rotate(350deg) brightness(98%) contrast(86%)"
                          : "none",
                      }}
                      className={
                        postStates[post.id]?.hasLiked
                          ? `${styles.iconClicked}`
                          : ""
                      }
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        lineHeight: "16px",
                      }}
                      className={`${styles.likeText} ${
                        postStates[post.id]?.hasLiked ? styles.likedText : ""
                      }`}
                    >
                      {postStates[post.id]?.hasLiked ? "Curtiu" : "Curtir"} {""}
                      <div
                        style={{
                          width: "27px",
                          height: "14px",
                          padding: "2px, 6px, 2px, 6px",
                          borderRadius: "16px",
                          display: "flex",
                          justifyContent: "center",
                          background: postStates[post.id]?.hasLiked
                            ? "#e9b425"
                            : "#A1A3A7",
                          color: "white",
                          fontSize: "10px",
                          position: "relative",
                          top: "-15px",
                          left: "45px",
                        }}
                      >
                        {postStates[post.id]?.hasLiked
                          ? Number(post.likes) + 1
                          : post.likes}
                      </div>
                    </span>
                  </div>

                  <div
                    className={`${styles.postComment} ${
                      commentClicked ? styles.clicked : ""
                    }`}
                  >
                    <span
                      className={styles.commentText}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: isMobile ? "40px" : "",
                        color: "#b4b4b6",
                        fontSize: "12px",
                      }}
                    >
                      <img
                        src={commentIcon.src}
                        alt="commentIcon"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                          color: "#b4b4b6",
                        }}
                      />
                      Comentários{" "}
                      <span
                        style={{
                          width: "27px",
                          height: "14px",
                          padding: "2px, 6px, 2px, 6px",
                          borderRadius: "16px",
                          display: "flex",
                          justifyContent: "center",
                          background: "#27282F",
                          color: "white",
                          fontSize: "10px",
                          position: "relative",
                          left: isMobile ? "3px" : "12px",
                          marginRight: "5px",
                        }}
                      >
                        {commentCounts[post.id] || 0}
                      </span>
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
                        color: "#b4b4b6",
                        fontSize: "12px",
                      }}
                    >
                      <img
                        src={shareIcon.src}
                        alt="shareIcon"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "5px",
                          color: "#b4b4b6",
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
                        fontFamily: "Montserrat",
                        background: "transparent",
                        border: "1px solid gray",
                        color: "white",
                        padding: "10px 15px",
                        outline: "none",
                        ...(isFocused && focusedStyle),
                      }}
                      type="text"
                      name="comment"
                      value={postStates[post.id]?.commentContent}
                      onChange={(e) => {
                        const newPostStates = { ...postStates };
                        const newPostState = newPostStates[post.id] || {
                          likeClicked: false,
                          commentContent: "",
                          hasLiked: false,
                          isSubmitting: false,
                        };
                        newPostState.commentContent = e.target.value;
                        newPostStates[post.id] = newPostState;
                        setPostStates(newPostStates);
                      }}
                      placeholder="Tem algo a dizer?"
                      className={styles.inputBox}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          handleCommentClick(post.id);
                        }
                      }}
                    />
                  </div>

                  {post.comments.length > 0 ? (
                    <div className={styles.everyComments}>
                      <span
                        className={styles.everyCommentsText}
                        style={{
                          color: "#b4b4b6",
                        }}
                      >
                        Todos os comentários
                      </span>
                    </div>
                  ) : (
                    <div className={styles.everyComments}>
                      <span
                        className={styles.everyCommentsText}
                        style={{
                          color: "#b4b4b6",
                        }}
                      >
                        Não há comentários ainda.
                      </span>
                    </div>
                  )}
                  {post.comments.length > 1 ? (
                    showAllCommentsForPost[post.id] ? (
                      post.comments.map((comment) => (
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

                                  fontSize: isMobile ? "12px" : "14px",
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
                      ))
                    ) : (
                      // Para poder renderizar apenas o primeiro comentário
                      <div key={post.comments[0].id} className={styles.comment}>
                        <div
                          className={styles.avatarContainer}
                          onClick={() =>
                            handleUserClick(post.comments[0].author.id)
                          }
                        >
                          <Avatar
                            alt={post.comments[0].author.name}
                            src={post.comments[0].author.image}
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

                                fontSize: isMobile ? "12px" : "14px",
                                fontWeight: 500,
                              }}
                            >
                              {post.comments[0].author.name} {""}:{" "}
                              <span style={{ fontWeight: "300" }}>
                                {post.comments[0].content}
                              </span>
                            </Typography>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className={styles.comment}>
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

                                  fontSize: isMobile ? "12px" : "14px",
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
                      </div>
                    ))
                  )}

                  <Divider style={{ marginTop: "16px" }} />

                  {post.comments.length > 1 && (
                    <div className={styles.seeAllComments}>
                      <p
                        className={styles.seeAllCommentsText}
                        style={{ marginTop: "16px", cursor: "pointer" }}
                        onClick={() => handleShowAllComments(post.id)}
                      >
                        Ver todos os comentários
                      </p>
                    </div>
                  )}
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
