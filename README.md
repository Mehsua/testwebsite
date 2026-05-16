Before running, you need a .env file with these 4 lines:

MYSQL_HOST='127.0.0.1'
MYSQL_USER='' 
MYSQL_PASSWORD='' 
MYSQL_DATABASE='dono_db' 


All display/frontend pages + javascript should be stored in /public folder in order for express.js to work
Things like the sql table, the express.js script should stay outside

Steps to run Express:
1. Add .env file with above steps
2. drop database
3. npm install
4. npm install multer
5. node dono_controller.js
6. npm start
