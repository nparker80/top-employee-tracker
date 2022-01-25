const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db',
});

connection.connect();

function runEmployees() {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'option',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add roles',
                'Add employees',
                'Update employee roles',
                'Update employee manager',
                'View employee by manager',
                'Exit'
            ]
          }).then(answer => {

            switch (answer.option) {
                case "View all departments":
                    viewAllDepartments();
                    break;

                case "View all roles":
                    viewAllRoles();
                    break;

                case "View all employees":
                    viewAllEmployees();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Add employees":
                    addEmployee();
                    break;

                case "Update employee roles":
                    updateEmployeeRole();
                    break;

                case "Update employee manager":
                    updateManager()
                    break;
                case "View employee by manager":
                    viewEmployeeByManager()
                    break;
                case "Exit":
                    connection.end();
                    console.log('Have a good day');
                    break;
            }
        })
}
function viewAllDepartments() {
  connection.query(
      'SELECT * FROM Department', (err, res) => {
          if (err) {
              throw err;
          }
          console.table(res)
          runEmployees();
      }
  )
}

function viewAllRoles() {
  connection.query(
      'select ro.title as Role_title, ro.salary as Salary , dept.name as DepartmentName from Role ro left join department as dept on dept.id = ro.department_id', (err, res) => {
          if (err) {
              throw err;
          }
          console.table(res)
          runEmployees();
      }
  )
}

function viewAllEmployees() {
  const sql = 'Select emp.id as EmployeeID, concat(emp.first_name,"  ",emp.last_name ) as EmployeeName , ro.title as Job_tittle, ro.salary as Salary,dept.name as Department_Name,concat(emp2.first_name,"  ",emp2.last_name) as ManagerName from employees_db.employee as emp left join employees_db.employee as emp2 on emp2.id=emp.manager_id left join employees_db.Role as ro on emp.role_id=ro.id left join employees_db.department as dept on dept.id = ro.department_id';
  connection.query(
      sql, 
      (err, res) => {
          if (err) {
              throw err;
          }
          console.table(res)
          runEmployees();
      }

  )
}
function addDepartment() {
  inquirer.prompt([

      {
          type: 'input',
          name: 'department',
          message: 'Please add a department name:'
      }

  ]).then(answer => {
      console.log(answer);
      connection.query('INSERT INTO department SET?', { name: answer.department }, (err, res) => {
          if (err) throw err;
          console.log('Added new department')
          runEmployees();
      });
  });
}

function addRoles() {
  console.log('aa');

  // query all the depts
  connection.promise().query("SELECT * FROM Department")
      .then((res) => {
          // make the choice dept arr
          return res[0].map(dept => {
              return {
                  name: dept.name,
                  value: dept.id
              }
          })
      })
      .then((departments) => {

          return inquirer.prompt([

              {
                  type: 'input',
                  name: 'roles',
                  message: 'Please add a role:'
              },

              {
                  type: 'input',
                  name: 'salary',
                  message: 'Please enter a salary:'
              },

              {
                  type: 'list',
                  name: 'depts',
                  choices: departments,
                  message: 'Please select your department.'
              }
          ])
      })

      .then(answer => {
          console.log(answer);
          return connection.promise().query('INSERT INTO role SET ?', { title: answer.roles, salary: answer.salary, department_id: answer.depts });
      })
      .then(res => {
          console.log('Added new role')
          runEmployees();

      })
      .catch(err => {
          throw err
      });
}




