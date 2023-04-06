import React from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateSeller } from '../../../../../api/seller';
import useGlobalState from '../../../../../hooks/useGlobalState';

export default function Skills() {
  const { user, setUser } = useGlobalState();
  const [isOpen, setOpen] = React.useState(false);
  const [skills, setSkills] = React.useState(user?.skills || []);
  const { isLoading, mutate } = useMutation((vals) => updateSeller(vals), {
    onSuccess: ({ data }) => {
      setUser(data);
      setOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });
  const handleSkillDelete = (index) => {
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  };
  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Skills</Typography>
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            {user?.skills.length === 0 ? (
              <Typography variant="body2">Not provided yet</Typography>
            ) : (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {user?.skills.map((skill, index) => (
                  <Chip key={index} label={skill} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <Dialog open={isOpen || isLoading} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Skills</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={4} py={2}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {skills.map((skill, index) => (
                <Chip key={index} label={skill} onDelete={() => handleSkillDelete(index)} />
              ))}
            </Box>
            <TextField
              size="small"
              variant="outlined"
              title="Skills"
              placeholder="Networking,ReactJS"
              fullWidth
              value={skills.join(', ')}
              onChange={(e) => setSkills(e.target.value.split(',').map((s) => s.trim()))}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              flexWrap="wrap"
              gap={2}
            >
              <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button
                disabled={isLoading}
                variant="contained"
                color="primary"
                onClick={() => {
                  mutate({ skills });
                }}
              >
                {isLoading ? <CircularProgress size="22px" /> : 'Update'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
