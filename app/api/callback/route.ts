import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get the phone number from the form submission
    const { phone } = await request.json();

    // 2. Basic validation to make sure a phone number was sent
    if (!phone) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    // 3. Get your secret Make.com Webhook URL from environment variables
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      // This is a server error, not the user's fault
      console.error('MAKE_WEBHOOK_URL is not defined in environment variables');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // 4. Securely send the phone number to your Make.com scenario
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone }), // Send the phone number in a JSON object
    });

    // 5. Send a success message back to the website's form
    return NextResponse.json({ message: 'Callback initiated successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error processing callback:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}