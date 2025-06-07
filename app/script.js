const fieldMap = {
  Unit_Type: "Unit_Type",
  Available_Date: "Available_Date",
  Approximate_Sq_Ft: "Approximate_Sq_Ft",
  Maximum_Occupants: "Maximum_Occupants",
  Property_Condition: "Property_Condition",
  Year_Last_Renovated: "Year_Last_Renovated",
  Number_of_Levels_in_Unit: "Number_of_Levels_in_Unit",
  Unit_Facing: "Unit_Facing",
  Lawn_and_Snow_Care: "Lawn_and_Snow_Care",
  Furnished: "Furnished",
  Basement_Included: "Basement_Included",
  Basement_Details: "Basement_Details",
  AC_Inclusion: "AC_Inclusion",
  Heat_Inclusion: "Heat_Inclusion",
  Internet_Inclusion: "Internet_Inclusion",
  Cable_Inclusion: "Cable_Inclusion",
  Phone_Inclusion: "Phone_Inclusion",
  Corner_Unit: "Corner_Unit",
  Central_Vacuum: "Central_Vacuum",
  Penthouse: "Penthouse",
  Natural_Sunlight: "Natural_Sunlight",
  Fireplace_Common_Area: "Fireplace_Common_Area",
  Fireplace_Bedroom: "Fireplace_Bedroom",
  Upgraded_Bathrooms: "Upgraded_Bathrooms",
  Backsplash_Kitchen: "Backsplash_Kitchen",
  Upgraded_Kitchen: "Upgraded_Kitchen",
  Dishwasher_Included: "Dishwasher_Included",
  Street_Address: "Street_Address",
  City: "City",
  Province: "Province",
  Country: "Country"
};

ZOHO.embeddedApp.on("PageLoad", function () {
  document.getElementById("fetchDataBtn").addEventListener("click", async () => {
    const url = document.getElementById("unitUrl").value.trim();
    if (!url) return alert("Please enter a valid Kijiji URL");

    document.getElementById("status").innerText = "Fetching data...";

    try {
      const response = await fetch("https://kijiji-scraper.onrender.com/kijiji-ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error("Fetch failed");

      const { extracted } = await response.json();
      document.getElementById("status").innerText = "Data fetched successfully";

      const tbody = document.getElementById("fieldTable");
      tbody.innerHTML = "";

      for (const key in fieldMap) {
        const value = extracted[key] ?? "";
        const row = `<tr>
          <td>${key}</td>
          <td><input type="text" id="${key}" value="${value}"></td>
        </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
      }

    } catch (err) {
      console.error(err);
      document.getElementById("status").innerText = "Error fetching data.";
    }
  });
});

ZOHO.embeddedApp.init();
