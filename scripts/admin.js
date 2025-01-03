const baseUrl = "https://beryl-ember-havarti.glitch.me/books";

//check if admin is logged in
const loginData = JSON.parse(localStorage.getItem("loginData"));
if (!loginData || loginData.email !== "admin@empher.com") {
    alert("Admin not Logged in");
    window.location.href = "index.html";
}

//Add a new bok
document.getElementById("addBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const book = {
        title,
        author,
        category,
        isAvailable: true,
        isVerified: true,
        borrowedDays: null,
        imageUrl: "https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg",
    };
    console.log("Submitting new book:", book)
    try {
        const response = await fetch(baseUrl, {
            method:"POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify(book),
        });
        console.log("Response status", response.status);
        const addedBook = await response.json();
        console.log("Added book:",addedBook);
    if (response.ok) {
        alert("Book Added Successfully");
        loadBooks();
    }
    else {
        alert("failed to add book")
    }
    //     alert("Book Added Successfully");
    // console.lof("data", book)
    // loadBooks();
    }catch (error) {
    alert("Failed to add book.Please try again later.");
    }
});

//load all books
const loadBooks = async () => {
    console.log("Loading books...")
    try {
        const response = await fetch(baseUrl);
        const books = await response.json();
        console.log("Fetched Books:",books)

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
            <p>Availability:${book.isAvailable}</p>
            <button>${book.isVerified}</button>
            <button onClick="deleteBook(${book.id})">Delete Book</button>`;
            grid.appendChild(card);
        });
    } catch (error) {
        alert("Failed to load books.Please try again later.")
    }
};
//Verify Book
const verifyBook = async (id) => {
    if (confirm("Are you sure to Verify..?")) {
        try {
            await fetch(`${baseUrl}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: true }),
            });
            alert("Book Verified Successfully");
            loadBooks();
        } catch (error) {
            alert("Failed to verify book.Please try again later.")
        }
    }
};

//Delete a book
const deleteBook = async (id) => {
    if (confirm("Are you sure to Delete..?")) {
        try {
            await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
            alert("Book Deleted Successfully");
            loadBooks();

        } catch (error) {
            alert("Failed to delete book.Please try again later.");
        }
    }
};

loadBooks();