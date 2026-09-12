const API_BASE_URL = "http://localhost:3000/api/v1"

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        window.location.href = "login.html"
        return
    }

    function renderTickets(tickets) {
    const container = document.getElementById("ticketsContainer")
    const noTickets = document.getElementById("noTickets")
    
    // Agar tickets nahi hain
    if (!tickets || tickets.length === 0) {
        container.innerHTML = ""
        noTickets.style.display = "block"
        return
    }
    
    noTickets.style.display = "none"
    container.innerHTML = ""
    
    // Har ticket ke liye card banao
    tickets.forEach(ticket => {
        const priorityClass = getPriorityClass(ticket.priority)
        
        const ticketHTML = `
            <div class="ticket-card" data-ticket-id="${ticket._id}">
                <div class="ticket-title">${ticket.title}</div>
                <div class="ticket-meta">
                    <span class="ticket-category">${ticket.category}</span>
                    <span class="ticket-priority ${priorityClass}">${ticket.priority}</span>
                </div>
                <div class="ticket-status">${ticket.status}</div>
            </div>
        `
        
        container.innerHTML += ticketHTML
    })

    container.querySelectorAll("[data-ticket-id]").forEach(card => {
        card.addEventListener("click", () => goToTicketDetails(card.dataset.ticketId))
    })
}

function getPriorityClass(priority) {
    if (priority === "Low") return "priority-low"
    if (priority === "Medium") return "priority-medium"
    if (priority === "High") return "priority-high"
    return ""
}

function goToTicketDetails(ticketId) {
    window.location.href = `ticket-details.html?id=${ticketId}`
}
    
    try {
        const response = await fetch(
            `${API_BASE_URL}/tickets/mine`,  // ✅ Sahi endpoint
            {
                method: "GET",  // ✅ GET method
                headers: { 
                    "Authorization": `Bearer ${token}`  // ✅ Template literal
                }
            }
        )
        
        const data = await response.json()
        
        if (!response.ok) {
            showError(data.message || "Failed to load tickets")
            return
        }
        
        renderTickets(data.data)  // ✅ Tickets render karo
        
    } catch (error) {
        showError("Error: " + error.message)
    }

})

function loadUserName() {
    const userName = localStorage.getItem("userName") || "User"
    document.getElementById("userName").textContent = userName
}