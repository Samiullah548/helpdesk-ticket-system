const API_BASE_URL = "/api/v1"

function clearMessages() {
    const errorDiv = document.getElementById("errorMessage")
    const successDiv = document.getElementById("successMessage")
    if (errorDiv) {
        errorDiv.textContent = ""
        errorDiv.classList.remove("show")
    }
    if (successDiv) {
        successDiv.textContent = ""
        successDiv.classList.remove("show")
    }
}

// Register form submit
const registerForm = document.getElementById("registerForm")
registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault()
    clearMessages()
    
    const fullname = document.getElementById("fullname").value.trim()
    const username = document.getElementById("username").value.trim()
    const email = document.getElementById("email").value.trim()
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
        }, 1500)
    } catch (error) {
        showError("Error: " + error.message)
    }
})

const loginForm = document.getElementById("loginForm")
loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault()
    clearMessages()

    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value

    if (!email || !password) {
        showError("All fields required")
        return
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
            showError(data.message || "Login failed")
            return
        }
        
        const accessToken = data.data.accessToken
        const refreshToken = data.data.refreshToken
        const displayName = data.data?.user?.fullname || data.data?.user?.username || email
        
        localStorage.setItem("userName", displayName)
        localStorage.setItem("userRole", data.data?.user?.role || "user")
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)

        showSuccess("Login successful! Redirecting....")
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 1000)
    } catch (error) {
        showError("Error: " + error.message)
    }
})

function showError(message) {
    const errorDiv = document.getElementById("errorMessage")
    const successDiv = document.getElementById("successMessage")
    if (successDiv) {
        successDiv.textContent = ""
        successDiv.classList.remove("show")
    }
    if (errorDiv) {
        errorDiv.textContent = message
        errorDiv.classList.add("show")
    }
}

function showSuccess(message) {
    const errorDiv = document.getElementById("errorMessage")
    const successDiv = document.getElementById("successMessage")
    if (errorDiv) {
        errorDiv.textContent = ""
        errorDiv.classList.remove("show")
    }
    if (successDiv) {
        successDiv.textContent = message
        successDiv.classList.add("show")
    }
}