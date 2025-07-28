import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const getOrderStatusEmailTemplate = (
  customerName: string,
  orderNumber: string,
  status: string,
  orderItems: Array<{ productName: string; quantity: number; totalPrice: number }>
) => {
  const statusMessages = {
    pending: {
      subject: `Order Received - ${orderNumber}`,
      title: 'Order Received! 📋',
      message: 'Thank you for your order! We have received your order and will process it soon.',
      color: '#f59e0b',
      icon: '⏳'
    },
    confirmed: {
      subject: `Order Confirmed - ${orderNumber}`,
      title: 'Order Confirmed! ✅',
      message: 'Great news! Your order has been confirmed and we are preparing it for you.',
      color: '#3b82f6',
      icon: '✅'
    },
    preparing: {
      subject: `Order Being Prepared - ${orderNumber}`,
      title: 'Order in Kitchen! 👨‍🍳',
      message: 'Our chefs are now preparing your delicious order with love and care.',
      color: '#f97316',
      icon: '👨‍🍳'
    },
    ready: {
      subject: `Order Ready for Pickup - ${orderNumber}`,
      title: 'Order Ready! 📦',
      message: 'Your order is ready for pickup! Please collect it at your earliest convenience.',
      color: '#8b5cf6',
      icon: '📦'
    },
    delivered: {
      subject: `Order Delivered - ${orderNumber}`,
      title: 'Order Delivered! 🚚',
      message: 'Your order has been successfully delivered. Thank you for choosing AbhiruchiEats!',
      color: '#10b981',
      icon: '🚚'
    },
    cancelled: {
      subject: `Order Cancelled - ${orderNumber}`,
      title: 'Order Cancelled ❌',
      message: 'Your order has been cancelled. If you have any questions, please contact our support team.',
      color: '#ef4444',
      icon: '❌'
    }
  };

  const statusInfo = statusMessages[status as keyof typeof statusMessages] || statusMessages.pending;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.subject}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #16a34a;
          margin-bottom: 10px;
        }
        .status-badge {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          font-size: 18px;
          margin: 20px 0;
          background-color: ${statusInfo.color};
        }
        .order-details {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .order-items {
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .item:last-child {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          color: #6b7280;
        }
        .contact-info {
          background: #fef3c7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🍛 AbhiruchiEats</div>
          <h1>${statusInfo.title}</h1>
          <div class="status-badge">
            ${statusInfo.icon} ${status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>

        <p>Dear ${customerName},</p>
        <p>${statusInfo.message}</p>

        <div class="order-details">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="order-items">
          <h3>Order Items</h3>
          ${orderItems.map(item => `
            <div class="item">
              <span>${item.productName} (×${item.quantity})</span>
              <span>₹${item.totalPrice.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        ${status === 'ready' ? `
          <div class="contact-info">
            <h4>📍 Pickup Information</h4>
            <p>Please visit our store to collect your order. Don't forget to bring your order number!</p>
          </div>
        ` : ''}

        ${status === 'delivered' ? `
          <div class="contact-info">
            <h4>🌟 Rate Your Experience</h4>
            <p>We hope you enjoyed your meal! Your feedback helps us serve you better.</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for choosing AbhiruchiEats!</p>
          <p>For any questions, contact us at support@abhiruchieats.com</p>
          <p style="font-size: 12px; color: #9ca3af;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order status update email
export const sendOrderStatusEmail = async (
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  status: string,
  orderItems: Array<{ productName: string; quantity: number; totalPrice: number }>
) => {
  try {
    const statusMessages = {
      pending: `Order Received - ${orderNumber}`,
      confirmed: `Order Confirmed - ${orderNumber}`,
      preparing: `Order Being Prepared - ${orderNumber}`,
      ready: `Order Ready for Pickup - ${orderNumber}`,
      delivered: `Order Delivered - ${orderNumber}`,
      cancelled: `Order Cancelled - ${orderNumber}`
    };

    const subject = statusMessages[status as keyof typeof statusMessages] || `Order Update - ${orderNumber}`;
    const htmlContent = getOrderStatusEmailTemplate(customerName, orderNumber, status, orderItems);

    const mailOptions = {
      from: `"AbhiruchiEats" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error };
  }
};
