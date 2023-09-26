import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Breadcrumbs, Link, TextField } from '@mui/material';
import { Link as HrefLink } from 'react-router-dom';
import { API } from '../api';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';
import 'ace-builds/src-noconflict/ext-code_lens';

export default function GenerateData() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('user-apiKey') || ''
  );
  const [structure, setStructure] = useState({});
  const [arrayLength, setArrayLength] = useState('');
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
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
      console.error('Error sending request:', error);
    }
  };
  const handleApiKey = (value) => {
    setApiKey(value);
    localStorage.setItem('user-apiKey', value);
  };
  return (
    <Container maxWidth="lg">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={HrefLink} to="/">
          Home
        </Link>
        <Typography color="text.primary">Generate Data</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Data
        </Typography>

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
          <Button variant="contained" type="submit" sx={{ mb: 2 }}>
            Generate Data
          </Button>
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
            }}
            readOnly
            width="100%"
          />
        )}
      </Box>
    </Container>
  );
}
