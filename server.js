const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const process = require('process');
const authRouter = require('./authRouter')


const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
const PORT = 3000;
server.use(cors())
server.use('/users',authRouter)

const DataBase = mysql.createConnection({
    host:'10.16.0.1',
    port:'3306',
    user: 'default-db',
    password:'8OQ&SpCQIl3M',
    database: 'default-db'
})

addQuery = (sqlQuery) => {
    DataBase.query(sqlQuery, (err, res) => {
      if (err) console.log(err);
      else console.log("данные введены");
    });
  }

server.get('/', (req,res)=> {
    return res.json("server");
})

server.get('/tasks', (req,res)=> {
    const UserId = req.query.user_id;
    const sqlCommand = `select * from tasks where user_id = ${UserId}`;
    DataBase.query(sqlCommand,(err,data)=> {
        if (err) return res.json(err);
        return res.json(data);
    })
})
server.get('/tasksArchive', (req,res)=> {
    const UserId = req.query.user_id;
    const sqlCommand = `select * from tasks where status_task = 2 and user_id = ${UserId}`;
    DataBase.query(sqlCommand,(err,data)=> {
        if (err) return res.json(err);
        return res.json(data);
    })
})
server.get('/Users',(req,res) => {
    const sqlCommand = `select * from users`;
    DataBase.query(sqlCommand,(err,data)=> {
        if (err) return res.json(err);
        return res.json(data);
    })
})

server.post('/taskAdd',(req,res) => {
    console.log("Данные получены");
    const {
        id,
        type_task,
        user_id,
        status_task,
        name,
        description,
        date,
        date_start,
        date_complete
    } = req.body; 

    const sql = 
    `INSERT INTO tasks (
        id,
        type_task,
        user_id,
        status_task,
        name,
        description,
        date,
        date_start,
        date_complete
    ) VALUES ('${id}','${type_task}','${user_id}','${status_task}','${name}','${description}','${date}','${date_start}','${date_complete}')`;    
    addQuery(sql);
    res.end('сервер обработал добавление');
});
server.post('/userAdd',(req,res) => {
    console.log("Данные получены");
    const {
        login,
        password,
        name
    } = req.body; 

    const sql = 
    `INSERT INTO users (
        login,
        password,
        name
    ) VALUES ('${login}','${password}','${name}')`;    
    addQuery(sql);
    res.end('сервер обработал добавление');
});

server.post('/taskEdit',(req,res) => {
    const {id,type_task,name,description,date} = req.body;
    let sql = `UPDATE tasks SET 
    name = '${name}',
    description = '${description}' WHERE (id = '${id}')`;
    if (type_task == 2) {
        sql = `UPDATE tasks SET 
        name = '${name}',
        description = '${description}',
        date = '${date}' WHERE (id = '${id}')`;
    }
    addQuery(sql);
    res.end('сервер обработал изменение');
})

server.post('/taskComplete',(req,res) => {
    let Today = new Date().toISOString().slice(0, 10).replace("T", " ");
    const {id} = req.body;
    const sql = `UPDATE tasks SET status_task = 2, 
    date_complete = '${Today}' WHERE (id = '${id}')`;
    addQuery(sql);
    res.end('сервер обработал выполнение');
})

server.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}!`));