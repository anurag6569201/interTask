import { useState } from "react";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import { CloudUpload, Send } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [rangeValue, setRangeValue] = useState(1);
  const [imageFile, setImageFile] = useState(null);

  const handleSend = async () => {
    const defaultText = input.trim() || "Default message";
    const defaultRange = rangeValue || 1;
    const defaultFile = file || '';
    const defaultImage = imageFile || '';
  
    if (!defaultText && !defaultFile && !defaultImage) {
      alert("Please enter a message, upload a file, or select an image.");
      return;
    }
  
    const newMessage = {
      text: defaultText,
      file: defaultFile ? URL.createObjectURL(defaultFile) : null,
      image: defaultImage ? URL.createObjectURL(defaultImage) : null,
      type: "user",
    };
  
    setMessages([...messages, newMessage]);
    setInput("");
    setFile(null);
    setImageFile(null);
  
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "I received your message!", type: "bot" }]);
    }, 1000);
  
    const formData = new FormData();
    formData.append("text", defaultText);
    formData.append("page_range", parseInt(defaultRange, 10));
    if (defaultFile) formData.append("file", defaultFile);
    if (defaultImage) formData.append("image", defaultImage);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/process_data/", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result && result.llm_response) {
          try {
            const questions = JSON.parse(result.llm_response);
            if (Array.isArray(questions) && questions.length > 0) {
              const formattedResponse = questions.map((q, index) => (
                <div key={index} className="mt-2">
                  <h6>{q.question}</h6>
                  <p><strong>Answer:</strong> {q.answer}</p>
                  <p><strong>Solution:</strong> {Object.values(q.solution).join(" ")}</p>
                  <p><strong>Hint:</strong> {q.hints}</p>
                </div>
              ));
  
              setMessages((prev) => [...prev, { text: formattedResponse, type: "bot" }]);
            } else {
              setMessages((prev) => [...prev, { text: "No questions found in the response", type: "bot" }]);
            }
          } catch (error) {
            console.error("Error parsing the response:", error);
            setMessages((prev) => [...prev, { text: "Error parsing the response from the server", type: "bot" }]);
          }
        } else {
          setMessages((prev) => [...prev, { text: "No valid response received", type: "bot" }]);
        }
      } else {
        console.error("Error processing data:", response.statusText);
        setMessages((prev) => [...prev, { text: "Error processing request", type: "bot" }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "An error occurred while processing your request", type: "bot" }]);
    }
  };
  
  
  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadedFiles([...uploadedFiles, selectedFile.name]);
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImageFile(selectedImage);
    }
  };

  return (
    <div className="container d-flex vh-100 p-4 bg-light" style={{padding:'0',maxWidth:'100vw',margin:'0'}}>
      {/* Left Panel */}
      <div className="w-25 p-3 bg-white shadow-lg rounded-4 me-3">
        <h5 className="text-center mb-3">Uploaded Files</h5>
        <ul className="list-group">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="list-group-item text-truncate">{file}</li>
          ))}
        </ul>
        <div className="mt-3">
          <label className="form-label">Select Pages: {rangeValue}</label>
          <input
            type="range"
            className="form-range"
            min="1"
            max="10"
            value={rangeValue}
            onChange={(e) => setRangeValue(e.target.value)}
          />
        </div>
      </div>

      {/* Chat Section */}
      <div className="d-flex flex-column align-items-center w-75">
        <Card className="w-100 max-w-2xl h-75 d-flex flex-column p-3 shadow-lg rounded-4 bg-white overflow-auto" style={{minHeight:'85vh'}}>
          <Card.Body className="d-flex flex-column gap-3 overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex flex-column p-3 rounded-4 shadow-sm mb-2 text-break ${
                  msg.type === "user"
                    ? "bg-primary text-white align-self-end"
                    : "bg-secondary text-white align-self-start"
                }`}
              >
                {typeof msg.text === "string" ? (
                  <div>{msg.text}</div>
                ) : (
                  msg.text
                )}
                {msg.file && (
                  <div className="mt-2">
                    <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-white text-decoration-underline">
                      View PDF
                    </a>
                  </div>
                )}
                {msg.image && (
                  <div className="mt-2">
                    <img src={msg.image} alt="User Image" className="img-fluid" />
                  </div>
                )}
              </div>
            ))}
          </Card.Body>
        </Card>

        <InputGroup className="w-100 mt-3 rounded-4 shadow-sm overflow-hidden">
          {/* PDF File Upload */}
          <InputGroup.Text as="label" className="btn btn-outline-secondary">
            <CloudUpload size={20} />
            <input type="file" accept="application/pdf" className="d-none" onChange={handleFileChange} />
            Upload PDF
          </InputGroup.Text>
          
          {/* Image File Upload */}
          <InputGroup.Text as="label" className="btn btn-outline-secondary ms-2">
            <CloudUpload size={20} />
            <input type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
            Upload Image
          </InputGroup.Text>

          {/* Text Input */}
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-0 px-3"
          />
          
          <Button onClick={handleSend} variant="primary">
            <Send size={20} />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatComponent;
