// server.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./backendTests'); // import your database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // for parsing application/json

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const {
        fullName,
        dateOfBirth,
        gender,
        nationality,
        maritalStatus,
        address,
        contactDetails,
        highestDegree,
        otherDegrees,
        marks,
        currentJob,
        previousJobs,
        skills,
        certifications,
        examCenter,
        category,
        photographs,
        signature,
        idProof,
        declaration,
        referenceInfo,
        previousApplications,
        specialNeeds,
        paymentProof
    } = req.body;

    try {
        const query = `
            INSERT INTO application_form (
                full_name, date_of_birth, gender, nationality, marital_status,
                address, contact_details, highest_degree, other_degrees, marks,
                current_job, previous_jobs, skills, certifications, exam_center,
                category, photographs, signature, id_proof, declaration,
                reference_info, previous_applications, special_needs, payment_proof
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20,
                $21, $22, $23, $24
            ) RETURNING id;
        `;
        const values = [
            fullName,
            dateOfBirth,
            gender,
            nationality,
            maritalStatus,
            address,
            contactDetails,
            highestDegree,
            otherDegrees,
            marks,
            currentJob,
            previousJobs,
            skills,
            certifications,
            examCenter,
            category,
            photographs,
            signature,
            idProof,
            declaration,
            referenceInfo,
            previousApplications,
            specialNeeds,
            paymentProof
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Database insertion error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
