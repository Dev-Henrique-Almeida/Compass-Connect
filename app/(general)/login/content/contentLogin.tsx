"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  createTheme,
  ThemeProvider,
  Card,
} from "@mui/material";
import nomeIcon from "@/public/icons/nome.png";
import senhaIcon from "@/public/icons/senha.png";
import senhaOpenIcon from "@/public/icons/senha-open.png";
import Link from "next/link";
import styles from "./login.module.scss";
import { useRouter } from "next/navigation";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

export default function ContentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Função para verificar se o usuário está logado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token; // Retorna true se o token existir, false caso contrário
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      // Se o usuário estiver logado, redirecione para a home
      router.push("/home");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let isValid = true;
    setErrors({ username: "", password: "" });

    if (password.length < 6 || password.length > 50) {
      setErrors((errors) => ({
        ...errors,
        password: "Senha deve ter entre 6 e 50 caracteres.",
      }));
      isValid = false;
    }

    if (password.length === 0) {
      setErrors((errors) => ({
        ...errors,
        password: "Senha não pode ser vazia.",
      }));
      isValid = false;
    }

    if (username.length > 255) {
      setErrors((errors) => ({
        ...errors,
        username: "Usuário não pode ter mais de 255 caracteres. ",
      }));
      isValid = false;
    }

    if (username.length === 0) {
      setErrors((errors) => ({
        ...errors,
        username: "Usuário não pode ser vazio. ",
      }));
      isValid = false;
    }

    if (isValid) {
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setErrors((errors) => ({ ...errors, username: "Usuário já existe." }));
        isValid = false;
      }
    }

    if (isValid) {
      try {
        const response = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "User-Agent": "PostmanRuntime/7.35.0",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            Origin: "http://localhost:3000",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          /* Setando o token */
          const data = await response.json();
          const token = data.token;
          const userId = data.user.id;
          localStorage.setItem("token", token);
          localStorage.setItem("id", userId);
          router.push("/home");
        } else {
          setErrors((errors) => ({
            ...errors,
            username: " ",
            password:
              "Usuário e/ou Senha inválidos.\nPor favor, tente novamente!",
          }));
          isValid = false;
        }
      } catch (error) {
        console.error("Ocorreu um erro: ", error);
      }
    }
  };

  const checkUsernameUnique = async (username: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        className={styles.main}
        sx={{
          background: "linear-gradient(180deg, #2e2f36 0%, #17181c 100%)",
          color: "white",

          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Grid className={styles.main} container>
          <Grid className={styles.main} item sm={6} style={{ padding: 20 }}>
            <Paper
              elevation={0}
              sx={{
                marginBottom: { xs: "160px", sm: "20px" },
                marginRight: { xs: "160px", sm: "20px" },
                marginLeft: { xs: 0, sm: "220px" },
                marginTop: { xs: "120px", sm: "140px" },
                padding: { xs: "24px", sm: "3" },
                maxWidth: { xs: "300px", sm: "400px" },
                color: "white",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "transparent",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "450",
                }}
                gutterBottom
              >
                Olá,
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "200",
                }}
                gutterBottom
              >
                Para continuar navegando de forma segura, efetue o login.
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ marginLeft: 0.3, fontSize: 27 }}
              >
                Login
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={nomeIcon.src}
                          alt="Nome Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: errors.username
                              ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                              : "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                    classes: {
                      root: errors.username && styles.errorBorder,
                      notchedOutline: errors.username
                        ? styles.errorBorder
                        : styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: { color: errors.username ? "#E9B425" : "#757575" },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.username ? "#E9B425" : "#757575",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    },
                  }}
                />
                <TextField
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={
                    errors.password && (
                      <div style={{ textAlign: "center" }}>
                        {errors.password.split("\n").map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            {index < errors.password.split("\n").length - 1 ? (
                              <br />
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          className={styles.cursorButton}
                          src={showPassword ? senhaOpenIcon.src : senhaIcon.src}
                          alt="Senha Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: errors.password
                              ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                              : "invert(100%)",
                          }}
                          onClick={togglePasswordVisibility}
                        />
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                    classes: {
                      root: errors.password && styles.errorBorder,
                      notchedOutline: errors.password
                        ? styles.errorBorder
                        : styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: { color: errors.password ? "#E9B425" : "#757575" },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.password ? "#E9B425" : "#757575",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    },
                  }}
                />
                <Button
                  type="submit"
                  className={styles.buttonLogin}
                  fullWidth
                  sx={{
                    color: "#ffffff",
                    borderRadius: "35px",
                    fontFamily: "Montserrat",

                    marginTop: "15px",
                    height: "55px",
                    fontSize: "12px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#000000")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#FFFFFF")
                  }
                >
                  Entrar
                </Button>
                <div className={styles.parentContainer}>
                  <span className={styles.loginContainer}>
                    Novo por aqui?{" "}
                    <Link className={styles.loginLink} href="/register">
                      <span>Registre-se</span>
                    </Link>
                  </span>
                </div>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <img
              src="/login-home.png"
              alt="Login Home"
              style={{
                width: "100%",
                maxWidth: "100vh",
                margin: 0,
                padding: 0,
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </ThemeProvider>
  );
}
