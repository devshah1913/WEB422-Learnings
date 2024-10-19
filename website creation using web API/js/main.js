/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 2247 / 2
* Student Name:Dev Nirmal shah
* Student Email: dshah98@myseneca.ca
* Course/Section: WEB422/ZAA
* Deployment URL: https://dev-a1.vercel.app/api/listings
*
*****************************************************************************/

let currentPage = 1; // Current page tracker
const itemsPerPage = 15; // Listing on each page
let queryName = null; // Current search query

const apiEndpoint = "https://dev-a1.vercel.app/api/listings"; // Domain URL

// Fetching all data to display on a page
function fetchListingsData() {
  // This will fetch the data and decide how much data want to fetch like items needed per page
  let requestUrl = `${apiEndpoint}?page=${currentPage}&perPage=${itemsPerPage}`;
  if (queryName) {
    //This will help to fetch the data requested like if we search anything in search box
    requestUrl += `&name=${encodeURIComponent(queryName)}`;
  }

  fetch(requestUrl)
    .then(response => {
      //If any error occurs this will execute
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(data => {
      //Check Listings available or not
      if (data.listings && data.listings.length) {
        renderListings(data.listings);
        window.scrollTo(0, 0);
      } else {
        handleNoListings();
      }
    })
    .catch(error => {
      //This will tell specific error which will help to resolve quickly
      console.error("Fetching error:", error);
      handleNoListings();
    });
}

function handleNoListings() {
  // This condition is to check if the page is not on 1
  if (currentPage > 1) {
    // if we want to go backward decrement of a page
    currentPage--; 
  }
  showNoDataMessage();
}

// Render the listings in the table
function renderListings(listings) {
  //Dom is used here to list a tables body
  const tableBody = document.querySelector("#listingTables tbody");
  tableBody.innerHTML = ""; 

  const listingRows = listings
  //Map the listings data to table and row
    .map(listing => `
      <tr data-id="${listing._id}">
        <td>${listing.name}</td>
        <td>${listing.room_type}</td>
        <td>${listing.address.street}</td>
        <td>
          ${listing.summary || "No summary available."}<br/><br/>
          <strong>Accommodates:</strong> ${listing.accommodates || "N/A"}<br/>
          <strong>Rating:</strong> ${listing.review_scores ? listing.review_scores.review_scores_rating : "N/A"} (${listing.number_of_reviews || 0} Reviews)
        </td>
      </tr>
    `).join("");  //this will help to join into a single html string

  tableBody.innerHTML = listingRows;
  document.getElementById("currPage").textContent = currentPage;

  tableBody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      const listingId = row.getAttribute("data-id"); // This will help to get the listing id
      fetchListingDetails(listingId);//This will help to fetch all the data for clicked listing
    });
  });
}

// Fetch details for a specific listing
function fetchListingDetails(id) {
  fetch(`${apiEndpoint}/${id}`)
    .then(response => response.json())
    .then(data => openDetailsModal(data)); 
}

// Open a modal to display detailed information about the listing
function openDetailsModal(data) {
  const modalContent = document.querySelector("#detailsModal .modal-body");
  const listingDetails = data.listing;

  modalContent.innerHTML = `
    <img id="photo" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${listingDetails.images?.picture_url || "https://placehold.co/600x400?text=Photo+Not+Available"}" alt="Listing Image">
    <br /><br />
    ${listingDetails.neighborhood_overview || "No description available."}<br/><br/>
    <strong>Price:</strong> $${listingDetails.price ? listingDetails.price.toFixed(2) : "N/A"}<br />
    <strong>Room:</strong> ${listingDetails.room_type || "N/A"}<br />
    <strong>Bed:</strong> ${listingDetails.bed_type || "N/A"} (${listingDetails.beds || "N/A"})<br/><br/>
  `;

  const modalHeader = document.querySelector("#detailsModal .modal-header");
  modalHeader.innerHTML = `
    <span>${listingDetails.name || "Listing Details"}</span>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  `;

  const modalInstance = new bootstrap.Modal(document.getElementById("detailsModal"), {
    backdrop: "static",
    keyboard: false,
  });
  modalInstance.show();
}

// Load listings when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchListingsData); 

// Display a message when no data is available
function showNoDataMessage() {
  const tableBody = document.querySelector("#listingTables tbody");
  tableBody.innerHTML = '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
}

// Handle pagination controls for previous page
document.getElementById("previous").addEventListener("click", event => {
  event.preventDefault();
  if (currentPage > 1) {
    currentPage--;
    fetchListingsData(); 
    window.scrollTo(0, 0);
  }
});

// Handle pagination controls for next page
document.getElementById("nextPage").addEventListener("click", event => {
  event.preventDefault();
  currentPage++;
  fetchListingsData();
  window.scrollTo(0, 0); 
});

// Handle search functionality when the form is submitted
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  queryName = document.getElementById("name").value.trim();
  currentPage = 1;
  fetchListingsData();
});

// Clear search functionality to reset the form
document.getElementById("clearForm").addEventListener("click", event => {
  event.preventDefault();
  document.getElementById("name").value = ""; 
  queryName = null; 
  currentPage = 1;
  fetchListingsData();
});
