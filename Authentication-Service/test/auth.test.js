const request = require('supertest');

const baseURL = 'http://localhost:8000'; // Replace with your Go server URL if different

describe('Authentication API Integration Tests', () => {
  
  // Test the signup endpoint for valid data
  test('POST /signup should return success message', async () => {
    const response = await request(baseURL)
      .post('/signup')
      .send({ username: 'testuser', password: 'testpass' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Signup successful');
  });

  // Test the login endpoint for valid data
  test('POST /login should return success message', async () => {
    const response = await request(baseURL)
      .post('/login')
      .send({ username: 'testuser', password: 'testpass' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  // Test if GET request to /signup returns 405 Method Not Allowed
  test('GET /signup should return 405 Method Not Allowed', async () => {
    const response = await request(baseURL)
      .get('/signup')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(405);  // Method Not Allowed
  });

  // Test if GET request to /login returns 405 Method Not Allowed
  test('GET /login should return 405 Method Not Allowed', async () => {
    const response = await request(baseURL)
      .get('/login')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(405);  // Method Not Allowed
  });

  // Test signup with an already existing username
  test('POST /signup with existing username should return error message', async () => {
    // First, signup with a new user
    await request(baseURL)
      .post('/signup')
      .send({ username: 'existinguser', password: 'password123' })
      .set('Content-Type', 'application/json');
    
    // Now try to signup with the same username
    const response = await request(baseURL)
      .post('/signup')
      .send({ username: 'existinguser', password: 'newpassword' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400); // Bad Request
    expect(response.body.message).toBe('Username already exists');
  });


  // Test login with incorrect password
  test('POST /login with incorrect password should return error message', async () => {
    const response = await request(baseURL)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(401); // Unauthorized
    expect(response.body.message).toBe('Invalid username or password');
  });
});
