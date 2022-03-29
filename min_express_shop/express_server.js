const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const url = require('url');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());
app.use(express.static('public')); //static resource 요청이 들어오면 public 에서 찾아서 보내준다. (express를 미드웨어 라우터라고도 하는 이유)

/*
 * express
 get[READ],
 post[CREATE],
 put[UPDATE],
 delete[DELETE] 로 나누어서 라우터를 할 수 있다. 
 */

 const DB_INFO ={
     host : '127.0.0.1',
     port : 3306,
     user: 'root',
     password:'mysql',
     database: 'express_shop'
 }

let login_id =''; //login 화면에 login 이 성공하게 되면 DB에 해당 튜플의 애트리뷰트 LOGIN ='on' 으로 바뀌고 , id를 login_id에 저장한다. 

app.get('/admin',async (req,res)=>{
    
    let query = `SELECT LOGIN FROM ADMIN WHERE ID = ?`;
    let db_res = connMysqlQuery(query,[login_id]);
    db_res = await db_res;
    
    if(db_res['result'].length){
        console.log('로그인 1차 통과');
        if(db_res['result'][0].LOGIN == 'on'){
            console.log("로그인 되어 있음");
            //관리자 메인 페이지를 전송!!
        }else{
           console.log("로그인 되어 있지 않음");
           //세션 만료 다시 로그인 해주세요!
           // 하고 로그인 화면을 전송한다.
           res.write(`
            <script>
                const LOGIN_message = '세션 만료 다시 로그인 해주세요!';
                alert(LOGIN_message); 
            </script>
           `);
           let login_page = readData('public/admin/html/admin_login.html');
           login_page = await login_page;
           res.write(login_page);
           res.send();
        }
    }else{
        console.log("없는 아이디!");
        res.write(`
            <script>
                const LOGIN_message = 'login 정보를 다시 입력해주세요!!';
                alert(LOGIN_message);
            </script>
        `);
        let login_page = readData('public/admin/html/admin_login.html');
           login_page = await login_page;
           res.write(login_page);
           res.send();
        
    }
});

app.post('/admin/login.do',(req,res)=>{
    console.log('hi form');
    console.log(req.body);

})

app.listen(8877, (e)=>{

    console.log()
    console.log('http://127.0.0.1:8877/admin 으로 접속하세요');
})


function readData(data_path){
    return new Promise((resolve, reject)=>{
        fs.readFile(data_path, (e,result)=>{
            if(e){
                throw new Error("파일 읽어오기 에러~~!! : "+ e);
            }
            resolve(result);
        })
    })
}

function connMysqlQuery(query, query_params=[]){
    return new Promise((resolve, reject)=>{
        const conn = mysql.createConnection(DB_INFO);
        conn.connect((e)=>{
            conn.query(query,query_params,(e,result)=>{
                resolve({'result' : result,'conn':conn });
            })
        })
    });
}