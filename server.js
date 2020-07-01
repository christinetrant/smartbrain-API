const express = require('express');

const app = express();

// create a route to make sure everything is working - we test this in Postman
app.get('/', (req, res) => {
	res.send('this is working');
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