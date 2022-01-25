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
    connection.promise().query("SELECT * FROM Department")
        .then((res) => {
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


function selectRole() {
    return connection.promise().query("SELECT * FROM role")
        .then(res => {
            return res[0].map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        })
}

function selectManager() {
    return connection.promise().query("SELECT * FROM employee ")
        .then(res => {
            return res[0].map(manager => {
                return {
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id,
                }
            })
        })

}

async function addEmployee() {

    const managers = await selectManager();

    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: await selectRole()
        },
        {
            name: "manager",
            type: "list",
            message: "Whats their managers name?",
            choices: managers
        }
    ]).then(function (res) {
        let roleId = res.role
        let managerId = res.manager

        console.log({managerId});
        connection.query("INSERT INTO Employee SET ?",
            {
                first_name: res.firstname,
                last_name: res.lastname,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(res)
                runEmployees();
            })

    })
}

function updateEmployeeRole() {
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            return res[0].map(employee => {
                return {
                    name: employee.first_name,
                    value: employee.id
                }
            })
        })
        .then(async (employeeList) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Please select the employee you want to update a role:.'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    choices: await selectRole(),
                    message: 'Please select the role.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  role_id = ? WHERE id = ?",

                    [
                        answer.roleId,
                        answer.employeeListId,
                    ],
            );
        })
        .then(res => {
            // console.log(res);
            console.log('Updated Manager Successfully')
            runEmployees();
        })

        .catch(err => {
            throw err
        });

}

function updateManager() {
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            return res[0].map(employee => {
                return {
                    name: employee.first_name,
                    value: employee.id
                }
            })
        })
        .then(async (employeeList) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeListId',
                    choices: employeeList,
                    message: 'Please select the employee you want to assign manager to:.'
                },
                {
                    type: 'list',
                    name: 'managerId',
                    choices: await selectManager(),
                    message: 'Please select the employee you want to make manager.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query("UPDATE employee SET  manager_id = ? WHERE id = ?",

                    [
                        answer.managerId,
                        answer.employeeListId,
                    ],
            );
        })
        .then(res => {
            // console.log(res);
            console.log('Updated Manager Successfully')
            runEmployees();
        })

        .catch(err => {
            throw err
        });

}


function viewEmployeeByManager() {
    connection.promise().query('SELECT *  FROM employee')
        .then((res) => {
            return res[0].map(employee => {
                return {
                    name: employee.first_name,
                    value: employee.id
                }
            })
        })
        .then(async (managerList) => {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'managerId',
                    choices: managerList,
                    message: 'Please select the manager you want to view employee by.'
                }
            ])
        })
        .then(answer => {
            console.log(answer);
            return connection.promise().query('SELECT * from Employee where manager_id=?',answer.managerId);

        })
        .then(res => {
            console.table(res[0])
            // console.log('Updated Manager Successfully')
            runEmployees();
        })

        .catch(err => {
            throw err
        });
}
runEmployees();