import bcrypt from "bcrypt"
import { readFileSync } from "node:fs";
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//     console.log(hash)
// });

bcrypt.compare(
    myPlaintextPassword,
    '$2b$10$lGpT1MVA.9EdnPW8uHp3xOdM3w.ilUv12VKfMDtY33l8GCruC0Aia'
).then((data) => {
    console.log(data)
})

let pass = " "
try{
    pass = readFileSync('password.txt');
    pass = pass.trim();
}   
catch(error){
    console.log(error.message);
}
    console.log(pass.toString()) 

if (!pass) {
    fs.writeFileSync('password.txt', 'pass');
}
    else{
        // check if password and hash matches
    }
