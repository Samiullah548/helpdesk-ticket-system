const API_BASE_URL = "http://localhost:3000/api/v1"

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }
    loadUserName()
})

document.getElementById("createTicketForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    
    // Get form values
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const category = document.getElementById("category").value
    const priority = document.getElementById("priority").value
    
    // Validation
    if (!title || !description || !category || !priority) {
        showError("All fields are required")
        return
    }
    
    try {
        const token = localStorage.getItem("accessToken")
        
        const response = await fetch(
            `${API_BASE_URL}/tickets/`,
            {
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
            }
        )
        
        const data = await response.json()
        
        if (!response.ok) {
            showError(data.message || "Failed to create ticket")
            return
        }
        
        showSuccess("Ticket created successfully! Redirecting...")
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 1500)
        
    } catch (error) {
        showError("Error: " + error.message)
    }
})

function loadUserName() {
    const userName = localStorage.getItem("userName")
    document.getElementById("userName").textContent = userName
}

function logout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userName")
    window.location.href = "login.html"
}

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