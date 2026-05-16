Before running, you need a .env file with these 4 lines:

MYSQL_HOST='127.0.0.1' //localhost address
MYSQL_USER='' //the name of your user
MYSQL_PASSWORD='' //the password of your user account 
MYSQL_DATABASE='donor_db' //the name of your schema or db


All display/frontend pages + javascript should be stored in /public folder in order for express.js to work
Things like the sql table, the express.js script should stay outside

Steps to run Express:
1. Add .env file with above steps
2. npm install
3. node dono_controller.js
4. npm start
