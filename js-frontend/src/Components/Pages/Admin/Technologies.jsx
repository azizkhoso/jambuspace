import React from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import { deleteTechnology, getTechnologies, updateTechnoloy } from '../../api/admin';
import AddTechnology from './AddTechnology';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { If, Then, Else } from 'react-if';
import CircularLoader from '../../Common/CircularLoader';

const Technologies = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [technologies, setTechnologies] = React.useState([]);
  const client = useQueryClient();
  const { isLoading } = useQuery(['technologies'], () => getTechnologies(), {
    onSuccess: ({ data }) => {
      setTechnologies(data);
    },
    onError: (res) => toast(res?.data?.message || res.message, { type: 'error' }),
  });

  const { mutate } = useMutation((vals) => updateTechnoloy(vals._id, vals), {
    onSuccess: () => client.invalidateQueries('technologies'),
    onError: (res) => toast(res?.data?.message || res.message, { type: 'error' }),
  });

  const deleteMutation = useMutation((id) => deleteTechnology(id), {
    onSuccess: () => client.invalidateQueries('technologies'),
    onError: (res) => toast(res?.data?.message || res.message, { type: 'error' }),
  });

  return (
    <div>
      <AddTechnology isOpen={modalShow} onClose={() => setModalShow(false)} />
      <Box className="m-4">
        <Typography className="text-center mt-4" variant="h3">
          Technologies
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="primary" onClick={() => setModalShow(true)}>
            Add New
          </Button>
        </Box>
        <Box className="m-4">
          <If condition={isLoading}>
            <Then>
              <CircularLoader />
            </Then>
            <Else>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {technologies &&
                    technologies.map((techItem, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{techItem.title}</TableCell>
                        <TableCell>{techItem.skills.join(', ')}</TableCell>
                        <TableCell className="text-uppercase font-weight-bold">
                          {techItem.active ? 'Enabled' : 'Disabled'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => mutate({ _id: techItem._id, active: !techItem.active })}
                          >
                            {techItem.active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            style={{ marginLeft: '10px' }}
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => {
                              console.log({ techItem });
                              deleteMutation.mutate(techItem._id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Else>
          </If>
        </Box>
      </Box>
    </div>
  );
};

export default Technologies;
