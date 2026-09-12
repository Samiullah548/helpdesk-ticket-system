const API_BASE_URL = "https://helpdesk-backend.onrender.com/api/v1"

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }
    
    loadUserName()
    
    // Get ticket ID from URL
    const params = new URLSearchParams(window.location.search)
    const ticketId = params.get("id")
    
    if (!ticketId) {
        showError("Ticket ID not found")
        return
    }
    
    loadTicketDetails(ticketId)
})

async function loadTicketDetails(ticketId) {
    try {
        const token = localStorage.getItem("accessToken")
        
        const response = await fetch(
            `${API_BASE_URL}/tickets/${ticketId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        
        const data = await response.json()
        
        if (!response.ok) {
            showError(data.message || "Failed to load ticket")
            return
        }
        
        renderTicketDetails(data.data)
        
    } catch (error) {
        showError("Error: " + error.message)
    }
}

function renderTicketDetails(ticket) {
    const container = document.getElementById("ticketDetailsContainer")
    
    const priorityClass = getPriorityClass(ticket.priority)
    const createdDate = new Date(ticket.createdAt).toLocaleDateString()
    
    const html = `
        <div class="ticket-title">${ticket.title}</div>
        
        <div class="ticket-badges">
            <span class="badge badge-category">${ticket.category}</span>
            <span class="badge badge-priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span>
            <span class="badge badge-status">${ticket.status}</span>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Description</div>
            <div class="detail-value">${ticket.description}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Created Date</div>
            <div class="detail-value">${createdDate}</div>
        </div>
        
        <div class="action-buttons">
            <button class="btn-primary" onclick="editTicket('${ticket._id}')">Edit</button>
            <button class="btn-danger" onclick="deleteTicket('${ticket._id}')">Delete</button>
        </div>
    `
    
    container.innerHTML = html
}

function getPriorityClass(priority) {
    if (priority === "Low") return "priority-low"
    if (priority === "Medium") return "priority-medium"
    if (priority === "High") return "priority-high"
}

async function deleteTicket(ticketId) {
    if (!confirm("Are you sure you want to delete this ticket?")) {
        return
    }
    
    try {
        const token = localStorage.getItem("accessToken")
        
        const response = await fetch(
            `${API_BASE_URL}/tickets/${ticketId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        
        const data = await response.json()
        
        if (!response.ok) {
            showError(data.message || "Failed to delete ticket")
            return
        }
        
        alert("Ticket deleted successfully!")
        window.location.href = "dashboard.html"
        
    } catch (error) {
        showError("Error: " + error.message)
    }
}

function editTicket(ticketId) {
    alert("Edit feature coming soon!")
    // Future: Implement edit page
}

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