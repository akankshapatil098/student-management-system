const API_URL = "http://localhost:8080/api/students";

window.onload = function () {
    checkStudents();
};

// Check if there are students already
function checkStudents() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                document.getElementById("studentSection").style.display = "block";
                loadStudents();
            }
        });
}

function loadStudents() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const cardsContainer = document.getElementById("studentCards");
            cardsContainer.innerHTML = "";

            if (data.length === 0) {
                document.getElementById("studentSection").style.display = "none";
                return;
            }

            document.getElementById("studentSection").style.display = "block";

            data.forEach(student => {
                const card = document.createElement("div");
                card.className = "student-card";
                card.innerHTML = `
                    <h3>${student.name}</h3>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Course:</strong> ${student.course}</p>
                    <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                `;
                cardsContainer.appendChild(card);
            });
        });
}

function addStudent() {
    // Clear previous errors
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("courseError").innerText = "";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const course = document.getElementById("course").value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, course })
    })
    .then(async response => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }
        return response.json();
    })
    .then(() => {
        loadStudents();   // Show student section and refresh cards
        clearForm();
    })
    .catch(error => {
        const msg = error.message;
        if (msg.includes("name")) document.getElementById("nameError").innerText = "Name is required";
        if (msg.includes("email")) document.getElementById("emailError").innerText = "Valid email is required";
        if (msg.includes("course")) document.getElementById("courseError").innerText = "Course is required";
    });
}
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";

    // Optional: clear error messages too
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("courseError").innerText = "";
}

function deleteStudent(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => loadStudents());
}
