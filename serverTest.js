const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./backendTests'); // import your database connection
const multer = require('multer'); // for handling file uploads
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Middleware for logging request method and URL
app.use(bodyParser.json()); // for parsing application/json

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use an absolute path for reliability
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/test', (req, res) => {
    res.send('Test route working!');
});


// Route to handle form submission with file uploads
app.post('/submit', (req, res, next) => {
    // Error handling for multer
    upload.fields([{ name: 'photographs' }, { name: 'signature' }, { name: 'paymentProof' }])(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer-specific errors (e.g., file too large)
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'File upload error' });
        } else if (err) {
            // Handle other errors
            console.error('General error:', err);
            return res.status(500).json({ error: 'Unexpected error' });
        }
        next(); // Proceed to next middleware if no error
    });
}, async (req, res) => {

    console.log('Uploaded Files:', req.files);

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
    idProof,
    declaration,
    references_info,
    previousApplications,
    specialNeeds,
    } = req.body;

    // Uploaded files
    const photographs = req.files['photographs'] ? req.files['photographs'][0].path : null;
    const signature = req.files['signature'] ? req.files['signature'][0].path : null;
    const paymentProof = req.files['paymentProof'] ? req.files['paymentProof'][0].path : null;

    try {
        const query = `
            INSERT INTO application_form (
                full_name, date_of_birth, gender, nationality, marital_status,
                address, contact_details, highest_degree, other_degrees, marks,
                current_job, previous_jobs, skills, certifications, exam_center,
                category, photographs, signature, id_proof, declaration,
                references_info, previous_applications, special_needs, payment_proof
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
    references_info,
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
