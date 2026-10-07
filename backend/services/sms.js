// backend/services/sms.js — OTP delivery
const config = require('../config');

// Phone login works when an SMS provider is configured, or outside production
// (where the code is returned to the client so the flow can be exercised).
const smsEnabled = () => config.sms.provider === 'twilio' || !config.isProduction;
const devMode = () => config.sms.provider !== 'twilio' && !config.isProduction;

async function sendOtp(phoneE164, code) {
  const text = `${code} is your NIVRA verification code. It expires in 10 minutes. Do not share it.`;

  if (config.sms.provider === 'twilio') {
    const { twilioSid, twilioToken, twilioFrom } = config.sms;
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: phoneE164, From: twilioFrom, Body: text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw Object.assign(new Error(`SMS delivery failed (${res.status})`), { detail, status: 502 });
    }
    return { delivered: true };
  }

  if (devMode()) {
    if (!config.isTest) console.log(`[dev SMS] ${phoneE164}: ${text}`);
    return { delivered: false, devCode: code };
  }

  throw Object.assign(new Error('Mobile sign-in is not configured.'), { status: 503 });
}

module.exports = { sendOtp, smsEnabled, devMode };
