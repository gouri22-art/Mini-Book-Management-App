document.getElementById("loginForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(email == "admin@empher.com" && password == "empher@123"){
        localStorage.setItem("loginData",JSON.stringify({email}));
        alert("Logged in as Admin.");
        window.location.href="admin.html";
    }else if(email == "user@empher.com" && password=="user@123"){
        localStorage.setItem("loginData",JSON.stringify({email}));
        window.location.href="books.html";
    }else{
        document.getElementById("error")
    }
});