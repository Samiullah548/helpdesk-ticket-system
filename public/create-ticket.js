const API_BASE_URL = "/api/v1"

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }
    loadUserName()
})

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

document.getElementById("createTicketForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    clearMessages()
    
    // Get form values
    const title = document.getElementById("title").value.trim()
    const description = document.getElementById("description").value.trim()
    const category = document.getElementById("category").value
    const priority = document.getElementById("priority").value
    
    // Validation
    if (!title || !description || !category || !priority) {
        showError("All fields are required")
        return
    }
    
    try {
        const token = localStorage.getItem("accessToken")
        
        const response = await fetch(`${API_BASE_URL}/tickets`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                category,
                priority
            })
        })
        
        const data = await response.json()
        
        if (response.status === 401) {
            logout()
            return
        }

        if (!response.ok) {
            showError(data.message || "Failed to create ticket")
            return
        }
        
        showSuccess("Ticket created successfully! Redirecting...")
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 1200)
        
    } catch (error) {
        showError("Error: " + error.message)
    }
})

function loadUserName() {
    const userName = localStorage.getItem("userName") || "User"
    const userNameEl = document.getElementById("userName")
    if (userNameEl) {
        userNameEl.textContent = userName
    }
}

function logout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userRole")
    window.location.href = "login.html"
}

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