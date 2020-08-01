var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    console.log("");
    console.log("Welcome!")
    askUser();
});

function askUser() {
    inquirer
       .prompt([
       {
         name: "task",
         type: "list",
         message: "What would like to do?",
         choices: [
            "Add a department, role, or employee",
            "View existing departments, roles, or employee",
            "Update current employee roles",
            "Exit"
         ]
       }
      ])
       .then(function(answer) {
         switch (answer.task) {
         case "Add a department, role, or employee":
            addWhat();
            break;
        
         case "View existing departments, roles, or employee": 
            viewWhat();
            break;

         case "Update current employee roles":
             updateRole();
             break;

         case "Exit":
             console.log("Connection Terminated!  Goodbye!")
             connection.end();
             
         }
       });
}

function addWhat() {
    inquirer
      .prompt([
       {
        name: "add",
        type: "list",
        message: "What would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]
       }
    ])
      .then(function(answer) {
        switch (answer.add) {
        case "Department":
            addDepartment();
            break;
        
        case "Role":
            addRole();
            break;

        case "Employee":
            addEmployee();
            break;
        }
      });
}

function addDepartment() {
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "What is the name of the department you would like to add?"
        }
      ])
      .then(function(answer) {
          var department = answer.department;
          var query = connection.query(
           "INSERT INTO department SET ?",
           {
             name: department 
           },
           function(err, res) {
               if (err) throw err;
               console.log("Department Added!");
               askUser();
           }           
          );
          
      })
}

function addRole() {
  connection.query("SELECT * FROM department", function(err, results) {
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the role you would like to add?"
        },
        
        {
          name: "salary",
          type: "input",
          message: "What is the annual salary for this role?"    
        },

        {
          name: "department",
          type: "list",
          message: "What department does this role belong to?",
          choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].name);
              }
              return choiceArray;
          }
        }
      ])
      .then(function(answer) {
          var title = answer.title;
          var salary = answer.salary;
          var departmentId = connection.query("SELECT id FROM department WHERE ?", { name: answer.department }, function(err, res) {
            var answer = res[0].id;
            var query = connection.query(
              "INSERT INTO role SET ?",
              {
                title: title,
                salary: salary,
                department_id: answer
              },
              function(err, res) {
                  if (err) throw err;
                  console.log("Role Added!");
                  askUser();
              }
                        
             );
          }); 
          
          
      })
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, results) {
    connection.query("SELECT * FROM employee", function (err, res) {
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?"
        },
        
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?"    
        },

        {
          name: "role",
          type: "list",
          message: "What is this employee's role?",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].title);
            }
            return choiceArray;
          }
        },

        {
          name: "manager",
          type: "list",
          message: "Who is this employee's manager?",
          choices: function() {
            var managerArray = [];
            for (var i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name + " " + res[i].last_name);
            }
            var none = "None";
            managerArray.push(none);
            return managerArray;
          }

        }
       
      ])
      .then(function(answer) {
          var firstName = answer.firstName;
          var lastName = answer.lastName;
          var str = answer.manager;
          manager = str.split(" ");
          var first = manager[0];
          var last = manager[1];
          if (answer.manager !== "None") {
            connection.query("SELECT id FROM employee WHERE ?", {last_name: last }, function (err, ans) {
              var managerAnswer = ans[0].id;
            connection.query("SELECT id FROM role WHERE ?", { title: answer.role }, function (err, res) {
              var roleAnswer = res[0].id;
              var query = connection.query(
               "INSERT INTO employee SET ?",
              {
               first_name: firstName,
               last_name: lastName,
               role_id: roleAnswer,
               manager_id: managerAnswer
              },
               function(err, res) {
                 if (err) throw err;
                 console.log("Employee Added!");
                 askUser();
               }           
              );
            
            });
           })
          } else {
           connection.query("SELECT id FROM role WHERE ?", { title: answer.role }, function (err, res) {
            var roleAnswer = res[0].id;
            var query = connection.query(
             "INSERT INTO employee SET ?",
            {
             first_name: firstName,
             last_name: lastName,
             role_id: roleAnswer
            },
             function(err, res) {
               if (err) throw err;
               console.log("Employee Added!");
               askUser();
             }           
            );
          
          });
         }
    });
  });
 });
}

function viewWhat() {
    inquirer
      .prompt([
       {
        name: "view",
        type: "list",
        message: "What would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees"
        ]
       }
      ])
      .then(function(answer) {
        switch (answer.view) {
        case "Departments":
            viewDepartment();
            break;
        
        case "Roles":
            viewRole();
            break;

        case "Employees":
            viewEmployee();
            break;
        }
      });
}

