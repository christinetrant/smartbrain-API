const handleSignin = (req, res, db, bcrypt) => {
	// In Postman we add in the body - json to test -> 
	/*{
    "email": "john@gmail.com",
    "password": "cookies"
	}*/
	// if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
	// 	// res.json('success')
	// 	res.json(database.users[0]);
	// } else {
	// 	res.status(400).json('error logging in');
	// }

	// Instead of res.send we can use res.json and there's a slight difference in what we receive. We receive a JSON string this way.
	// res.send('signin')
	// res.json('signin')

	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			// console.log(data);
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			// console.log(isValid)
			if(isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						// console.log(user[0])
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}