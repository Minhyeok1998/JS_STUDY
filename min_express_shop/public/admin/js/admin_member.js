const login_id = document.getElementById('login_id');
fetch('/admin/getID')
.then((res)=>{return res.json();})
.then((id)=>{login_id.innerText=id});


const clone_tr = document.querySelector('tr.clone_tr');
const member_tbody = document.querySelector('tbody.member_tbody');
console.log(member_tbody);
logOutBtn.addEventListener('click',async ()=>{

    const result = await fetch(`/member/${login_id.innerText}/logOut`,{method:"PUT"});
    const res = await result.json();
    
    if(res.affectedRows === 1){
     window.location.href='http://127.0.0.1:8877/admin';     
    }
 });
console.log(Member);
//Member 는 database 에서 Member 테이블 정보 (Object Array 형태)

Member.forEach((member)=>{
    
    const clone_node = clone_tr.cloneNode(true);
    clone_node.classList.remove('disabled');
    let key;
    for(key in member){
        switch(key){
            case'ID':
                clone_node.querySelector('td.ID').innerText = member[key];
                clone_node.querySelector('input.CHECKID').addEventListener('change',(e)=>{
                    console.log(e.target.checked);
                    checkedFunction(member['ID'], e.target.checked);
                });
                break;
            case 'PHONE':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            case 'PHONE':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            case 'EMAIL':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            case 'NAME':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            case 'ADDRESS':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            case 'ADDRESS_DETAIL':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            case 'BIRTH':
                clone_node.querySelector(`.${key}`).innerText = member[key];
                break;
            
        }
    }
    member_tbody.append(clone_node);
})




const checkAr = new Array(); //CHECKBOX 가 선택(TRUE) 인 아이디를 저장한 배열
function checkedFunction(id ,state){ // 클릭한 checkbox의 id와 체크 상태  파라미터로 넘김
    
    if(state){
        checkAr.push(id);
    }
    else{
        checkAr.splice(checkAr.indexOf(id),1);
    }

    console.log(checkAr);
}