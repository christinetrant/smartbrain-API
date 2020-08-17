const handleProfile = (req, res, db) => {
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
}

module.exports = {
	handleProfile: handleProfile
}