import bcrypt from "bcrypt"
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config()
import pg from 'pg'
// import { readFileSync, writeFileSync } from "fs";
const saltRounds = 10;
const filePath = './password.txt'
// const myPlaintextPassword = process.argv[2] || 's0/\/\P4$$w0rD';

const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`,
   ssl: {
      rejectUnauthorized: false
   }
});

// console.log(process.env.DB_URL)

const initializeDatabase = async () => {
   console.log('Initializing dota database...');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users_test (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
   `;

   try {
      const client = await pool.connect();
      await pool.query(createTableQuery);
      console.log('The server is ready to go.');
   } catch (error) {
      console.error('Error initializing database:', error.message);
      console.error('Full error:', error);
      throw error;
   }
};

async function registerEmail(email, hashPassword) {
   try {
    const query = `
        INSERT INTO users_test (
            email, password
            
        ) 
        VALUES ($1, $2) 
        RETURNING id, email`;

   const values = [email, hashPassword];

      const res = await pool.query(query, values);
      console.log('user додано:', res.rows[0]);
   } catch (err) {
      console.error('Error:', err.message);
   }

}

async function getAllUsers() {
    
    const res = await pool.query('SELECT * FROM users_test');
    
    console.table(res.rows)    
}

async function userExists(id) {
   const res = await pool.query('SELECT * FROM users_test WHERE id = $1', [id]);
   return res.rows.length > 0;
}

async function deleteUser(id) {

   if(isNaN(id) || id <= 0){
      console.log("Помилка! ви написали id не числом, або ваше значення id <= 0 ");
      return;
   }

   if (!(await userExists(id))) {
      console.error(`Помилка: Юзера з ID ${id} не знайдено`);
      return;
   }

   await pool.query('DELETE FROM users_test WHERE id = $1', [id]);
   console.log(`The user with ID ${id} has been removed from the database..`);
}

async function login(email, password) {
    try {
        const res = await pool.query('SELECT * FROM users_test WHERE email = $1', [email]);
        const user = res.rows[0];
        if (!user) {
            console.log('User not found');
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('Login successful!');
            return;
        } else {
            console.log('Incorrect password or email.');
            return;
        }
    } catch (error) {
        console.error('Error during login:', error);
        return;
    }
}

const email = process.argv[3]
const password = process.argv[4]

switch(process.argv[2]) {

   case "list": {
      await getAllUsers();
      break;
   }
   case "register":{ 
      if (process.argv.length < 5 || !email || !password){
         console.log("Something went wrong")
         console.log("How to use `register`: node `your_file_name.js` register <email> <password>")
         console.log("Example: node dataBase.js register dffas@gmail.com 123123")
         break;
   } else {
    await registerEmail(email, password);
   }

    break;
   
}

    case "login":{
        if (process.argv.length < 5 || !email || !password){
        console.log("Something went wrong")
        console.log("How to use `login`: node `your_file_name.js` login <email> <password>")
        console.log("Example: node dataBase.js login dffas@gmail.com 123123")
        break;
        } else{
            await login(email, password);
        }
        break;
    }
    case "delete":{
        if(process.argv.length < 4){
        console.log("Something went wrong")
        console.log("How to use `delete`: node `your_file_name.js` delete <id>")
        console.log("Example: node dataBase.js delete 1")
        break;
        }
      const id = parseInt(process.argv[3]);

      if (isNaN(id) || id <= 0){
        console.log("Check if you typed id correctly")
        break;
      }
      await deleteUser(id);
      break;
    }
}


await pool.end();
