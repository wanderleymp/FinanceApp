import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography,
  Collapse
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PaymentIcon from '@mui/icons-material/Payment';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({
    financeiro: true,
    cadastro: true,
    contratos: true,
    configuracoes: true
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuSections = [
    {
      title: 'Geral',
      items: [
        { 
          text: 'Dashboard', 
          icon: <DashboardIcon />, 
          path: '/dashboard' 
        }
      ]
    },
    {
      title: 'Financeiro',
      key: 'financeiro',
      icon: <PaymentIcon />,
      items: [
        { 
          text: 'Movimento Geral', 
          icon: <ReceiptIcon />, 
          path: '/movements' 
        },
        { 
          text: 'Vendas', 
          icon: <ReceiptIcon />, 
          path: '/list-sales' 
        },
        { 
          text: 'Contas a Receber', 
          icon: <ReceiptIcon />, 
          path: '/accounts-receivable' 
        },
        { 
          text: 'Tipos de Movimento', 
          icon: <AssignmentIcon />, 
          path: '/movement-types' 
        },
        { 
          text: 'Status de Movimento', 
          icon: <AssignmentIcon />, 
          path: '/movement-statuses' 
        },
        { 
          text: 'Métodos de Pagamento', 
          icon: <PaymentIcon />, 
          path: '/payment-methods' 
        }
      ]
    },
    {
      title: 'Cadastro',
      key: 'cadastro',
      icon: <BusinessIcon />,
      items: [
        { 
          text: 'Pessoas', 
          icon: <PeopleIcon />, 
          path: '/persons' 
        },
        { 
          text: 'Usuários', 
          icon: <PersonIcon />, 
          path: '/users' 
        }
      ]
    },
    {
      title: 'Contratos',
      key: 'contratos',
      icon: <AssignmentIcon />,
      items: [
        { 
          text: 'Lista de Contratos', 
          icon: <AssignmentIcon />, 
          path: '/contracts' 
        },
        { 
          text: 'Novo Contrato', 
          icon: <AssignmentIcon />, 
          path: '/contracts/new' 
        },
        { 
          text: 'Tipos de Contrato', 
          icon: <AssignmentIcon />, 
          path: '/contract-types' 
        },
        { 
          text: 'Status de Contrato', 
          icon: <AssignmentIcon />, 
          path: '/contract-statuses' 
        }
      ]
    },
    {
      title: 'Configurações',
      key: 'configuracoes',
      icon: <SettingsIcon />,
      items: [
        { 
          text: 'Configurações Gerais', 
          icon: <SettingsIcon />, 
          path: '/settings' 
        }
      ]
    }
  ];

  const renderMenuSection = (section: any) => {
    if (section.key) {
      return (
        <>
          <ListItem onClick={() => toggleMenu(section.key)}>
            <ListItemIcon>{section.icon}</ListItemIcon>
            <ListItemText primary={section.title} />
            {openMenus[section.key] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus[section.key]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {section.items.map((item: any) => (
                <ListItem 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  onClick={onClose}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      );
    }

    return section.items.map((item: any) => (
      <ListItem 
        key={item.text} 
        component={Link} 
        to={item.path}
        onClick={onClose}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    ));
  };

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        }}
      >
        <Box 
          sx={{ 
            padding: 2, 
            backgroundColor: 'primary.main', 
            color: 'white' 
          }}
        >
          <Typography variant="h6">Finance App</Typography>
        </Box>

        <List>
          {menuSections.map(renderMenuSection)}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
