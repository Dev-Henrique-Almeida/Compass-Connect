"use client";
import React, { useEffect } from "react";
import styles from "./register.module.scss";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import nomeIcon from "@/public/icons/nome.png";
import usuarioIcon from "@/public/icons/usuario.png";
import dataIcon from "@/public/icons/nascimento.png";
import senhaIcon from "@/public/icons/senha.png";
import senhaOpenIcon from "@/public/icons/senha-open.png";
import confirmarIcon from "@/public/icons/confirmar-senha.png";
import emailIcon from "@/public/icons/email.png";
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

interface User {
  id: string;
  email: string;
  username: string;
}

const getUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:3001/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const usersData: User[] = data.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
        }));
        return usersData;
      }
    } catch (error) {
      console.error("Erro ao obter informações dos usuários:", error);
    }
  }
  return []; // Aqui vai retornar um array vazio se houver um erro ou se o token não existir
};

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

export default function ContentRegister() {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAll, setUsernameAll] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    nome: "",
    username: "",
    password: "",
    nascimento: "",
    email: "",
    confirmPassword: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    } else {
    }
  }, []);

  const applyDateMask = (value: string) => {
    let cleanValue = value.replace(/\D/g, "");

    let day = cleanValue.slice(0, 2);
    let month = cleanValue.slice(2, 4);
    let year = cleanValue.slice(4, 8);

    if (day.length === 2) {
      const dayNum = parseInt(day, 10);
      if (dayNum < 1 || dayNum > 31) {
        day = "31";
      }
    }

    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        month = "12";
      }
    }

    if (year.length === 4) {
      const yearNum = parseInt(year, 10);
      if (yearNum < 1900) {
        year = "1900";
      } else if (yearNum > 2023) {
        year = "2023";
      }
    }

    cleanValue = [day, month, year].filter(Boolean).join("/");
    return cleanValue;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailUnique = await checkEmailUnique(email);
    const userUnique = await checkUsernameUnique(username);

    console.error(email);
    console.log(emailUnique);
    let isValid = true;

    setErrors({
      nome: "",
      username: "",
      password: "",
      nascimento: "",
      email: "",
      confirmPassword: "",
    });

    /* Validações para a senha */

    if (!password || !confirmPassword) {
      setErrors((errors) => ({
        ...errors,
        password: "Senha é obrigatório.",
        confirmPassword: "Confirmar a senha é obrigatório.",
      }));
      isValid = false;
    }

    if (password.length < 6 || password.length > 50) {
      setErrors((errors) => ({
        ...errors,
        password: "Senha deve ter entre 6 e 50 caracteres.",
      }));
      isValid = false;
    }

    /* Validações para a confirmação da senha */
    if (confirmPassword !== password) {
      setErrors((errors) => ({
        ...errors,
        password: " ",
        confirmPassword: "As senhas não correspondem.",
      }));
      isValid = false;
    }

    /* Validações para o usuário */

    if (username.length > 255) {
      setErrors((errors) => ({
        ...errors,
        username: "Usuário não pode ter mais de 255 caracteres. ",
      }));
      isValid = false;
    } else if (!username) {
      setErrors((errors) => ({
        ...errors,
        username: "Usuário é obrigatório. ",
      }));
      isValid = false;
    } else if (!userUnique) {
      console.log(userUnique);

      setErrors((errors) => ({ ...errors, username: "Usuário já existe." }));
      isValid = false;
    }

    /* Validações para o nome */

    if (nome.length > 255) {
      setErrors((errors) => ({
        ...errors,
        nome: "Nome não pode ter mais de 255 caracteres. ",
      }));
      isValid = false;
    }

    if (!nome) {
      setErrors((errors) => ({
        ...errors,
        nome: "Nome é obrigatório. ",
      }));
      isValid = false;
    }

    /* Validações para o email */
    if (email.length === 0) {
      setErrors((errors) => ({ ...errors, email: "E-mail é obrigatório." }));
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setErrors((errors) => ({
        ...errors,
        email: "Por favor, insira um e-mail válido.",
      }));
      isValid = false;
    } else {
      // Verificação de unicidade do e-mail
      const emailIsUnique = await checkEmailUnique(email);
      if (!emailIsUnique) {
        setErrors((errors) => ({ ...errors, email: "Email já existe." }));
        isValid = false;
      }
    }

    /* Validações para a data de nascimento */
    let formattedDate = "";
    if (!nascimento) {
      setErrors((errors) => ({
        ...errors,
        nascimento: "Data de Nascimento é obrigatória.",
      }));
      isValid = false;
    } else {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = nascimento.match(dateRegex);

      if (!match) {
        setErrors((errors) => ({
          ...errors,
          nascimento:
            "Por favor, insira uma data válida no formato dd/mm/aaaa.",
        }));
        isValid = false;
      } else {
        const [, day, month, year] = match;

        formattedDate = `${year}-${month}-${day}`;
      }
    }

    if (isValid) {
      if (isValid) {
        try {
          const response = await fetch("http://localhost:3001/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",

              "User-Agent": "PostmanRuntime/7.35.0",
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              Connection: "keep-alive",
            },
            body: JSON.stringify({
              name: nome,
              username,
              birthdate: formattedDate,
              email,
              password,
              confirmPassword,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const token = data.token;
            const userId = data.user.id;

            localStorage.setItem("token", token);
            localStorage.setItem("id", userId);
            router.push("/home");
          } else {
            console.error("Registro Falhou");
          }
        } catch (error) {
          console.error("Ocorreu um erro:", error);
        }
        console.log(formattedDate);
      }
    }
  };

  const checkUsernameUnique = async (newUsername: string) => {
    const users = await getUsers();
    return users.every((user) => user.username !== newUsername);
  };

  const checkEmailUnique = async (newEmail: string) => {
    const users = await getUsers();
    return users.every((user) => user.email !== newEmail);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.main}>
        <Grid className={styles.main} container>
          <Grid className={styles.main} item sm={6} style={{}}>
            <Paper
              elevation={0}
              sx={{
                marginBottom: { xs: "160px", sm: "20px" },
                marginRight: { xs: "160px", sm: "20px" },
                marginLeft: { xs: 0, sm: "260px" },
                marginTop: { xs: "-10px", sm: "60px" },
                padding: { xs: "24px", sm: "3" },
                maxWidth: { xs: "342px", sm: "400px" },
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
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  error={!!errors.nome}
                  helperText={errors.nome}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={nomeIcon.src}
                          alt="Nome Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: errors.nome
                              ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                              : "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                    classes: {
                      root: errors.nome && styles.errorBorder,
                      notchedOutline: errors.nome
                        ? styles.errorBorder
                        : styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: { color: errors.nome ? "#E9B425" : "#757575" },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.nome ? "#E9B425" : "#757575",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 5,
                    },
                  }}
                />

                <TextField
                  label="Usuário"
                  fullWidth
                  margin="dense"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={usuarioIcon.src}
                          alt="Usuário Icon"
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
                      marginTop: 5,
                    },
                  }}
                />
                <TextField
                  label="Data de Nascimento"
                  fullWidth
                  margin="dense"
                  value={nascimento}
                  onChange={(e) => setNascimento(applyDateMask(e.target.value))}
                  error={!!errors.nascimento}
                  helperText={errors.nascimento}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={dataIcon.src}
                          alt="Data Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: errors.nascimento
                              ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                              : "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                    classes: {
                      root: errors.nascimento && styles.errorBorder,
                      notchedOutline: errors.nascimento
                        ? styles.errorBorder
                        : styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: { color: errors.nascimento ? "#E9B425" : "#757575" },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.nascimento ? "#E9B425" : "#757575",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 5,
                    },
                  }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="dense"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          src={emailIcon.src}
                          alt="Email Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: errors.email
                              ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                              : "invert(100%)",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                    classes: {
                      root: errors.email && styles.errorBorder,
                      notchedOutline: errors.email
                        ? styles.errorBorder
                        : styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: { color: errors.email ? "#E9B425" : "#757575" },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.email ? "#E9B425" : "#757575",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 5,
                    },
                  }}
                />
                <TextField
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
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
                      marginTop: 5,
                    },
                  }}
                />
                <TextField
                  label="Confirmar Senha"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  margin="dense"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img
                          className={styles.cursorButton}
                          src={
                            showConfirmPassword
                              ? senhaOpenIcon.src
                              : confirmarIcon.src
                          }
                          alt="Confirmar Senha Icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            filter: errors.confirmPassword
                              ? "brightness(0) saturate(100%) invert(94%) sepia(39%) saturate(7165%) hue-rotate(331deg) brightness(93%) contrast(95%)"
                              : "invert(100%)",
                          }}
                          onClick={toggleConfirmPasswordVisibility}
                        />
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                    classes: {
                      root: errors.confirmPassword && styles.errorBorder,
                      notchedOutline: errors.confirmPassword
                        ? styles.errorBorder
                        : styles.whiteBorder,
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: errors.confirmPassword ? "#E9B425" : "#757575",
                    },
                  }}
                  FormHelperTextProps={{
                    style: {
                      color: errors.confirmPassword ? "#E9B425" : "#757575",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 5,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  className={styles.buttonRegister}
                  fullWidth
                  sx={{
                    color: "#FFFFFF",
                    borderRadius: "35px",
                    height: "55px",
                    marginTop: "15px",
                  }}
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
