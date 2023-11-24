const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Deepgram } = require('@deepgram/sdk');

const app = express();
const port = 3001;

// Increase payload size limit (adjust as needed)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

const deepgramApiKey = 'fc91d4462dfa9a2c9189117cdac58f2ffcb6eb62'; // Replace with your actual Deepgram API key
const deepgram = new Deepgram(deepgramApiKey);




app.post('/transcribe', async (req, res) => {
  const { file, mimetype } = req.body;

  let source;
  const audio = Buffer.from(file, 'base64');
  source = {
    buffer: audio,
    mimetype: mimetype,
  };

  try {
    const response = await deepgram.transcription.preRecorded(source, {
      smart_format: true,
      model: 'nova',
    });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Transcription failed' });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});