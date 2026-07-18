let allComplaints = [];
const PRIORITY_BY_RANK = ["Critical", "High", "Medium", "Low"];

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

async function loadComplaints() {

  const container = document.getElementById("complaintsContainer");

  try {
    const res = await fetch("/complaint");
    const complaints = await res.json();
    const priorityByCategory = buildPriorityByCategoryMap(complaints);
    allComplaints = await syncDynamicPriorities(complaints, priorityByCategory);
    applyFilters();
  } catch (error) {
    console.error("Error loading complaints:", error);
    container.innerHTML = "<p>Error loading complaints. Please check if the server is running.</p>";
  }
}

function buildPriorityByCategoryMap(complaints) {
  const countByCategory = {};

  // Count active (unresolved) complaints per category
  complaints.forEach((complaint) => {
    if (complaint.status !== "Resolved") {
      const category = complaint.category || "Others";
      countByCategory[category] = (countByCategory[category] || 0) + 1;
    }
  });

  const priorityByCategory = {};

  Object.keys(countByCategory).forEach((category) => {
    const count = countByCategory[category];
    if (count <= 1) {
      priorityByCategory[category] = "Low";
    } else if (count === 2) {
      priorityByCategory[category] = "Medium";
    } else if (count === 3) {
      priorityByCategory[category] = "High";
    } else {
      priorityByCategory[category] = "Critical";
    }
  });

  return priorityByCategory;
}

async function syncDynamicPriorities(complaints, priorityByCategory) {
  const updateRequests = complaints
    .filter((complaint) => {
      const expectedPriority = priorityByCategory[complaint.category] || "Low";
      return complaint.priority !== expectedPriority;
    })
    .map(async (complaint) => {
      const expectedPriority = priorityByCategory[complaint.category] || "Low";
      try {
        await fetch(`/complaint/${complaint._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ priority: expectedPriority })
        });
      } catch (error) {
        console.error(`Priority update failed for ${complaint._id}:`, error);
      }
    });

  if (updateRequests.length > 0) {
    await Promise.all(updateRequests);
  }

  return complaints.map((complaint) => ({
    ...complaint,
    priority: priorityByCategory[complaint.category] || "Low"
  }));
}


/* Render complaints */

function renderComplaints(list) {

  const container = document.getElementById("complaintsContainer");
  const isResolvedPage = window.location.pathname.includes("resolved.html");

  if (list.length === 0) {
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

        ${!isResolvedPage ? `<small>Priority: ${c.priority || 'Low'}</small><br>` : ''}
        <small>ID: ${c._id}</small>

      </div>

      <div>

        <span class="status ${c.status.toLowerCase().replace(" ", "-")}">
          ${c.status}
        </span>
        
        ${!isResolvedPage ? `
        <br><br>

        <select onchange="updateStatus('${c._id}', this.value)">
          <option value="Pending" ${c.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${c.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${c.status === "Resolved" ? "selected" : ""} ${c.status === "Pending" ? "disabled title=\"Must be In Progress first\"" : ""}>Resolved</option>
        </select>
        ` : ''}

      </div>

  </div>

  `).join("");
}


/* Update complaint status */

async function updateStatus(id, status) {

  try {
    const response = await fetch(`/complaint/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Error updating complaint status");
    }

    loadComplaints();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Error updating complaint status. Server may be down.");
  }
}


/* Filters */

function applyFilters() {
  const isResolvedPage = window.location.pathname.includes("resolved.html");
  const searchBox = document.getElementById("searchBox");
  const statusFilter = document.getElementById("statusFilter");

  let filtered = allComplaints;

  // 1. Page level filtering
  if (isResolvedPage) {
    filtered = filtered.filter(c => c.status === "Resolved");
  } else {
    filtered = filtered.filter(c => c.status !== "Resolved");
  }

  // 2. Status filtering 
  if (statusFilter && statusFilter.value !== "all") {
    filtered = filtered.filter(c => c.status === statusFilter.value);
  }

  // 3. Search filtering
  if (searchBox && searchBox.value.trim() !== "") {
    const value = searchBox.value.toLowerCase();
    filtered = filtered.filter(c =>
      (c.category && c.category.toLowerCase().includes(value)) ||
      (c.location && c.location.toLowerCase().includes(value)) ||
      (c.priority && c.priority.toLowerCase().includes(value))
    );
  }

  // 4. Sort by Priority (Critical > High > Medium > Low)
  const priorityScore = {
    "Critical": 4,
    "High": 3,
    "Medium": 2,
    "Low": 1
  };

  filtered.sort((a, b) => {
    const scoreA = priorityScore[a.priority] || 0;
    const scoreB = priorityScore[b.priority] || 0;

    // Fallback sorting by date (newest first) if same priority
    if (scoreA === scoreB) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    return scoreB - scoreA;
  });

  renderComplaints(filtered);
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", applyFilters);
  }
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", applyFilters);
  }
});