import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { API } from '../api';
import Chip from '@mui/material-next/Chip';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';

export default function Sidebar() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [typesData, setTypesData] = React.useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API.GET_TYPES);
      const data = response.data;
      setTypesData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {Object.keys(typesData).map((category) => (
          <React.Fragment key={category}>
            <Divider />
            {typeof typesData[category] === 'object' && (
              <ListItem disablePadding>
                <ListItemText primary={category === 'chance' ? 'Pro' : 'New'} />
              </ListItem>
            )}
            {typeof typesData[category] === 'object' ? (
              Object.entries(typesData[category]).map(([key, value]) => (
                <ListItem key={key} disablePadding>
                  <ListItemButton onClick={() => copyToClipboard(key)}>
                    <ListItemText primary={key} />
                    <FileCopyIcon sx={{ fontSize: 16 }} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem key={category} disablePadding>
                <ListItemButton onClick={() => copyToClipboard(category)}>
                  <ListItemText primary={category} />
                  <FileCopyIcon sx={{ fontSize: 16 }} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Chip
          color="primary"
          size="small"
          variant="filled"
          label="Check Supported Types"
          onClick={toggleDrawer('right', true)}
          icon={<InfoTwoToneIcon />}
        />
        <SwipeableDrawer
          anchor={'right'}
          open={state['right']}
          onClose={toggleDrawer('right', false)}
          onOpen={toggleDrawer('right', true)}
        >
          {list('right')}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
