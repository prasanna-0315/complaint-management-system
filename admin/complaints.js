let allComplaints = [];

// Check admin auth
function checkAuth() {
  const adminId = sessionStorage.getItem("adminId");
  if (!adminId) {
    window.location.href = "admin_login.html";
    return false;
  }
  return true;
}

/* Load complaints from backend */

async function loadComplaints(){

  const container = document.getElementById("complaintsContainer");

  try {
    const res = await fetch("http://localhost:5000/complaint");
    allComplaints = await res.json();
    renderComplaints(allComplaints);
  } catch (error) {
    console.error("Error loading complaints:", error);
    container.innerHTML = "<p>Error loading complaints. Please check if the server is running.</p>";
  }
}


/* Render complaints */

function renderComplaints(list){

  const container = document.getElementById("complaintsContainer");

  if(list.length === 0){
    container.innerHTML = "<p>No complaints found</p>";
    return;
  }

  container.innerHTML = list.map(c => `

  <div class="complaint-card">

      <div class="complaint-left">

        <div class="complaint-title">
          ${c.category} - ${c.location}
        </div>

        <div class="complaint-desc">
          ${c.description}
        </div>

        <small>Priority: ${c.priority || 'Medium'}</small><br>
        <small>ID: ${c._id}</small>

      </div>

      <div>

        <span class="status ${c.status.toLowerCase().replace(" ","-")}">
          ${c.status}
        </span>

        <br><br>

        <select onchange="updateStatus('${c._id}', this.value)">
          <option value="Pending" ${c.status==="Pending"?"selected":""}>Pending</option>
          <option value="In Progress" ${c.status==="In Progress"?"selected":""}>In Progress</option>
          <option value="Resolved" ${c.status==="Resolved"?"selected":""}>Resolved</option>
        </select>

      </div>

  </div>

  `).join("");
}


/* Update complaint status */

async function updateStatus(id,status){

  try {
    await fetch(`http://localhost:5000/complaint/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({status})
    });
    loadComplaints();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Error updating complaint status");
  }
}


/* Search complaints */

document.addEventListener("DOMContentLoaded", function() {
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", function(){
      const value = this.value.toLowerCase();
      const filtered = allComplaints.filter(c =>
        c.category.toLowerCase().includes(value) ||
        c.location.toLowerCase().includes(value) ||
        (c.priority && c.priority.toLowerCase().includes(value))
      );
      renderComplaints(filtered);
    });
  }
});