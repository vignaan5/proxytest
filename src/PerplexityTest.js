const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/api/query', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'pplx-70b-online',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }, {
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3001');
});