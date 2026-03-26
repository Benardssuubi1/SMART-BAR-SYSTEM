export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;

  if (!targetUrl || !apiKey) {
    console.error('Missing environment variables: API_URL or API_KEY');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const path = req.url.replace('/api/proxy', '');
  const fullUrl = `${targetUrl}${path}`;

  const fetchOptions = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(fullUrl, fetchOptions);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}