const express = require('express');

const app = express();
// need the below to parse json:
app.use(express.urlencoded({extended: false}));
app.use(express.json());
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
})

// Instead of res.send we can use res.json and there's a slight difference in what we receive. We receive a JSON string this way.
// We want to check whatever the user enters on the front-end – it's going to come back here in the response or in the request and we want to check it with our current list of users to make sure that their passwords match.
app.post('/signin', (req, res) => {
	// In Postman we add in the body - json -> 
	/*{
    "email": "john@gmail.com",
    "password": "cookies"
	}*/
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json('Success')
	} else {
		res.status(400).json('error logging in');
	}
	// res.send('signin')
	res.json('signin')
})
// we can send app.listen a second parameter, which is a function within this function, it will run right after the 'listen' happens on port 3000.
app.listen(3000, () => {
	console.log('app is running on port 3000');
})

/*
ROUTES:
root (/) --> response = this is working

/signin --> will be a POST request (json) will respond with either a success or fail.  As it is a password nned to POST so it is inside the body using https and not query string.

/register - POST request - we want to add the date to a variable in our server - will return new user object

/profile/:userId --> will have a profile with user id so we need to GET user information

/image --> PUT as we are updating rank score

*/