const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
// to connect to our postgres database
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});
// to access something from the users table we need a promise (.then) - we get an empty array so we know it is connected
// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

const app = express();
// need the below to parse json:
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


// Until I get to learn databases, going to use a variable to store users for now:
const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			// how many times john has submitted photos
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
}
// create a route to make sure everything is working - we test this in Postman
app.get('/', (req, res) => {
	res.send('this is working');
	// res.send(database.users);
	// If we look in Postman we only get first 2 users
  /* So what just happened? Well this is another good case for why we need a database.
	The reason that Ann wasn't added the first time around is because I changed the root route to include 'database.users', which meant the Nodemon had to restart; the server had to restart and start over.

	And because these are JavaScript variables every time we restart the server this gets run all over again.

	So the database initiates with just the two users.

	Again we don't really use variables to store information that we need to what we call 'persist' – that is to last and be memorized by the system. Databases are really really good because they run on disk somewhere out there in the world and they're really really good at keeping this information and not going down or if they do go down that they have backups so that users always get at it and we don't lose any information.
	*/

})

// Instead of res.send we can use res.json and there's a slight difference in what we receive. We receive a JSON string this way.
// We want to check whatever the user enters on the front-end – it's going to come back here in the response or in the request and we want to check it with our current list of users to make sure that their passwords match.
app.post('/signin', (req, res) => {
	// In Postman we add in the body - json to test -> 
	/*{
    "email": "john@gmail.com",
    "password": "cookies"
	}*/
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		// res.json('success')
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
	// res.send('signin')
	// res.json('signin')
})

app.post('/register', (req, res) => {
	/*
		In register on POSTMAN we put in body - json:
		{
    	"email": "ann@gmail.com",
    	"password": "apples", 
    	"name": "Ann"
		}
	*/
	// Using destructuring we grab (GET) what we need from req.body:
	const { email, name, password } = req.body;
	// bcrypt.hash(password, null, null, function(err, hash) {
		// Store hash in your password DB.
	// });

	// We want to create a new user:
	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	// password: password,
	// 	entries: 0,
	// 	joined: new Date()
	// })
	// We can now do above but connect to database - use Postman to test and then SELECT * FROM users; in command line psql
	db('users')
		// return all users using help from knex:
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		// .then(console.log);
		// If we get a response:
		.then(user => {
			res.json(user[0]);		
		})
		.catch(err => res.status(400).json('Unable to register'));
	// we want the response to add new user that was created
	// res.json(database.users[database.users.length-1]);
})

// By using :id it means we can have anything e.g. 87374 and it will get the user id from the req.params property
app.get('/profile/:id', (req, res) => {
	// First we want to grab the parameter id
	const { id } = req.params;
	// let found = false;
	// // We have to loop through ids:
	// database.users.forEach(user => {
	// 	if(user.id === id) {
	// 		found = true;
	// 		return res.json(user);
	// 	}
	// })

	// Now our database is connected we can do:
	db.select('*').from('users')
		// .where({id: id}) - we can destructure to look like:
		.where({id})
		.then(user => {
			// console.log(user[0]);
			// If array of user is not 0 (empty)
			if(user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('Error getting user'))
	
	// if(!found) { 
	// 	res.status(400).json('no such user');
	// }
})

// copying function as above but adding entries plus 1 if user found
// TO test in POSTMAN - in body type under PUT: { "id": "123" }
app.put('/image', (req, res) => {
	// First we want to grab the body id
	const { id } = req.body;
	// let found = false;
	// // We have to loop through ids:
	// database.users.forEach(user => {
	// 	if(user.id === id) {
	// 		found = true;
	// 		user.entries++;
	// 		return res.json(user.entries);
	// 	}
	// })
	// if(!found) { 
	// 	res.status(400).json('no such user');
	// }

	// Implementing for database:
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			// console.log(entries[0]);
			res.json(entries[0])
		})
		.catch(err => res.status(400).json('Unable to get entries'))
})


// BCRYPT FOR HASHING PASSWORDS
// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


// we can send app.listen a second parameter, which is a function within this function, it will run right after the 'listen' happens on port 3000.
app.listen(3000, () => {
	console.log('app is running on port 3000');
})

/*
ROUTES:
root (/) --> response = this is working

/signin --> will be a POST request (json) will respond with either a success or fail.  As it is a password need to POST so it is inside the body using https and not query string.

/register - POST request - we want to add the date to a variable in our server - will return new user object

/profile/:userId --> [homescreen] will have a profile with user id so we need to GET user information

/image --> PUT as we are updating rank score, the user already exists

*/