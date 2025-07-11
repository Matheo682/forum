import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip
} from '@mui/material';
import { 
  AccountCircle, 
  Add, 
  Home,
  AdminPanelSettings,
  DirectionsCar,
  Speed
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { ROUTES, TEXTS, USER_ROLES } from '../../constants';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate(ROUTES.HOME);
  };

  const handleProfile = () => {
    navigate(ROUTES.PROFILE);
    handleClose();
  };

  const handleAdmin = () => {
    navigate(ROUTES.ADMIN);
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.8)',
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        {/* Logo i nazwa aplikacji */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component={Link}
            to={ROUTES.HOME}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
              mr: 2,
              boxShadow: '0 4px 16px rgba(100, 116, 139, 0.4)',
            }}>
              <DirectionsCar sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #64748b 0%, #f97316 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                {TEXTS.APP_NAME}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}
              >
                Forum Motoryzacyjne
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Status użytkownika - wyświetlane zawsze */}
        {isAuthenticated && user && (
          <Chip
            icon={<Speed />}
            label={user.role === USER_ROLES.ADMIN ? 'Administrator' : 'Użytkownik'}
            variant="outlined"
            size="small"
            sx={{
              mr: 2,
              borderColor: user.role === USER_ROLES.ADMIN ? '#f97316' : '#0ea5e9',
              color: user.role === USER_ROLES.ADMIN ? '#f97316' : '#0ea5e9',
              background: user.role === USER_ROLES.ADMIN ? 'rgba(249, 115, 22, 0.1)' : 'rgba(14, 165, 233, 0.1)',
              '& .MuiChip-icon': {
                color: user.role === USER_ROLES.ADMIN ? '#f97316' : '#0ea5e9',
              }
            }}
          />
        )}

        {/* Przycisk dodawania posta dla zalogowanych */}
        {isAuthenticated && (
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to={ROUTES.CREATE_POST}
            sx={{ 
              mr: 2,
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
              },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {TEXTS.POSTS.CREATE_POST}
          </Button>
        )}

        {/* Menu użytkownika */}
        {isAuthenticated ? (
          <div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mr: 2, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500 
                }}
              >
                Witaj, {user?.name || user?.username}
              </Typography>
              <IconButton
                size="large"
                aria-label="konto użytkownika"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
                    border: '2px solid rgba(100, 116, 139, 0.3)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 
                   user?.username ? user.username.charAt(0).toUpperCase() : 
                   <AccountCircle />}
                </Avatar>
              </IconButton>
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  mt: 1,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '1px solid rgba(100, 116, 139, 0.2)',
                  borderRadius: 3,
                  minWidth: 200,
                  boxShadow: '0 8px 32px rgba(15, 23, 42, 0.6)',
                },
              }}
            >
              <MenuItem 
                onClick={handleProfile}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                  }
                }}
              >
                <AccountCircle sx={{ mr: 2, color: '#64748b' }} />
                {TEXTS.NAVIGATION.PROFILE}
              </MenuItem>
              
              {/* Panel administracyjny tylko dla adminów */}
              {user?.role === 'admin' && (
                <MenuItem 
                  onClick={handleAdmin}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    }
                  }}
                >
                  <AdminPanelSettings sx={{ mr: 2, color: '#f97316' }} />
                  {TEXTS.NAVIGATION.ADMIN}
                </MenuItem>
              )}
              
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#f44336' }}>
                  {TEXTS.NAVIGATION.LOGOUT}
                </Box>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined"
              component={Link} 
              to={ROUTES.LOGIN}
              sx={{
                borderColor: 'rgba(100, 116, 139, 0.5)',
                color: '#64748b',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#64748b',
                  backgroundColor: 'rgba(100, 116, 139, 0.1)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {TEXTS.NAVIGATION.LOGIN}
            </Button>
            <Button 
              variant="contained"
              component={Link} 
              to={ROUTES.REGISTER}
              sx={{
                background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 16px rgba(100, 116, 139, 0.4)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {TEXTS.NAVIGATION.REGISTER}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