function viewDepartment() {
  console.log(" Here are all current departments");
  console.log(" ");
  var table = new Table({
    head: ['ID', 'Department']
    , colWidths: [10, 20]
    });    
  connection.query("SELECT * FROM department", function(err, results) {
    
    for (var i = 0; i < results.length; i++) {
      var department = results[i].name;
      var id = results[i].id;
      
      table.push(
        [id, department]
        
      );
    }
    console.log(table.toString());
    console.log(" ");
    askUser();
  })

}


function viewRole() {
  
  connection.query("SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department.name", function(err, results) {
    var table = new Table({
      head: ['Title', 'Salary', 'Department']
      , colWidths: [25, 10, 20]
      });
    for (var i = 0; i < results.length; i++) {
      var title = results[i].title;
      var salary = results[i].salary;
      var department = results[i].name;
      table.push(
        [title, salary, department]
        
      );
    }
    console.log(table.toString());
    console.log(" ");
    askUser();
  });
    
}

function viewEmployee() {
  inquirer
    .prompt([
      {
        name: "searchBy",
        type: "list",
        message: "How would you like to view Employees?",
        choices: [
          "View Employees By Department",
          "View Employees By Manager"
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.searchBy) {
      case "View Employees By Department":
          sortByDepartment();
          break;
      
      case "View Employees By Manager":
          sortByManager();
          break;
      }
    });

}

function sortByDepartment() {
  connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS Employee, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'No Manager') AS Manager, role.title, role.salary, department.name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id  ORDER BY department.name, e.last_name", function(err, results) {
    var table = new Table({
      head: ['Employee', 'Title', 'Salary', 'Department', 'Manager']
      , colWidths: [20, 25, 10, 20, 20]
      });
    for (var i = 0; i < results.length; i++) {
      var employee = results[i].Employee;
      var manager = results[i].Manager;
      var employeeTitle = results[i].title;
      var employeeSalary = results[i].salary;
      var employeeDept = results[i].name;
     


      table.push(
        [employee, employeeTitle, employeeSalary, employeeDept, manager]
        
      );
     
    }
    console.log(table.toString());
    console.log(" ");
    askUser();
  });  

        
}
    




function sortByManager() {
  connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS Employee, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'No Manager') AS Manager, role.title, role.salary, department.name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id  ORDER BY Manager, department.name", function(err, results) {
    var table = new Table({
      head: ['Employee', 'Title', 'Salary', 'Department', 'Manager']
      , colWidths: [20, 25, 10, 20, 20]
      });
    for (var i = 0; i < results.length; i++) {
      var employee = results[i].Employee;
      var manager = results[i].Manager;
      var employeeTitle = results[i].title;
      var employeeSalary = results[i].salary;
      var employeeDept = results[i].name;
     


      table.push(
        [employee, employeeTitle, employeeSalary, employeeDept, manager]
        
      );
     
    }
    console.log(table.toString());
    console.log(" ");
    askUser();
  });  

}

function updateRole() {
  connection.query("SELECT * FROM role", function(err, results) {
   connection.query("SELECT * FROM employee", function(err, res) {
    inquirer
      .prompt([
       {
        name: "employee",
        type: "list",
        message: "Who's role is changing?",
        choices: function() {
          var choicesArray = [];
          for (var i = 0; i < res.length; i++) {
              choicesArray.push(res[i].first_name + " " + res[i].last_name);
          }
          return choicesArray;
        }
      },

      {
        name: "newRole",
        type: "list",
        message: "What is their new role?",
        choices: function() {
          var roleArray = [];
          for (var i = 0; i < results.length; i++) {
            roleArray.push(results[i].title);
          }
          return roleArray;
        }
      }    
    ])
    .then(function(answer) {
      var newRole = answer.newRole;
      var str = answer.employee;
      employeeName = str.split(" ");
      var first = employeeName[0];
      var last = employeeName[1];
      connection.query("SELECT id FROM role WHERE ?", { title: newRole }, function(err, res) {
        var newRoleId = res[0].id;
        connection.query("UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: newRoleId
          },
          {
            last_name: last
          }
        ],        
        function(err, res) {
          if (err) throw err;
          console.log("Role Updated!");
          askUser();
        }
        )
      });





    });




  }) 
 })
}

