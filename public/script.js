const campaignList = document.getElementById("campaign-list")
        
function formatDate(dateString) {
    const date = new Date(dateString)

    return date.toLocaleDateString("en-SG", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    })
}

function renderCampaigns(campaigns) {
    campaignList.innerHTML = ""

    campaigns.forEach(campaign => {
        const div = document.createElement("div")
        div.classList.add("card")

        const isClosed = campaign.status === "Closed"

        div.innerHTML = `
            <div class="left-section">
                <h2 class="campaign-title">${campaign.title}</h2>

                <p class="campaign-status">
                    ${isClosed 
                    ? `Closed on ${formatDate(campaign.deadline)}`
                    : `In progress, closing on ${formatDate(campaign.deadline)}`
                    }
                </p>

                <button class="btn ${isClosed ? "btn-closed" : "btn-edit"}">
                    ${isClosed ? "Closed" : "Edit Campaign"}
                </button>
            </div>

            <div class="middle-section">
                <div class="line"></div>
            </div>

            <div class="right-section">
                <p class="amount">$${Number(campaign.targetAmount).toLocaleString()} target</p>

                <button class="btn btn-donors">
                    View Donors
                </button>
            </div>
        `

        campaignList.appendChild(div)
    })
}

async function loadCampaigns() {
    const res = await fetch("http://localhost:8080/getCampaign")
    const campaigns = await res.json()

    renderCampaigns(campaigns)
}

if (campaignList) {
    loadCampaigns()
}

const donationList = document.getElementById("donation-list")

async function loadDonations() {
    const res = await fetch("/api/donations")
    const donations = await res.json()

    renderDonations(donations)
}

function renderDonations(donations) {
    donationList.innerHTML = ""

    donations.forEach(donation => {
        const div = document.createElement("div")
        div.className = "card"

        const isClosed = donation.status === "Closed"

        div.innerHTML = `
            <div class="left-section">
                <h2 class="campaign-title">${donation.title}</h2>
                <p class="campaign-status">
                    ${isClosed 
                        ? `Closed on ${formatDate(donation.deadline)}`
                        : `In progress, closing on ${formatDate(donation.deadline)}`
                    }
                </p>

                <button class="btn ${isClosed ? "btn-closed" : "btn-progress"}">
                    ${isClosed ? "Closed" : "View progress"}
                </button>
            </div>

            <div class="middle-section">
                <div class="line"></div>
            </div>

            <div class="right-section">
                <p class="amount">$${Number(donation.amount).toLocaleString()}</p>
            </div>
        `

        donationList.appendChild(div)
    })
}

if (donationList) {
    loadDonations()
}
