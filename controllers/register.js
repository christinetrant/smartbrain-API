const handleRegister = (req, res, db, bcrypt) => {
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
	// return db('users')
	// 	// return all users using help from knex:
	// 	.returning('*')
	// 	.insert({
	// 		email: email,
	// 		name: name,
	// 		joined: new Date()
	// 	})
	// 	// .then(console.log);
	// 	// If we get a response:
	// 	.then(user => {
	// 		res.json(user[0]);		
	// 	})
	// 	.catch(err => res.status(400).json('Unable to register'));
	// we want the response to add new user that was created
	// res.json(database.users[database.users.length-1]);

	// We need to add password to login as well so above code isn't good enough!  We'll need to BEGIN TRANSACTION
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		// first transaction: insert into login the hash and email
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				// return all users using help from knex:
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				// .then(console.log);
				// If we get a response:
				.then(user => {
					res.json(user[0]);		
				})
		})
		// if all successful commit changes otherwise rollback
		.then(trx.commit)
    .catch(trx.rollback);
	})
	.catch(err => res.status(400).json('Unable to register'));
}

module.exports = {
	handleRegister: handleRegister
}