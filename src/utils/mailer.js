const nodemailer = require('nodemailer');
require('dotenv').config();

// build transporter lazily because we might need to call async createTestAccount
let transporterPromise;

async function createTransporter() {
    // if environment is not configured with real SMTP, fall back to ethereal test account
    const usingPlaceholder =
        !process.env.EMAIL_HOST ||
        process.env.EMAIL_HOST === 'smtp.example.com';

    if (usingPlaceholder) {
        console.warn(
            'E-mail SMTP settings not found; using ethereal.test account for development'
        );
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal user:', testAccount.user);
        console.log('Ethereal pass:', testAccount.pass);
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const transportOptions = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    };
    console.log('Creating real SMTP transporter with', transportOptions.host);
    return nodemailer.createTransport(transportOptions);
}

async function getTransporter() {
    if (!transporterPromise) {
        transporterPromise = createTransporter().then(async (t) => {
            // verify connection/log errors
            try {
                await t.verify();
                console.log('SMTP transporter verified');
            } catch (err) {
                console.error('SMTP verification failed:', err.message || err);
            }
            return t;
        });
    }
    return transporterPromise;
}

async function sendMail(options) {
    const transporter = await getTransporter();
    // ensure default from address
    options.from = options.from || process.env.EMAIL_FROM || process.env.EMAIL_USER;
    try {
        const info = await transporter.sendMail(options);
        // if using ethereal, log preview URL
        if (info && nodemailer.getTestMessageUrl) {
            const url = nodemailer.getTestMessageUrl(info);
            if (url) {
                console.log('Preview email at:', url);
            }
        }
        return info;
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
}

module.exports = {
    sendMail,
};
