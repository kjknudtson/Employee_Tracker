# Employee_Tracker
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  ## Description

  This application allows the user to access a database of employee information for their company.  This application utlizes Javascript and Node.js to interact with the information stored in a MySQL server.  The application also uses the npms: Inquirer, MySQL, and cli-table to function.  In addition to accessing the database, the user will also be able to freely manipulate the data within, by adding information about departments, roles, and employees, updating employee information, as well as completely deleting employees from the database entirely.  The employee information is available for the user to view by department or by manager.

  Repository: https://github.com/kjknudtson/Employee_Tracker

  ## Table of Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Contributors](#contributors)
  * [License](#license)
  * [Tests](#tests)
  * [Questions](#questions)

  ## Installation

  In order to install, one must first clone the repository to the local machine.  Once that is done, the user will need to, through the command line, go into the folder and perform an installation of the npm packages.  This can be done simply by typing "npm install" or "npm i".  This will automatically install the required npm packages (inquirer, mysql, cli-table) through the info in the package.json file.  If, for some reason, that does not work, the user can then type "npm install inquirer mysql cli-table" which will then install all three npm packages.  The user will then need to open up the "employeeCMS.js" file and place in their MySQL database password on line 16.  Then the user will need to open up their MySQL workbench and input the data from the file "employee_db.sql" to create the database with the correct tables and columns.  Finally, the user then may then type "node employeeCMS.js" in the command line to begin the application.

  ## Usage

  When the app is first opened a "Welcome!" message is displayed, along with the initial inquiry asking what the user may like to do.  The options are "Add department, role, or employee", "View departments, roles, or employees", "Update current employee roles or managers", and "Delete employee".  There is also an "Exit" option available, should the user wish to exit the application, which would immediately terminate the connection to the MySQL database.  If the user wishes to add something, a second prompt will appear, asking if the user would wish to add a department, role, or employee.  For "Department", the user only simply needs to input a department name, for "Role", the user will input the title, salary, and which department it falls under.  Finally, for "Employee", the user will be asked the first and last name of the employee, what their title is, and what their manager's name is (if applicable).  It is recommended that the user begins by adding all departments first, followed by all roles, then all managers, followed by the rest of the employees.  When selecting the view option, the user will be prompted again, to decide between departments, roles, or employees.  Upon selecting Departments, the user will be shown a table with all departments available that the user has input into the system already.  When viewing roles, the user will see each title, their salary, and which department it belongs to.  Upon selecting to view Employees, the user will be prompted to select whether they would like to view by department, or manager.  When selecting either option, the user will be shown a table that shows each employee's name, title, salary, department, and their manager's name (or "No Manager" if they do not have a manager).  The Update selection prompts the user to select whether they would like to change an employee's role or manager to one that has already been input into the system.  Finally, should the user select the Delete option, they will be prompted to select which person they would like to remove.  Upon making a selection, the application will announce to the user that the selected employee has been removed.  Should the user view current employees again, they will see that the employee, and all their info, has been removed from the table.
  
  Video Demonstration: https://www.youtube.com/watch?v=YEINdyrN0JU&feature=youtu.be

  ![employee_tracker](https://user-images.githubusercontent.com/64320048/89109008-0f01fb80-d403-11ea-822c-4ddbedbb6ccd.png)

  ## Contributors

  None, as this was a solo project.

  ## License

  Click on the badge at the top of the file to learn more about the license.

  ## Tests

  None

  ## Questions

  If there are any questions you have, you may contact me at https://github.com/kjknudtson

  You may also email me at kjknudtson1989@gmail.com
