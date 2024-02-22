import express from 'express';
import bodyParser from 'body-parser';
import { createTransport } from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());
// Route handler for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!'); // You can send any response here
});

//this is for the request quote
// app.post('/api/send-quote-email', async (req, res) => {
//   const { email } = req.body;
//   const subject = 'Request Quote';
//   const message = `User's email address: ${email}`;

//   // Set up Nodemailer transporter with SMTP configuration
//   const transporter = createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//       user: process.env.EMAIL_ADDRESS, // Your email address
//       pass: process.env.EMAIL_PASSWORD // Your email password
//     }
//   });

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_ADDRESS,
//       to: process.env.EMAIL_ADDRESS,
//       subject: subject,
//       text: message
//     });

//     console.log('Email sent successfully');
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ success: false, error: 'Failed to send email' });
//   }
// });



//this is for the contact us form
// Route handler for sending email
app.post('/api/send-contact-email', async (req, res) => {
    const { name, email, phoneNumber, message } = req.body;
    const subject = 'Contact Form Submission';
    const text = `
      Name: ${name}
      Email: ${email}
      Phone Number: ${phoneNumber}
      Message: ${message}
    `;
  
    // Set up Nodemailer transporter with SMTP configuration
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: subject,
        text: text,
      });
      console.log('Email sent successfully');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });

//this is career form
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), 'uploads');
      // Check if the directory exists, create it if not
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      console.log('Upload Path:', uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, path.basename(file.originalname));
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'cv') {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return cb(new Error('Only PDF, DOC, or DOCX files are allowed'));
        }
      }
      cb(null, true);
    }
  });
  
  app.post('/api/send-career-application', upload.single('cv'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No CV file uploaded' });
    }
  
    const { name, email, experience, message} = req.body;
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "dreamzseo.pune@gmail.com",
        pass: "vzja ahlh avdf zyjm",
      },
    });
  
    const subject = 'Career Application Submission';
    const text = `
      Name: ${name}
      Email: ${email}
      Years of Experience: ${experience}
      Message: ${message}
    `;
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: subject,
        text: text,
        attachments: [
          {
            filename: req.file.originalname,
            content: req.file.buffer,
            contentType: req.file.mimetype, // Assuming mimetype is correctly set by multer
          },
        ],
      });
      console.log('Career application email sent successfully');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending career application email:', error);
      res.status(500).json({ success: false, error: 'Failed to send career application email' });
    }
  });

  
  //request quote form 
  app.post('/api/send-quote-email', async (req, res) => {
    const { name, email, phone, service } = req.body;
    const subject = 'Quote Request';
    const message = `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Service: ${service}
    `;
  
    // Set up Nodemailer transporter with SMTP configuration
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_ADDRESS, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password
      }
    });
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS, // Your email address where you want to receive the quote request
        subject: subject,
        text: message
      });
  
      console.log('Quote email sent successfully');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending quote email:', error);
      res.status(500).json({ success: false, error: 'Failed to send quote email' });
    }
  });


  


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
