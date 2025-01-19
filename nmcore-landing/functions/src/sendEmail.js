import { render } from '@react-email/components';
import sgMail from "@sendgrid/mail";
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import ConfirmationEmail from './email/confirmation-email.js';
import ShippingNotificationEmail from './email/shipping-notification-email.js';

const sendgridApiKey = defineSecret('SENDGRID_KEY');

const emailTemplates = {
  confirmation: ConfirmationEmail,
  shippingNotification: ShippingNotificationEmail,
  // Add other email templates here
};

const sendEmailInternal = async (emailType, emailData) => {
  sgMail.setApiKey(sendgridApiKey.value());

  const EmailComponent = emailTemplates[emailType];
  if (!EmailComponent) {
    throw new Error('Invalid email type');
  }

  const emailHtml = await render(createElement(EmailComponent, emailData));

  const msg = {
    to: emailData.email,
    from: "Hud Wahab <hud@nmcore.com>",
    subject: getSubject(emailType),
    html: emailHtml,
  };

  console.log("Form submitted");
  try {
    const output = await sgMail.send(msg);
    console.log("Email sent successfully:", output);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error('Error sending email');
  }
};

export const sendEmail = onRequest({ secrets: [sendgridApiKey], cors: true }, async (req, res) => {
  const { emailType, emailData } = req.body;

  try {
    await sendEmailInternal(emailType, emailData);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Error sending email' });
  }
});

function getSubject(emailType) {
  switch (emailType) {
    case 'confirmation':
      return 'Order Confirmation';
    case 'shippingNotification':
      return 'Shipping Notification';
    // Add other cases for different email types
    default:
      return 'Notification';
  }
}