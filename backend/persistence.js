let _user = [
    { username: "test", firsName: "wow", lastName: "yo", password: "test" },
    { username: "test2", firsName: "hey", lastName: "boom", password: "test"},
];

const getAllUsers = () => _user;

const addUser = (username, firsName, lastName, password) => {
    _user.push({ username: username, firsName: firsName, lastName: lastName, password: password });
}

const removeUser = (username) => {
    let found = _user.findIndex(user => user.username == username);
    _user.splice(found, 1);
}

const editUser = (username, firsName, lastName) => {
    let found = _user.findIndex(user => user.username == username);
    _user[found].firsName = firsName;
    _user[found].lastName = lastName;
}

const singleUser = (username) => _user.filter(user => username === user.username);

module.exports = { getAllUsers, removeUser, addUser, editUser, singleUser};