const supertest = require('supertest');
const app = require('../index');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const api = supertest(app);

beforeAll(async () => {
  // Executes before all the test cases
  await User.deleteMany({});
});

test('Register User', async () => {
  const res = await api.post('/auth/signup')
    .send({
      password: 'test',
      email: 'test@gmail.com',
    })
    .expect(201);
  expect(res.body.user.email).toBe('test@gmail.com');
});

test('Duplicate email cannot be registered', async()=>{
    res=await api.post('/auth/signup').send({
            password:'test',
            email:'test@gmail.com',
    }).expect(409)
    expect(res.body.error).toBeDefined()
    expect(res.body.error).toMatch(/Email already exists/)
})

test('All fields are necessary to register',async()=>{
    res=await api.post('/auth/signup')
    .send({
        password:'test',
    }).expect(400)

    expect(res.body.error).toBeDefined()
    expect(res.body.error).toMatch(/cannot be left empty/)
})

test('Login User', async () => {
    const res = await api.post('/auth/login')
      .send({
        password: 'test',
        email: 'test@gmail.com',
      })
      .expect(200);
      expect(res.body.message).toMatch(/success/)

  });

afterAll(async () => {
  await mongoose.connection.close();
});
