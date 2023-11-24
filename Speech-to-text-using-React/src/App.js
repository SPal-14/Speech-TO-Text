import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcriptionResult, setTranscriptionResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleTranscription = () => {
    if (!selectedFile) {
      console.error('Please select a file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContentBase64 = event.target.result.split(',')[1];;

      // Send transcription request to the server
      fetch('https://api.deepgram.com/v1/listen', {
        method: 'POST',
        headers : {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Token fc91d4462dfa9a2c9189117cdac58f2ffcb6eb62"
         },
        body: JSON.stringify({
          file: fileContentBase64,
          mimetype: selectedFile.type,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTranscriptionResult(data);
        })
        .catch((error) => {
          console.error('Transcription Error:', error);
        });
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="App">
      <h1>Audio Transcription App</h1>
      <input type="file" onChange={handleFileChange} accept="audio/*" />
      <button onClick={handleTranscription}>Transcribe</button>

      {transcriptionResult && (
        <div>
          <h2>Transcription Result:</h2>
          <pre>{JSON.stringify(transcriptionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
