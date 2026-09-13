const API_BASE_URL = "/api/v1"

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }

    loadUserName()

    function renderTickets(tickets) {
        const container = document.getElementById("ticketsContainer")
        const noTickets = document.getElementById("noTickets")
        
        if (!tickets || tickets.length === 0) {
            container.innerHTML = ""
            noTickets.style.display = "block"
            return
        }
        
        noTickets.style.display = "none"
        container.innerHTML = ""
        
        tickets.forEach(ticket => {
            const priorityClass = getPriorityClass(ticket.priority)
            
            const ticketHTML = `
                <div class="ticket-card" data-ticket-id="${ticket._id}">
                    <div class="ticket-title">${escapeHtml(ticket.title)}</div>
                    <div class="ticket-meta">
                        <span class="ticket-category">${escapeHtml(ticket.category)}</span>
                        <span class="ticket-priority ${priorityClass}">${escapeHtml(ticket.priority)}</span>
                    </div>
                    <div class="ticket-status">${escapeHtml(ticket.status)}</div>
                </div>
            `
            
            container.innerHTML += ticketHTML
        })

        container.querySelectorAll("[data-ticket-id]").forEach(card => {
            card.addEventListener("click", () => goToTicketDetails(card.dataset.ticketId))
        })
    }

    function getPriorityClass(priority) {
        const p = (priority || "").toLowerCase()
        if (p === "low") return "priority-low"
        if (p === "medium") return "priority-medium"
        if (p === "high") return "priority-high"
        return ""
    }

    function goToTicketDetails(ticketId) {
        window.location.href = `ticket-details.html?id=${ticketId}`
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/mine`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        })
        
        const data = await response.json()
        
        if (response.status === 401) {
            logout()
            return
        }

        if (!response.ok) {
            showError(data.message || "Failed to load tickets")
            return
        }
        
        renderTickets(data.data)
        
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
    if (errorDiv) {
        errorDiv.textContent = message
        errorDiv.classList.add("show")
    }
}

function escapeHtml(text) {
    if (!text) return ""
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
}