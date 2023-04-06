import React from 'react';

import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Search, Send } from '@mui/icons-material';
import { Else, If, Then } from 'react-if';
import moment from 'moment';
import io from 'socket.io-client';
import useGlobalState from '../../hooks/useGlobalState';
import { useLocation } from 'react-router-dom';

function sendMessage(msg, socket) {
  socket.emit('new-message', msg);
}

export default function Chat() {
  const { user } = useGlobalState();
  const chatUser = useLocation()?.state?.chatUser;
  // socket initialization
  const { current: messagesSocket } = React.useRef(
    io(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
      query: {
        userId: user._id,
        userType: user.userType,
      },
    }),
  );
  // ------------------------
  const [messageText, setMessageText] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [allMessages, setAllMessages] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState(chatUser);
  const messagesContainerRef = React.useRef();

  React.useEffect(() => {
    if (selectedUser?.id) {
      messagesSocket.emit('get-all-messages', selectedUser.id);
    }
  }, [selectedUser?.id]);

  React.useEffect(() => {
    messagesSocket.emit('get-conversations');
    messagesSocket.on('all-conversations', (cnvs) => {
      const usrs = [];
      cnvs.forEach((cn) => {
        const otherUser = cn.users.find((u) => u.id !== user._id);
        usrs.push(otherUser);
      });
      setUsers(usrs);
    });
    messagesSocket.on('new-message', (msg) => setAllMessages((allMsgs) => [...allMsgs, msg]));
    messagesSocket.on('all-messages', (allmsgs) => setAllMessages(allmsgs));
  }, []);

  React.useEffect(() => {
    // scroll to bottom when a new message is added
    messagesContainerRef.current?.scrollBy(0, Number.MAX_SAFE_INTEGER);
  }, [selectedUser, messagesContainerRef, allMessages]);
  return (
    <Container component={Paper} maxWidth="lg" sx={{ my: 3, px: '0 !important' }}>
      <Grid
        container
        paddingX={0}
        sx={{
          minHeight: '50vh',
          maxHeight: { xs: 'fit-content', md: '800px' },
        }}
      >
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            bgcolor: '#efefef',
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            gap: 2,
            maxHeight: { xs: '300px', md: 'unset' },
          }}
        >
          <TextField
            label="Search"
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Box height="100%" overflow="auto" display="flex" flexDirection="column">
            {users
              .filter((i) => i.fullName.toLowerCase().includes(searchText.toLowerCase()))
              .map((u) => (
                <Box
                  role="button"
                  onClick={() => setSelectedUser(u)}
                  key={u.fullName}
                  display="flex"
                  alignItems="center"
                  p={1}
                  gap={2}
                  sx={{
                    '&': {
                      cursor: 'pointer',
                    },
                    '&:hover': {
                      bgcolor: '#ccc',
                    },
                  }}
                >
                  <Avatar alt={u.fullName} src={u.image} sx={{ width: 32, height: 32 }} />
                  <Typography variant="body1">{u.fullName}</Typography>
                </Box>
              ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <If condition={selectedUser}>
            <Then>
              <Box display="flex" flexDirection="column" py={1} height="100%">
                <Box component={Paper} display="flex" alignItems="center" p={1} gap={2}>
                  <Avatar
                    alt={selectedUser?.fullName}
                    src={selectedUser?.image}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body1">{selectedUser?.fullName}</Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  p={1}
                  flexGrow={1}
                  minHeight={{ xs: '500px', md: 'unset' }}
                  maxHeight="500px"
                  overflow="auto"
                  ref={messagesContainerRef}
                >
                  {allMessages.map((mess) => (
                    <Box key={mess._id} display="flex" width="100%" my={0.5}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        maxWidth={{ xs: '90%', md: '50%' }}
                        bgcolor="#dfdfdf"
                        borderRadius="8px"
                        p={1}
                        marginLeft={mess.from.id === user?._id ? 'auto' : 'unset'}
                      >
                        <Typography variant="body1">{mess.text}</Typography>
                        <Typography variant="caption">
                          {moment(mess.createdAt).format('hh:mm A DD-MMM-YYYY')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box display="flex" alignItems="center" p={1}>
                  <TextField
                    label="Message"
                    size="small"
                    fullWidth
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <IconButton
                    onClick={() => {
                      sendMessage(
                        {
                          from: {
                            id: user._id,
                            fullName: user.fullName,
                            userType: user.userType,
                          },
                          to: selectedUser,
                          text: messageText,
                        },
                        messagesSocket,
                      );
                      setMessageText('');
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </Box>
            </Then>
            <Else>
              <Box display="flex" flexDirection="column" height="100%">
                <Typography sx={{ m: 'auto' }}>No chat selected</Typography>
              </Box>
            </Else>
          </If>
        </Grid>
      </Grid>
    </Container>
  );
}
