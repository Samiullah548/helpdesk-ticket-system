import cors from "cors"

app.use(cors({
    origin: "*",  // Testing ke liye, production mein specific URL
    credentials: true
}))

const API_BASE_URL = "http://localhost:3000/api/v1"

// Register form submit
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    
    const fullname = document.getElementById("fullname").value
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    // Validation
    if (!fullname || !username || !email || !password) {
        showError("All fields required")
        return
    }
    
    if (password.length < 8) {
        showError("Password minimum 8 characters")
        return
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullname, username, email, password })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
            showError(data.message || "Registration failed")
            return
        }
        
        showSuccess("Registration successful! Redirecting to login...")
        setTimeout(() => {
            window.location.href = "login.html"
        }, 2000)
    } catch (error) {
        showError("Error: " + error.message)
    }
})

function showError(message) {
    const errorDiv = document.getElementById("errorMessage")
    errorDiv.textContent = message
    errorDiv.classList.add("show")
}

function showSuccess(message) {
    const successDiv = document.getElementById("successMessage")
    successDiv.textContent = message
    successDiv.classList.add("show")
}