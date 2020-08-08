const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
console.log(password)
const url =
    `mongodb+srv://fullstack:${password}@cluster0.invzc.mongodb.net/phonebook?retryWrites=true&w=majority`
    
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ))

console.log(url)
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 3) {
        Person.find({}).then(result => {
            console.log("Phonebook:")
            result.forEach( ({name,number}) => {
            console.log(`Name: ${name} Number: ${number}`)
            })
            mongoose.connection.close()
        })
    }   
  if (process.argv.length === 5) {
    const nameV = process.argv[3]
    const numberV = process.argv[4]

    const person = new Person({
    name: nameV,
    number: numberV,
    })

    person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
    console.log(`added ${nameV} number ${numberV} to phonebook`)
    })
}