import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from 'axios';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Alert, Breadcrumbs, Link, TextField } from '@mui/material';
import { Link as HrefLink } from 'react-router-dom';

export default function GenerateData() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('user-apiKey') || ''
  );
  const [structure, setStructure] = useState(Object);
  const [arrayLength, setArrayLength] = useState('');
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      apiKey,
      structure,
      arrayLength,
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:1337/api/generate/data',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      data: JSON.stringify({
        structure: structure,
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
          <JSONInput
            id="a_unique_id"
            theme="dark_vscode_tribute"
            locale={locale}
            colors={{
              string: '#DAA520', // overrides theme colors with whatever color value you want
            }}
            onChange={(e) => setStructure(e.jsObject)}
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
          <Button variant="contained" type="submit">
            Generate Data
          </Button>
        </form>

        {success && (
          <Box
            sx={{ my: 2, display: 'flex', justifyContent: 'center', gap: 2 }}
          >
            <Alert severity="success">
              <JSONInput
                id="a_unique_id_2"
                theme="dark_vscode_tribute"
                locale={locale}
                colors={{
                  string: '#DAA520', // overrides theme colors with whatever color value you want
                }}
                placeholder={data}
                height="auto"
                viewOnly={true}
                width="100%"
              />
            </Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}
