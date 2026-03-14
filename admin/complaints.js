let allComplaints = [];

/* Load complaints from backend */

async function loadComplaints(){

  const container = document.getElementById("complaintsContainer");

  const res = await fetch("http://localhost:5000/complaint");

  allComplaints = await res.json();

  renderComplaints(allComplaints);
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

        <small>Student: ${c.studentName}</small><br>
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

  await fetch(`http://localhost:5000/complaint/${id}`,{

    method:"PUT",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({status})

  });

  loadComplaints();
}


/* Search complaints */

document.getElementById("searchBox").addEventListener("input",function(){

  console.log("search:", this.value);
  const value = this.value.toLowerCase();

  const filtered = allComplaints.filter(c =>
    c.category.toLowerCase().includes(value) ||
    c.studentName.toLowerCase().includes(value) ||
    c.location.toLowerCase().includes(value)
  );

  renderComplaints(filtered);

});


/* Status filter */

document.getElementById("statusFilter").addEventListener("change",function(){

  const selected = this.value;

  if(selected === "all"){
    renderComplaints(allComplaints);
  }

  else{
    const filtered = allComplaints.filter(c => c.status === selected);
    renderComplaints(filtered);
  }

});


/* Start page */

loadComplaints();