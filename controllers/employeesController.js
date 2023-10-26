const data = {
  employees: require('../models/employees.json'),
  setEmployees: function (data) { this.employees = data }
};


const getAllEmployees = (req, res) => {
  res.json(data.employees);
}

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  if (!newEmployee.firstname || !newEmployee.lastname){
    res.status(400).json({ 'message': 'first and last name is required' });
  }
  if (typeof newEmployee.firstname !== "string" || typeof newEmployee.lastname !== "string"){
    res.status(400).json({ 'message': 'first and last name must be a string' });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
}

const updateEmployee = (req, res) => {
  if (typeof parseInt(req.body.id) !== "number"){
    res.status(400).json({ 'message': 'employee id must be a number' });
  }
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    res.status(400).json({ 'message': 'employee not found' });
  }
  if (!req.body.firstname || req.body.lastname) {
    res.status(400).json({ 'message': 'first and last name is required' });
  }
  if (typeof req.body.firstname !== "string" || req.body.lastname !== "string"){
    res.status(400).json({ 'message': 'first and last name must be a string' });
  }
  employee.firstname = req.body.firstname;
  employee.lastname = req.body.lastname;

  const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  res.status(203).json(data.employees);
}

const deleteEmployee = (req, res) => {
  if (typeof parseInt(req.body.id) !== "number"){
      res.status(400).json({ 'message': 'employee id must be a number' });
    }
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
  if (!employee) {
    res.status(400).json({ 'message': 'employee not found' });
  }
   
  const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id));
  data.setEmployees([...filteredArray]);
  res.status(404).json(data.employees);
}

const getEmployee = (req, res) => {
  if (typeof parseInt(req.params.id) !== "number"){
    res.status(400).json({ 'message': 'employee id must be a number' });
  }
  const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));
  if (!employee) {
    res.status(400).json({ 'message': 'employee not found' });
  }
  res.status(203).json(employee);
}

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
}
