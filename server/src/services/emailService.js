const nodemailer = require('nodemailer');

// EmailService: handles email notifications via Gmail SMTP
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  // Send order confirmation email
  async sendOrderConfirmation(order) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: order.email,
      subject: `Order #${order.id} Confirmed - CubeTech Shop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Order Confirmed!</h1>
          <p>Thank you for your order.</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p><strong>Order #:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Total:</strong> ₱${parseFloat(order.total).toFixed(2)}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p style="color: #6b7280;">Thank you for shopping with CubeTech Shop!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Order confirmation sent to ${order.email}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Failed to send order confirmation: ${error.message}`);
      return false;
    }
  }

  // Send order status update email
  async sendStatusUpdate(order, oldStatus, newStatus) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: order.email,
      subject: `Order #${order.id} Status Update - CubeTech Shop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Order Status Updated</h1>
          <p>Your order status has been updated.</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p><strong>Order #:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Previous Status:</strong> ${oldStatus}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p style="color: #6b7280;">Thank you for shopping with CubeTech Shop!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Status update sent to ${order.email}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Failed to send status update: ${error.message}`);
      return false;
    }
  }

  // Send welcome email to new customer
  async sendWelcome(customer) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: customer.email,
      subject: 'Welcome to CubeTech Shop!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome!</h1>
          <p>Thank you for registering with CubeTech Shop.</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p><strong>Name:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p>Start shopping today!</p>
          <p style="color: #6b7280;">Thank you for joining CubeTech Shop!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Welcome email sent to ${customer.email}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Failed to send welcome email: ${error.message}`);
      return false;
    }
  }

  // Send order cancellation email
  async sendOrderCancelled(order) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: order.email,
      subject: `Order #${order.id} Cancelled - CubeTech Shop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Order Cancelled</h1>
          <p>Your order has been cancelled.</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p><strong>Order #:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <hr style="border: 1px solid #e5e7eb;">
          <p>If you have any questions, please contact us.</p>
          <p style="color: #6b7280;">Thank you for shopping with CubeTech Shop!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Cancellation email sent to ${order.email}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL] Failed to send cancellation email: ${error.message}`);
      return false;
    }
  }
}

module.exports = new EmailService();
