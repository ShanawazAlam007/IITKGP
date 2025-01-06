const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const { User }=require('../backend/db/index.js');
const app = express();
app.use(express.json());
app.use(cors());


app.post('/verify-inquiry/:id', async (req, res) => {
  const { inquiryId, userName, userEmail } = req.body;

  console.log('Verifying user:', userName, userEmail, inquiryId.inquiryId);
  let id=inquiryId.inquiryId;
  console.log(id);
  
  try {
    // Fetch data from Persona API
    const response = await axios.get(`https://withpersona.com/api/v1/inquiries/${id}`, {
      headers: {
        Authorization: `Bearer api key`, // Replace with your API key
      },
    });

    console.log('Persona Response:', response.data);

    // Safely extract name fields from the response
    const { attributes } = response.data.data;
    const firstName = attributes['name-first'] || 'N/A';
    const middleName = attributes['name-middle'] || 'N/A';
    const lastName = attributes['name-last'] || 'N/A';

    console.log(`First Name: ${firstName}`);
    console.log(`Middle Name: ${middleName}`);
    console.log(`Last Name: ${lastName}`);

    // Find the user in the database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Verify name matches
    if (user.firstName !== firstName || user.lastName !== lastName) {
      console.log('Name mismatch. The name provided during verification does not match our records.');
      return res.status(400).send('Name mismatch. The name provided during verification does not match our records.');
    }

    res.status(200).send({ message: 'Verification successful' });
  } catch (error) {
    console.error('Error verifying user:', error.response?.data || error.message);
    res.status(500).send({ error: 'Verification failed', details: error.message });
  }
});

app.listen(8080, () => console.log('Server running on port 8080'));
