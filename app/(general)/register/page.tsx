"use client";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import styles from "./page.module.scss";
import nomeIcon from "@/public/icons/nome.png";
import usuarioIcon from "@/public/icons/usuario.png";
import dataIcon from "@/public/icons/nascimento.png";
import senhaIcon from "@/public/icons/senha.png";
import senhaOpenIcon from "@/public/icons/senha-open.png";
import confirmarIcon from "@/public/icons/confirmar-senha.png";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
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
          router.push("/home");
        } else {
          console.error("Login failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      console.log(username, password);
    }
  };

  const checkUsernameUnique = async (username: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.main}>
        <Grid className={styles.main} container>
          <Grid
            className={styles.main}
            item
            sm={6}
            style={{
              padding: 20,
            }}
          >
            <Paper
              className={styles.main}
              elevation={0}
              sx={{
                marginBottom: 20,
                marginRight: 20,
                marginLeft: 20,
                marginTop: 10,
                padding: 3,
                maxWidth: 400,
              }}
            >
              <Typography variant="h2" gutterBottom>
                Olá,
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Por favor, registre-se para continuar.
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ marginLeft: 0.3, fontSize: 27 }}
              >
                Cadastro
              </Typography>
              <form onSubmit={handleRegister}>
                <TextField
                  label="Nome"
                  fullWidth
                  margin="normal"
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
                            filter: "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      color: "#FFFFFF",
                    },
                    classes: {
                      notchedOutline: styles.whiteBorder,
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
                  label="Usuário"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={usuarioIcon.src}
                          alt="Usuário Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      color: "#FFFFFF",
                    },
                    classes: {
                      notchedOutline: styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#757575",
                    },
                  }}
                />
                <TextField
                  label="Nascimento"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={dataIcon.src}
                          alt="Data Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      color: "#FFFFFF",
                    },

                    classes: {
                      notchedOutline: styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#757575",
                    },
                  }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AlternateEmailOutlinedIcon
                          style={{
                            color: "#FFFFFF",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      color: "#FFFFFF",
                    },
                    classes: {
                      notchedOutline: styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#757575",
                    },
                  }}
                />
                <TextField
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
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
                    style: { color: errors.password ? "#E9B425" : "#757575" },
                  }}
                />
                <TextField
                  label="Confirmar Senha"
                  type="password"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={confirmarIcon.src}
                          alt="Confirmar-Senha Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),

                    classes: {
                      notchedOutline: styles.whiteBorder,
                    },
                    className: styles.whiteBorder,
                  }}
                  InputLabelProps={{
                    className: styles.whiteLabel,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  className={styles.buttonRegister}
                  fullWidth
                >
                  Registrar-se
                </Button>
                <div className={styles.parentContainer}>
                  <span className={styles.registerContainer}>
                    Já possui uma conta?{" "}
                    <Link href="/login" className={styles.registerLink}>
                      Faça Login
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
      </div>
    </ThemeProvider>
  );
}
