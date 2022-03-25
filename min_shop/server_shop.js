const http = require('http');
const mysql = require('mysql');
const url = require('url');
const fs = require('fs');


const DB_INF = {
    host : '127.0.0.1',
    port : 3306,
    user:'root',
    password:"mysql",
    database: 'min_shop'
};

http.createServer(async (req, res)=>{
    let parse_req = url.parse(req.url,true);
    console.log('요청이 왔당 !!!! :'+ parse_req.pathname);

    if(parse_req.pathname ==='/' || parse_req.pathname === '/index.html'){
        // fs.readFile('index.html',(fs_e, index_page)=>{
        // })
        fsRead('index.html').then((main_page)=>{
            res.setHeader('Content-Type','text/html; charset=utf-8');
            res.end(main_page);
        })
    }else if(parse_req.pathname ==="/member/showList.do"){
        // fs.readFile('user_info.html',(fs_e, userInf_page)=>{
        // })
        fsRead('user_info.html').then((userInf_page)=>{
            res.setHeader('Content-Type','text/html; charset=utf-8');
            res.end(userInf_page);

        })
    }else if(parse_req.pathname ==='/user/ajax/showList.do'){
        
        const select_obj = await sqlConQuery('select ID,NAME,EMAIL,BIRTH from user');
        res.setHeader('Content-Type','application/json; charset=utf-8');

        res.end(JSON.stringify(select_obj['result']));
        select_obj['sql_conn'].end(()=>{}); 
       
        
    }else if(parse_req.pathname==='/user/ajax/deleteUser.do'){
        res.setHeader('Content-Type','application/json; charset=utf-8');
        console.log(parse_req.query['id']);
        const db_list = await sqlConQuery('delete from user where id=?',parse_req.query['id']);
        console.log(db_list['result']);
        res.end(JSON.stringify(db_list['result']));
        db_list['sql_conn'].end(()=>{});
        
    }else if(parse_req.pathname==='/user/login.do'){
        fsRead('login_host.html').then((data)=> {res.write(data); res.end();});
    }else if(parse_req.pathname==='/check/ajax/idPwd'){
       let post_data='';
       req.on('data',(data)=>{
           post_data+=data;
       })
       req.on('end',async ()=>{
           const form_data = JSON.parse(post_data);
           let sql = 'SELECT * FROM USER WHERE ID= ? AND PASSWORD = ? ';
           const result_list = await sqlConQuery(sql,[form_data['id'],form_data['pwd']]);

          
           res.end(JSON.stringify(result_list['result']));
           result_list['sql_conn'].end();
       })
    }else if(parse_req.pathname ==='/user/update_form.do'){
        fsRead('update_form.html').then((page)=>{res.write(page); res.end()});
    }else if(parse_req.pathname==='/user/confirm/ID.do'){
        let post_data = '';
        req.on('data',(data)=>{post_data+=data;});
        req.on('end',async ()=>{
            const form_data =  JSON.parse(post_data);
            // console.log(form_data['ID']);
            let sql = 'SELECT * FROM USER WHERE ID=?'
            const result_list = await sqlConQuery(sql,[form_data['ID']]);
            console.log(result_list['result']);
            res.end(JSON.stringify(result_list['result']));
            result_list['sql_conn'].end();
        })
    }else if(parse_req.pathname==='/user/confirm/MAIL.do'){
        let post_data ='';
        req.on('data',(data)=>{
            post_data +=data;
        })
        req.on('end',async ()=>{
            const form_data = JSON.parse(post_data);
            // console.log(form_data.MAIL);
            let sql = 'SELECT * FROM USER WHERE EMAIL=?';
            const result_list = await sqlConQuery(sql,[form_data['EMAIL']]);
            console.log(result_list['result']);
            res.end(JSON.stringify(result_list['result']));
            result_list['sql_conn'].end();
        })
    }else if(parse_req.pathname ==='/user/update.do'){
        let post_data ='';
        req.on('data',(data)=>{post_data += data;})
        req.on('end', async ()=>{
            const form_data = JSON.parse(post_data);
            console.log(form_data);
            let sql = `UPDATE USER SET ID=?, PASSWORD=?, EMAIL=?, BIRTH =? WHERE ID =?`;
            const result_list = await sqlConQuery(sql,[form_data['ID'],form_data['PASSWORD'],form_data['EMAIL'],form_data['BIRTH'],form_data['o_id']]);
            console.log(result_list['result']);
            res.end(JSON.stringify(result_list['result']));
            result_list['sql_conn'].end();
        })
    }else if(parse_req.pathname==='/member/join_user.do'){
        fsRead('insert_form.html').then((join_page)=>{
            res.setHeader('Content-Type','text/html; charset=utf-8');
            res.end(join_page);
        })
    }else if(parse_req.pathname==='/user/join_in.do'){
        let post_data = '';
        req.on('data',(data)=>{post_data+=data});
        req.on('end',async()=>{
            const form_data = JSON.parse(post_data);
            let sql = 'insert into user(ID,PASSWORD,NAME,EMAIL,BIRTH) values(?,?,?,?,?)';
            const result_list = await sqlConQuery(sql,[form_data['id'],form_data['pwd'],form_data['name'],form_data['email'],form_data['birth']]);
            res.end(JSON.stringify(result_list['result']));
            result_list['sql_conn'].end();
        })
    }

    /* product 상품 관련 서버 일 을 만들어보자 */
    else if(parse_req.pathname ==='/product/main.do'){
        fsRead('product_main.html').then((product_main_page)=>{
            res.setHeader('Content-type','text/html; charset=utf-8');
            res.end(product_main_page);
        })
    }else if(parse_req.pathname === '/product/show/list'){
        const result_list = await sqlConQuery('SELECT * FROM PRODUCT LIMIT 6',[]);
        res.setHeader('Content-Type','application/json charset=utf-8');
        res.end(JSON.stringify(result_list['result']));
        result_list['sql_conn'].end();
    }else if(parse_req.pathname.split('/')[2]==='image'){
        //img 들어오게 하기
        
        let new_parse_req = parse_req.pathname.replace('/product/','');
        console.log('new_parse_req.pathname = '+ new_parse_req);
        fsRead(new_parse_req).then((image)=>{

            res.setHeader('Content-type','image/jpeg');
            res.end(image);
        })
        
    }else if(parse_req.pathname === '/product/detail'){
        console.log(parse_req.query);
        fsRead('product_detail.html').then((product_detail_page)=>{
           return new Promise((resolve,reject)=>{
                res.setHeader("Content-Type","text/html; charset=utf-8");
                res.write(product_detail_page);
                resolve();
           }).then(async ()=>{
               let sql ='select * from product where id = ?'
                const result_list = await sqlConQuery(sql,[parse_req.query["id"]]);
                // res.setHeader("Content-Type","application/json");
                console.log(result_list['result']);
                res.write(`<script>let obj_list = ${JSON.stringify(result_list["result"])}</script>`);
                res.end();
                result_list['sql_conn'].end();
           })
        })
        
        
    }else if(parse_req.pathname==='/product/update/submit.do'){
        let post_data = '';
        req.on('data',(data)=>{post_data += data;});
        req.on('end',async ()=>{
            const json_obj = JSON.parse(post_data);
           
            let sql = 'UPDATE PRODUCT SET NAME=?, BRAND=?, PRICE=?,COUNT=?,MAIN_IMG=?,detail_img=? WHERE ID=?';
            const result_list = await sqlConQuery(sql, [json_obj['NAME'],json_obj['BRAND'],json_obj['PRICE'],json_obj['COUNT'],json_obj['MAIN_IMG'],json_obj['detail_img'],json_obj['ID']]);
            res.write(JSON.stringify(result_list['result']));
            res.end();
            result_list['sql_conn'].end();
        })
    }else if(parse_req.pathname==='/product/delete'){
        console.log(parse_req.query);
        let sql = 'DELETE FROM PRODUCT WHERE ID=?';
        let sql_result = await sqlConQuery(sql,[parse_req.query['id']]);
        res.end(JSON.stringify(sql_result['result']));
        sql_result['sql_conn'].end((e)=>{});
    }

    else if(parse_req.pathname==='/product/showBoard'){
        let query = 'SELECT NUM,USER_ID,CONTENTS,DATE,STAR FROM BOARD WHERE PRODUCT_ID = ? ';
        const result_list = await sqlConQuery(query,[parse_req.query['PRODUCT_ID']]);
        console.log(result_list['result']);
        res.end(JSON.stringify(result_list['result']));
        result_list['sql_conn'].end((e)=>{});
    }else if(parse_req.pathname==='/product/deleteBoard'){
        let query = 'DELETE FROM BOARD WHERE NUM = ?';
        const result_list = await sqlConQuery(query,[parse_req.query['NUM']]);
        res.end(JSON.stringify(result_list['result']));
        result_list['sql_conn'].end((e)=>{});
    }
}).listen(7777,(e)=>{
    if(e){
        console.log(e);
    }
    console.log('http://127.0.0.1:7777/ OR http://127.0.0.1:7777/index.html 로 오세요' );
});


function sqlConQuery(sql, sql_para=[]){
    return new Promise((resolve, reject)=>{
        const sql_conn = mysql.createConnection(DB_INF);
        resolve(sql_conn);
    }).then((sql_conn)=>{
        return new Promise((resolve,reject)=>{
            sql_conn.connect((e)=>{
                if(e){throw new Error(e);}
                resolve(sql_conn);
            })
        })
    }).then((sql_conn)=>{
       return new Promise((resolve,reject)=>{
        sql_conn.query(sql,sql_para,(e,result)=>{

            resolve({"result" : result, "sql_conn" : sql_conn});
        })
       })
    })
}

function fsRead(url){
    return new Promise((resolve,reject)=>{
        fs.readFile(url,(e,data)=>{
            resolve(data);
        })
    })
}