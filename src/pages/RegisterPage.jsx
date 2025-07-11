import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register as registerUser } from '../store/authSlice';
import { ROUTES, TEXTS } from '../constants';

// Schemat walidacji
const schema = yup.object({
  name: yup
    .string()
    .min(2, TEXTS.VALIDATION.NAME_MIN)
    .max(50, TEXTS.VALIDATION.NAME_MAX)
    .matches(/^[a-zA-Z0-9_-]+$/, 'Nazwa może zawierać tylko litery, cyfry, myślniki i podkreślenia')
    .required(TEXTS.VALIDATION.REQUIRED),
  email: yup
    .string()
    .email(TEXTS.VALIDATION.EMAIL_INVALID)
    .required(TEXTS.VALIDATION.REQUIRED),
  password: yup
    .string()
    .min(6, TEXTS.VALIDATION.PASSWORD_MIN)
    .max(50, TEXTS.VALIDATION.PASSWORD_MAX)
    .required(TEXTS.VALIDATION.REQUIRED),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Hasła muszą być identyczne')
    .required(TEXTS.VALIDATION.REQUIRED),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Przekierowanie po rejestracji
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;
    dispatch(registerUser(userData));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            {TEXTS.AUTH.REGISTER_TITLE}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={TEXTS.AUTH.NAME}
              name="name"
              autoComplete="name"
              autoFocus
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={TEXTS.AUTH.EMAIL}
              name="email"
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={TEXTS.AUTH.PASSWORD}
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Potwierdź hasło"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                TEXTS.AUTH.REGISTER_BUTTON
              )}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
                {TEXTS.AUTH.HAVE_ACCOUNT}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
