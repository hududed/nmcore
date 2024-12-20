// filepath: /Users/hfox/Developments/nmcore/nmcore-landing/functions/src/sendEmail.ts
import { render } from '@react-email/components';
import sgMail from "@sendgrid/mail";
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import { InviteCollaboration } from './email/invite-collaboration'; // Adjust the import path as needed

const sendgridApiKey = defineSecret('SENDGRID_KEY');

export const sendEmail = onRequest(
  { secrets: [sendgridApiKey], cors: true },
  async (req, res) => {
    sgMail.setApiKey(sendgridApiKey.value());
    const { email, fullName } = req.body;

    const emailHtml = await render(createElement(InviteCollaboration, { fullName }));

    const msg = {
      to: email,
      from: "Hud Wahab <hud@nmcore.com>", 
      subject: "Invitation to collaborate with nmcore",
      html: emailHtml,
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