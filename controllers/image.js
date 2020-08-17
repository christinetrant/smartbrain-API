// copying function as above but adding entries plus 1 if user found
// TO test in POSTMAN - in body type under PUT: { "id": "123" }
const handleImage = (req, res, db) => {
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
}

module.exports = {
	handleImage: handleImage
}