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
  Input,
  Typography,
} from '@mui/material';
import { Edit, UploadFile } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateSellerFiles } from '../../../../../api/seller';
import useGlobalState from '../../../../../hooks/useGlobalState';
import { When } from 'react-if';

export default function Resume() {
  const { user, setUser } = useGlobalState();
  const [isOpen, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const { isLoading, mutate } = useMutation((vals) => updateSellerFiles(vals), {
    onSuccess: ({ data }) => {
      setUser(data);
      setOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Resume</Typography>
            <IconButton onClick={() => setOpen(true)}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <When condition={Boolean(user?.resume)}>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${user?.resume?.url}`}
                  alt="Resume"
                  style={{ width: 150 }}
                />
              </When>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog open={isOpen || isLoading} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Resume</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={4} py={2}>
            <Box
              sx={{
                cursor: 'pointer',
                my: 1.5,
                '&:hover': {
                  '& div, & #upload-icon': {
                    color: 'black',
                  },
                  borderColor: 'black !important',
                },
              }}
              border="1px solid"
              borderRadius="4px"
              display="flex"
              flexDirection="column"
              py={0.7}
              px={1}
              component="label"
              htmlFor="image"
            >
              <Box display="flex" alignItems="center" width="100%">
                <UploadFile id="upload-icon" htmlColor="gray" />
                <Box color="gray" width="100%" textAlign="center">
                  Upload Image
                </Box>
              </Box>
              <Input id="image" type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
              <When condition={Boolean(file)}>
                <Box
                  width="150px"
                  component="img"
                  src={file && URL.createObjectURL(file)}
                  alt="resume"
                  mx="auto"
                />
              </When>
            </Box>
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
                disabled={isLoading || !file}
                variant="contained"
                color="primary"
                onClick={() => {
                  mutate({ resume: file });
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
