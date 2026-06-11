function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "theethanerivers@gmail.com" && password === "Incredibleman") {
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("err").innerText = "Invalid login details";
  }
}