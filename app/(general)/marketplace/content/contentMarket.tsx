"use client";

import React, { useState, useEffect } from "react";
import styles from "./contentMarket.module.scss";
import imagemIcon from "@/public/icons/imagemIcon.png";
import precoIcon from "@/public/icons/precoIcon.png";
import descricaoIcon from "@/public/icons/descricaoIcon.png";
import itemIcon from "@/public/icons/itemIcon.png";
import marketDefault from "@/public/marketDefault.png";

import {
  Button,
  Typography,
  Grid,
  Card,
  createTheme,
  ThemeProvider,
  Modal,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import Link from "next/link";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";

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
}

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

const getMarketItems = async (): Promise<Product[]> => {
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

const ContentMarket = () => {
  const { modalOpen, setId } = useStore();
  const [marketItems, setMarketItems] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const router = useRouter();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
  });
  const homePostStyle = {
    width: modalOpen ? "calc(100% - 350px)" : "105%",
    marginLeft: modalOpen ? "350px" : "0",
  };

  const mobileHomePostStyle = {
    width: "100%",
    marginLeft: "-4%",
  };

  // No topo do seu componente, defina os estados para erros
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  // Função para lidar com o clique no item do marketplace
  const handleMarketItemClick = (productId: string) => {
    // Navega para a página do item no marketplace
    setId(productId);

    router.push(`/marketplace/id=${productId}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Limpa os erros anteriores
    setErrors({
      name: "",
      description: "",
      price: "",
      image: "",
    });

    let formIsValid = true;

    // Validação do nome
    if (!productName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Nome é obrigatório.",
      }));
      formIsValid = false;
    }

    // Validação da descrição
    if (!productDescription.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Descrição é obrigatória.",
      }));
      formIsValid = false;
    }

    // Validação do preço
    const priceNumber = parseFloat(productPrice);
    if (!productPrice.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Preço é obrigatório.",
      }));
      formIsValid = false;
    } else if (isNaN(priceNumber) || priceNumber <= 0) {
      setErrors((prevErrors) => ({ ...prevErrors, price: "Preço inválido." }));
      formIsValid = false;
    }

    // Validação da imagem

    if (!productImage) {
      setErrors((errors) => ({
        ...errors,
        image: "Imagem é obrigatória. ",
      }));
      formIsValid = false;
    } else {
      const pattern = /\.(jpeg|jpg|png|webp|gif)$/;
      if (!pattern.test(productImage)) {
        setErrors((errors) => ({
          ...errors,
          image:
            "A url deve ser de uma imagem válida (jpeg, jpg, png, webp, gif).",
        }));
        formIsValid = false;
      }
    }

    // Se o formulário não é válido, para aqui.
    if (!formIsValid) return;

    // Se o formulário for válido, prossegue com a requisição POST
    const sellerId = localStorage.getItem("id");
    if (!sellerId) {
      console.error("O ID do vendedor não está disponível");
      return;
    }

    const productData = {
      name: productName,
      description: productDescription,
      price: priceNumber,
      image: productImage,
      sellerId: sellerId,
    };

    try {
      const response = await fetch("http://localhost:3001/market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Produto criado com sucesso:", responseData);
        handleCloseModal();
        // Atualiza a lista de itens do mercado aqui, se necessário
      } else {
        const errorData = await response.json();
        console.error("Falha ao criar o produto:", errorData.message);
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de criação de produto:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 767
  );

  const maxDescription = (desc: string) => {
    return desc.length > 220 ? `${desc.substring(0, 220)}...` : desc;
  };

  useEffect(() => {
    const fetchData = async () => {
      const items = await getMarketItems();
      setMarketItems(items);
      console.log("State updated with items:", items);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Card
        style={{
          background: "#17181c",
          marginTop: "-40px",
          paddingTop: "30px",
        }}
        elevation={0}
      >
        <div
          className={styles.main}
          style={isMobile ? mobileHomePostStyle : homePostStyle}
        >
          <div className={styles.headerMarket} style={{ margin: "16px" }}>
            <Typography
              style={{
                color: "var(--gray-gray-300, #75767D)",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "1.12px",
                textTransform: "uppercase",
                margin: 0,
                marginLeft: isMobile ? "8%" : "-5%",
              }}
            >
              Todos os itens
            </Typography>
            <Typography
              variant="h3"
              style={{
                color: "var(--white, #F5F5F5)",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "56px",
                letterSpacing: "-0.96px",
                marginLeft: isMobile ? "10%" : "-4%",
              }}
            >
              Marketplace
            </Typography>
            <div
              className={styles.buttonContainer}
              style={{
                right: isMobile ? "12%" : "11.5%",
              }}
            >
              <Button
                className={styles.buttonAdd}
                fullWidth
                sx={{
                  color: "#ffffff",
                  borderRadius: "35px",
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  marginTop: isMobile ? "-10px" : "15px",
                  right: isMobile ? "10%" : "14%",
                  height: "54px",
                  width: "170px",
                  fontSize: "14px",
                  textTransform: "none",
                }}
                onClick={handleOpenModal}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              >
                Adicionar item
              </Button>
            </div>
          </div>

          <div
            className={styles.contentMarket}
            style={{
              marginTop: "36px",
              marginLeft: isMobile ? "22%" : "",
            }}
          >
            <Grid container spacing={0}>
              {marketItems.map((product) => {
                console.log("Verificando produto:", product);
                return (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <div
                      className={styles.marketItem}
                      style={{
                        maxWidth: "255px",
                      }}
                    >
                      <div className={styles.imageContainer}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "255px",
                            height: "255px",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = marketDefault.src;
                          }}
                        />
                      </div>
                      <Typography
                        style={{
                          color: "var(--white, #F5F5F5)",
                          fontFamily: "Inter",
                          fontSize: "16px",
                          fontWeight: 500,
                          textAlign: "left",
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        style={{
                          marginTop: "5px",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "24px",
                          letterSpacing: "-0.14px",
                          color: "var(--gray-gray-200, #A1A3A7)",
                          marginBottom: "8px",
                          textAlign: "left",
                        }}
                      >
                        {maxDescription(product.description)}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          letterSpacing: "-0.14px",
                          color: "var(--gray-gray-200, #A1A3A7)",
                          marginBottom: "8px",
                          textAlign: "left",
                        }}
                      >
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </Typography>
                      <Link
                        href={`/marketplace/id=${product.id}`}
                        style={{
                          width: "150px",
                          borderRadius: "24px",
                          padding: "4px 12px",
                          gap: "10px",
                          fontSize: "14px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          color: "var(--white, #F5F5F5)",
                          cursor: "pointer",
                          textDecoration: "none",
                          marginRight: product.vendido ? "59%" : "38%",
                          background: product.vendido
                            ? "#FE2E05"
                            : "var(--gray-gray-200, #A1A3A7)",
                        }}
                        onClick={() => handleMarketItemClick(product.id)}
                      >
                        {product.vendido ? "Já vendido!" : "Ainda não vendido"}
                      </Link>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
      </Card>
      <Modal open={isModalOpen} onClose={handleCloseModal} closeAfterTransition>
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
              marginBottom: "10px",
            }}
          >
            Adicionar Item
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome do item"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src={itemIcon.src}
                      alt="Item Icon"
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "white",
                        filter: errors.name
                          ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                          : "0",
                      }}
                    />
                  </InputAdornment>
                ),
                style: { color: "#FFFFFF" },
                classes: {
                  root: errors.name && styles.errorBorder,
                  notchedOutline: errors.name
                    ? styles.errorBorder
                    : styles.whiteBorder,
                },
              }}
              InputLabelProps={{
                style: { color: errors.name ? "#E9B425" : "#757575" },
              }}
              FormHelperTextProps={{
                style: {
                  color: errors.name ? "#E9B425" : "#757575",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 5,
                },
              }}
            />
            <TextField
              label="Descrição"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors.description}
              helperText={errors.description}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src={descricaoIcon.src}
                      alt="Descrição Icon"
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "white",
                        filter: errors.description
                          ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                          : "0",
                      }}
                    />
                  </InputAdornment>
                ),
                style: { color: "#FFFFFF" },
                classes: {
                  root: errors.description && styles.errorBorder,
                  notchedOutline: errors.description
                    ? styles.errorBorder
                    : styles.whiteBorder,
                },
              }}
              InputLabelProps={{
                style: { color: errors.description ? "#E9B425" : "#757575" },
              }}
              FormHelperTextProps={{
                style: {
                  color: errors.description ? "#E9B425" : "#757575",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 5,
                },
              }}
            />
            <TextField
              label="Preço"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src={precoIcon.src}
                      alt="Preço Icon"
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "white",
                        filter: errors.price
                          ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                          : "0",
                      }}
                    />
                  </InputAdornment>
                ),
                style: { color: "#FFFFFF" },
                classes: {
                  root: errors.price && styles.errorBorder,
                  notchedOutline: errors.price
                    ? styles.errorBorder
                    : styles.whiteBorder,
                },
              }}
              InputLabelProps={{
                style: { color: errors.price ? "#E9B425" : "#757575" },
              }}
              FormHelperTextProps={{
                style: {
                  color: errors.price ? "#E9B425" : "#757575",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 5,
                },
              }}
            />
            <TextField
              label="Imagem"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors.image}
              helperText={errors.image}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src={imagemIcon.src}
                      alt="Imagem URL Icon"
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "white",
                        filter: errors.image
                          ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                          : "0",
                      }}
                    />
                  </InputAdornment>
                ),
                style: { color: "#FFFFFF" },
                classes: {
                  root: errors.image && styles.errorBorder,
                  notchedOutline: errors.image
                    ? styles.errorBorder
                    : styles.whiteBorder,
                },
              }}
              InputLabelProps={{
                style: { color: errors.image ? "#E9B425" : "#757575" },
              }}
              FormHelperTextProps={{
                style: {
                  color: errors.image ? "#E9B425" : "#757575",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 5,
                },
              }}
            />
            <Button
              type="reset"
              fullWidth
              className={styles.buttonCancel}
              sx={{
                background:
                  "linear-gradient(180deg, #2e2f36 0%, #17181c 100%),linear-gradient(0deg, #17181c, #17181c)",

                color: "#ffffff",
                borderRadius: "35px",
                marginTop: "10px",
                height: "50px",

                textTransform: "none",
                fontWeight: "bold",
                transition: "color 0.3s",
                fontSize: "15px",
              }}
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>

            <Button
              sx={{
                marginTop: "20px",
                color: "white",
                borderRadius: "46px",
                border: "1px solid var(--orange, #9e1a00)",
                fontFamily: "MontSerrat",
                fontWeight: "bold",
                cursor: "pointer",
                height: "55px",
                background:
                  "var(--gradient-button,linear-gradient(180deg, #ad2d14 0%, #f42e07 100%))",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                textTransform: "none",
              }}
              fullWidth
              type="submit"
            >
              Salvar
            </Button>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ContentMarket;
