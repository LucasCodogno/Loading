import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRive, useStateMachineInput } from 'rive-react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const theme = createTheme();

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Rive Teddy animation logic
  const { rive, RiveComponent } = useRive({
    src: "520-990-teddy-login-screen.riv",
    autoplay: true,
    stateMachines: "State Machine 1"
  });

  // ... (rest of the Teddy animation logic from SignIn)

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.10.125:3010/exec?comando=ProcInformacoesUsuario_React%20@login='${login}',%20@senha='${senha}'`);
      const data = await response.json();

      if (data[0].Ret === 1) {
        sessionStorage.setItem('userAvatar', data[0].Foto);
        sessionStorage.setItem('authenticated', 'true');
        router.push('/');
      } else {
        alert('Credenciais incorretas');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      alert('Erro durante o login. Tente novamente mais tarde.');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            
          }}
        >
          {/* <div>
            <RiveComponent style={{ width: '400px', height: '400px' }} />
          </div> */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Login"
              required
              fullWidth
              label="Login "
              name="login"
              autoComplete="login"
              autoFocus
            />
            <TextField
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              required
              fullWidth
              label="Password"
              name="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </ThemeProvider>
  );
}
