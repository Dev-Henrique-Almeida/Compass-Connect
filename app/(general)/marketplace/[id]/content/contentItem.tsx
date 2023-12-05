"use client";
import * as React from "react";
import styles from "./contentItem.module.scss";
import { Button, Typography, createTheme, useMediaQuery } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import tempoIcon from "@/public/icons/timing.png";
import useStore from "@/store/store";
import deletarIcon from "@/public/icons/trash.png";
import editarIcon from "@/public/icons/pencil.png";
import defaultPost from "@/public/defaultImagePost.png";
import defaultPostMobile from "@/public/defaultPostMobile.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Arial",
  },
});

interface User {
  image: string;
  name: string;
  id: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  vendido: boolean;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
  buyerId: string | null;
  seller: User;
  buyer: User;
}

const ContentItem = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { id, setId } = useStore();
  const [item, setItem] = useState<Product | null>(null);
  const router = useRouter();
  /*   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); */
  const [imageError, setImageError] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const open = Boolean(anchorEl);
  const isSold = item && item.vendido;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserClick = (userId: string) => {
    // Navega para a página de perfil do usuário
    setId(userId);
    router.push(`/perfil/id=${userId}`);
  };

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

  const handleBuyClick = async () => {
    const loggedInUserId = localStorage.getItem("id");
    const itemId = item?.id;
    console.log(itemId);
    console.log(loggedInUserId);
    if (!itemId) {
      console.error("ID do item não está disponível.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/market/buy/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Falha ao realizar a compra do item: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Compra realizada com sucesso", data);
    } catch (error) {
      console.error("Erro ao comprar item:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (id) {
      fetch(`http://localhost:3001/market/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Falha ao buscar dados do item");
          }
          return response.json();
        })
        .then((data) => {
          setItem(data);
        });

      /*    .finally(() => {
          setLoading(false);
        }); */
    }
  }, [id]);

  /*   if (loading) {
    return <p>Carregando...</p>;
  } */

  /*   if (error) {
    return <p>Ocorreu um erro: {error}</p>;
  }
 */
  if (!item) {
    return <p></p>;
  }
  return (
    <div
      className={styles.main}
      style={{
        background: "#17181c",
        marginTop: "-40px",
        paddingTop: "30px",
      }}
    >
      <div className={styles.itemDetails}>
        <Typography
          variant="h1"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontFamily: "MontSerrat",
            fontSize: "48px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "56px",
            letterSpacing: "-0.96px",
            marginTop: "36px",
          }}
        >
          Detalhes do Item
        </Typography>
      </div>

      <div className={styles.infos}>
        <div className={styles.imageContainer}>
          <img
            src={
              imageError
                ? isMobile
                  ? defaultPostMobile.src
                  : defaultPost.src
                : item.image
            }
            alt={item.name}
            onError={() => setImageError(true)}
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "10px",
            }}
          />
        </div>

        <div className={styles.itemInfo}>
          <div className={styles.options}>
            <Typography
              variant="h2"
              className={styles.itemTitle}
              style={{
                color: "#fff",
                fontFamily: "Inter",
                fontSize: "48px",
                fontWeight: 500,
                textAlign: "left",
                lineHeight: "100%",
              }}
            >
              {item.name}
            </Typography>

            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              style={{
                color: "white",
              }}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              className={styles.customMenu}
            >
              <MenuItem onClick={handleClose}>
                <img
                  src={editarIcon.src}
                  alt="Editar Icon"
                  style={{
                    height: "18px",
                    width: "18px",
                  }}
                />
                Editar
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <img
                  src={deletarIcon.src}
                  alt="Deletar Icon"
                  style={{
                    height: "18px",
                    width: "18px",
                  }}
                />
                Deletar
              </MenuItem>
            </Menu>
          </div>

          <Typography
            className={styles.itemDescription}
            style={{
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "24px",
              letterSpacing: "-0.14px",
              color: "var(--gray-gray-200, #A1A3A7)",
              marginBottom: "8px",
              textAlign: "left",
            }}
          >
            {item.description}
          </Typography>

          <Typography
            className={styles.itemPrice}
            style={{
              marginTop: "30px",
              color: "var(--gray-gray-200, #A1A3A7)",
              fontFamily: "Inter",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "24px",
              letterSpacing: "-0.24px",
            }}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.price)}
          </Typography>

          <Typography
            style={{
              marginTop: "40px",
              width: "186px",
              borderRadius: "46px",
              fontFamily: "MontSerrat",
              display: "flex",
              justifyContent: "center",
              padding: "4px 12px",
              gap: "10px",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "var(--white, #F5F5F5)",
              cursor: "pointer",
              marginLeft: "-4px",
              background: item.vendido
                ? "#FE2E05"
                : "var(--gray-gray-200, #A1A3A7)",
            }}
          >
            {item.vendido ? "Já vendido!" : "Ainda não vendido"}
          </Typography>

          {!isSold && (
            <div className={styles.buttonContainer}>
              <Button
                type="submit"
                onClick={handleBuyClick}
                variant="contained"
                className={`${styles.buttonRegister} ${styles.addButtonMargin}`}
                style={{
                  display: "flex",
                  marginLeft: "-4px",
                  width: "220px",
                  marginTop: "30px",
                  marginBottom: "40px",
                  textTransform: "none",
                  fontFamily: "MontSerrat",
                  padding: "16px 24px",
                  alignItems: "flex-start",
                  borderRadius: "46px",
                  border: "1px solid var(--orange, #FE2E05)",
                  background:
                    "var(--gradient-button, linear-gradient(180deg, #AD2D14 0%, #F42E07 100%))",
                }}
              >
                Comprar Item
              </Button>
            </div>
          )}
        </div>
        <div className={styles.seller}>
          <Typography
            variant="h2"
            className={styles.itemTitle}
            style={{
              color: "#fff",
              fontFamily: "Inter",
              fontSize: "48px",
              fontWeight: 500,
              textAlign: "left",
              lineHeight: "100%",
              marginTop: "20px",
            }}
          >
            Vendedor
          </Typography>
        </div>
        <div className={styles.avatarContainer}>
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              handleUserClick(item.seller.id);
            }}
          >
            <Avatar
              alt="Avatar"
              src={item.seller.image}
              style={{
                marginTop: "20px",
                width: "32px",
                height: "32px",
                marginRight: "16px",
              }}
            />
          </span>
          <div className={styles.postInfo}>
            <div className={styles.nomeUser}>
              <h4
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                {item.seller.name}
              </h4>
            </div>
            <div
              className={styles.postDate}
              style={{
                marginTop: "-16px",
                marginLeft: "-3px",
              }}
            >
              <img
                src={tempoIcon.src}
                style={{
                  width: isMobile ? "15px" : "20px",
                  height: isMobile ? "15px" : "20px",
                  marginRight: "5px",
                  marginBottom: "-5px",
                }}
              />
              <p
                style={{
                  color: "var(--gray-gray-300, #75767D)",
                  fontWeight: 500,
                  marginTop: "-1px",
                  marginLeft: "5px",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                {getTimeSince(item.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {isSold && item.buyer && (
          <div>
            <div
              className={styles.seller}
              style={{
                position: isMobile ? "relative" : "absolute",

                top: isMobile ? "0" : "96.8%",

                left: isMobile ? "0" : "60%",
              }}
            >
              <Typography
                variant="h2"
                className={styles.itemTitle}
                style={{
                  color: "#fff",
                  fontFamily: "Inter",
                  fontSize: "48px",
                  fontWeight: 500,
                  textAlign: "left",
                  lineHeight: "100%",
                }}
              >
                Comprador
              </Typography>
            </div>
            <div
              className={styles.avatarContainer}
              style={{
                position: isMobile ? "relative" : "absolute",
                top: isMobile ? "0" : "102%",
                left: isMobile ? "0" : "60%",
              }}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleUserClick(item.buyer.id);
                }}
              >
                <Avatar
                  alt="Avatar"
                  src={item.buyer.image}
                  style={{
                    marginTop: "20px",
                    width: "32px",
                    height: "32px",
                    marginRight: "16px",
                  }}
                />
              </span>
              <div className={styles.postInfo}>
                <div className={styles.nomeUser}>
                  <h4
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    {item.buyer.name}
                  </h4>
                </div>
                <div
                  className={styles.postDate}
                  style={{
                    marginTop: "-16px",
                    marginLeft: "-3px",
                  }}
                >
                  <img
                    src={tempoIcon.src}
                    style={{
                      width: isMobile ? "15px" : "20px",
                      height: isMobile ? "15px" : "20px",
                      marginRight: "5px",
                      marginBottom: "-5px",
                    }}
                  />
                  <p
                    style={{
                      color: "var(--gray-gray-300, #75767D)",
                      fontWeight: 500,
                      marginTop: "-1px",
                      marginLeft: "5px",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    {getTimeSince(item.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentItem;
