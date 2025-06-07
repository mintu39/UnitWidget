let currentRecordId = null;

ZOHO.embeddedApp.on("PageLoad", function (data) {
  currentRecordId = data.EntityId[0];

  document.getElementById("fetchDataBtn").addEventListener("click", () => {
    const url = document.getElementById("unitUrl").value;
    if (!url) return alert("Please enter the Unit URL.");

    document.getElementById("status").innerText = "Fetching data...";

    fetch("https://kijiji-scraper.onrender.com/kijiji-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Scraped data:", data);

        // Populate fields
        document.getElementById("Market_Price_With_Parking_and_Locker").value = data.price;
        document.getElementById("Posting_Title_With_Parking_and_Locker").value = data.title;
        document.getElementById("Bedrooms").value = data.bedrooms;
        document.getElementById("Bathrooms").value = data.bathrooms;
        document.getElementById("Number_of_Parking_Spaces").value = data.parking_included;

        document.getElementById("status").innerText = "Data fetched. You can now edit and update.";
      })
      .catch(err => {
        console.error("Fetch error:", err);
        document.getElementById("status").innerText = "Failed to fetch data.";
      });
  });

  document.getElementById("updateDataBtn").addEventListener("click", () => {
    const updatedFields = {
      Market_Price_With_Parking_and_Locker: document.getElementById("Market_Price_With_Parking_and_Locker").value,
      Posting_Title_With_Parking_and_Locker: document.getElementById("Posting_Title_With_Parking_and_Locker").value,
      Bedrooms: document.getElementById("Bedrooms").value,
      Bathrooms: document.getElementById("Bathrooms").value,
      Number_of_Parking_Spaces: document.getElementById("Number_of_Parking_Spaces").value
    };

    ZOHO.CRM.API.updateRecord({
      Entity: "Leads", // Change if needed
      RecordID: currentRecordId,
      APIData: updatedFields
    }).then(function(response) {
      console.log("Update response:", response);
      document.getElementById("status").innerText = "CRM record updated successfully!";
    }).catch(function(err) {
      console.error("Update failed:", err);
      document.getElementById("status").innerText = "Failed to update CRM record.";
    });
  });
});

ZOHO.embeddedApp.init();
