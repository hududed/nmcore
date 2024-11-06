
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import sgMail from "@sendgrid/mail";

initializeApp();

const sendgridApiKey = defineSecret('SENDGRID_KEY');

export const sendEmail = onRequest(
  { secrets: [sendgridApiKey], cors: true },
  async (req, res) => {
      console.log("Endpoint hit");
      sgMail.setApiKey(sendgridApiKey.value());
      const { email, fullName } = req.body;

      const msg = {
        to: email,
        from: "hud@nmcore.com", 
        subject: "Welcome to my awesome app!",
        text: `Hello ${fullName}, welcome to our app!`,
        html: `<strong>Hello ${fullName}, welcome to our app!</strong>`,
      };

      console.log("Form submitted");
      try {
        const output = await sgMail.send(msg);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).json(output);
      } catch (error) {
        console.error("Error sending email:", error);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(500).json({ error: 'Error sending email' });
      }
    }
);