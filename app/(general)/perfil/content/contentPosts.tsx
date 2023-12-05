import React, { useEffect, useState } from "react";
import styles from "./contentPost.module.scss";
import tempoIcon from "@/public/icons/timing.png";
import defaultPost from "@/public/defaultImagePost.png";
import defaultPostMobile from "@/public/defaultPostMobile.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import deletarIcon from "@/public/icons/trash.png";
import editarIcon from "@/public/icons/pencil.png";
import commentIcon from "@/public/icons/commentIcon.png";
import shareIcon from "@/public/icons/shareIcon.png";
import likeIcon from "@/public/icons/likeIcon.png";

import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
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

const ContentMyPosts = () => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const { modalOpen, setId } = useStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [postStates, setPostStates] = useState<{ [key: string]: PostState }>(
    {}
  );
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const postStatesInit: { [key: string]: PostState } = {};

  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentPostId(postId);
  };
  const router = useRouter();
  const [showAllCommentsForPost, setShowAllCommentsForPost] =
    useState<ShowAllCommentsState>({});
  const [userProfile, setUserProfile] = useState({
    name: "",
    image: "",
    id: "",
  });

  const homePostStyle = {
    width: modalOpen ? "calc(100% - 350px)" : "100%",
    marginLeft: modalOpen ? "350px" : "0",
  };

  const mobileHomePostStyle = {
    width: "100%",
  };
  const focusedStyle = {
    border: "0.8px solid gray",
    padding: "9.6px 14.4px",
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /* UseEffects */

  // Função para obter todos os posts do usuário logado
  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await getPosts();
      const userId = localStorage.getItem("id"); // Obter o ID do usuário logado
      if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
        const userPosts = fetchedPosts.filter(
          (post) => post.author.id === userId
        ); // Filtrar os posts pelo ID do autor
        const sortedPosts = userPosts.sort(
          (a: Post, b: Post) =>
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

  /* Funções */

  // Função para o uso do input
  /*   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }; */

  // Função para deletar o post
  const handleDeletePost = async () => {
    if (currentPostId) {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/${currentPostId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setPosts((currentPosts) =>
            currentPosts.filter((post) => post.id !== currentPostId)
          );
          setCurrentPostId(null);
        } else {
          console.error("Falha ao deletar o post");
        }
      } catch (error) {
        console.error("Erro ao enviar requisição de deletar:", error);
      }
    }
  };

  const handleShowAllComments = (postId: string) => {
    setShowAllCommentsForPost((prevState: ShowAllCommentsState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // Função para mandar o like que o usuário deu, para o post que foi escolhido
  const handleLikeClick = async (postId: string) => {
    // Evita múltiplas curtidas no mesmo post.
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

  // Função para abrir o modal com as informações atuais do post
  const handleEditClick = (post: Post) => {
    setCurrentPostId(post.id);
    setEditText(post.text);
    setEditImageUrl(post.image);
    setEditLocation(post.location);
    setIsEditModalOpen(true);
  };

  // Função para o usuário poder editar um post
  const handleUpdatePost = async () => {
    if (currentPostId && editText && editImageUrl && editLocation) {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/${currentPostId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              text: editText,
              image: editImageUrl,
              location: editLocation,
              authorId: userProfile.id,
            }),
          }
        );

        if (response.ok) {
          setIsEditModalOpen(false);
        } else {
          console.error("Falha ao atualizar o post");
        }
      } catch (error) {
        console.error("Erro ao enviar requisição de atualização:", error);
      }
    }
  };

  return (
    <Card
      style={{
        marginTop: isMobile ? "130px" : "140px",
        height: "auto",
        background: "#17181c",
      }}
    >
      <div className={styles.timeline}>
        <Box
          sx={{
            position: "absolute",
            top: isMobile ? "137%" : "173%",
            left: isMobile ? "-18px" : "25%",
            marginTop: isMobile ? "-130px" : "-1000px",
            marginLeft: isMobile ? "26.5px" : "auto",
            width: isMobile ? "370px" : "1370px",
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
                  <div className={styles.avatarContainer}>
                    <Avatar
                      alt={post.author.name}
                      src={post.author.image}
                      style={{
                        width: "32px",
                        height: "32px",
                        marginRight: "16px",
                        border: "1px solid #E9B425",
                      }}
                      onClick={() => {
                        handleUserClick(post.author.id);
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

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                        sx={{
                          left: isMobile ? "0px" : "-40px",
                        }}
                      >
                        <MenuItem
                          onClick={() => handleEditClick(post)}
                          sx={{
                            width: isMobile ? "100px" : "240px",
                          }}
                        >
                          <img
                            src={editarIcon.src}
                            alt="Editar Icon"
                            style={{
                              height: "18px",
                              width: "18px",
                            }}
                          />
                          <span
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            Editar
                          </span>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            handleDeletePost();
                          }}
                        >
                          <img
                            src={deletarIcon.src}
                            alt="Deletar Icon"
                            style={{
                              height: "18px",
                              width: "18px",
                            }}
                          />
                          <span
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            Deletar
                          </span>
                        </MenuItem>
                      </Menu>
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
                    <IconButton
                      onClick={(event) => handleClick(event, post.id)}
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      style={{
                        color: "white",
                        position: "absolute",
                        marginLeft: isMobile ? "83%" : "95%",
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
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
                      alignItems: "center",
                      color: "#b4b4b6",
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
                          width: isMobile ? "20px" : "27px",

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
                          left: isMobile ? "38px" : "45px",
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
                        color: "#b4b4b6",
                        fontSize: "12px",
                        marginLeft: isMobile ? "40px" : "",
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
                          width: isMobile ? "20px" : "27px",

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
                          marginLeft: "5px",
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
                                  marginTop: "30px",

                                  fontSize: isMobile ? "12px" : "14px",
                                  fontWeight: 500,
                                }}
                              >
                                {comment.author.name} {""}:{" "}
                                <span
                                  style={{
                                    fontWeight: "100",
                                    fontSize: isMobile ? "10px" : "12px",
                                  }}
                                >
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
          <Modal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            closeAfterTransition
          >
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
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Editar Post
              </Typography>
              <TextField
                label="Insira um texto"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
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
              <TextField
                label="Insira a url de uma imagem"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
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
              <TextField
                label="Insira a localização"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
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
                onClick={handleUpdatePost}
                fullWidth
              >
                Salvar Alterações
              </Button>
            </Box>
          </Modal>
        </Box>
      </div>
    </Card>
  );
};

export default ContentMyPosts;
