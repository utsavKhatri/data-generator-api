import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';

import axios from 'axios';
import {
  Alert,
  Breadcrumbs,
  Link,
  Slide,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { Link as HrefLink } from 'react-router-dom';
import { API } from '../api';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';
import 'ace-builds/src-noconflict/ext-code_lens';
import { utils, write } from 'xlsx';
import Sidebar from '../components/Sidebar';
import Badge from '@mui/material-next/Badge';

export default function GenerateData() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('user-apiKey') || ''
  );
  const [structure, setStructure] = useState({});
  const [arrayLength, setArrayLength] = useState('');
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [errMessage, setErrMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      apiKey,
      structure: JSON.parse(structure),
      arrayLength,
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API.GEN_DATA,
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      data: JSON.stringify({
        structure: JSON.parse(structure),
        arrayLength: arrayLength,
      }),
    };
    try {
      const response = await axios.request(config);
      setData(response.data);
      setSuccess(true);
    } catch (error) {
      setOpen(true);
      setErrMessage(error.response?.data?.message);
      console.error('Error sending request:', error);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const generateExcel = () => {
    const workbook = {
      Sheets: { Sheet1: utils.json_to_sheet(data) },
      SheetNames: ['Sheet1'],
    };
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'generated_data.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleApiKey = (value) => {
    setApiKey(value);
    localStorage.setItem('user-apiKey', value);
  };

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errMessage}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert severity="error" onClick={handleClose}>
          {errMessage}
        </Alert>
      </Snackbar>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={HrefLink} to="/">
          Home
        </Link>
        <Typography color="text.primary">Generate Data</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Stack direction="row" my={2} spacing={3} alignItems={'center'}>
          <Typography variant="h4" component="h1" mb={0} gutterBottom>
            Generate Data
          </Typography>
          <Sidebar />
        </Stack>

        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="API Key"
            value={apiKey}
            onChange={(e) => handleApiKey(e.target.value)}
            fullWidth
            required
            variant="outlined"
            color="success"
            sx={{ mb: 2 }}
          />
          <AceEditor
            mode="json"
            theme="solarized_light"
            name="blah2"
            onChange={(e) => {
              console.log(e);
              setStructure(e);
            }}
            fontSize={14}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            width="100%"
          />
          <TextField
            type="number"
            placeholder="Array Length"
            value={arrayLength}
            onChange={(e) => setArrayLength(e.target.value)}
            fullWidth
            required
            sx={{ my: 2 }}
          />
          <Button
            variant="filledTonal"
            type="submit"
            sx={{
              mb: 2,
              background: '#16c2f2',
              '&:hover': { background: '#04a7d4', color: 'white' },
            }}
          >
            Generate Data
          </Button>
          {data && (
            <Button
              variant="filledTonal"
              sx={{ ml: 3, mb: 2 }}
              onClick={generateExcel}
              disabled={data.length === 0}
              color="success"
            >
              Generate Excel
            </Button>
          )}
        </form>

        {success && (
          <AceEditor
            mode="json"
            theme="tomorrow"
            name="blah22"
            value={JSON.stringify(data, null, 2)}
            fontSize={14}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              useElasticTabstops: true,
              useWorker: true,
              vScrollBarAlwaysVisible: false,
              hScrollBarAlwaysVisible: false,
            }}
            readOnly
            width="100%"
          />
        )}
      </Box>
    </Container>
  );
}
