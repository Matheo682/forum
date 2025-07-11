import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Typography,
  Container
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import CategoryManagement from '../components/Admin/CategoryManagement';
import BrandManagement from '../components/Admin/BrandManagement';
import ModelManagement from '../components/Admin/ModelManagement';
import GenerationManagement from '../components/Admin/GenerationManagement';
import UserManagement from '../components/Admin/UserManagement';
import PostManagement from '../components/Admin/PostManagement';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useSelector((state) => state.auth);

  // Sprawdź czy użytkownik jest administratorem
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel Administracyjny
      </Typography>
      
      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Kategorie" />
            <Tab label="Marki" />
            <Tab label="Modele" />
            <Tab label="Generacje" />
            <Tab label="Użytkownicy" />
            <Tab label="Posty" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <CategoryManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <BrandManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ModelManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <GenerationManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <UserManagement />
        </TabPanel>
        
        <TabPanel value={tabValue} index={5}>
          <PostManagement />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPage;
