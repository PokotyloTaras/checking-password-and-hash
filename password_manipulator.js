import fs from 'fs';
import readline from "readline-sync";
import bcrypt from "bcrypt"

const saltRounds = 10;
const filePath = './password.txt'

const userInput = readline.question('Enter password: ');
let data = ""

try {
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, 'utf8').trim();
    }
} catch (error) {
    console.log("Problem:", error.message);
}

if (data === '' ) {
   const hash = bcrypt.hashSync(userInput, saltRounds);
   fs.writeFileSync(filePath, hash);
    console.log('password is saved')
    
}

    else{
      const isMatch = bcrypt.compareSync(userInput, data);
    
    if (isMatch) {
        console.log('True password');
    } else {
        console.log('Wrong password!');
    }
}
