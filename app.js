const API = "http://localhost:3000";

let token = "";

async function login(){
  const res = await fetch(API+"/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  token = data.token;
  localStorage.setItem("token", token);

  location.href="dashboard.html";
}

async function load(){
  token = localStorage.getItem("token");

  const res = await fetch(API+"/me",{
    headers:{ Authorization: token }
  });

  const user = await res.json();

  document.getElementById("balance").innerText =
    "$" + user.balance;
}

async function send(){
  const res = await fetch(API+"/transfer",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      fromId: 1,
      walletId: walletId.value,
      amount: Number(amount.value)
    })
  });

  const data = await res.json();
  alert("Transfer complete");
}

async function loadHistory(){
  const res = await fetch(API+"/transactions");
  const data = await res.json();

  list.innerHTML = data.map(t =>
    `<div class="card">
      ${t.from} → ${t.to}<br>
      $${t.amount}<br>
      ${new Date(t.date).toDateString()}
    </div>`
  ).join("");
}