document.addEventListener("DOMContentLoaded",()=>{
    const baseUrl = "http://localhost:3000/books";

//check if user is logged in
const loginData = JSON.parse(localStorage.getItem("loginData"));
if (!loginData || loginData.email !== "user@empher.com") {
    alert("User not Logged in");
    window.location.href = "index.html";
}

//load available books

document.getElementById("showAvailableBooks").addEventListener("click", async () => {
    try {
        const response = await fetch(`${baseUrl}?isAvailable=true`);
        const books = await response.json();

        const grid = document.getElementById("booksGrid");
        grid.innerHTML = " ";

        books.forEach((book) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>Author:${book.author}</p>
            <p>Category:${book.category}</p>
            <button class="borrow-btn" data-id = "${book.id}">Borrow Book</button>`;
            grid.appendChild(card);

        });
        //attach event listener
        const borrowButtons = document.querySelectorAll(".borrow-btn");
        borrowButtons.forEach((button)=>{
            button.addEventListener("click",(e)=>{
                const bookId = e.target.getAttribute("data-id");
                borrowBook(bookId);
            });
        });
    } catch (error) {
        alert("Failed to load available books.Please try again later.");
    }
});

//Borrow book

const borrowBook = async (id) => {
    const days = prompt("Enter borrowing duration(1-10 days):");
    if (days && days > 0 && days <= 10) {
        try {
            await fetch(`${baseUrl}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAvailable: false, borrowBook: days }),
            });
            alert("Book Borrowed Successfully");
            document.getElementById("showAvailableBooks").click();//reload available books

        } catch (error) {
            alert("Failed to borrow book.Please try again later.");
        }
    } else {
        alert("Invalid Duration.Please enter a value between 1 to 10")
    }

};

//load borrowed book
document.getElementById("showBorrowedBooks").addEventListener("click",async()=>{
    try{
        const response = await fetch(`${baseUrl}?isAvailable=false`);
        const books = await response.json();

        const grid = document.getElementById("booksGrid");
        grid.innerHTML = " ";

        books.forEach((books)=>{
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
            <img src="${books.imageUrl}" alt="${book.title}">
            <h3>${books.title}</h3>
            <p>Author:${books.author}</p>
            <p>Category:${books.category}</p>
            <p>Borrowed for:${books.borrowedDays} days</p>
            <button onClick="returnBook(${books.id})">Return Book</button>`;
            grid.appendChild(card);

            
        });
    }catch(error){
        alert("Failed to load borrowed books.Please try again later.");
    }
});

//return a book 
const returnBook = async (id)=>{
    if(confirm("Are you sure to return book ..?")){
        try{
            await fetch(`${baseUrl}/${id}`,{
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({isAvailable:true,borrowedDays:null}),
            });
            alert("Book Returned Successfully.");
            document.getElementById("showBorrowedBooks").click();// reload borrowed books

        }catch(error){
            alert("Failed to return book.Please try again later.");
        }

    }
}

});