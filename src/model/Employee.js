const mongoose = require('mongoose');
mongoose.connect('mongodb://3.111.125.73/employee-db', {useNewUrlParser: true});
const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    screenshotInterval: Number,
    idleTimeLimit: Number
});

const Employee = mongoose.model('Employee', employeeSchema);


module.exports = Employee;