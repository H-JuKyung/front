window.onload = async () => { // 웹 페이지가 로드된 후 실행되는 비동기 함수(Async) / await 키워드를 사용하여 비동기 작업을 처리함
    // fetch()를 사용하여 URL에서 데이터를 가져옴 (GET 요청)
    // await == 서버 응답을 기다림
    // productList에 Response 객체가 저장됨
    const email = sessionStorage.getItem("email");
    if(email) {
      document.getElementById("loginSpan").innerHTML = email + ` <button id="logout">logout</button>`;
    }
    axios.defaults.withCredentials = true;
    console.log(axios); // ƒ (){return e.apply(t,arguments)} 출력됨
    let productList = await fetch("http://localhost:8080/getAllProducts", { method: "GET"});
    console.log(productList);

    productList = await productList.json(); // 서버 응답 데이터를 JSON 형식으로 변환
    console.log(productList);

    let productListDiv = ``;
    productList.forEach((item) => {
        productListDiv += `<div class="card m-3" style="width: 10rem;">
                <img src="img/${item.pimg}" class="card-img-top" alt="...">
                <div class="card-body">
                  <b class="card-title">${item.prodname}</b>
                  <p class="card-text text-danger">${item.price}원</p>
                  <a href="#" class="btn btn-outline-info" id="addCart">장바구니 담기</a>
                </div>
              </div>`;
    });
    document.getElementById("productListDiv").innerHTML = productListDiv;
}



document.getElementById("signupBtn").addEventListener("click", async () => {
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;
  const data = { nickname, email, pw };
  let response = await fetch("http://localhost:8080/insertMember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  console.log(response);
  if (response.msg === "ok") {
    console.log("ok");
    const modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));
    modal.hide();
    //hero icons
//     document.getElementById("loginSpan").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width="24" height="24">
//   <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
// </svg>`;
    document.getElementById("signupLi").remove();
  } else {
    alert(response.msg);
  }
});



document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const pw = document.getElementById("loginPw").value;
  const data = { email, pw };
  let response = await axios.post("http://localhost:8080/login", data);
  // response = await response.json();
  console.log(response);
  alert(response.data.msg);
  if(response.data.msg === "ok") {
    const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    modal.hide();
    document.getElementById("loginSpan").innerHTML = email + ` <button id="logout">logout</button>`;
    window.sessionStorage.setItem("email", email);
  }
});


document.getElementById("productListDiv").addEventListener("click", (event)=>{
  if(event.target.id == 'addCart') {
    axios.post("http://localhost:8080/addCart", {});
  }
});


document.getElementById("loginSpan").addEventListener("click", (event)=>{
  if(event.target.id == 'logout') {
    sessionStorage.removeItem("email");
    window.location.reload();
  }
});