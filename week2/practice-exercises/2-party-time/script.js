
/**
 * 3: Party time
 * 
 * After reading the documentation make a request to https://reservation100-sandbox.mxapps.io/rest-doc/api
 * and print the response to the console. Use async-await and try/catch.
 * 
 * Hints:
 * - make sure to use the correct headers and http method in the request
 */

import fetch from 'node-fetch';
// Replace with your desired name
const guestName = 'Your Name Here';

async function makeReservation() {
  try {
    // API details from the documentation
    const url = 'https://reservation100-sandbox.mxapps.io/api/v1/reservations';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ guestName }); // Format request body

    // Make the POST request with async/await
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    // Check response status
    if (!response.ok) {
      throw new Error(`Reservation failed with status: ${response.status}`);
    }

    // Parse and log the response
    const responseData = await response.json();
    console.log('Reservation response:', responseData);
  } catch (error) {
    console.error('Error making reservation:', error);
  }
}

makeReservation();
