
console.log(LOGIN_ID);


const login_id  = document.getElementById('login_id');
login_id.innerText = LOGIN_ID;

const logOutBtn= document.getElementById("logOutBtn");

logOutBtn.addEventListener('click',async ()=>{

   const result = await fetch(`/member/${LOGIN_ID}/logOut`,{method:"PUT"});
   const res = await result.json();
   
   if(res.affectedRows === 1){
    window.location.href='http://127.0.0.1:8877/admin';     
   }
});