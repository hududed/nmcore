// response emails
export type EmailData = {
  name: string;
  orderId: string;
  email: string;
}

export type EmailType = 'confirmation' | 'shippingNotification';