/* eslint-disable @typescript-eslint/no-var-requires */
const { createInterface } = require('readline');
const { Writable } = require('stream');
const { hash } = require('bcrypt');
const { config } = require('dotenv');
const { connect, Schema, model } = require('mongoose');

config();

const saltRounds = 10;
const mutableStdout = new Writable({
  write: function (chunk, encoding, callback) {
      process.stdout.write(chunk, encoding);
    callback();
  }
});

class User extends Schema {
  constructor() {
    super({
      name: String,
      email: String,
      password: String,
      company: String,
      role: String,
      resetToken: String,
      activated: Boolean,
    })
  }
}

const UserClass = model('user', new User());

const rl = createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true,
});

(async () => {
  const promisedQuestion = (question: string): Promise<string> => new Promise((resolve) => rl.question(question, (answer: string) => resolve(answer)));

  const email = await promisedQuestion('Type a email?');
  const password = await promisedQuestion('Type a password?');

  const hashedPassword = await hash(password, saltRounds);

  const db = process.env.NODE_ENV === 'development'
    ? `mongodb://localhost/${process.env.MONGODB_DB}`
    : `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@localhost:27017/${process.env.MONGODB_DB}`;

  await connect(db);

  const user = new UserClass({
    email,
    password: hashedPassword,
    role: 'admin',
    name: email.split('@')[0],
    activated: true,
  });

  await user.save();

  console.log(email, password, hashedPassword);
})()
