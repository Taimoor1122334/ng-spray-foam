import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware to parse json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(path.join(process.cwd(), '.')));

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Real POST API route for contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  
  // Basic validation
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (Name, Email, and Phone).'
    });
  }

  console.log('NG Spray Foam Contact Lead Received:', {
    name,
    email,
    phone,
    service: service || 'General Inquiry',
    message: message || '',
    receivedAt: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: `Thank you, ${name}! Your estimate request has been received. Our insulation specialist will call you shortly at ${phone}.`
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Development static server running on http://localhost:${PORT}`);
});
