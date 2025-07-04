var userId = "";
let data = {};
let leasingSel = "";
let scrapedDate = "";
let Source = "";
let BuildingName = "";
let listingId = "";
let loggedInUserId = "";
let propertyCondition = "";
let electricityProvider = "";
let waterProvider = "";
let gasProvider = "";
let hotWaterTankProvider = "";
let Corner_Unit = "";
let Central_Vacuum = "";
let Penthouse = "";
let Fireplace_Common_Area = "";
let Fireplace_Bedroom = "";
let Upgraded_Bathrooms = "";
let Backsplash_Kitchen = "";
let Upgraded_Kitchen = "";
let Dishwasher_Included = "";
let Building_AC_Incl = "";
let Building_Heat_Incl = "";
let Building_Cable_Incl = "";
let Building_Internet_Incl = "";
let Building_Water_Filtration_Rental = "";
let Parking_Garage = "";
let Remote_Garage = "";
let Visitor_Parking = "";
let EV_Charging = "";
let Car_Wash = "";
let Subway_Access = "";
let Laundry_Building = "";
let Lobby_Lounge = "";
let Wheelchair_Access = "";
let Onsite_Staff = "";
let Concierge_24_7 = "";
let Guest_Suites = "";
let Bicycle_Storage = "";
let Elevators = "";
let Buzzer_System = "";
let Security = "";
let Keyless_Entry = "";
let Pet_Spa = "";
let BBQ_Area = "";
let Rooftop_Patio = "";
let Cabanas = "";
let Tennis_Court = "";
let Outdoor_Patio = "";
let Outdoor_Pool = "";
let Outdoor_Child_Play_Area = "";
let Gym_Fitness = "";
let Rec_Room = "";
let Billiards = "";
let Indoor_Pool = "";
let Sauna = "";
let Library = "";
let Squash = "";
let Bowling = "";
let Indoor_Child_Area = "";
let Meeting_Room = "";
let Yoga_Room = "";
let Movie_Room = "";
let unitData = {};
let leadData = {};
let building_data = {};
let Games_Room = "";
let Whirlpool = "";
let Steam_Room = "";
let Basketball = "";
let Golf_Range = "";
let Piano_Lounge = "";
let Daycare = "";
let ParkingLevelNumber = "";
let lawnSnowCare = "";
let buildingType = "";
let basement = "";
let basementDetails = "";
let upgradedBathroom = "";
let upgradedKitchen = "";
let Lastyearrenovated = "";
let Sunlight = "";
let privateTerraceOrBackyard = "";
let view = "";
let numericPrice = "";
let result = "";
let BBQ_Area_Final = "";
let Outdoor_Patio_Final = "";
let sqFt = "";
let furnished = "";
let maximumOccupants = "";
let entranceType = "";
let numberOfLevels = "";
let unitFacing = "";
let flooringCommonArea = "";
let ceilingHeight = "";
let windowCoveringsCommon = "";
let windowCoveringsBedroom = "";
let bedroomLayout = "";
let denAsBedroom = "";
let closetType = "";
let enSuiteBathrooms = "";
let bathroomCountertop = "";
let showerType = "";
let applianceFinish = "";
let kitchenCountertops = "";
let flooringBedrooms = "";
let balconyLocation = "";
let isPrivateTerrace = "";
let numberOfLockers = "";
let lockerDetails = "";
let lockerLevelAndNumber = "";
let utilityShare = "";
let insuranceCompany = "";
let insurancePolicyNumber = "";
let AC_Inclusion = "";
let Heat_Inclusion = "";
let Internet_Inclusion = "";
let utilityNotes = "";
let buildingCategory = "";
let condoCorpNumber = "";
let petRestrictions = "";
let mgmtInfo = "";
let mgmtEmail = "";
let mgmtPhone = "";
let officeAddress = "";
let developerName = "";
let dateOfConstructionISO = "";
let Unitnumber = "";
let UnitNamecorrected = "";
let Walkout_to_Garage = "";
let Private_Garage = "";
let Street_Number = "";
let Street_Name = "";
let Mailbox_Number = "";
let unitName = "";
let obj = "";
let fullName = "";
let FirstName = "";
let LastName = "";
let Mobile = "";
let unitType = "";
let city = "";
let Province = "";
let PostalCode = "";
let bedrooms = "";
let bathrooms = "";
let numberOfFloors = "";
let numberOfUnits = "";
let backyard = "";
let backyardFenced = "";
let Parkingspacs = "";
let parkingDetails = "";

ZOHO.embeddedApp.on("PageLoad", async function () {
  console.log("✅ Widget ready");

  async function populateUserDropdown(selectId) {
    const leasingSel = document.getElementById(selectId);
    if (!leasingSel) {
      console.error(`❌ Element with id ${selectId} not found`);
      return;
    }

    try {
      const [resp, userInfo] = await Promise.all([
        ZOHO.CRM.API.getAllUsers({ Type: "ActiveUsers" }),
        ZOHO.CRM.CONFIG.getCurrentUser()
      ]);

      leasingSel.innerHTML = "";
      loggedInUserId = userInfo.users[0].id;
      const userEmail = userInfo.users[0].email;
      const fullName = userInfo.users[0].full_name;

      if (resp.users?.length) {
        resp.users.forEach((u) => {
          const opt = document.createElement("option");
          opt.value = u.id;
          opt.text = u.full_name || u.email;

          if (u.id === loggedInUserId) {
            opt.selected = true;
          }

          leasingSel.appendChild(opt);
        });
      } else {
        leasingSel.innerHTML = "<option>No active users</option>";
      }

      console.log(`✅ [${selectId}] Logged-in User ID:`, loggedInUserId);
      console.log(`📧 [${selectId}] Email:`, userEmail);
      console.log(`👤 [${selectId}] Name:`, fullName);

      // Update loggedInUserId when another user is selected
      leasingSel.addEventListener("change", function () {
        loggedInUserId = this.value;
        const selectedUser = resp.users.find(u => u.id == loggedInUserId);

        console.log(`✅ [${selectId}] Updated User ID:`, loggedInUserId);
        console.log(`📧 [${selectId}] Email:`, selectedUser?.email || "N/A");
        console.log(`👤 [${selectId}] Name:`, selectedUser?.full_name || "N/A");
      });

    } catch (err) {
      console.error(`❌ Error loading users for ${selectId}:`, err);
      leasingSel.innerHTML = "<option>Error loading users</option>";
    }
  }

  // Usage:
  await populateUserDropdown("ownerid");
  await populateUserDropdown("ownerid1");


  // validateAllFields();
  function validateAllFields() {
    // List all required field IDs here
    const requiredFieldIds = [
      "First_Name",
      "Last_Name",
      "Available_Date",
      "Mobile",
      "Unit_Type",
      "City",
      "Province",
      "Postal_Code",
      "Bedrooms",
      "Bathrooms",
      "number_of_floors",
      "number_of_units",
      "Backyard",
      "Backyard_Fenced",
      "Year_Last_Renovated",
      "Parking_Spaces",
      "Parking_Details",
      "ownerid",
      "Unit_name",
      "Unit_number"
    ];

    let missingFields = [];
    requiredFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        // For select elements, check selected value
        let value = el.value ? el.value.trim() : "";
        if (!value) {
          let label = el.previousElementSibling ? el.previousElementSibling.innerText : id;
          missingFields.push(label);
        }
      }
    });

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all required fields",
        html: `<ul style="text-align:left;">${missingFields.map(f => `<li>${f}</li>`).join("")}</ul>`,
      });
      return false;
    }
    return true;
  }
  function validateAllFields1() {
    // List all required field IDs here
    const requiredFieldIds = [
      "First_Name1",
      "Last_Name1",
      "Mobile1",
      "Email1",
      "ownerid1",
      "Unitaddress1",
      "Unit_Type1",
      "City1",
      "Available_Date1",
      "Province1",
      "Postal_Code1",
      "Bedrooms1",
      "Bathrooms1",
      "number_of_floors1",
      "number_of_units1",
      "Backyard1",
      "Backyard_Fenced1",
      "Year_Last_Renovated1",
      "Parking_Spaces1",
      "Asking_Price1",
      "Parking_Details1",
      "Unit_number1",
      "Date_of_Construction1",
      "sqrfeet1",
      "Unit_Description1"
    ];

    let missingFields = [];
    requiredFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        // For select elements, check selected value
        let value = el.value ? el.value.trim() : "";
        if (!value) {
          let label = el.previousElementSibling ? el.previousElementSibling.innerText : id;
          missingFields.push(label);
        }
      }
    });

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all required fields",
        html: `<ul style="text-align:left;">${missingFields.map(f => `<li>${f}</li>`).join("")}</ul>`,
      });
      return false;
    }
    return true;
  }





  function capitalizeNamePart(name) {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Get First Name
  function extractFirstName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    return capitalizeNamePart(nameParts[0] || "");
  }

  // Get Last Name
  function extractLastName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    const lastName = nameParts.length > 1
      ? nameParts.slice(1).join(" ")
      : fullName.trim();
    return capitalizeNamePart(lastName);
  }

  function extractPhoneNumberFromText(data) {
    const text = JSON.stringify(data).toLowerCase();

    // This will match most North American phone formats (with dashes, spaces, +1, etc.)
    const matches = text.match(/(\+?1[\s\-\.]?)?(\d{3})[\s\-\.]?\d{3}[\s\-\.]?\d{4}/g);

    if (!matches || matches.length === 0) return "";

    // Get the **last** phone-like match
    const lastMatch = matches[matches.length - 1];

    // Extract digits only
    const digits = lastMatch.replace(/\D/g, "");

    // Always return last 10 digits, with "1" in front
    const last10 = digits.slice(-10);
    return last10;
  }
  // Helper to parse date from the string
  function parseAvailableDate(text) {
    const dateMatch = text.match(/available\s*(from)?\s*(.*)/i);
    if (dateMatch && dateMatch[2]) {
      const parsed = new Date(dateMatch[2].trim());
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  }
  // Helper to normalize the date
  function normalizeAvailableDate(dateObj) {
    if (!dateObj) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    dateObj.setHours(0, 0, 0, 0); // ensure comparison uses local time

    const effectiveDate = dateObj < today ? today : dateObj;

    // Return as YYYY-MM-DD in local time
    return effectiveDate.toLocaleDateString("en-CA");
  }
  // Available Date parsing function
  function extractAvailableDate(attributes) {
    if (!attributes || !Array.isArray(attributes)) return "";

    for (let attr of attributes) {
      if (attr.values && Array.isArray(attr.values)) {
        for (let val of attr.values) {
          if (
            typeof val === "string" &&
            val.toLowerCase().includes("available")
          ) {
            const parsedDate = parseAvailableDate(val);
            return normalizeAvailableDate(parsedDate);
          }
        }
      }
    }

    return "";
  }
  // Detect unit type based on title and description
  function detectUnitTypeFromTitleAndDescription(
    title = "",
    descriptionArray = []
  ) {
    const text = (
      title +
      " " +
      (descriptionArray || []).join(" ")
    ).toLowerCase();

    const typeMap = [
      {
        type: "Stacked Townhouse",
        keywords: [
          "stacked condo townhouse",
          "stacked condo townhome",
          "2-storey stacked townhouse",
          "3-storey stacked townhome",
          "multi-level townhouse",
          "multi-level townhome",
          "upper unit townhouse",
          "lower unit townhouse",
          "upper level townhouse",
          "lower level townhouse",
          "stacked unit",
          "stacked style townhouse",
          "stacked town",
          "townhouse style condo",
          "townhome style condo",
          "condo townhouse",
          "condo townhome",
          "upper stacked town",
          "lower stacked town",
          "townhouse condo",
          "back to back townhouse",
          "back-to-back stacked townhome",
          "stacked TH",
          "stacked t/h",
          "stacked t.h.",
          "2 level stacked town",
          "stacked town house",
          "stack townhome",
          "stack town house"

        ],
      },
      {
        type: "Basement",
        keywords: [
          "Basement apartment for rent",
          "Basement unit for rent",
          "Separate entrance basement apartment",
          "Separate entrance basement unit",
          "Private basement apartment",
          "Private basement unit",
          "Walkout basement apartment",
          "Legal basement apartment",
          "Finished basement apartment",
          "Renovated basement apartment",
          "Newly renovated basement unit",
          "Bright basement apartment",
          "Above ground basement apartment",
          "Spacious basement apartment",
          "Basement bachelor apartment",
          "1 bedroom basement apartment",
          "2 bedroom basement apartment",
          "Studio basement apartment",
          "Fully furnished basement apartment"

        ],
      },
      {
        type: "Condominium",
        keywords: [
          "condo suite",
          "condo flat",
          "condo residence",
          "condo loft",
          "condo studio",
          "condo property",
          "high-rise condo",
          "low-rise condo",
          "mid-rise condo",
          "luxury condominium",
          "modern condo",
          "new condo",
          "brand new condo",
          "condo building",
          "condo complex",
          "condo rental",
          "condo for rent",
          "condo for lease",
          "condo accommodation",
          "condo",
          "apartment condo",
          "condo apartments",
          "condo style apartment",
          "apartment style condo",
          "condo townhouse",
          "condo townhome",
          "condo living",
          "executive condo",
          "premium condo",
          "upscale condo",
          "boutique condo",
          "Condozet run"
        ],
      },
      {
        type: "Unit - Apartment Building",
        keywords: [
          "mid-rise",
          "apartment",
          "apartment building",
          "apartment unit",
          "apartment suite",
          "apartment flat",
          "apartment residence",
          "apartment rental",
          "apartment for rent",
          "apartment for lease",
          "apartment complex",
          "unit apartment",
          "unit for rent",
          "unit for lease",
          "rental unit",
          "rental apartment",
          "residential unit",
          "residential apartment",
          "building apartment",
          "building unit",
          "building suite",
          "corner apartment",
          "corner suite",
          "high-rise apartment",
          "high-rise unit",
          "low-rise apartment",
          "low-rise unit",
          "mid-rise apartment",
          "mid-rise unit",
          "multi-unit building",
          "multi-unit apartment",
          "multi residential building",
          "multi family apartment",
          "multi family unit",
          "apartment tower",
          "apartment block",
          "unit in apartment building"
        ],
      },
      {
        type: "Single Unit - House",
        keywords: [
          "single family home",
          "single family house",
          "single detached",
          "detached house",
          "detached home",
          "freehold house",
          "freehold home",
          "standalone house",
          "standalone home",
          "private house",
          "private detached",
          "private detached house",
          "private detached home",
          "single dwelling",
          "single unit home",
          "single unit detached",
          "bungalow house",
          "bungalow home",
          "entire home",
          "entire detached house",
          "entire detached home",
          "house for rent",
          "home for rent",
          "detached for rent",
          "single family detached",
          "single family detached house",
          "single family detached home",
          "single residence",
          "private residence",
          "stand alone house",
          "stand alone home"
        ],
      },
      {
        type: "Multi Unit - Above Ground",
        keywords: [
          "duplex",
          "triplex unit",
          "fourplex unit",
          "multi-plex",
          "multi unit house",
          "multi unit building",
          "multi family home",
          "multi family house",
          "main floor unit",
          "upper unit",
          "upper floor unit",
          "upper suite",
          "second floor unit",
          "third floor unit",
          "top floor unit",
          "above ground unit",
          "above grade unit",
          "above ground suite",
          "above grade suite",
          "upstairs suite",
          "upstairs apartment",
          "upper level suite",
          "upper level apartment",
          "main level unit",
          "main level suite",
          "main floor apartment",
          "corner unit apartment",
          "corner unit suite",
          "corner apartment",
          "multi unit above ground",
          "multi unit residence",
          "multi storey unit"
        ],
      },
      {
        type: "Student Room",
        keywords: [
          "student room",
          "student housing",
          "room near college",
          "student rental",
          "student accommodation",
          "student residence",
          "student dorm",
          "student dormitory",
          "room for student",
          "student room for rent",
          "student housing rental",
          "student housing room",
          "student suite",
          "student unit",
          "room for university student",
          "room for college student",
          "room close to college",
          "room close to university",
          "room near campus",
          "room by campus",
          "student room rental",
          "student lease",
          "student living",
          "all inclusive student housing",
          "all inclusive student accommodation",
          "shared student housing",
          "shared student room",
          "private student room",
          "furnished student room",
          "room near university",
          "all-inclusive student room",
        ],
      },
    ];

    for (let entry of typeMap) {
      for (let keyword of entry.keywords) {
        if (text.includes(keyword)) {
          return entry.type;
        }
      }
    }

    return "";
  }
  // Paste your city list here
  const cityList = [
    "Acton", "Ajax", "Aligarh", "Allensville", "Alton", "Alwar", "Amherstburg", "Amigo Beach", "Ancaster", "Angus", "Athens", "Aurora", "Aylmer", "Ayr", "Bala", "Balton", "Barrie", "Beamsville", "Belle River", "Belleville", "Binbrook", "Bloomington", "Blue Mountains", "Bolton", "Bothwell", "Bowmanville", "Bracebridge", "Bradford", "Brampton", "Brantford", "Breslau", "Bridgenorth", "Brockville", "Brooklin", "Brucefield", "Burlington", "Burnaby", "Caledon", "Caledon East", "Caledon Village", "Caledonia", "Cambridge", "Campbellville", "Chatham", "Clarington", "Cobourg", "Coldwater", "Collingwood", "Comber", "Concord", "Coquitlam", "Cornwall", "Corunna", "Courtice", "Craighurst", "Crystal Beach", "Crystal Rock", "Deerbrook", "Delete", "Delhi", "Dundas", "East Gwillimbury", "East York", "Elmstead", "Embro", "Essex", "Etobicoke", "Fallingbrook", "Ficko", "Fisherville", "Fonthill", "Forest Harbour", "Fort Erie", "Gananoque", "Georgetown", "Georgina", "Gravenhurst", "Greater Napanee", "Green River", "Grimsby", "Guelph", "Gwalior", "Haldimand", "Halton Hills", "Hamilton", "Hannon", "Harrisburg", "Hathras", "Holland Landing", "Honey Harbour", "Horseshoe Valley", "Huntsville", "Ilderton", "Ingersoll", "Innisfil", "Jaipur", "Jarvis", "Jasper", "Jerseyville", "Jodhpur", "Johnstown", "Kanata", "Katowice", "Kattleby", "Kemptville", "Kennedy Acres", "Keswick", "Kimberley", "Kimberly", "King City", "Kingston", "Kingsville", "Kitchener", "Kleinburg", "Klondyke", "Komoka", "Krakow", "Lakefield", "LaSalle", "Leamington", "Lefroy", "Lincoln", "Lindsay", "Lindsy", "Listowel", "Little Britain", "London", "Mallorytown", "Malton", "Maple", "Markham", "Merlin", "Metcalfe", "Milbrook", "Millbrook", "Milton", "Mississauga", "Mount Hope", "Muskoka", "Nagaur", "Nashville", "Navan", "New Delhi", "New Tecumseth", "New Westminster", "Newcastle", "Newmarket", "Newtonville", "Niagara Falls", "Niagara-on-the-Lake", "Nobleton", "North Vancouver", "North York", "Norwood", "Oakville", "Oakwood", "Odessa", "Oldcastle", "Orangeville", "Orillia", "Osgoode", "Oshawa", "Ottawa", "Owen Sound", "Paris", "Pefferlaw", "Peterborough", "Pickering", "Pinkerton", "Pittsburgh", "Point Edward", "Port Colborne", "Port Coquitlam", "Port Hope", "Port Moody", "Port Perry", "Port Rowan", "Portservain", "Prince Edward", "Prishtine", "Pushkar", "Richmond Hill", "Rosseau", "Saint Catharines", "Saint George", "Saint Joachim", "Saint Thomas", "Sarnia", "Scarborough", "Schomberg", "Shannonville", "Sikar", "Simcoe", "South Woodslee", "Spencerville", "Springdale Park", "Springwater", "St Catharines", "St Thomas", "St. Catharines", "St. Thomas", "Staples", "Stevensville", "Stittsville", "Stoney Creek", "Stoney Point", "Stouffville", "Stratford", "Strathroy", "Sunderland", "Surrey", "Taunton", "Tecumseh", "Test City", "Thamesford", "Thompsonville", "Thornhill", "Thornton", "Thorold", "Thousand Islands", "Tillbury", "Tillsonburg", "Tirana", "Toronto", "Unionville", "Uxbridge", "Vancouver", "Vanier", "Vaughan", "Warsaw", "Wasaga Beach", "Waterdown", "Waterloo", "Welland", "West Gwillimbury", "West Vancouver", "Wheatley", "Whitby", "Whitchurch-Stouffville", "Willowdale", "Windsor", "Windsville", "Woodbridge", "Woodstock", "Wyoming", "York"
  ];

  function extractCityFromAddress(data) {
    const text = JSON.stringify(data).toLowerCase();

    // For best matching, sort by length (to match "St. Catharines" before "St Catharines")
    const sortedCities = cityList.slice().sort((a, b) => b.length - a.length);

    for (const city of sortedCities) {
      // Allow matching ignoring periods/commas (St. Catharines ~ St Catharines)
      const cityPattern = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex
        .replace(/[\.\,]/g, '[\\.\\,\\s]?'); // period/comma/space flexible
      const regex = new RegExp(`\\b${cityPattern}\\b`, 'i');
      if (regex.test(text)) {
        return city; // Return the first matched city
      }
    }
    return ""; // Nothing found
  }

  // Detect number of floors based on description
  function detectNumberOfFloors() {
    const text = JSON.stringify(data).toLowerCase();

    // explicit digits: "3-storey", "4 level", "5 floors", "top floor (3rd)"
    const numMatch = text.match(
      /(\d{1,2})\s*(?:-?\s*storey|floor|floors|level|levels)/
    );
    if (numMatch) return parseInt(numMatch[1]);

    // relative keywords
    if (/multi-storey|multi level/.test(text)) return "Multi-storey";
    if (/walk-up/.test(text)) return "Walk-up";
    if (/main floor/.test(text)) return 1;
    if (/top floor/.test(text)) return "Top floor";

    return "";
  }
  // Detect number of units based on description
  function detectNumberOfUnits() {
    const text = JSON.stringify(data).toLowerCase();

    const numMatch = text.match(/(\d{1,4})\s*units?/); // e.g. "40 units", "100+ units"
    if (numMatch) return parseInt(numMatch[1]);

    if (/100\+\s*units|hundreds of units/.test(text)) return "100+";
    if (/boutique building|small complex|exclusive/.test(text))
      return "Small / Boutique";

    return "";
  }
  // detect backyard no backyard.
  function detectBackyard() {
    const text = JSON.stringify(data).toLowerCase();

    if (text.includes("private backyard") || text.includes("private yard")) {
      return "Included";
    }
    if (
      text.includes("shared backyard") ||
      text.includes("shared green space")
    ) {
      return "Shared";
    }
    if (
      text.includes("no backyard access") ||
      text.includes("no access to backyard") ||
      text.includes("no yard access")
    ) {
      return "No Backyard";
    }

    return "Not Included";
  }
  // Detect backyard fenced status based on description and backyard value
  function detectBackyardFenced() {
    const text = JSON.stringify(data).toLowerCase();

    if (text.includes("No Backyard") || text.includes("Not Included")) {
      return "No Backyard";
    }

    if (text.includes("fully fenced") || text.includes("fenced yard")) {
      return "Yes";
    }

    if (
      text.includes("unfenced") ||
      text.includes("open yard") ||
      text.includes("no fence")
    ) {
      return "No";
    }

    // Default if nothing is mentioned
    return "No";
  }
  // Extract parking spaces from vipPrimary and text content
  function extractParkingSpacesFromText() {
    // Lowercase for easier matching
    const text = JSON.stringify(data).toLowerCase();
    // 1. Highest priority: detect "no parking"
    if (text.includes("no parking")) return 0;

    // 2. Look for "#+ parking" (e.g. "3+ parking included")
    let match = text.match(/(\d+)\s*\+\s*parking/);
    if (match) return parseInt(match[1]);

    // 3. Look for "# parking" (e.g. "2 parking included", "1 parking included")
    match = text.match(/(\d+)\s*parking/);
    if (match) return parseInt(match[1]);

    // 4. "parking included" (just says included, but not how many: return 1 as default)
    if (text.includes("parking included")) return 1;

    // 5. Fallback: no info
    return "";
  }
  // Detect parking details based on description and title
  function detectParkingDetails(descriptionArray = [], title = "") {
    const text = (title + " " + descriptionArray.join(" ")).toLowerCase();

    if (text.includes("no parking")) {
      return "No Parking Available";
    }

    if (
      text.includes("street parking only") ||
      text.includes("only street parking")
    ) {
      return "Street Parking";
    }

    if (text.includes("building parking garage")) {
      return "Building Parking Garage";
    }

    if (
      text.includes("garage and outdoor") ||
      text.includes("parking garage and outdoor lot")
    ) {
      return "Parking Garage and Outdoor Parking Lot";
    }

    if (text.includes("outdoor parking lot")) {
      return "Outdoor Parking Lot";
    }

    if (text.includes("full driveway and garage")) {
      return "Full Driveway & Garage";
    }

    if (text.includes("left side of driveway and garage")) {
      return "Left Side of Driveway & Garage";
    }

    if (text.includes("right side of driveway and garage")) {
      return "Right Side of Driveway & Garage";
    }

    if (text.includes("left side of driveway")) {
      return "Left Side of Driveway";
    }

    if (text.includes("right side of driveway")) {
      return "Right Side of Driveway";
    }

    if (text.includes("full driveway")) {
      return "Full Driveway";
    }

    if (text.includes("parking garage")) {
      return "Building Parking Garage";
    }

    return ""; // Default if no matches
  }
  //extract square footage from vipPrimary
  function extractSqFt(vipPrimary) {
    if (!vipPrimary || !Array.isArray(vipPrimary)) return "";

    const matchItem = vipPrimary.find((x) =>
      /\b\d{1,3}(,\d{3})?\s*(sq\s?ft|sqft)\b/i.test(x)
    );
    if (!matchItem) return "";

    const match = matchItem.match(/\d{1,3}(,\d{3})?/);
    if (!match) return "";

    const sqft = parseInt(match[0].replace(/,/g, ""));

    // Round to nearest 10
    return Math.round(sqft / 10) * 10;
  }
  /// Detect unit name based on location or description
  function detectUnitName() {
    return data?.location || "";
  }
  // Detect property condition based on description
  function detectPropertyCondition(descriptionArray) {
    const combined = (descriptionArray || []).join(" ").toLowerCase();
    if (combined.includes("brand new") || combined.includes("never lived in")) {
      return "Brand New";
    } else if (
      combined.includes("renovated") ||
      combined.includes("upgraded")
    ) {
      return "Newly Renovated";
    } else if (combined.includes("moderate") || combined.includes("fair")) {
      return "Moderate";
    } else if (
      combined.includes("needs work") ||
      combined.includes("fixer upper")
    ) {
      return "Needs Renovations";
    }
    return "";
  }
  // detect balcony location.
  function detectBalconyLocation(descriptionArray = [], balconyType = "") {
    // Rule override for specific balcony type
    if (balconyType.toLowerCase() === "front porch") {
      return "Front Hallway";
    }

    const text = (descriptionArray || []).join(" ").toLowerCase();

    const mapping = [
      {
        value: "Bedroom and Living Area",
        keywords: [
          "balcony in bedroom and living room",
          "balcony off bedroom and living room",
        ],
      },
      {
        value: "Both Bedrooms and Living Area",
        keywords: [
          "both bedrooms and living room",
          "balcony from both bedrooms and living",
        ],
      },
      {
        value: "Both Bedrooms",
        keywords: ["balcony from both bedrooms", "balcony off both bedrooms"],
      },
      {
        value: "Front Hallway & Living area",
        keywords: [
          "balcony in front hallway and living room",
          "balcony off front hallway and living",
        ],
      },
      {
        value: "Front Hallway & Kitchen",
        keywords: [
          "balcony in front hallway and kitchen",
          "balcony off front hallway and kitchen",
        ],
      },
      {
        value: "Front Hallway",
        keywords: [
          "balcony in front hallway",
          "balcony off hallway",
          "hallway balcony",
        ],
      },
      {
        value: "Living Area",
        keywords: [
          "balcony from living room",
          "living room access to balcony",
          "balcony off living room",
        ],
      },
      {
        value: "Bedroom",
        keywords: ["balcony off bedroom", "balcony in bedroom"],
      },
      {
        value: "Bathroom",
        keywords: ["balcony in bathroom", "bathroom access to balcony"],
      },
    ];

    for (const item of mapping) {
      for (const keyword of item.keywords) {
        if (text.includes(keyword)) return item.value;
      }
    }

    return "No Balcony";
  }
  // Electricity provider detection based on description
  function detectElectricityProvider(descriptionArray = []) {
    const providers = {
      arthurs: "Arthurs Fuel",
      thorold: "City of Thorold",
      essex: "Essex Powerline",
      halton: "Halton Hills Hydro",
      pemi: "Pemi Provident",
      "utilities kingston": "Utilities Kingston",
      willmthydro: "Willmthydro",
      wyse: "Wyse",
      "4k": "4K",
      alectra: "Alectra",
      algoma: "Algoma Power",
      bradford: "Bradford West Gwillimbury",
      brampton: "Brampton Hydro",
      brantford: "Brantford Hydro",
      burlington: "Burlington Hydro",
      "niagara power": "Canadian Niagara Power Inc.",
      carma: "Carma",
      kitchener: "City of Kitchener",
      "clean cut": "Clean Cut Energy",
      cricket: "Cricket Energy",
      "crown crest": "Crown Crest Capital",
      "direct energy": "Direct Energy",
      durham: "Durham Hydro",
      "earth power": "Earth Power",
      elexicon: "Elexicon Energy",
      whitby: "Elexicon Energy Whitby",
      enbridge: "Enbridge",
      enercare: "Enercare",
      "energy +": "Energy + Inc.",
      enersource: "Enersource",
      enova: "Enova",
      enpower: "EnPower Group",
      entegrus: "Entegrus Powelines",
      enwin: "Enwin",
      erth: "ERTH Power",
      fibre: "FibreStream",
      flexcon: "Flexcon",
      "fort erie": "Fort Erie - Canadian Niagara Power",
      granbridge: "Grandbridge Energy",
      grimsby: "Grimsby power",
      guelph: "Guelph Hydro",
      holton: "Holton Hydro",
      "hydro one": "Hydro One",
      ottawa: "Hydro Ottawa",
      innpower: "InnPower",
      kw: "KW Hydro",
      london: "London Hydro",
      mersey: "Mersey",
      metergy: "Metergy Solutions",
      "nd energy": "ND Energy",
      newmarket: "Newmarket-Tay Power Distribution",
      "niagara peninsula": "Niagara Peninsula Energy",
      oakville: "Oakville Hydro",
      oshawa: "Oshawa Power",
      "power stream": "Power Stream",
      priority: "Priority",
      provident: "Provident",
      reliance: "Reliance Home Comfort",
      spectra: "Spectra",
      "toronto hydro": "Toronto Hydro",
      "toronto water": "Toronto Water",
      tillsonburg: "Town of Tillsonburg",
      "union gas": "Union Gas",
      veridian: "Veridian",
      wasaga: "Wasaga Distribution Inc",
      "waterloo north": "Waterloo North Hydro",
      welland: "Welland Hydro",
      "wyse meter": "Wyse Meter",
    };

    const text = (descriptionArray || []).join(" ").toLowerCase();

    for (const key in providers) {
      if (text.includes(key)) {
        return providers[key];
      }
    }

    return "";
  }
  // Detect water provider based on description
  function detectWaterProvider(descriptionArray = []) {
    const providers = [
      "Arthurs Fuel",
      "City of Oakville",
      "City of Oshawa",
      "City of Pickering",
      "City of Tecumseh",
      "Edoes",
      "Ersolutions",
      "Peel Water",
      "Utilities Kingston",
      "Wyse",
      "4K",
      "Alectra",
      "Aquaman Bulk Water Supply",
      "Bradford West Gwillimbury",
      "Brantford Utilities",
      "Burlington Hydro",
      "Carma",
      "City of Barrie",
      "City of Brantford",
      "City of Burlington",
      "City of Cambridge",
      "City of Guelph",
      "City of Kitchener",
      "City of London",
      "City of Niagara Falls",
      "City of Orillia",
      "City of Ottawa",
      "City of Port Colborne",
      "City of Richmond hill",
      "City of St. Catharines",
      "City of Thorold",
      "City of Toronto",
      "City of Vaughan",
      "City of Waterloo",
      "City of Whitby",
      "Clean Cut Energy",
      "Cricket Energy",
      "Crown Crest Capital",
      "Durham Region",
      "Earth Power",
      "Elexicon Energy",
      "Enbridge",
      "Enersource",
      "Enova",
      "Entegrus Powerlines",
      "Enwin",
      "ERTH Power",
      "Essa Township",
      "Essex power lines",
      "Fernsby",
      "Fort Erie - Water and Waste Services",
      "Granbridge Energy",
      "Guelph Hydro",
      "Haldimand County",
      "Haldimand County Water and Wastewater",
      "Hydro One",
      "Included",
      "InnPower",
      "King City",
      "Kitchener Utilities",
      "Lakershore Power Line",
      "Linc",
      "London Hydro",
      "Mersey",
      "Metergy Solutions",
      "Middlesex center county",
      "Municipality of Strathroy",
      "ND Energy",
      "Newmarket Hydro",
      "Newmarket Tay Power Distribution",
      "Newmarket-Tay Power Distribution",
      "Oakville Hydro",
      "Ontario Power",
      "Peel Region",
      "Power Stream",
      "Priority",
      "Provident",
      "Reliance home comfort",
      "Spectra",
      "Springwater Region",
      "The City of Georgina",
      "To Be Determined (TBD)",
      "Town of Aurora Water Department",
      "Town of Bradford West Gwillimbury",
      "Town of East Gwillimbury",
      "Town of Fort Erie",
      "Town of Georgina",
      "Town of Grimsby",
      "Town of New Tecumseth",
      "Town of Pelham",
      "Town of Stouffville",
      "Town of Tillsonburg",
      "Township of Springwater",
      "Township of Woolwich",
      "Veridian",
      "Wasaga Distribution Inc",
      "Wastewater",
      "Waterloo North Hydro",
      "Welland Municipality",
      "Welland Water",
      "Welland Water/Wastewater",
      "Wyse Meter",
      "York Region",
    ];

    const text = (descriptionArray || []).join(" ").toLowerCase();

    for (const provider of providers) {
      if (text.includes(provider.toLowerCase())) {
        return provider;
      }
    }

    return "Not Mentioned";
  }
  // Detect gas provider based on description
  function detectGasProvider(descriptionArray = []) {
    const providers = [
      "Arthurs Fuel",
      "City Of Waterloo",
      "Oakville Hydro",
      "Utilities Kingston",
      "4K",
      "Alectra",
      "Bradford West Gwillimbury",
      "Carma",
      "City of Kitchener",
      "Clean Cut Energy",
      "Cricket Energy",
      "Crown Crest Capital",
      "Direct Energy",
      "Earth Power",
      "Elexicon Energy",
      "Enbridge",
      "Enercare",
      "Enersource",
      "Enova",
      "ERTH Power",
      "Hydro One",
      "Included",
      "Kitchener Utilities",
      "London Hydro",
      "Mersey",
      "Metergy Solutions",
      "N/A",
      "Newmarket Tay Power Distribution",
      "Newmarket-Tay Power Distribution",
      "Ontario Power",
      "Power Stream",
      "Priority",
      "Propan",
      "Provident",
      "Reliance home comfort",
      "TBD",
      "Toronto Hydro",
      "Toronto Water",
      "Town of Tillsonburg",
      "UnionGas",
      "Waterloo North Hydro",
    ];

    const text = (descriptionArray || []).join(" ").toLowerCase();

    for (const provider of providers) {
      if (text.includes(provider.toLowerCase())) {
        return provider;
      }
    }

    // Specific matches for official provider names
    if (text.includes("enbridge gas") || text.includes("union gas"))
      return "Enbridge";
    if (text.includes("epcor")) return "EPCOR";
    if (text.includes("kitchener utilities")) return "Kitchener Utilities";
    if (text.includes("utilities kingston")) return "Utilities Kingston";

    return "Not Mentioned";
  }
  // Detect hot water tank provider based on description
  function detectHotWaterTankProvider(descriptionArray = []) {
    const providers = [
      "Arthurs Fuel",
      "Evolve",
      "GSW",
      "Rinnai",
      "Utilities Kingston",
      "4K",
      "4K Energy",
      "Aire One",
      "Alectra",
      "Allianz",
      "Bradford West Gwillimbury",
      "Carma",
      "City of Kitchener",
      "City of Pickering",
      "Clean Cut Energy",
      "Cricket Comfort",
      "Cricket Energy",
      "Cricket Home Comfort",
      "Crown Crest Capital",
      "Direct Energy",
      "Earth Power",
      "Eco Star Home Services Co.",
      "Elevate",
      "Elexicon Energy",
      "En saving Inc",
      "Enbridge",
      "Enercare",
      "Enersource",
      "Enova",
      "Enpure",
      "Enresource",
      "ERTH Power",
      "Genesis Home Services",
      "Gian Inc",
      "Giant",
      "Green Planet",
      "HCSI Home Comfort",
      "Homecorp",
      "Htp",
      "Hydro One",
      "Included",
      "Kirin Air Systems Inc.",
      "Kitchener Utilities",
      "LaSalle Town",
      "LIMCAN",
      "London Hydro",
      "Mersey",
      "Metergy Solutions",
      "Midland",
      "Morenergy",
      "N/A",
      "National Home Services",
      "Newmarket Tay Power Distribution",
      "Newmarket-Tay Power Distribution",
      "Oakville Hydro",
      "Ontario Power",
      "Power Stream",
      "Priority",
      "Provident",
      "Radiant",
      "Region of Peel",
      "Reliance home comfort",
      "Rheem Guardian System",
      "Sandpiper",
      "Simply Green",
      "Superflue",
      "Tankless Water Heater",
      "TBD",
      "To be Determined (TBD)",
      "Toronto Hydro",
      "Toronto Water",
      "Town of Stouffville",
      "Town of Tillsonburg",
      "UnionGas",
      "Vista",
      "Waterloo North Hydro",
    ];

    const text = (descriptionArray || []).join(" ").toLowerCase();

    for (const provider of providers) {
      if (text.includes(provider.toLowerCase())) {
        return provider;
      }
    }

    // Match specific keywords
    if (text.includes("reliance")) return "Reliance home comfort";
    if (text.includes("enercare")) return "Enercare";
    if (text.includes("enbridge rentals")) return "Enbridge";
    if (text.includes("direct energy")) return "Direct Energy";
    if (text.includes("national home services"))
      return "National Home Services";
    if (text.includes("home trust")) return "Home Trust";
    if (text.includes("just energy")) return "Just Energy";

    return "Not Mentioned";
  }
  // Detect corner unit based on description
  function detectCornerUnit() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("corner unit");
  }

  function detectCentralVacuum() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("central vacuum");
  }

  function detectPenthouse() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("penthouse") || text.includes("top floor");
  }

  function detectFireplaceCommonArea() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("fireplace") || text.includes("living room fireplace");
  }

  function detectFireplaceBedroom() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("fireplace in bedroom");
  }

  function detectUpgradedBathrooms() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("upgraded bathroom") || text.includes("modern bath");
  }

  function detectUpgradedKitchen() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("renovated kitchen") ||
      text.includes("modern kitchen") ||
      text.includes("upgraded kitchen") ||
      text.includes("new kitchen") ||
      text.includes("updated kitchen")
    );
  }

  function detectBacksplashKitchen() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("backsplash") ||
      text.includes("tile wall behind stove") ||
      text.includes("tile wall behind sink")
    );
  }
  // Detect dishwasher included based on description and attributes

  function detectDishwasherIncludedFromText() {
    const text = JSON.stringify(data).toLowerCase(); // search everywhere!

    // Array of possible phrases that indicate a dishwasher is included
    const dishwasherKeywords = [
      "dishwasher", // general mention
      "dishwasher included",
      "built-in dishwasher",
      "dishwasher (in unit)",
      "dishwasher (in building)",
      "dishwasher provided",
      "includes dishwasher",
    ];

    for (let keyword of dishwasherKeywords) {
      if (text.includes(keyword)) return true;
    }
    return false;
  }

  function detectBuilding_AC_Incl() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("air conditioning included") ||
      text.includes("central ac") ||
      text.includes("cooling included") ||
      text.includes("a/c provided") ||
      text.includes("no extra for ac")
    );
  }

  function detectBuilding_Heat_Incl() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("heating included") ||
      text.includes("free heat") ||
      text.includes("radiator heating") ||
      text.includes("baseboard heating") ||
      text.includes("no extra cost for heat")
    );
  }

  function detectBuilding_Cable_Incl() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("cable included") ||
      text.includes("rogers tv") ||
      text.includes("tv package") ||
      text.includes("free cable") ||
      text.includes("bell fibe")
    );
  }

  function detectBuilding_Internet_Incl() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("wi-fi included") ||
      text.includes("internet provided") ||
      text.includes("free high-speed") ||
      text.includes("unlimited data") ||
      text.includes("bell/rogers internet")
    );
  }

  function detectBuilding_Water_Filtration_Rental() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("water softener") ||
      text.includes("reverse osmosis") ||
      text.includes("culligan") ||
      text.includes("filter rental") ||
      text.includes("water purification")
    );
  }
  function detectRemote_Garage() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("remote included") ||
      text.includes("garage fob") ||
      text.includes("opener") ||
      text.includes("automatic garage") ||
      text.includes("remote access")
    );
  }
  function detectParking_Garage() {
    const text = JSON.stringify(data).toLowerCase();

    const remoteGarageSelected =
      text.includes("remote included") ||
      text.includes("garage fob") ||
      text.includes("opener") ||
      text.includes("automatic garage") ||
      text.includes("remote access");

    return (
      text.includes("underground parking") ||
      text.includes("garage included") ||
      text.includes("secure parking") ||
      text.includes("indoor parking") ||
      text.includes("heated garage") ||
      remoteGarageSelected
    );
  }
  function detectVisitor_Parking() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("guest parking") ||
      text.includes("visitor spots") ||
      text.includes("visitors welcome") ||
      text.includes("free visitor parking")
    );
  }

  function detectEV_Charging() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("electric vehicle charger") ||
      text.includes("ev station") ||
      text.includes("tesla charger") ||
      text.includes("ev ready")
    );
  }

  function detectCar_Wash() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("car wash bay") ||
      text.includes("onsite car wash") ||
      text.includes("vehicle wash")
    );
  }
  function detectSubway_Access() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("steps to subway") ||
      text.includes("subway access") ||
      text.includes("near ttc") ||
      text.includes("connected to station") ||
      text.includes("direct underground access")
    );
  }

  function detectLaundry_Building() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("in-suite laundry") ||
      text.includes("shared laundry") ||
      text.includes("washer/dryer included") ||
      text.includes("onsite laundry") ||
      text.includes("coin laundry") ||
      text.includes("laundry room")
    );
  }

  function detectLobby_Lounge() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("grand lobby") ||
      text.includes("lounge area") ||
      text.includes("reception") ||
      text.includes("common lounge") ||
      text.includes("waiting area")
    );
  }

  function detectWheelchair_Access() {
    const text = JSON.stringify(data).toLowerCase();

    const elevatorSelected =
      text.includes("elevator") ||
      text.includes("lift") ||
      text.includes("two elevators") ||
      text.includes("service elevator");

    return (
      text.includes("accessible") ||
      text.includes("wheelchair friendly") ||
      text.includes("barrier free") ||
      text.includes("elevator access") ||
      text.includes("mobility-friendly") ||
      elevatorSelected
    );
  }

  function detectOnsite_Staff() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("building staff") ||
      text.includes("live-in super") ||
      text.includes("property manager onsite") ||
      text.includes("janitor") ||
      text.includes("caretaker")
    );
  }

  function detectConcierge_24_7() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("concierge") ||
      text.includes("doorman") ||
      text.includes("front desk") ||
      text.includes("lobby security") ||
      text.includes("reception 24/7")
    );
  }
  function detectGuest_Suites() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("guest rooms") ||
      text.includes("visitor suites") ||
      text.includes("guest accommodation") ||
      text.includes("temporary suite")
    );
  }
  function detectBicycle_Storage() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("bike lockers") ||
      text.includes("bicycle room") ||
      text.includes("cycling storage") ||
      text.includes("bike parking")
    );
  }

  function detectElevators() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("elevator") ||
      text.includes("lift") ||
      text.includes("two elevators") ||
      text.includes("service elevator")
    );
  }
  function detectBuzzer_System() {
    const text = JSON.stringify(data).toLowerCase();

    const conciergeSelected =
      text.includes("concierge") ||
      text.includes("doorman") ||
      text.includes("front desk") ||
      text.includes("lobby security") ||
      text.includes("reception 24/7");

    return (
      text.includes("buzzer") ||
      text.includes("intercom") ||
      text.includes("phone entry") ||
      text.includes("enterphone") ||
      text.includes("access system") ||
      conciergeSelected
    );
  }

  function detectSecurity() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("security guard") ||
      text.includes("24hr monitoring") ||
      text.includes("surveillance") ||
      text.includes("onsite security")
    );
  }

  function detectKeyless_Entry() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("fob access") ||
      text.includes("smart lock") ||
      text.includes("keyless") ||
      text.includes("touchpad lock")
    );
  }
  function detectPet_Spa() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("dog wash") ||
      text.includes("pet grooming station") ||
      text.includes("pet spa") ||
      text.includes("pet shower")
    );
  }
  function detectBBQ_Area() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("bbq terrace") ||
      text.includes("grill area") ||
      text.includes("barbecue") ||
      text.includes("rooftop bbq")
    );
  }
  function detectRooftop_Patio() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("sky terrace") ||
      text.includes("rooftop lounge") ||
      text.includes("terrace") ||
      text.includes("top floor patio")
    );
  }

  function detectCabanas() {
    const text = JSON.stringify(data).toLowerCase();

    const outdoorPoolSelected =
      text.includes("outdoor swimming") ||
      text.includes("pool") ||
      text.includes("sunbathing area");

    const indoorPoolSelected =
      text.includes("heated indoor pool") ||
      text.includes("indoor swimming") ||
      text.includes("lap pool");

    return (
      text.includes("poolside cabanas") ||
      text.includes("cabanas") ||
      text.includes("shaded seating") ||
      outdoorPoolSelected ||
      indoorPoolSelected
    );
  }

  function detectTennis_Court() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("tennis") ||
      text.includes("outdoor court") ||
      text.includes("recreation court")
    );
  }

  function detectOutdoor_Patio() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("backyard") ||
      text.includes("outdoor space") ||
      text.includes("garden terrace") ||
      text.includes("open patio")
    );
  }

  function detectOutdoor_Pool() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("outdoor swimming") ||
      text.includes("pool") ||
      text.includes("sunbathing area")
    );
  }

  function extractWasherManufacturer(data) {
    // 1. Lowercase the entire data text
    const text = JSON.stringify(data).toLowerCase();

    // 2. Define your picklist in lowercase for easier matching
    const washerManufacturers = [
      "galanz", "aeg", "allure", "amana", "asko", "avg", "bertazzoni", "best", "bloomberg", "bluestar",
      "bosch", "braoa", "brgan", "broan", "caloric", "cavavin", "chambers", "cyclone", "dacor", "danby",
      "direct drive", "electrolux", "elica", "faber", "fisher & paykel", "forester", "frigidaire",
      "fulgor", "gaggenau", "gasland", "general electric", "ge appliances", "gorenje", "haier", "hamilton beach",
      "hisense", "homestyles", "huebsch", "iflow", "ikea", "inglis", "jennair", "kenmore", "kitchenaid", "kobe",
      "krupps", "kucht", "la cornue", "lg", "liebherr", "lotus", "lynx", "marvel", "maxima", "maytag", "midea",
      "miele", "moffat", "monogram", "napoleon", "nca", "not mentioned", "nutone", "panasonic",
      "porter & charles", "roper", "sakura", "samsung", "sanyo", "sharp", "silhouette", "sirius", "smeg",
      "sub-zero", "sunbeam", "thermador", "unique appliances", "venmar", "vent a hood", "vesta", "vitara",
      "whirlpool", "wolf", "z-air", "zephyr"
    ];

    // 3. Try to match any manufacturer name in the text (partial/typo-tolerant)
    for (let brand of washerManufacturers) {
      // Handle short brands (e.g., LG, GE) with word boundaries
      const regex = new RegExp(`\\b${brand.replace(/[^a-z0-9]/g, "\\$&")}\\b`, "i");
      if (regex.test(text)) {
        // Return with correct CRM casing (from picklist)
        const crmBrand = brand
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return crmBrand;
      }
    }
    return "Not Mentioned"; // fallback for blank, null, or not found
  }


  function detectOutdoor_Child_Play_Area() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("playground") ||
      text.includes("kids zone") ||
      text.includes("tot lot") ||
      text.includes("children’s park")
    );
  }
  function detectGym_Fitness() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("gym") ||
      text.includes("fitness center") ||
      text.includes("exercise room") ||
      text.includes("cardio") ||
      text.includes("weights")
    );
  }

  function detectRec_Room() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("recreation area") ||
      text.includes("game room") ||
      text.includes("activity room")
    );
  }

  function detectBilliards() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("billiards") ||
      text.includes("pool table") ||
      text.includes("snooker")
    );
  }

  function detectIndoor_Pool() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("heated indoor pool") ||
      text.includes("indoor swimming") ||
      text.includes("lap pool")
    );
  }

  function detectSauna() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("dry sauna") ||
      text.includes("infrared sauna") ||
      text.includes("steam + sauna")
    );
  }

  function detectLibrary() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("library") ||
      text.includes("reading room") ||
      text.includes("study lounge")
    );
  }

  function detectSquash() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("squash") ||
      text.includes("racketball") ||
      text.includes("indoor court")
    );
  }

  function detectBowling() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("bowling alley") ||
      text.includes("lanes") ||
      text.includes("ten pin")
    );
  }

  function detectIndoor_Child_Area() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("kids room") ||
      text.includes("indoor play") ||
      text.includes("children’s zone")
    );
  }

  function detectMeeting_Room() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("conference room") ||
      text.includes("boardroom") ||
      text.includes("meeting space")
    );
  }
  function detectYoga_Room() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("yoga") ||
      text.includes("pilates") ||
      text.includes("meditation studio")
    );
  }

  function detectMovie_Room() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("cinema") ||
      text.includes("media room") ||
      text.includes("theatre")
    );
  }

  function detectGames_Room() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("games lounge") ||
      text.includes("arcade") ||
      text.includes("foosball")
    );
  }

  function detectWhirlpool() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("hot tub") ||
      text.includes("jacuzzi") ||
      text.includes("spa tub")
    );
  }

  function detectSteam_Room() {
    const text = JSON.stringify(data).toLowerCase();
    return text.includes("steam bath") || text.includes("steam room");
  }

  function detectBasketball() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("basketball court") ||
      text.includes("hoop") ||
      text.includes("indoor court")
    );
  }

  function detectGolf_Range() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("golf simulator") ||
      text.includes("putting green") ||
      text.includes("mini golf")
    );
  }

  function detectPiano_Lounge() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("piano") ||
      text.includes("music room") ||
      text.includes("live music area")
    );
  }

  function detectDaycare() {
    const text = JSON.stringify(data).toLowerCase();
    return (
      text.includes("childcare") ||
      text.includes("preschool") ||
      text.includes("day care") ||
      text.includes("licensed daycare")
    );
  }

  // Extract parking level and number from description
  function extractParkingLevelNumber() {
    const text = JSON.stringify(data).toLowerCase();

    // Pattern: Level P1, spot 124
    const match1 = text.match(/level\s*(p\d+)[^\d]*(\d{1,4})/i);
    if (match1) return `${match1[1].toUpperCase()} - ${match1[2]}`;

    // Pattern: Parking space B3
    const match2 = text.match(/parking\s*(space)?\s*([a-z]?\d{1,4})/i);
    if (match2) return match2[2].toUpperCase();

    // Pattern: underground parking on P2, stall 52
    const match3 = text.match(/p(\d+)[^\d]*(stall|space)?\s*(\d{1,4})/i);
    if (match3) return `P${match3[1]} - ${match3[3]}`;

    return "";
  }

  // Detect furnished status based on description
  function detectFurnished(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    if (text.includes("unfurnished") || text.includes("not furnished")) {
      return "No";
    }
    if (text.includes("partially furnished")) {
      return "Partially Furnished";
    }
    if (
      text.includes("furnishing available at extra cost") ||
      text.includes("additional fee") ||
      text.includes("extra cost")
    ) {
      return "Optional - Extra Cost";
    }
    if (text.includes("optional") && text.includes("furnish")) {
      return "Optional - No Cost";
    }
    if (text.includes("fully furnished") || text.includes("furnished")) {
      return "Fully Furnished";
    }
    return "No";
  }
  function detectOnSiteLaundry(data) {
    // Flatten all text, attributes, and descriptions for a global search
    const text = JSON.stringify(data).toLowerCase();

    // Pay Per Use
    if (
      /pay per use|coin(\s|-)?(operated|laundry|machine)|card(\s|-)?operated|paid laundry|pay laundry|pay to use/.test(text)
    ) return "Pay Per Use";

    // En-Suite / In-Unit (most specific, most valuable)
    if (
      /en(\s|-)?suite laundry|in(\s|-)?suite laundry|laundry (in unit)|private laundry|laundry in unit|in-unit laundry|unit has laundry|in unit (washer|dryer|laundry)|in-apartment laundry|laundry inside unit|apartment laundry|unit laundry|inside unit laundry/.test(text)
    ) return "En-Suite";

    // Shared (building/common)
    if (
      /shared laundry|communal laundry|laundry (in building)|building laundry|laundry room|common laundry|laundry in building|shared (washer|dryer)|laundry facilities|community laundry/.test(text)
      ||
      /laundry\s?\(in building\)/.test(text) // direct match for your sample
    ) return "Shared";

    // No Laundry
    if (
      /no laundry|no washer|no dryer|laundry not included|laundry not available|no laundry facilities|no in(\s|-)?building laundry/.test(text)
    ) return "No";

    // If it just says "laundry" but no other details, treat as Shared (weak fallback)
    if (/laundry/.test(text)) return "Shared";

    // Default
    return "";
  }
  // detect private terrace
  function detectPrivateTerraceOrBackyard(
    descriptionArray = [],
    backyardValue = ""
  ) {
    // If Backyard is explicitly marked as Included
    if (backyardValue === "Included") {
      return true; // equivalent to "selected"
    }

    // Otherwise detect based on keywords
    const text = (descriptionArray || []).join(" ").toLowerCase();

    return (
      text.includes("private terrace") ||
      text.includes("private backyard") ||
      text.includes("exclusive yard")
    );
  }
  // Detect entrance type based on title and description
  function detectEntranceType(descriptionArray = []) {
    const text = (descriptionArray || [].join(" ")).toLowerCase();

    if (text.includes("private entrance")) {
      return "Private - Side Entrance";
    }
    if (text.includes("shared entrance")) {
      return "Shared - Side Entrance";
    }
    if (text.includes("private entrance")) {
      return "Private - Front Entrance";
    }
    if (text.includes("shared entrance")) {
      return "Shared - Front Entrance";
    }
    if (
      text.includes("walk out") ||
      text.includes("walkout") ||
      text.includes("walk-out") ||
      text.includes("back entrance")
    ) {
      return "Private - Walk out (Back Entrance)";
    }
    if (
      text.includes("entrance through garage") ||
      text.includes("garage access")
    ) {
      return "Entrance Only via Garage";
    }
    if (
      text.includes("via main floor") ||
      text.includes("through upstairs") ||
      text.includes("main unit access")
    ) {
      return "Entrance Only via Main floor Unit";
    }
    if (
      text.includes("no basement") ||
      text.includes("above ground") ||
      (!text.includes("entrance") && !text.includes("basement"))
    ) {
      return "N/A - No basement";
    }

    return "N/A - No basement";
  }
  // Detect number of levels based on title and description
  function detectNumberOfLevels(descriptionArray = [], title = "") {
    const text = (
      title +
      " " +
      (descriptionArray || []).join(" ")
    ).toLowerCase();

    const matchMap = [
      {
        value: "1",
        keywords: [
          "bungalow",
          "flat",
          "single level",
          "main floor",
          "ground level",
          "ranch",
          "one floor",
          "1 storey",
        ],
      },
      {
        value: "2",
        keywords: [
          "duplex",
          "2-storey",
          "two-storey",
          "bi-level",
          "two levels",
          "upper/lower level",
          "split level",
        ],
      },
      {
        value: "3",
        keywords: ["triplex", "3-storey", "three levels", "three floors"],
      },
      {
        value: "1",
        keywords: [
          "shared house",
          "student room",
          "co-living",
          "shared unit",
          "room for rent",
        ],
      },
    ];

    for (let entry of matchMap) {
      for (let keyword of entry.keywords) {
        if (text.includes(keyword)) {
          return entry.value;
        }
      }
    }

    return "";
  }
  function extractEmailFromData(data) {
    const text = JSON.stringify(data).toLowerCase();
    // Regex for matching most email formats
    const emailMatch = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
    return emailMatch ? emailMatch[0] : "";
  }

  // Detect unit facing direction based on description
  function detectUnitFacing(descriptionArray = []) {
    const directions = [
      "north",
      "south",
      "east",
      "west",
      "northeast",
      "northwest",
      "southeast",
      "southwest",
    ];
    const joined = (descriptionArray || []).join(" ").toLowerCase();

    for (let dir of directions) {
      const pattern = new RegExp(`\\b${dir}\\b`, "i");
      if (pattern.test(joined)) {
        return dir.charAt(0).toUpperCase() + dir.slice(1);
      }
    }

    return "";
  }
  // Detect flooring type in common area based on description
  function detectFlooringCommonArea(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    const flooringOptions = [
      "vinyl",
      "laminate",
      "carpet",
      "hardwood",
      "tile",
      "concrete",
    ];

    for (let option of flooringOptions) {
      if (text.includes(option)) {
        return option.charAt(0).toUpperCase() + option.slice(1); // Capitalize first letter
      }
    }

    return ""; // If nothing matches
  }
  // Detect ceiling height based on description
  function detectCeilingHeight(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const ceilingMap = {
      7: "7 Foot",
      8: "8 Foot",
      9: "9 Foot",
      10: "10 Foot",
      15: "15 Foot as a Ceiling Height",
    };

    const match = text.match(
      /(7|8|9|10|15)\\s?(foot|ft)[\\s-]?(ceiling|ceilings)?/
    );
    if (match && ceilingMap[match[1]]) {
      return ceilingMap[match[1]];
    }

    return "";
  }
  // Detect window coverings based on description
  function detectWindowCoverings(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const matchMap = [
      {
        keywords: [
          "roller shade",
          "roller blind",
          "roller blinds",
          "roller shades",
        ],
        value: "Roller",
      },
      {
        keywords: ["1 inch blinds", "1'' blind", '1" blind', "1 inch aluminum"],
        value: "1'' Aluminum Blinds",
      },
      {
        keywords: ["2 inch blind", "2'' blind", "2 inch faux", "2 inch vinyl"],
        value: "2'' Faux Blinds",
      },
      {
        keywords: ["california shutter", "shutters"],
        value: "California Shutters",
      },
      { keywords: ["vertical blind", "verticals"], value: "Vertical" },
      {
        keywords: [
          "no window covering",
          "without window covering",
          "no blinds",
        ],
        value: "No Window Coverings",
      },
      { keywords: ["drape", "curtain"], value: "Drapes" },
      { keywords: ["zebra blind", "zebra shade"], value: "Zebra" },
    ];

    for (let item of matchMap) {
      for (let kw of item.keywords) {
        if (text.includes(kw)) return item.value;
      }
    }

    return "Other";
  }
  // Detect number of bedrooms from structured 'primary' field and full text
  function extractBedroomsSmart(vipPrimary = [], title = "", description = []) {
    const combinedText = (
      title +
      " " +
      (description || []).join(" ")
    ).toLowerCase();

    // 1. Studio detection
    if (combinedText.includes("studio")) {
      return "Studio";
    }

    // 2. Bedroom + Den or Media patterns
    const comboPatterns = [
      { regex: /1\s*(bed(room)?)?\s*\+\s*(den|media)/, value: "1 + Den" },
      { regex: /2\s*(bed(room)?)?\s*\+\s*(den|media)/, value: "2 + Den" },
      { regex: /3\s*(bed(room)?)?\s*\+\s*(den|media)/, value: "3 + Den" },
      { regex: /4\s*(bed(room)?)?\s*\+\s*(den|media)/, value: "4 + Den" },
      { regex: /5\s*(bed(room)?)?\s*\+\s*(den|media)/, value: "5 + Den" },
      { regex: /6\s*(bed(room)?)?\s*\+\s*(den|media)/, value: "6 + Den" },
    ];

    for (let { regex, value } of comboPatterns) {
      if (regex.test(combinedText)) {
        return value;
      }
    }

    // 3. Fallback: search vipPrimary for numeric bedrooms
    for (let item of vipPrimary) {
      const match = item.match(/(\d+)\s*bed(room)?s?/i);
      if (match) return match[1]; // Just the number
    }

    return ""; // Nothing found
  }
  // Detect bedroom layout based on description
  function detectBedroomLayout(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    if (
      text.includes("basement room no window") ||
      text.includes("no window in any bedroom") ||
      text.includes("no windows in bedrooms") ||
      text.includes("all interior rooms") ||
      text.includes("no bedroom has a window")
    ) {
      return "All Interior Rooms (No Windows in room)";
    }

    if (
      text.includes("no window in second bedroom") ||
      text.includes("2nd room no window") ||
      text.includes("second room has no window") ||
      text.includes("only one bedroom has window")
    ) {
      return "2nd room is Interior (2nd room has no Windows)";
    }

    if (
      text.includes("all rooms have windows") ||
      text.includes("each bedroom has a window") ||
      text.includes("every bedroom has windows") ||
      text.includes("all bedrooms have windows")
    ) {
      return "No Interior rooms (All rooms have windows)";
    }

    return "";
  }
  // Detect if den can be used as a bedroom
  function detectDenAsBedroom(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    if (
      text.includes("den can be used as bedroom") ||
      text.includes("den can be used as a bedroom")
    ) {
      return "Yes";
    }

    if (text.includes("small office") || text.includes("open den")) {
      return "No";
    }

    if (!text.includes("den")) {
      return "No Den";
    }

    return "";
  }
  // Detect closet type based on description
  function detectClosetType(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    // 1. Most Specific Match First
    if (text.includes("his and hers walk-in") && text.includes("master")) {
      return "His and Hers Walk-in (Master Only)";
    }

    if (
      (text.includes("his and hers") || text.includes("his & hers")) &&
      text.includes("all bedrooms")
    ) {
      return "His and Hers (Multiple Rooms)";
    }

    if (text.includes("walk-in") && text.includes("multiple")) {
      return "Walk-in (Multiple Rooms)";
    }

    if (
      (text.includes("his and hers") || text.includes("his & hers")) &&
      (text.includes("primary") || text.includes("master"))
    ) {
      return "His and Hers (Primary Bedroom Only)";
    }

    if (
      text.includes("walk-in") &&
      (text.includes("primary") || text.includes("master"))
    ) {
      return "Walk-in (Primary Bedroom Only)";
    }

    if (
      text.includes("no closets") ||
      text.includes("no closet") ||
      text.includes("no storage")
    ) {
      return "No Closets";
    }

    if (
      text.includes("some rooms have no closet") ||
      text.includes("not all bedrooms have closets")
    ) {
      return "No Closets In Some Rooms";
    }

    // Fallback if no special patterns matched
    if (text.includes("closet")) {
      return "Regular Closets";
    }

    return ""; // Unknown
  }
  // Detect en-suite bathrooms based on description
  function detectEnSuiteBathrooms(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    // 1. Full Bath in Primary + Jack & Jill
    if (
      (text.includes("jack and jill") || text.includes("jack & jill")) &&
      text.includes("primary") &&
      (text.includes("ensuite") || text.includes("en-suite"))
    ) {
      return "Full Bath in Primary and Jack & Jill in Multiple Rooms";
    }

    // 2. Jack & Jill in Multiple Rooms
    if (text.includes("jack and jill") || text.includes("jack & jill")) {
      return "Jack & Jill in Multiple Rooms";
    }

    // 3. Full Bath in Multiple Rooms
    if (
      (text.includes("ensuite") || text.includes("en-suite")) &&
      (text.includes("both rooms") ||
        text.includes("all rooms") ||
        text.includes("multiple rooms") ||
        text.includes("each bedroom"))
    ) {
      return "Full Bath in Multiple Rooms";
    }

    // 4. Primary Bedroom Only
    if (
      text.includes("ensuite in master only") ||
      text.includes("only primary has ensuite") ||
      text.includes("en-suite in primary") ||
      text.includes("master with ensuite")
    ) {
      return "Primary Bedroom Only";
    }

    // 5. No En-Suite Bathrooms
    if (
      text.includes("no ensuite") ||
      text.includes("no en-suite") ||
      text.includes("shared bathroom") ||
      text.includes("bathroom is shared") ||
      text.includes("hallway bathroom") ||
      text.includes("no private bathroom")
    ) {
      return "No En-Suite Bathrooms";
    }

    return ""; // Unknown
  }
  // Extract bathrooms using smart regex patterns
  function extractBathroomsSmart(
    vipPrimary = [],
    title = "",
    description = []
  ) {
    const combinedText = (
      title +
      " " +
      (description || []).join(" ")
    ).toLowerCase();

    // 1. Regex patterns for exact float values like "1.5 bath", "2.5 bathrooms"
    const floatMatch = combinedText.match(/\b(\d\.\d)\s*(bath(room)?s?)?\b/);
    if (floatMatch && floatMatch[1]) {
      return floatMatch[1]; // e.g., "1.5", "2.5"
    }

    // 2. Regex patterns for whole number bathrooms like "2 bath", "3 bathrooms"
    const intMatch = combinedText.match(/\b(\d+)\s*(bath(room)?s?)\b/);
    if (intMatch && intMatch[1]) {
      return intMatch[1]; // e.g., "1", "2", etc.
    }

    // 3. Fallback: structured data in vipPrimary like "2 Bathrooms"
    for (let item of vipPrimary) {
      const primaryMatch = item.match(/(\d+(?:\.\d)?)\s*bath(room)?s?/i);
      if (primaryMatch && primaryMatch[1]) {
        return primaryMatch[1]; // e.g., "1.5", "2"
      }
    }

    return "0"; // Default fallback if nothing found
  }
  // Detect bathroom countertop material based on description
  function detectBathroomCountertop(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    if (
      text.includes("granite") ||
      text.includes("quartz") ||
      text.includes("stone") ||
      text.includes("marble")
    ) {
      return "Stone";
    }

    if (
      text.includes("laminate") ||
      text.includes("formica") ||
      text.includes("melamine")
    ) {
      return "Formica";
    }

    return "";
  }
  // Detect shower type based on description
  function detectShowerType(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const hasStanding =
      text.includes("walk-in shower") || text.includes("standing shower");
    const hasSeat =
      text.includes("shower seat") || text.includes("shower with seat");
    const hasBathtubShower =
      text.includes("bathtub with shower") || text.includes("tub shower combo");
    const hasFreeStandingTub =
      text.includes("free standing tub") ||
      text.includes("freestanding bathtub");

    const isMultiple =
      text.includes("multiple bathrooms") ||
      text.includes("multiple ensuites") ||
      text.includes("in multiple rooms");

    // Priority order:
    if (hasStanding && hasSeat && isMultiple)
      return "Standing Shower (With Seat) in Multiple Rooms";
    if (hasStanding && hasSeat) return "Standing Shower (With Seat)";
    if (hasStanding && isMultiple) return "Standing Shower in Multiple Rooms";
    if (hasFreeStandingTub && hasStanding && isMultiple)
      return "Free Standing Bathtub & Standing Shower in Multiple Rooms";
    if (hasFreeStandingTub && hasStanding)
      return "Free Standing Bathtub & Standing Shower";
    if (hasFreeStandingTub) return "Free Standing Bathtub";
    if (hasBathtubShower && isMultiple)
      return "Bathtub in Multiple Rooms with Shower";
    if (hasStanding && hasBathtubShower && isMultiple)
      return "Standing Shower & Bathtubs with Shower in Multiple Rooms";
    if (hasBathtubShower) return "Bathtub with Shower";
    if (hasStanding) return "Standing Shower";

    return ""; // No match
  }
  // Detect appliance finish based on description
  function detectApplianceFinish(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    if (
      text.includes("paneled appliances") ||
      text.includes("built-in panel") ||
      text.includes("panel ready")
    ) {
      return "Paneled";
    }
    if (text.includes("stainless steel")) {
      return "Stainless Steel";
    }
    if (text.includes("white appliances") || text.includes("white fridge")) {
      return "White";
    }
    if (text.includes("black appliances") || text.includes("black fridge")) {
      return "Black";
    }

    return ""; // Default if no match
  }
  // Detect kitchen countertops based on description
  function detectKitchenCountertops(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    // Stone keywords
    const stoneKeywords = ["quartz", "granite", "stone", "marble"];
    if (
      stoneKeywords.some(
        (keyword) =>
          text.includes(keyword + " kitchen") ||
          text.includes(keyword + " countertop")
      )
    ) {
      return "Stone";
    }

    // Formica keywords
    const formicaKeywords = ["laminate", "formica"];
    if (
      formicaKeywords.some(
        (keyword) =>
          text.includes(keyword + " kitchen") ||
          text.includes(keyword + " counter")
      )
    ) {
      return "Formica";
    }

    return "";
  }
  // Detect bedroom flooring based on description
  function detectBedroomFlooring(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const flooringTypes = [
      "vinyl",
      "laminate",
      "carpet",
      "hardwood",
      "tile",
      "concrete",
    ];
    for (let type of flooringTypes) {
      if (text.includes(type) && text.includes("bedroom")) {
        return type.charAt(0).toUpperCase() + type.slice(1); // Capitalized for picklist match
      }
    }

    // If no explicit "bedroom" match, fallback to first flooring match in text
    for (let type of flooringTypes) {
      if (text.includes(type)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }

    return ""; // Default if nothing found
  }
  // Detect if the unit has a private garage or personal garage
  function detectPrivateGarage(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("private garage") || text.includes("personal garage");
  }
  // Detect if the unit has a walkout to garage
  function detectWalkoutToGarage(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return (
      text.includes("walk out to garage") ||
      text.includes("indoor access to garage") ||
      text.includes("direct walkout")
    );
  }
  // Extract number of storage units from description
  function extractStorageUnits(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    const match = text.match(
      /(?:includes|with)?\s*(\d+)\s*(locker|storage|storage unit|storage locker)/
    );
    return match ? parseInt(match[1]) : null;
  }
  // Extract locker storage details from description
  function extractLockerStorageDetails(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    if (text.includes("condo locker")) {
      return "Condominium Locker";
    }
    if (text.includes("shed in backyard")) {
      return "Backyard Shed";
    }
    if (text.includes("no storage")) {
      return "N/A - No Storage Available";
    }

    return ""; // No match found
  }
  // Extract locker level and number from description
  function extractLockerLevelAndNumber(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const pattern =
      /locker\s*(on)?\s*(level\s*)?(p\d|b\d|[a-z]?\d)?\s*[#-]?\s*(\d{1,4})/i;
    const match = text.match(pattern);

    if (match) {
      const level = match[3] ? match[3].toUpperCase() : "";
      const number = match[4] || "";
      return level && number ? `${level} - ${number}` : "";
    }

    return "";
  }
  // Extract utility responsibility from description
  function extractUtilityResponsibility(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const percentMatch = text.match(/(\d{1,3})\s*%?\s*(of\s+)?utilities/);
    if (percentMatch) {
      let percent = parseInt(percentMatch[1]);
      if (percent >= 0 && percent <= 100) {
        return `${percent}%`;
      }
    }

    if (
      text.includes("tenant pays all") ||
      text.includes("tenant responsible for all utilities")
    ) {
      return "100%";
    }

    if (
      text.includes("utilities included") ||
      text.includes("all utilities included")
    ) {
      return "0%";
    }

    return "";
  }
  // Detect home insurance company based on description
  function detectHomeInsurance(descriptionArray = []) {
    const insuranceMap = {
      aaxel_insurance: "AAXEL Insurance",
      apollo: "Apollo",
      arthur_j_gallagher_co: "Arthur J. Gallagher & CO.",
      atliens_counsel_insurance: "Atliens - Counsel Insurance",
      bill_blaney_insurance_brokers_ltd: "Bill Blaney Insurance Brokers Ltd",
      blenheim: "Blenheim",
      brockman_associates: "Brockman & Associates",
      brokers_trust: "Brokers Trust",
      cartus_home: "Cartus Home",
      co_operators_insurance: "Co-Operators Insurance",
      connect_insurance: "Connect Insurance",
      connex_insurance: "Connex Insurance",
      cooperative_insurance: "Cooperative Insurance",
      cooperators: "Cooperators",
      csio: "CSIO",
      dominion_insurance: "Dominion Insurance",
      duffy_insurance_broker: "Duffy Insurance Broker",
      eglantan_scot_real_estate_mangment_inc:
        "EGLANTAN SCOT REAL ESTATE MANGMENT INC",
      entegrus: "Entegrus",
      first_insurance_of_canada: "First Insurance of Canada",
      heart_lake_insurance: "Heart Lake Insurance",
      heartland_farm_mutual_insurance: "Heartland Farm Mutual Insurance",
      ifs_insurance: "IFS insurance",
      impact_insurance: "Impact Insurance",
      insureit_group: "Insureit Group",
      intact_home_insurance: "Intact Home Insurance",
      jocelyn_insurance: "Jocelyn Insurance",
      jones_deslauriers: "Jones DesLauriers",
      maxwell: "Maxwell",
      meloche_monnex_insurance: "Meloche Monnex insurance",
      mitch_insurance: "Mitch Insurance",
      mo_home_insurance: "Mo Home Insurance",
      mpi: "MPI",
      nesjardin_insurance: "Nesjardin Insurance",
      norrisbridge_insurance: "Norrisbridge Insurance",
      north_blenheim_mutual_insurance_company:
        "North Blenheim Mutual Insurance Company",
      northbrook_insurance: "Northbrook Insurance",
      optimum_general_insurance: "Optimum General Insurance",
      otip_insurance: "OTIP Insurance",
      pacific_insurance_company: "Pacific Insurance Company",
      peel_mutual: "Peel Mutual",
      premier_marine_insurance: "Premier Marine Insurance",
      prime_service: "Prime Service",
      roy_lewis_insurance: "Roy Lewis Insurance",
      scoop_insurance: "Scoop Insurance",
      stewart_title_guaranty_company: "Stewart Title Guaranty Company",
      stonemark: "Stonemark",
      sutherland_insurance: "Sutherland insurance",
      tanner_insurance_corp: "Tanner Insurance Corp.",
      tbh_insurance_agency_ltd: "Tbh Insurance Agency Ltd.",
      td_bank: "TD Bank",
      the_jordan: "The Jordan",
      tradition_mutual_insurance: "Tradition Mutual Insurance",
      traveller: "Traveller",
      van_allen: "Van Allen",
      vanessa: "Vanessa",
      yarmouth_mutual_insurance: "Yarmouth Mutual Insurance",
      youngs_inurance: "Youngs Inurance",
      zenith: "Zenith",
      zensurance: "Zensurance",
      zurick_insurance: "Zurick Insurance",
      "360_community_management_ltd": "360 Community Management Ltd",
      abex_affiliated_brokers_exchange: "Abex Affiliated Brokers Exchange",
      able_insurance_brokers_ltd: "Able Insurance Brokers LTD",
      allstate_insurance_company: "Allstate Insurance Company",
      arch_insurance_canada_ltd: "Arch Insurance Canada Ltd.",
      atrens_counsel_insurance_brokers: "Atrens-Counsel Insurance Brokers",
      aviva_insurance_company: "Aviva Insurance Company",
      ayr_farmers_mutual_insurance_company:
        "Ayr Farmers Mutual Insurance Company",
      belairdirect_insurance_company: "Belairdirect Insurance Company",
      bertie_and_clinton: "Bertie and Clinton",
      billyard_insurance_group: "Billyard Insurance Group",
      brokerlink: "BrokerLink",
      burns_and_wilcox_canada: "Burns and Wilcox Canada",
      canadian_automobile_association: "Canadian Automobile Association (CAA)",
      canadian_premier_life_insurance_company:
        "Canadian Premier Life Insurance Company",
      censure_insurance: "Censure Insurance",
      certas_home_auto_insurance: "Certas Home & Auto Insurance",
      chicago_title_insurance_company: "Chicago Title Insurance Company",
      chubb_insurance_company_of_canada: "Chubb Insurance Company Of Canada",
      cia_insurance_services_ltd: "CIA Insurance Services Ltd",
      cibc: "CIBC",
      cm_steele_insurance_brokers: "CM Steele Insurance Brokers",
      co_op_insurance: "Co-op Insurance",
      common_wealth: "Common Wealth",
      condo_insurance: "Condo Insurance",
      definity: "Definity",
      designer_insurance: "Designer Insurance",
      diamond_insurance: "Diamond Insurance",
      domain_canada: "Domain Canada",
      dream_insurance: "Dream Insurance",
      economical_insurance: "Economical Insurance",
      ensurco_insurance: "Ensurco Insurance",
      esurance_an_allstate_company: "Esurance (an allstate company)",
      fivestar_insurance: "Fivestar Insurance",
      forward_insurance_managers_ltd: "Forward Insurance Managers LTD",
      fsb_insurance_ltd: "FSB Insurance ltd",
      gore_mutual_insurance_company: "Gore Mutual Insurance Company",
      groupone_insurance: "GroupOne Insurance",
      habitational: "Habitational",
      hallwell_mutual_insurance: "Hallwell Mutual Insurance",
      htm_insurance: "HTM Insurance",
      hub_international: "HUB International",
      idc_insurance: "IDC Insurance",
      included_in_maintenance_fees: "Included in maintenance fees",
      infinity_insurance_company: "Infinity Insurance Company",
      inova_insurance_costco_wholesale: "Inova Insurance / Costco Wholesale",
      insurance_store: "Insurance Store",
      insureco_inc: "Insureco, Inc",
      intact_financial_corporation: "Intact Financial Corporation",
      johnson_insurance: "Johnson Insurance",
      kase_insurance: "Kase Insurance",
      kob: "KOB",
      lloyds_underwriters: "Lloyd's underwriters",
      manulife_insurance: "Manulife Insurance",
      maple_mutual_insurance: "Maple Mutual Insurance",
      max_insurance: "Max Insurance",
      mcclelland_insurance_brokers_limited:
        "McClelland Insurance Brokers Limited",
      mcconville_omni_insurance_brokers_ltd:
        "McConville Omni Insurance Brokers Ltd",
      merit_insurance: "Merit Insurance",
      middlesex_mutual: "Middlesex Mutual",
      multi_risk_insurance_financial_group_inc:
        "Multi Risk Insurance & Financial Group Inc.",
      mutual_fire: "Mutual Fire",
      nfp: "NFP",
      northbridge: "Northbridge",
      olsen_soltile: "Olsen Soltile",
      onlia_insurance: "Onlia Insurance",
      pembridge_insurance: "Pembridge Insurance",
      peoples_insurance_co_ltd: "People's Insurance Co. Ltd.",
      personal_insurance_company: "Personal Insurance Company",
      portage_home_insurance: "Portage Home Insurance",
      preferred_insurance: "Preferred Insurance",
      premier_canada_assurance_managers_ltd:
        "Premier Canada Assurance Managers. Ltd.",
      progressive: "Progressive",
      rai_grant: "Rai Grant",
      rbc: "RBC",
      revau: "Revau",
      risk_care_insurance: "Risk Care Insurance",
      royal_bank: "Royal Bank",
      rsa_insurance_group: "RSA Insurance Group (Royal & Sun Alliance)",
      saco_insurance: "Saco Insurance",
      scotia_insurance: "Scotia Insurance",
      scotiabank: "Scotiabank",
      scottish_york_insurance: "Scottish & York Insurance",
      security_national_insurance_company:
        "Security National Insurance Company",
      sgi_insurance: "SGI Insurance",
      snap_premium_finance: "SNAP Premium Finance",
      sonnet_insurance_company: "Sonnet Insurance Company",
      sound_insurance_company: "Sound Insurance Company",
      square_one_insurance_services: "Square One Insurance Services",
      state_farm: "State Farm",
      stone_bridge: "Stone Bridge",
      strategic_link_consulting_inc: "Strategic Link Consulting INC",
      sunlife: "SunLife",
      tarion: "Tarion",
      td_home_insurance: "TD Home Insurance",
      the_national_bank: "The National Bank",
      the_personal_insurance_company: "The Personal Insurance Company",
      to_be_determined_tbd: "To Be Determined (TBD)",
      tower_hill_insurance: "Tower Hill Insurance",
      towerhill_insurance: "Towerhill Insurance",
      traveler_canada: "Traveler Canada",
      trillium: "Trillium",
      unica: "Unica",
      unifund_assurance_company: "Unifund Assurance Company",
      wawanesa_mutual_insurance: "Wawanesa Mutual Insurance",
      wellcare_insurance: "Wellcare Insurance 无忧保险",
    };

    const text = (descriptionArray || []).join(" ").toLowerCase();

    for (const keyword in insuranceMap) {
      if (text.includes(keyword.replace(/_/g, " "))) {
        return insuranceMap[keyword];
      }
    }

    return "Not Mentioned";
  }
  // Extract insurance policy number from description
  function extractInsurancePolicyNumber(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    const pattern =
      /(policy\s*#|insurance\s*(reference|policy))[^0-9]{0,10}(\d{7,10})/i;
    const match = text.match(pattern);
    return match ? match[3] : "";
  }

  // 2. Street Number (e.g., 123 in "123 King St")
  // 1. Extract Street Number: Returns the first number before the street name (works for "10-456 Elm Street" => "456", "123A Main Ave" => "123")
  function extractStreetNumber(location = "") {
    if (!location) return "";
    // Only match if the second part after '-' starts with a number
    const cleaned = location.trim().split('-').pop();
    const match = cleaned.match(/^(\d{1,5})[A-Za-z]?\b/);
    return match ? match[1] : "";
  }

  // 2. Extract Street Name: Gets street name and suffix, stops at comma/city/province/postal
  function extractStreetName(location = "") {
    if (!location) return "";
    const streetTypes = [
      "street", "st", "road", "rd", "avenue", "ave", "boulevard", "blvd", "drive", "dr",
      "lane", "ln", "court", "ct", "crescent", "cr", "terrace", "way", "trail", "place", "pkwy"
    ].join("|");
    // Pattern: optional number/unit, then name + suffix
    const regex = new RegExp(
      `\\d{1,5}(?:-\\d{1,5})?\\s+([\\w\\s']+?\\s(?:${streetTypes}))\\b`,
      "i"
    );
    const match = location.match(regex);
    if (match && match[1]) {
      return match[1].replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim();
    }
    return "";
  }
  // 5. Province (3rd part of location)
  function extractProvince(location = "") {
    const parts = location.split(",");
    return parts.length >= 3 ? parts[2].trim() : "Ontario";
  }
  // 6. Postal Code (e.g., A1A 1A1)
  function extractPostalCode(location = "") {
    const match = location.match(/[A-Z]\d[A-Z][ -]?\d[A-Z]\d/i);
    return match ? match[0].toUpperCase().replace(/\s+/, "") : "";
  }
  // 7. Mail Box Number (e.g., MB#123, mailbox 45, box 12)
  function extractMailBoxNumber(descriptionArray = []) {
    const text = descriptionArray.join(" ").toLowerCase();
    const match = text.match(/(?:mailbox|mb#|box)\s*([a-z0-9]+)/i);
    return match ? match[1] : "";
  }
  // Detect utility inclusions based on description
  function detectACInclusionFromText() {
    const text = JSON.stringify(data).toLowerCase(); // search everywhere!

    const acKeywords = [
      "air conditioning included",
      "central ac",
      "ac provided",
      "a/c included",
      "includes air conditioning",
      "with air conditioning",
      "air conditioning",
    ];

    for (let keyword of acKeywords) {
      if (text.includes(keyword)) return true;
    }
    return false;
  }

  function detectHeatInclusionFromText() {
    const text = JSON.stringify(data).toLowerCase();

    const heatKeywords = [
      "heating included",
      "heat paid by landlord",
      "heat included",
      "includes heating",
      "with heating"
    ];

    for (let keyword of heatKeywords) {
      if (text.includes(keyword)) return true;
    }
    return false;
  }

  function detectInternetInclusionFromText() {
    const text = JSON.stringify(data).toLowerCase();

    const internetKeywords = [
      "wifi included",
      "internet included",
      "free internet",
      "with wifi",
      "with internet",
      "includes wifi",
      "includes internet"
    ];

    for (let keyword of internetKeywords) {
      if (text.includes(keyword)) return true;
    }
    return false;
  }
  function detectWaterInclusion(data) {
    // Turn the whole object into a string for searching
    const text = JSON.stringify(data).toLowerCase();

    // List of keywords to check for
    const waterKeywords = [
      "water included",
      "water is included",
      "water paid by landlord",
      "hydro and water included",
      "water utility included",
      "water bill included",
      "water softener",
      "reverse osmosis",
      "culligan",
      "rent water system",
      "filter rental",
      "water purification",
      "purified water",
      "water filter",
      "drinking water included",
      "water system rental",
      "osmosis system",
      "soft water included",
      "water & heat included",
      "hot water included"
    ];

    // If any of the keywords are found, return true
    return waterKeywords.some(keyword => text.includes(keyword));
  }

  function detectHydroProvider(data) {
    const text = JSON.stringify(data).toLowerCase();

    // List of common hydro/electricity provider names and related keywords
    const hydroKeywords = [
      "hydro",
      "hydro included",
      "hydro one",
      "toronto hydro",
      "alectra",
      "enwin",
      "enmax",
      "hydro ottawa",
      "powerstream",
      "brampton hydro",
      "oakville hydro",
      "london hydro",
      "energy provider",
      "electricity provider",
      "electricity included",
      "utility provider",
      "utilities included",
      "electric included"
    ];
    const found = hydroKeywords.some(keyword => text.includes(keyword));
    if (found) return true;



    return false;
  }

  function detectCableInclusion(data) {
    const text = JSON.stringify(data).toLowerCase();

    // Cable-related keywords and popular provider terms
    const cableKeywords = [
      "cable included",
      "cable incl",
      "free cable",
      "tv package",
      "rogers tv",
      "bell fibe",
      "bell tv",
      "shaw cable",
      "cogeco tv",
      "videotron",
      "cable ready",
      "cable provided",
      "cable tv included",
      "satellite tv included",
      "satellite included",
      "cable service included",
      "cable service",
      "cable tv",
      "cable subscription",
      "cable television",
      "cable service provider",
      "cable provider",
      "cable and internet included",
      "tv included",
    ];

    return cableKeywords.some(keyword => text.includes(keyword));
  }



  // utility notes extraction from description
  function extractUtilityNotes(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ");
    const knownPatterns = [
      /air conditioning included|central ac|ac provided/i,
      /heating included|heat paid by landlord/i,
      /wifi included|internet included|free internet/i,
      /cable included|tv included/i,
      /phone line included|landline included/i,
      /utilities included/i,
      /tenant pays all/i,
      /\d{1,3}%/i,
      /tenant pays|owner pays/i,
      /utilities split/i,
    ];

    const utilityLines = (descriptionArray || []).filter((line) => {
      return /utility|utilities|hydro|gas|heat|internet|wifi|cable|phone|water/i.test(
        line
      );
    });

    const unknownNotes = utilityLines.filter((line) => {
      return !knownPatterns.some((pattern) => pattern.test(line));
    });

    return unknownNotes.join(" ");
  }
  // Detect building category based on text
  function detectBuildingCategoryFromText() {
    const text = JSON.stringify(data).toLowerCase(); // search everywhere!

    const categoryMap = [
      {
        type: "Residential",
        keywords: [
          "residential",
          "house",
          "home",
          "apartment",
          "rental",
          "condo",
        ],
      },
      {
        type: "Commercial",
        keywords: [
          "commercial",
          "office",
          "retail",
          "business unit",
          "warehouse",
        ],
      },
      { type: "Mixed-use", keywords: ["mixed-use"] },
      { type: "Investment property", keywords: ["investment property"] },
    ];

    for (let entry of categoryMap) {
      for (let keyword of entry.keywords) {
        if (text.includes(keyword)) return entry.type;
      }
    }
    return "";
  }
  // Extract condo corporation number from data
  function extractCondoCorpNumber() {
    const text = JSON.stringify(data); // keep case for corp codes

    // formats like "TSCC 1234", "MTCC123", "YCC 567", "Condo Corp #987"
    const match = text.match(/\b([A-Z]{2,4}C{0,2})\s*#?\s*(\d{3,5})\b/);
    return match ? `${match[1].replace(/\s+/, "")} ${match[2]}` : "";
  }
  // Detect pet restrictions based on text
  function detectPetRestrictions() {
    const text = JSON.stringify(data).toLowerCase();

    // Returns true if *any* restriction is detected
    if (
      /no pets|no dogs|cats only|service animals only|breed restrictions|small pets/.test(text)
    ) {
      return true;
    }

    return false;
  }

  // Detect building management info based on text
  function detectBuildingMgmtInfo() {
    const text = JSON.stringify(data).toLowerCase();

    const infoKeywords = [
      "call concierge",
      "contact management",
      "see front desk",
      "property manager",
      "speak to super",
      "contact the superintendent",
    ];

    for (const kw of infoKeywords) {
      if (text.includes(kw)) return kw.replace(/\b\w/g, (c) => c.toUpperCase()); // title-case keyword
    }
    return ""; // leave blank if nothing relevant
  }
  function extractDryerManufacturer(data) {
    const manufacturerList = [
      "Galanz", "AEG", "Allure", "Amana", "Asko", "AVG", "Bertazzoni", "Best", "Bloomberg", "Bluestar", "Bosch", "Braoa", "Brgan", "Broan", "Caloric", "Cavavin", "Chambers", "Cyclone", "Dacor", "Danby", "Direct drive", "Electrolux", "Elica", "Faber", "Fisher & Paykel", "Forester", "Frigidaire", "Fulgor", "Gaggenau", "Gasland", "General Electric (GE Appliances)", "Gorenje", "Haier", "Hamilton Beach", "Hisense", "Homestyles", "Huebsch", "iFlow", "Ikea", "Inglis", "Jennair", "Kenmore", "KitchenAid", "Kobe", "Krupps", "Kucht", "La Cornue", "LG", "Liebherr", "Lotus", "Lynx", "Marvel", "Maxima", "Maytag", "Midea", "Miele", "Moffat", "Monogram", "Napoleon", "NCA", "Not Mentioned", "NuTone", "Panasonic", "Porter & Charles", "Roper", "Sakura", "Samsung", "Sanyo", "Sharp", "Silhouette", "Sirius", "Smeg", "Sub-Zero", "Sunbeam", "Thermador", "Unique Appliances", "Venmar", "Vent A Hood", "Vesta", "Vitara", "Whirlpool", "Wolf", "Z-Air", "Zephyr"
    ];

    const text = JSON.stringify(data).toLowerCase();

    // Try to match a brand near "dryer"
    for (let brand of manufacturerList) {
      const brandPattern = new RegExp(
        `\\b${brand.toLowerCase()}\\b[^\\w\\d]{0,20}dryer|dryer[^\\w\\d]{0,20}\\b${brand.toLowerCase()}\\b`, 'i'
      );
      if (brandPattern.test(text)) {
        return brand; // Return CRM-style value
      }
    }

    // Not found
    return "Not Mentioned";
  }
  //
  function extractMgmtEmail() {
    const text = JSON.stringify(data);
    const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i); // first email
    return match ? match[0] : "";
  }
  // Extract management phone number from data
  function extractMgmtPhone() {
    const text = JSON.stringify(data);

    // matches formats like "+1-782-414-4299", "416-555-1234", "(902) 555-1234"
    const match = text.match(
      /(\+?\d{1,2}[-\s.]*)?\(?\d{3}\)?[-\s.]*\d{3}[-\s.]*\d{4}/
    );
    return match ? match[0].trim() : "";
  }
  // Extract office address from data
  function extractOfficeAddress() {
    const text = JSON.stringify(data).toLowerCase();

    // grab a short fragment after common lead-ins
    const leadIns = [
      "property management office",
      "leasing office",
      "located at",
      "visit us at",
    ];
    for (const lead of leadIns) {
      const idx = text.indexOf(lead);
      if (idx !== -1) {
        // return up to next 60 chars or ending quote
        const snippet = text.slice(idx, idx + 60);
        const clean = snippet.replace(/\\n|\\r|\\t|["']/g, " ").trim();
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      }
    }
    return "";
  }
  // Detect developer name based on text
  function detectDeveloperName() {
    const text = JSON.stringify(data).toLowerCase();

    const developers = [
      "tridel",
      "mattamy homes",
      "daniels",
      "minto",
      "menkes",
      "pinnacle",
      "times group",
      "great gulf",
      "lanterra",
      "plaza",
      "monarch",
      "lifetime developments",
    ];

    for (const dev of developers) {
      if (text.includes(dev)) {
        // Title-case developer name for output
        return dev.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    /* “Built by <developer>” pattern */
    const match = text.match(/built by\s+([a-z0-9 &.-]{3,40})/i);
    if (match) return match[1].trim().replace(/\b\w/g, (c) => c.toUpperCase());

    return "";
  }
  // Detect date of construction based on text
  function detectDateOfConstruction() {
    const text = JSON.stringify(data).toLowerCase();

    // explicit year formats:  "Built in 2015", "Year built: 2008", "2012 build"
    const yrMatch = text.match(
      /(?:built in|year built[:\s]|built[:\s]|built)\s*(19|20)\d{2}/
    );
    if (yrMatch) {
      const year = yrMatch[0].match(/(19|20)\d{2}/)[0]; // e.g. "2015"
      return `${year}-01-01`; // → "2015-01-01"
    }

    // generic phrases—leave blank so user can pick a proper date
    if (
      /brand new|new construction|newly built|recently built|less than 5 years/.test(
        text
      )
    )
      return "";

    if (/historic|vintage/.test(text)) return "";

    return ""; // nothing found
  }


  // Event listener for fetching data
  document.getElementById("fetchDataBtn").addEventListener("click", async () => {
    const url = document.getElementById("unitUrl").value;
    const match = url.match(/\/(\d+)(?:\/)?$/);
    const statusfc = document.getElementById("fetchDataBtn");

    if (!url) {
      Swal.fire("Enter URL", "Please enter a Kijiji listing URL.", "warning");
      return;
    }
    if (match) {
      listingId = match[1];
      // console.log(listingId);
    } else {
      console.log("No ID found in URL");
    }
    // Show loader and disable button
    statusfc.disabled = true;
    document.getElementById("pageLoader").style.display = "flex";

    //"&bypassCache=true"
    try {
      const response = await fetch(
        "https://api.royalyorkpm.com/kijiji-ocr-new?url=" +
        encodeURIComponent(url) + "&api_key=12345" + "&bypassCache=true"
      );
      data = await response.json();
      const StringData = JSON.stringify(data).toLowerCase();
      console.log("StringData", StringData);
      //25th June start New -
      const obj = { firstName: data.firstName || "" };
      const fullName = obj.firstName || "";
      const FirstName = extractFirstName(fullName);
      const LastName = extractLastName(fullName);
      scrapedDate = extractAvailableDate(data.vipAttributes?.attributes);
      const Mobile = extractPhoneNumberFromText(data);
      const unitType = detectUnitTypeFromTitleAndDescription(data.title, data.description);
      const city = extractCityFromAddress(data);
      const Province = extractProvince(data.location);
      const PostalCode = extractPostalCode(data.location);
      const bedrooms = extractBedroomsSmart(data.vipAttributes?.primary || [], data.title || "", data.description || []);
      const bathrooms = extractBathroomsSmart(data.vipAttributes?.primary || [], data.title || "", data.description || []);
      const numberOfFloors = detectNumberOfFloors() || 0;
      const numberOfUnits = detectNumberOfUnits() || 0;
      const backyard = detectBackyard();
      const backyardFenced = detectBackyardFenced();
      const Parkingspacs = extractParkingSpacesFromText();
      const washerManufacturer = extractWasherManufacturer(data);
      const parkingDetails = detectParkingDetails() || "";
      const Walkout_to_Garage = detectWalkoutToGarage(data.description || []);
      const Private_Garage = detectPrivateGarage(data.description || []);
      const Street_Number = extractStreetNumber(data.location || "");
      const Street_Name = extractStreetName(data.location || "");
      const Mailbox_Number = extractMailBoxNumber(data.description || []);
      const unitName = detectUnitName() || "";
      const propertyCondition = detectPropertyCondition(data.description);
      const electricityProvider = detectElectricityProvider(data.description || []);
      const waterProvider = detectWaterProvider(data.description || []);
      const gasProvider = detectGasProvider(data.description || []);
      const hotWaterTankProvider = detectHotWaterTankProvider(data.description || []);
      const Corner_Unit = detectCornerUnit();
      const Central_Vacuum = detectCentralVacuum();
      const Penthouse = detectPenthouse();
      const Fireplace_Common_Area = detectFireplaceCommonArea();
      const Fireplace_Bedroom = detectFireplaceBedroom();
      const Upgraded_Bathrooms = detectUpgradedBathrooms();
      const Backsplash_Kitchen = detectBacksplashKitchen();
      const Upgraded_Kitchen = detectUpgradedKitchen();
      const Dishwasher_Included = detectDishwasherIncludedFromText();
      const Building_AC_Incl = detectBuilding_AC_Incl();
      const Building_Heat_Incl = detectBuilding_Heat_Incl();
      const Building_Cable_Incl = detectBuilding_Cable_Incl();
      const Building_Internet_Incl = detectBuilding_Internet_Incl();
      const Building_Water_Filtration_Rental = detectBuilding_Water_Filtration_Rental();
      const Parking_Garage = detectParking_Garage();
      const Remote_Garage = detectRemote_Garage();
      const Visitor_Parking = detectVisitor_Parking();
      const EV_Charging = detectEV_Charging();
      const Car_Wash = detectCar_Wash();
      const Subway_Access = detectSubway_Access();
      const Laundry_Building = detectLaundry_Building();
      const Lobby_Lounge = detectLobby_Lounge();
      const Wheelchair_Access = detectWheelchair_Access();
      const Onsite_Staff = detectOnsite_Staff();
      const Concierge_24_7 = detectConcierge_24_7();
      const Guest_Suites = detectGuest_Suites();
      const Bicycle_Storage = detectBicycle_Storage();
      const Elevators = detectElevators();
      const Buzzer_System = detectBuzzer_System();
      const Security = detectSecurity();
      const Keyless_Entry = detectKeyless_Entry();
      const Pet_Spa = detectPet_Spa();
      const BBQ_Area = detectBBQ_Area();
      const Rooftop_Patio = detectRooftop_Patio();
      const Cabanas = detectCabanas();
      const Tennis_Court = detectTennis_Court();
      const Outdoor_Patio = detectOutdoor_Patio();
      const Outdoor_Pool = detectOutdoor_Pool();
      const Outdoor_Child_Play_Area = detectOutdoor_Child_Play_Area();
      const Gym_Fitness = detectGym_Fitness();
      const Rec_Room = detectRec_Room();
      const Billiards = detectBilliards();
      const Indoor_Pool = detectIndoor_Pool();
      const Sauna = detectSauna();
      const Library = detectLibrary();
      const Squash = detectSquash();
      const Bowling = detectBowling();
      const Indoor_Child_Area = detectIndoor_Child_Area();
      const Meeting_Room = detectMeeting_Room();
      const Yoga_Room = detectYoga_Room();
      const Movie_Room = detectMovie_Room();
      const Games_Room = detectGames_Room();
      const Whirlpool = detectWhirlpool();
      const Steam_Room = detectSteam_Room();
      const Basketball = detectBasketball();
      const Golf_Range = detectGolf_Range();
      const Piano_Lounge = detectPiano_Lounge();
      const Daycare = detectDaycare();
      const Email = extractEmailFromData(data);
      const ParkingLevelNumber = extractParkingLevelNumber();
      document.getElementById("First_Name").value = FirstName;
      document.getElementById("Last_Name").value = LastName;
      document.getElementById("Available_Date").value = scrapedDate;
      document.getElementById("Mobile").value = Mobile;
      document.getElementById("Unit_Type").value = unitType;
      document.getElementById("City").value = city;
      document.getElementById("Province").value = Province;
      document.getElementById("Bathrooms").value = bathrooms;
      document.getElementById("Bedrooms").value = bedrooms;
      document.getElementById("Postal_Code").value = PostalCode;
      document.getElementById("number_of_floors").value = numberOfFloors;
      document.getElementById("number_of_units").value = numberOfUnits;
      document.getElementById("Backyard").value = backyard;
      document.getElementById("Backyard_Fenced").value = backyardFenced;
      document.getElementById("Parking_Spaces").value = Parkingspacs;
      document.getElementById("Parking_Details").value = parkingDetails;


      //function for conditions ::

      // Detect maximum occupants based on bedroom value
      function detectMaxOccupants(bedroomValue = "") {
        if (!bedroomValue || typeof bedroomValue !== "string") return "";

        const value = bedroomValue.toLowerCase().trim();

        // Handle "Studio"
        if (value === "studio") {
          return 2;
        }

        // Match numeric part (e.g., "2", "3 + Den", "4 bedrooms", etc.)
        const match = value.match(/^(\d+)/);
        if (match) {
          const bedrooms = parseInt(match[1], 10);
          return bedrooms * 2;
        }

        return ""; // No valid bedroom count found
      }
      // Function to detect unit number
      function detectUnitNumber(unitType, unitName) {
        if (!unitName || typeof unitName !== "string") return "";

        const trimmed = unitName.trim();

        if (unitType === "Basement" && !trimmed.startsWith("2-")) {
          return "2-" + trimmed;
        }

        if (
          unitType === "Multi Unit - Above Ground" &&
          !trimmed.startsWith("1-")
        ) {
          return "1-" + trimmed;
        }

        return trimmed;
      }
      // Function to correct unit name
      function correctUnitName(unitType, unitName) {
        if (!unitName || typeof unitName !== "string") return "";

        const trimmed = unitName.trim();

        // Check if unitName contains any digit
        const hasNumber = /\d/.test(trimmed);

        if (hasNumber) {
          if (unitType === "Basement" && !trimmed.startsWith("2-")) {
            return "2-" + trimmed;
          }

          if (
            unitType === "Multi Unit - Above Ground" &&
            !trimmed.startsWith("1-")
          ) {
            return "1-" + trimmed;
          }

          return trimmed;
        }

        // If no number, prefix with "Not Listed – {unitName}"
        return ` ${trimmed}`;
      }
      // Detect lawn and snow care services based on description
      function detectLawnAndSnowCare(descriptionArray = [], unitType = "") {
        const text = (descriptionArray || []).join(" ").toLowerCase();
        unitType = unitType.toLowerCase();

        // Auto-include for specific unit types
        if (
          unitType === "condominium" ||
          unitType === "unit - apartment building"
        ) {
          return "Lawn and Snow Removal: Included";
        }

        const hasLawn = /lawn care|grass cutting/.test(text);
        const hasSnow = /snow removal|snow clearing|snow cleared/.test(text);

        if (hasLawn && hasSnow) return "Lawn and Snow Removal: Included";
        if (hasLawn) return "Lawn Care: Included";
        if (hasSnow) return "Snow Removal: Included";

        return "Not Included";
      }
      // Detect basement type based on title and description
      function detectBasementIncluded(
        title = "",
        descriptionArray = [],
        unitType = ""
      ) {
        const type = unitType.toLowerCase();

        if (type === "basement") {
          return "This is the basement";
        }

        if (type === "multi unit - above ground") {
          return "Separate Unit";
        }

        if (type === "condominium" || type === "unit - apartment building") {
          return "N/A - Basement does not exist";
        }

        const text = (
          title +
          " " +
          (descriptionArray || []).join(" ")
        ).toLowerCase();

        if (
          text.includes("basement unit") ||
          text.includes("this is the basement")
        ) {
          return "This is the basement";
        }
        if (
          text.includes("separate basement") ||
          text.includes("basement access") ||
          text.includes("private basement")
        ) {
          return "Separate Unit";
        }
        if (text.includes("finished basement")) {
          return "Finished";
        }
        if (
          text.includes("partially finished basement") ||
          text.includes("half finished basement")
        ) {
          return "Half-finished";
        }
        if (text.includes("unfinished basement")) {
          return "Unfinished";
        }

        return "N/A - Basement does not exist";
      }
      // Extract basement details from description
      function extractBasementDetails(descriptionArray = [], unitType = "") {
        const type = unitType.toLowerCase();

        if (type === "basement") {
          return "This is the basement";
        }

        if (type === "multi unit - above ground") {
          return "Separate Unit";
        }

        if (type === "condominium" || type === "unit - apartment building") {
          return "N/A - Basement does not exist";
        }

        const basementKeywords = [

          "laundary"
        ];

        const matches = (descriptionArray || []).filter((line) =>
          basementKeywords.some((keyword) =>
            line.toLowerCase().includes(keyword)
          )
        );

        return matches.join("\\n");
      }
      // check for upgraded bathroom
      function checkUpgradedBathroom(propertyCondition = "") {
        return propertyCondition === "Newly Renovated";
      }
      // Extract last renovated year from description
      function extractLastRenovatedYear(propertyCondition = "") {
        // If the property is brand new, return the current year
        if (
          propertyCondition.toLowerCase() === "brand new" ||
          propertyCondition.toLowerCase() === "brand new - never lived in"
        ) {
          return new Date().getFullYear().toString();
        }

        const text = JSON.stringify(data).toLowerCase();

        // Match phrases followed by a 4-digit year
        const matches = [
          ...text.matchAll(
            /(renovated in|last renovated|updated in|new bathroom in)[^\d]*(\d{4})/g
          ),
        ];

        if (matches.length === 0) return "";

        // Extract years and return the most recent one
        const years = matches.map((match) => parseInt(match[2], 10));
        const latestYear = Math.max(...years);

        return latestYear.toString();
      }
      function detectPrivateTerraceOrBackyardFromBackyardValue(
        backyardValue = ""
      ) {
        return backyardValue === "Included";
      }
      // Detect view based on unit type
      function detectViewCombined(unitType = "", descriptionArray = []) {
        const type = unitType.toLowerCase();

        const typesWithCourtyardView = [
          "house",
          "multi unit - above ground",
          "stacked townhouse",
          "townhouse",
          "basement",
        ];

        // Priority 1: Unit Type override
        if (typesWithCourtyardView.includes(type)) {
          return "Courtyard/Backyard";
        }

        // Priority 2: Description-based detection
        const text = (descriptionArray || []).join(" ").toLowerCase();

        const hasLake = text.includes("lake view") || text.includes("lake views");
        const hasCity = text.includes("city view") || text.includes("city views");
        const hasConservation = text.includes("conservation area");
        const hasBackyard =
          text.includes("backyard view") ||
          text.includes("courtyard") ||
          text.includes("overlooks backyard");

        if (hasLake && hasCity && hasConservation)
          return "Lake, City, and Conservation";
        if (hasLake && hasCity) return "Lake and City";
        if (hasCity && hasConservation) return "City and Conservation";
        if (hasLake) return "Lake";
        if (hasCity) return "City";
        if (hasConservation) return "Conservation";
        if (hasBackyard) return "Courtyard/Backyard";

        return "";
      }
      function detectBBQ_Area_Synced() {
        if (Outdoor_Patio) return true;

        const text = JSON.stringify(data).toLowerCase();
        return (
          text.includes("bbq terrace") ||
          text.includes("grill area") ||
          text.includes("barbecue") ||
          text.includes("rooftop bbq")
        );
      }
      function detectOutdoor_Patio_Synced() {
        if (BBQ_Area) return true;

        const text = JSON.stringify(data).toLowerCase();
        return (
          text.includes("backyard") ||
          text.includes("outdoor space") ||
          text.includes("garden terrace") ||
          text.includes("open patio")
        );
      }
      // website title generation function
      function generateWebsiteTitle(bedrooms, bathrooms, unitType, unitName) {
        // Format bedrooms
        let bedPart = bedrooms ? `${bedrooms} BED` : "";

        // Format bathrooms
        let bathPart = bathrooms ? `${bathrooms} BATH` : "";

        // Combine BED + BATH
        let bedBath = [bedPart, bathPart].filter(Boolean).join(" + ");

        // Format unit type
        let unitTypeFormatted = unitType ? unitType.toUpperCase() : "UNIT";

        // Remove postal code from unitName
        let unitNameClean = unitName;
        if (unitName.includes(",")) {
          let parts = unitName.split(",");
          // Remove last part if it looks like a postal code
          if (parts[parts.length - 1].trim().match(/[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d/)) {
            parts.pop();
          }
          unitNameClean = parts.join(",").trim();
        }

        // Capitalize each word in unit name
        function titleCase(str) {
          return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1));
        }

        // Combine
        const title = `${bedBath} - ${unitTypeFormatted} FOR RENT - ${titleCase(unitNameClean)}`;
        return title;
      }



      //Condition const here updated ones
      const UnitNamecorrected = correctUnitName(unitType, unitName);
      const dryerBrand = extractDryerManufacturer(data);
      const cableIncluded = detectCableInclusion(data);
      const Unitnumber = detectUnitNumber(unitType,);
      const lawnSnowCare = detectLawnAndSnowCare(data.description || []);
      const basement = detectBasementIncluded(data.title || "", data.description || [], data.unitType || "");
      const basementDetails = extractBasementDetails(data.description || [], data.unitType || "");
      const upgradedBathroom = checkUpgradedBathroom(propertyCondition);
      const Lastyearrenovated = extractLastRenovatedYear(propertyCondition) || "";
      const Sunlight = true;
      const websiteTitle = generateWebsiteTitle(bedrooms, bathrooms, unitType, unitName);
      const privateTerraceOrBackyard = detectPrivateTerraceOrBackyardFromBackyardValue(backyard);
      const view = detectViewCombined(data.unitType || "");
      const numericPrice = data.price ? Number(data.price.replace(/[$,]/g, "")) : "";
      const hydroIncluded = detectHydroProvider(data);
      const BBQ_Area_Final = detectBBQ_Area_Synced();
      const Outdoor_Patio_Final = detectOutdoor_Patio_Synced();
      const waterIncluded = detectWaterInclusion(data);
      const sqFt = extractSqFt(data.vipAttributes?.primary);
      const furnished = detectFurnished(data.description || []);
      const maximumOccupants = detectMaxOccupants(data.description);
      const entranceType = detectEntranceType(data.title || "", data.description || []);
      const unitFacing = detectUnitFacing(data.description);
      const flooringCommonArea = detectFlooringCommonArea(data.description || []);
      const ceilingHeight = detectCeilingHeight(data.description || []);
      const windowCoveringsCommon = detectWindowCoverings(data.description || []);
      const windowCoveringsBedroom = detectWindowCoverings(data.description || []);
      const bedroomLayout = detectBedroomLayout(data.description || []);
      const denAsBedroom = detectDenAsBedroom(data.description || []);
      const closetType = detectClosetType(data.description || []);
      const enSuiteBathrooms = detectEnSuiteBathrooms(data.description || []);
      const bathroomCountertop = detectBathroomCountertop(data.description || []);
      const showerType = detectShowerType(data.description || []);
      const applianceFinish = detectApplianceFinish(data.description || []);
      const kitchenCountertops = detectKitchenCountertops(data.description || []);
      const flooringBedrooms = detectBedroomFlooring(data.description || []);
      const balconyLocation = detectBalconyLocation(data.description || []);
      const isPrivateTerrace = detectPrivateTerraceOrBackyard(data.description || []);
      const numberOfLockers = extractStorageUnits(data.description || []);
      const lockerDetails = extractLockerStorageDetails(data.description || []);
      const lockerLevelAndNumber = extractLockerLevelAndNumber(data.description || []);
      const utilityShare = extractUtilityResponsibility(data.description || []);
      const insuranceCompany = detectHomeInsurance(data.description || []);
      const insurancePolicyNumber = extractInsurancePolicyNumber(data.description || []);
      const AC_Inclusion = detectACInclusionFromText();
      const Heat_Inclusion = detectHeatInclusionFromText();
      const Internet_Inclusion = detectInternetInclusionFromText();
      const utilityNotes = extractUtilityNotes(data.description || []);
      const buildingCategory = detectBuildingCategoryFromText(data.title, data.description);
      const condoCorpNumber = extractCondoCorpNumber();
      const petRestrictions = detectPetRestrictions();
      const mgmtInfo = detectBuildingMgmtInfo();
      const mgmtEmail = extractMgmtEmail();
      const officeAddress = extractOfficeAddress();
      const developerName = detectDeveloperName();
      const Laundary = detectOnSiteLaundry(data);
      const dateOfConstructionISO = detectDateOfConstruction();
      document.getElementById("Year_Last_Renovated").value = Lastyearrenovated;
      document.getElementById("Unit_name").value = UnitNamecorrected || "";
      document.getElementById("Unit_number").value = Unitnumber;

      function generateAdDescription({
        FirstName,
        LastName,
        Mobile,
        bedrooms,
        bathrooms,
        unitType,
        unitName,
        Street_Name,
        Street_Number,
        city,
        Province,
        PostalCode,
        price,
        Parkingspacs,
        Upgraded_Kitchen,
        kitchenCountertops,
        applianceFinish,
        furnished,
        flooringBedrooms,
        ceilingHeight,
        upgradedBathroom,
        closetType,
        enSuiteBathrooms,
        privateTerraceOrBackyard,
        Sunlight,
        Outdoor_Patio_Final,
        BBQ_Area_Final,
        Parking_Garage,
        Remote_Garage,
        Subway_Access,
        dateOfConstructionISO,
      }) {
        const phoneDisplay = Mobile || "(437) 561-9900"; // fallback to call number

        // Address block
        const addressFull = `${Street_Number ? Street_Number + " " : ""}${Street_Name}, ${city}, ${Province} ${PostalCode}`.trim();

        // Intersection placeholder (can enhance to extract if needed)
        const intersection = `${city} Main Intersection`;

        // Price and parking
        const priceDisplay = price ? `$${price.toLocaleString()}/mo` : "Price Upon Request";
        const parkingDisplay = Parkingspacs ? `(${Parkingspacs} Parking Spots Available)` : "";

        // Building amenities
        const amenities = []
        if (Outdoor_Patio_Final) amenities.push("Outdoor Patio");
        if (BBQ_Area_Final) amenities.push("Barbecue Area");
        if (Parking_Garage) amenities.push("Parking Garage");
        if (Remote_Garage) amenities.push("Remote Garage");
        if (Subway_Access) amenities.push("Public Transit");

        const amenitiesDisplay = amenities.length > 0 ? `- ${amenities.join(" - ")} -` : "Inquire for building amenities.";

        // Unit Features
        const features = [];

        if (bedrooms) features.push(`${bedrooms} Bedrooms`);
        if (bathrooms) features.push(`${bathrooms} Bathrooms`);
        if (dateOfConstructionISO) features.push(`Built: ${dateOfConstructionISO}`);
        if (Upgraded_Kitchen) features.push("Upgraded Kitchen");
        if (kitchenCountertops) features.push(`${kitchenCountertops} Countertops`);
        if (applianceFinish) features.push(`${applianceFinish} Appliances`);
        if (furnished) features.push("Furnished");
        if (flooringBedrooms) features.push(`${flooringBedrooms} Floors`);
        if (ceilingHeight) features.push(`${ceilingHeight} Ceilings`);
        if (upgradedBathroom) features.push("Upgraded Bathrooms");
        if (closetType) features.push(`${closetType} Closets`);
        if (enSuiteBathrooms) features.push("En-suite Bathroom");
        if (privateTerraceOrBackyard) features.push("Private Terrace/Backyard");
        if (Sunlight) features.push("Tons of Natural Light");

        const featuresDisplay = features.map(f => `- ${f}`).join("\n");

        return `** OPEN 24/7 - CALL: ${phoneDisplay} **

${bedrooms || "Multiple"} Bedrooms, ${bathrooms || "Multiple"} Bathrooms, Near Parks, Public Transportation, Bus Stops, Schools, Shopping Malls, Grocery Stores, Restaurants, Bars and Sport Clubs. The unit also has ${Upgraded_Kitchen ? "an Upgraded Kitchen, " : ""}${kitchenCountertops ? `${kitchenCountertops} Countertops, ` : ""}${flooringBedrooms ? `${flooringBedrooms} Floors, ` : ""}${upgradedBathroom ? "Upgraded Bathrooms, " : ""}${privateTerraceOrBackyard ? "Private Terrace/Backyard, " : ""}${Sunlight ? "and Tons of Natural Light." : ""}

ADDRESS AND INTERSECTION:
${addressFull}
${intersection}

PRICE AND SPECIAL OFFERS:
${priceDisplay} ${parkingDisplay}
Enjoy Special Offers From Our Partners: Rogers, Telus, Bell, Apollo Insurance, The Brick

UNIT FEATURES:
${featuresDisplay}

BUILDING AMENITIES:
${amenitiesDisplay}

Available Immediately!!

** OPEN 24/7 - CALL: ${phoneDisplay} **
READY FOR YOU: Your new home will be spotlessly clean before move-in!`;
      }
      function generateLocationAndIncentives({
        locationFeatures = [],
        hasParks = true,
        hasTransit = true,
        hasSchools = true,
        hasShopping = true,
        hasRestaurants = true,
        incentivesPartners = ["Rogers", "Bell", "Apollo Insurance", "The Brick"],
        customIncentives = [],
      } = {}) {
        // 📍 Location Description Assembly
        const features = [];

        if (hasParks) features.push("Parks");
        if (hasTransit) features.push("Public Transportation, Bus Stops");
        if (hasSchools) features.push("Schools");
        if (hasShopping) features.push("Shopping Malls, Grocery Stores");
        if (hasRestaurants) features.push("Restaurants, Bars and Sports Clubs");

        if (locationFeatures.length > 0) {
          features.push(...locationFeatures);
        }

        const locationDescription = `Near ${features.join(", ")}.`;

        // 🎁 Incentives Assembly
        const partners = incentivesPartners.length > 0
          ? incentivesPartners.join(", ")
          : "our trusted partners";

        const incentives = customIncentives.length > 0
          ? `Enjoy Special Rates and Offers: ${customIncentives.join(", ")}.`
          : `Enjoy Special Rates From Our Partners: ${partners}.`;

        return {
          locationDescription,
          incentives
        };
      }



      const adDescription = generateAdDescription({
        FirstName,
        LastName,
        Mobile,
        bedrooms,
        bathrooms,
        unitType,
        unitName,
        Street_Name,
        Street_Number,
        city,
        Province,
        PostalCode,
        price: numericPrice,
        Parkingspacs,
        Upgraded_Kitchen,
        kitchenCountertops,
        applianceFinish,
        furnished,
        flooringBedrooms,
        ceilingHeight,
        upgradedBathroom,
        closetType,
        enSuiteBathrooms,
        privateTerraceOrBackyard,
        Sunlight,
        Outdoor_Patio_Final,
        BBQ_Area_Final,
        Parking_Garage,
        Remote_Garage,
        Subway_Access,
        dateOfConstructionISO,
      });
      const { locationDescription, incentives } = generateLocationAndIncentives();



      leadData = {
        First_Name: FirstName,
        Assigned_to: { id: loggedInUserId },
        Last_Name: LastName,
        Mobile: Mobile,
        Phone: Mobile,
        Email: Email,
        City: city,
        Lead_Source: "Kijiji",
        Asking_Price: numericPrice,
        Lead_Priority_Level: "High",
        URL: document.getElementById("unitUrl").value,
        Available_Date: scrapedDate,
        Ad_ID_New: listingId,
        Kijiji_Data_Importer: true,
      };
      unitData = {
        Name: UnitNamecorrected,
        Posting_Title_With_Parking_and_Locker: websiteTitle,
        Unit_Type: unitType,
        Incentives: incentives,
        Market_Price_With_Parking_and_Locker: numericPrice,
        Marketed_Price: numericPrice,
        Dryer_Manufacture: dryerBrand,
        Washer_Manufacture: washerManufacturer,
        Washer_and_Dryer: Laundary,
        Ad_Description: adDescription,
        Ad_Description_Long: adDescription,
        Meta_Description: adDescription,
        Location_Description: locationDescription,
        Posting_Title: websiteTitle,
        Total_Area_Sq_Ft: sqFt,
        Max_Occupants: maximumOccupants,
        Property_Condition: propertyCondition,
        Year_Built: Lastyearrenovated,
        Number_of_Floors: numberOfFloors,
        Unit_Facing: unitFacing,
        Lawn_and_Snow_Care: lawnSnowCare,
        Basement_Entrance: entranceType,
        Furnished: furnished,
        Basement_Included: basement,
        Basement_Details: basementDetails,
        Earliest_Move_in_Date: scrapedDate,
        Flooring_Common_Area: flooringCommonArea,
        Ceiling_Hight: ceilingHeight,
        Window_Coverings: windowCoveringsCommon,
        Window_Coverings_Common_Area: windowCoveringsBedroom,
        Bedrooms: bedrooms,
        Bedroom_Layout: bedroomLayout,
        Den_can_be_used_as_a_bedroom: denAsBedroom,
        Closets: closetType,
        En_Suite_Bathrooms: enSuiteBathrooms,
        Bathrooms: bathrooms,
        Countertops_Bathroom: bathroomCountertop,
        Shower_Type: showerType,
        Appliances: applianceFinish,
        Countertops: kitchenCountertops,
        Flooring_in_Bedrooms: flooringBedrooms,
        Location_of_Balcony: balconyLocation,
        Backyard: backyard,
        Is_the_backyard_fenced: backyardFenced,
        Number_of_Parking_Spaces: Parkingspacs,
        Parking_Details: parkingDetails,
        parking_level_num: ParkingLevelNumber,
        View: view,
        Cable_Inclusion: cableIncluded,
        Water_Inclusion: waterIncluded,
        Electricity_Inclusion: hydroIncluded,
        Number_of_Lockers: numberOfLockers,
        Storage_Details: lockerDetails,
        locker_level_and_number: lockerLevelAndNumber,
        How_are_utilities_split: utilityShare,
        Insurance_Home_Owner: insuranceCompany,
        Insurance_Home_Owners: insuranceCompany,
        Insurance_Policy_Number: insurancePolicyNumber,
        Address_Line_2: Unitnumber,
        Street_Number: Street_Number,
        Address: Street_Name,
        City: city,
        On_site_Laundry: Laundary,
        Province: Province,
        Postal_Code: PostalCode,
        Mail_Box_Number: Mailbox_Number,
        Bank_Account: "Canada",
        Hydro_Provider: electricityProvider,
        Water_Provider: waterProvider,
        Gas_Provider: gasProvider,
        Hot_Water_Tank_Provider: hotWaterTankProvider,
        AC_Inclusion: AC_Inclusion,
        Heat_Inclusion: Heat_Inclusion,
        Internet_Inclusion: Internet_Inclusion,
        Cable_Inclusion: Building_Cable_Incl,
        Utility_Notes: utilityNotes,
        Corner_Unit: Corner_Unit,
        Central_Vaccum: Central_Vacuum,
        Penthouse: Penthouse,
        Tons_of_Natural_Light: true,
        Fireplace: Fireplace_Common_Area,
        Fireplace_Bedroom: Fireplace_Bedroom,
        Upgraded_Bathrooms: Upgraded_Bathrooms,
        Upgraded_Back_Splash: Backsplash_Kitchen,
        Upgraded_Kitchen: Upgraded_Kitchen,
        Dishwasher: Dishwasher_Included,
        Huge_Private_Terrace: isPrivateTerrace,
        Private_Garage: Private_Garage,
        Walk_out_to_Garage: Walkout_to_Garage,
        Owner: { id: loggedInUserId },
        Kijiji_Data_Importer: true,
      };
      building_data = {
        Date_of_Construction: dateOfConstructionISO,
        Developer_Name: developerName,
        AC_Included1: AC_Inclusion,
        Heat_Included1: Heat_Inclusion,
        Internet_Included: Internet_Inclusion,
        Concierge_Building_Management_Info: mgmtInfo,
        Category: buildingCategory,
        Property_Type: unitType,
        Property_Management_Contact_Email: mgmtEmail,
        Office_Phone_Number: Mobile,
        Office_Address: officeAddress,
        floor_count: numberOfFloors,
        unit_count: numberOfUnits,
        Corporation_Number: condoCorpNumber,
        Pet_Restrictions: petRestrictions,
        Address: UnitNamecorrected,
        Name: UnitNamecorrected,
        City: city,
        Category: "Residential",
        Country: "Canada",
        Province: Province,
        Postal_Code: PostalCode,
        ac_included: Building_AC_Incl,
        heat_included: Building_Heat_Incl,
        cable_inclusion: Building_Cable_Incl,
        internet_inclusion: Building_Internet_Incl,
        Water_Filtration_Softener_Rental: Building_Water_Filtration_Rental,
        Parking_Garage: Parking_Garage,
        Remote_Garage: Remote_Garage,
        Visitor_Parking: Visitor_Parking,
        Electric_Car_Charging_Stations: EV_Charging,
        Car_Wash: Car_Wash,
        has_subway_access: Subway_Access,
        Laundry_Facilities: Laundry_Building,
        has_lobby_lounge: Lobby_Lounge,
        Wheelchair_Access: Wheelchair_Access,
        Onsite_Staff: Onsite_Staff,
        has_security: Concierge_24_7,
        has_guest_suites: Guest_Suites,
        has_bicycle_storage: Bicycle_Storage,
        Elevators: Elevators,
        Enter_Phone_System: Buzzer_System,
        Security_Onsite: Security,
        Keyless_Entry: Keyless_Entry,
        Pet_Spa: Pet_Spa,
        has_bbq_terrace: BBQ_Area_Final,
        has_rooftop_patio: Rooftop_Patio,
        has_cabana: Cabanas,
        has_tennis_court: Tennis_Court,
        Outdoor_Patio: Outdoor_Patio_Final,
        has_outdoor_pool: Outdoor_Pool,
        Outdoor_Child_Play_Area: Outdoor_Child_Play_Area,
        has_fitness_center: Gym_Fitness,
        Rec_Room: Rec_Room,
        has_billiards_room: Billiards,
        has_pool: Indoor_Pool,
        has_sauna: Sauna,
        Library: Library,
        has_squash_court: Squash,
        has_bowling_alley: Bowling,
        Indoor_Child_Play_Area: Indoor_Child_Area,
        has_business_centre: Meeting_Room,
        has_yoga_room: Yoga_Room,
        has_movie_theater: Movie_Room,
        has_game_room: Games_Room,
        has_whirlpool: Whirlpool,
        has_steam_room: Steam_Room,
        has_basketball_court: Basketball,
        has_golf_range: Golf_Range,
        Piano_Lounge: Piano_Lounge,
        Day_Care_Centre: Daycare,
        Kijiji_Data_Importer: true,

      };

      // ✅ Hide loader and update button status
      document.getElementById("pageLoader").style.display = "none";
      Swal.fire("Success", "All Details fectched successfully!", "success");
      statusfc.innerText = "✅ Data fetched.";
    } catch (err) {
      console.error("❌ Fetch error:", err);
      Swal.fire("Error", "Could not fetch data. See console.", "error");

      // ❌ Hide loader and show error
      document.getElementById("pageLoader").style.display = "none";
      statusfc.innerText = "❌ Error fetching data.";
      location.reload();
    }
  });

  // Event listener for creating records
  // Create records in Zoho CRM

  document.getElementById("createRecordsBtn1").addEventListener("click", async () => {
    const statuscr = document.getElementById("createRecordsBtn1");
    const aid = leasingSel.value;

    //     if (!validateAllFields()) {
    //     // Stop the function if validation fails
    //     return;
    // }
    statuscr.disabled = true;
    document.getElementById("pageLoader2").style.display = "flex";

    console.log("Lead Data:", leadData);
    console.log("Unit Data:", unitData);
    console.log("Building Data:", building_data);


    try {
      document.getElementById("pageLoader2").style.display = "flex";

      let buildingid = null;
      let existingBuilding = null;
      const BuildingName = building_data.Name?.trim();

      if (BuildingName) {
        const buildingQuery = `(Name:equals:${BuildingName})`;
        console.log("🔍 Building Query:", buildingQuery);

        const searchResp = await ZOHO.CRM.API.searchRecord({
          Entity: "Buildings",
          Type: "criteria",
          Query: buildingQuery,
        });
        console.log("Building Search Response:", searchResp);

        if (searchResp?.data?.length > 0) {
          existingBuilding = searchResp.data[0];
          buildingid = existingBuilding.id;
        }
      }

      const unitName = unitData.Name?.trim();
      if (unitName) {
        const unitQuery = `(Name:equals:${unitName})`;
        console.log("🔍 Unit Query:", unitQuery);

        const unitDupCheck = await ZOHO.CRM.API.searchRecord({
          Entity: "Units",
          Type: "criteria",
          Query: unitQuery,
        });
        console.log("Unit Search Response:", unitDupCheck);

        if (unitDupCheck?.data?.length > 0) {
          throw {
            module: "Units",
            message: "Duplicate Unit Name",
            details: {
              id: unitDupCheck.data[0].id,
              field: "Name",
            },
          };
        }
      }

      const adID = leadData.Ad_ID_New?.trim();
      if (adID) {
        const leadQuery = `(Ad_ID_New:equals:${adID})`;
        console.log("🔍 Lead Query:", leadQuery);

        const leadDupCheck = await ZOHO.CRM.API.searchRecord({
          Entity: "Leads",
          Type: "criteria",
          Query: leadQuery,
        });
        console.log("Lead Search Response:", leadDupCheck);

        if (leadDupCheck?.data?.length > 0) {
          throw {
            module: "Leads",
            message: "Duplicate Ad ID",
            details: {
              id: leadDupCheck.data[0].id,
              field: "Ad_ID_New",
            },
          };
        }
      }

      if (!buildingid) {
        const buildingResp = await ZOHO.CRM.API.insertRecord({
          Entity: "Buildings",
          APIData: building_data,
          Trigger: ["workflow"],
        });
        console.log("Building Response:", buildingResp);
        if (!buildingResp || buildingResp.data[0].code !== "SUCCESS") {
          throw {
            module: "Buildings",
            message: buildingResp.data[0].message || "Error creating building",
            details: {
              id: null,
              field: "Insert Error",
            },
            data: buildingResp.data,
          };
        }
        buildingid = buildingResp.data[0].details.id;
      }

      const leadResp = await ZOHO.CRM.API.insertRecord({
        Entity: "Leads",
        APIData: leadData,
        Trigger: ["workflow"],
      });
      if (!leadResp || leadResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Leads",
          message: leadResp.data[0].message || "Error creating lead",
          details: {
            id: null,
            field: "Insert Error",
          },
          data: leadResp.data,
        };
      }
      const leadId = leadResp.data[0].details.id;

      const unitResp = await ZOHO.CRM.API.insertRecord({
        Entity: "Units",
        APIData: unitData,
        Trigger: ["workflow"],
      });
      if (!unitResp || unitResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Units",
          message: unitResp.data[0].message || "Error creating unit",
          details: {
            id: null,
            field: "Insert Error",
          },
          data: unitResp.data,
        };
      }
      const unitId = unitResp.data[0].details.id;

      const updateLeadResp = await ZOHO.CRM.API.updateRecord({
        Entity: "Leads",
        RecordID: leadId,
        Trigger: ["workflow"],
        APIData: {
          id: leadId,
          Associated_Unit: { id: unitId },
          Owner: { id: aid },
        },
      });
      if (!updateLeadResp || updateLeadResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Leads",
          message: updateLeadResp.data[0].message || "Error updating lead",
          details: {
            id: leadId,
            field: "Update Error",
          },
          data: updateLeadResp.data,
        };
      }

      const updateUnitResp = await ZOHO.CRM.API.updateRecord({
        Entity: "Units",
        RecordID: unitId,
        Trigger: ["workflow"],
        APIData: {
          id: unitId,
          Associated_Building: { id: buildingid },
        },
      });
      if (!updateUnitResp || updateUnitResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Units",
          message: updateUnitResp.data[0].message || "Error updating unit",
          details: {
            id: unitId,
            field: "Update Error",
          },
          data: updateUnitResp.data,
        };
      }

      // 🎉 Success summary popup
      Swal.fire({
        icon: "success",
        title: "✅ Records Created Successfully",
        html: `
    <style>
      .summary-container {
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        margin-top: 16px;
      }
      .summary-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 10px;
        overflow: hidden;
      }
      .summary-table td {
        padding: 14px 18px;
        vertical-align: top;
        border: 1px solid #e0e0e0;
      }
      .summary-header {
        background-color: #0d6efd;
        color: #fff;
        font-weight: bold;
        width: 140px;
        text-align: center;
      }
      .summary-cell {
        font-weight: 600;
        background-color: #f8f9fa;
      }
      .summary-cell a {
        color: #0d6efd;
        font-weight: 500;
        text-decoration: underline;
      }
      .summary-label {
        color: #6c757d;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 4px;
        display: block;
      }
    </style>
    <div class="summary-container">
      <table class="summary-table">
        <tr>
          <td class="summary-header">👤 Prospect</td>
          <td class="summary-cell">
            <span class="summary-label">Prospect Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/Leads/${leadId}" target="_blank">${leadData.Last_Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Mobile</span>${leadData.Mobile || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">City</span>CAD ${leadData.City || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Available Date</span>${leadData.Available_Date || "N/A"
          }</td>
        </tr>
        <tr>
          <td class="summary-header">🏠 Unit</td>
          <td class="summary-cell">
            <span class="summary-label">Unit Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/CustomModule10/${unitId}" target="_blank">${unitData.Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Bathroom</span>${unitData.Bathrooms || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Bedrooms</span>${unitData.Bedrooms || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Unit Type</span>${unitData.Unit_Type || "N/A"
          }</td>
        </tr>
        <tr>
          <td class="summary-header">🏢 Building</td>
          <td class="summary-cell">
            <span class="summary-label">Building Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/CustomModule2/${buildingid}" target="_blank">${existingBuilding?.Name || building_data.Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Property Type</span>${building_data.Property_Type || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Number of Floors</span>${building_data.floor_count || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">City</span>${building_data.City || "N/A"
          }</td>
        </tr>
      </table>
    </div>
  `,
        width: 750,
        confirmButtonText: "Done",
        confirmButtonColor: "#0d6efd",
      }).then(() => {
        location.reload();
      });
    }
    catch (err) {
      document.getElementById("pageLoader2").style.display = "none";
      console.error("❌ Full Error Object:", err);

      let title = "❌ Operation Failed";
      let html = `<p>Something went wrong. Please review the message below.</p>`;

      // ✅ This will now trigger correctly:
      if (err?.module && err?.details) {
        const moduleName = err.module;
        const field = err.details.field || "Field";
        const id = err.details.id;
        const message = err.message || "Error";

        const moduleLinks = {
          Units: id ? `https://crm.zoho.com/crm/org680397761/tab/CustomModule10/${id}` : "#",
          Leads: id ? `https://crm.zoho.com/crm/org680397761/tab/Leads/${id}` : "#",
          Buildings: id ? `https://crm.zoho.com/crm/org680397761/tab/CustomModule2/${id}` : "#",
        };

        title = "🚫 Duplicate Entry or API Error";
        html = `
            <p><strong>Module:</strong> ${moduleName}</p>
            <p><strong>Field:</strong> ${field}</p>
            <p><strong>Message:</strong> ${message}</p>
            ${id ? `<p><a href="${moduleLinks[moduleName]}" target="_blank">🔗 View Record</a></p>` : ""}
        `;
      }
      // For Zoho API errors
      else if (err?.data?.[0]?.message) {
        const message = err.data[0].message;
        const reason = err.data[0]?.details?.[0]?.api_name || "Unknown Field";
        title = "⚠️ API Validation Error";
        html = `
            <p><strong>Error Message:</strong> ${message}</p>
            <p><strong>Problem Field:</strong> ${reason}</p>
        `;
      } else {
        html = `
            <p>An unexpected error occurred.</p>
            <pre>${err?.message || JSON.stringify(err)}</pre>
        `;
      }

      Swal.fire({
        icon: "error",
        title: title,
        html: html,
        confirmButtonText: "Close",
        confirmButtonColor: "#d33",
      }).then(() => {
        location.reload();
      });;
    } finally {
      document.getElementById("pageLoader").style.display = "none";
      document.getElementById("pageLoader2").style.display = "none";
    }
  });

  document.getElementById("createRecordsBtn2").addEventListener("click", async () => {
    const statuscr = document.getElementById("createRecordsBtn2");
    const aid = leasingSel.value;
    if (!validateAllFields1()) {
      // Stop the function if validation fails
      return;
    }
    statuscr.disabled = true;
    document.getElementById("pageLoader2").style.display = "flex";
    Source = document.getElementById("prospectSource").value;
    console.log("Source", Source);

    // ✅ Fetch values safely once
    const firstNameValue = document.getElementById("First_Name1")?.value || "";
    const lastNameValue = document.getElementById("Last_Name1")?.value || "";
    const mobileValue = document.getElementById("Mobile1")?.value || "";
    const cityValue = document.getElementById("City1")?.value || "";
    const availableDateValue = document.getElementById("Available_Date1")?.value || "";
    const unitTypeValue = document.getElementById("Unit_Type1")?.value || "";
    const floorsValue = document.getElementById("number_of_floors1")?.value || "";
    const bedroomsValue = document.getElementById("Bedrooms1")?.value || "";
    const bathroomsValue = document.getElementById("Bathrooms1")?.value || "";
    const backyardValue = document.getElementById("Backyard1")?.value || "";
    const backyardFencedValue = document.getElementById("Backyard_Fenced1")?.value || "";
    const parkingSpacesValue = document.getElementById("Parking_Spaces1")?.value || "";
    const parkingDetailsValue = document.getElementById("Parking_Details1")?.value || "";
    const unitNumberValue = document.getElementById("Unit_number1")?.value || "";
    const provinceValue = document.getElementById("Province1")?.value || "";
    const postalCodeValue = document.getElementById("Postal_Code1")?.value || "";
    const unitCountValue = document.getElementById("number_of_units1")?.value || "";
    const constructedon = document.getElementById("Date_of_Construction1")?.value || "";
    const sqfeet = document.getElementById("sqrfeet1")?.value || "";
    const unitdes = document.getElementById("Unit_Description1")?.value || "";
    const askingprice = document.getElementById("Asking_Price1")?.value || "";
    const lastrenovated = document.getElementById("Year_Last_Renovated1")?.value || "";
    const Unit_Address = document.getElementById("Unitaddress1")?.value || "";
    const Email1 = document.getElementById("Email1")?.value || "";
    const propertyCondition = document.getElementById("Property_Condition1")?.value || "";
    const Locker = document.getElementById("numlocker1")?.value || "";
    const lockerd = document.getElementById("Locker_Details1")?.value || "";
    const washerd = document.getElementById("Washer_and_Dryer1")?.value || "";
    const Furnished = document.getElementById("Furnished1")?.value || "";
    const Utilities = document.getElementById("Utilities")?.value || "";
    const NOE = document.getElementById("Noe1")?.value || "";


    ;

    // ✅ Create leadData safely
    leadData = {
      First_Name: firstNameValue,
      Last_Name: lastNameValue,
      Assigned_to: { id: loggedInUserId },
      Mobile: mobileValue,
      Phone: mobileValue,
      Unit_Address: Unit_Address,
      Email1: Email1,
      Asking_Price: askingprice,
      City: cityValue,
      City_New2: cityValue,
      Lead_Source: Source,
      Lead_Priority_Level: "High",

      Available_Date: availableDateValue,
      Kijiji_Data_Importer: true,
    };

    // ✅ Create unitData safely
    unitData = {
      Name: Unit_Address,
      Address_Line_2: unitNumberValue,
      Property_Condition: propertyCondition,
      Notice_of_Entry_Required: NOE,
      Furnished: Furnished,
      How_are_utilities_split: Utilities,
      Washer_and_Dryer: washerd,
      Number_of_Lockers: Locker,
      Storage_Details: lockerd,
      Unit_Category: "Residential",
      Marketed_Price: askingprice,
      Market_Price_With_Parking_and_Locker: askingprice,
      Location_Description: unitdes,
      Total_Area_Sq_Ft: sqfeet,
      Unit_Type: unitTypeValue,
      Year_Built: lastrenovated,
      Number_of_Floors: floorsValue,
      Bedrooms: bedroomsValue,
      Bathrooms: bathroomsValue,
      Backyard: backyardValue,
      Is_the_backyard_fenced: backyardFencedValue,
      Number_of_Parking_Spaces: parkingSpacesValue,
      Parking_Details: parkingDetailsValue,
      Address_Line_2: Unit_Address,
      City: cityValue,
      Province: provinceValue,
      Postal_Code: postalCodeValue,
      Bank_Account: "Canada",
      Tons_of_Natural_Light: true,
      Owner: { id: loggedInUserId },
      Kijiji_Data_Importer: true,
    };

    // ✅ Create building_data safely
    building_data = {
      Property_Type: unitTypeValue,
      floor_count: floorsValue,
      unit_count: unitCountValue,
      Address: Unit_Address,
      Name: Unit_Address + "," + cityValue + "," + provinceValue + "," + postalCodeValue,
      City: cityValue,
      Category: "Residential",
      Country: "Canada",
      Province: provinceValue,
      Postal_Code: postalCodeValue,
      Date_of_Construction: constructedon,
      Kijiji_Data_Importer: true,
    };
    try {
      document.getElementById("pageLoader2").style.display = "flex";

      let buildingid = null;
      let existingBuilding = null;

      const BuildingName = document.getElementById("Unit_name").value?.trim();

      if (BuildingName) {
        const buildingQuery = `(Name:equals:${BuildingName})`;
        console.log("🔍 Building Query:", buildingQuery);

        const searchResp = await ZOHO.CRM.API.searchRecord({
          Entity: "Buildings",
          Type: "criteria",
          Query: buildingQuery,
        });
        console.log("Building Search Response:", searchResp);

        if (searchResp?.data?.length > 0) {
          existingBuilding = searchResp.data[0];
          buildingid = existingBuilding.id;
        }
      }

      const unitName = document.getElementById("Unit_name").value?.trim();

      if (unitName) {
        const unitQuery = `(Name:equals:${unitName})`;
        console.log("🔍 Unit Query:", unitQuery);

        const unitDupCheck = await ZOHO.CRM.API.searchRecord({
          Entity: "Units",
          Type: "criteria",
          Query: unitQuery,
        });
        console.log("Unit Search Response:", unitDupCheck);

        if (unitDupCheck?.data?.length > 0) {
          throw {
            module: "Units",
            message: "Duplicate Unit Name",
            details: {
              id: unitDupCheck.data[0].id,
              field: "Name",
            },
          };
        }
      }

      if (!buildingid) {
        const buildingResp = await ZOHO.CRM.API.insertRecord({
          Entity: "Buildings",
          APIData: building_data,
          Trigger: ["workflow"],
        });
        console.log("Building Response:", buildingResp);
        if (!buildingResp || buildingResp.data[0].code !== "SUCCESS") {
          throw {
            module: "Buildings",
            message: buildingResp.data[0].message || "Error creating building",
            details: {
              id: null,
              field: "Insert Error",
            },
            data: buildingResp.data,
          };
        }
        buildingid = buildingResp.data[0].details.id;
      }

      const leadResp = await ZOHO.CRM.API.insertRecord({
        Entity: "Leads",
        APIData: leadData,
        Trigger: ["workflow"],
      });
      if (!leadResp || leadResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Leads",
          message: leadResp.data[0].message || "Error creating lead",
          details: {
            id: null,
            field: "Insert Error",
          },
          data: leadResp.data,
        };
      }
      const leadId = leadResp.data[0].details.id;
      const unitResp = await ZOHO.CRM.API.insertRecord({
        Entity: "Units",
        APIData: unitData,
        Trigger: ["workflow"],
      });
      if (!unitResp || unitResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Units",
          message: unitResp.data[0].message || "Error creating unit",
          details: {
            id: null,
            field: "Insert Error",
          },
          data: unitResp.data,
        };
      }
      const unitId = unitResp.data[0].details.id;

      const updateLeadResp = await ZOHO.CRM.API.updateRecord({
        Entity: "Leads",
        RecordID: leadId,
        Trigger: ["workflow"],
        APIData: {
          id: leadId,
          Associated_Unit: { id: unitId },
          Owner: { id: aid },
        },
      });
      if (!updateLeadResp || updateLeadResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Leads",
          message: updateLeadResp.data[0].message || "Error updating lead",
          details: {
            id: leadId,
            field: "Update Error",
          },
          data: updateLeadResp.data,
        };
      }

      const updateUnitResp = await ZOHO.CRM.API.updateRecord({
        Entity: "Units",
        RecordID: unitId,
        Trigger: ["workflow"],
        APIData: {
          id: unitId,
          Associated_Building: { id: buildingid },
        },
      });
      if (!updateUnitResp || updateUnitResp.data[0].code !== "SUCCESS") {
        throw {
          module: "Units",
          message: updateUnitResp.data[0].message || "Error updating unit",
          details: {
            id: unitId,
            field: "Update Error",
          },
          data: updateUnitResp.data,
        };
      }

      // 🎉 Success summary popup
      Swal.fire({
        icon: "success",
        title: "✅ Records Created Successfully",
        html: `
    <style>
      .summary-container {
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        margin-top: 16px;
      }
      .summary-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 10px;
        overflow: hidden;
      }
      .summary-table td {
        padding: 14px 18px;
        vertical-align: top;
        border: 1px solid #e0e0e0;
      }
      .summary-header {
        background-color: #0d6efd;
        color: #fff;
        font-weight: bold;
        width: 140px;
        text-align: center;
      }
      .summary-cell {
        font-weight: 600;
        background-color: #f8f9fa;
      }
      .summary-cell a {
        color: #0d6efd;
        font-weight: 500;
        text-decoration: underline;
      }
      .summary-label {
        color: #6c757d;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 4px;
        display: block;
      }
    </style>
    <div class="summary-container">
      <table class="summary-table">
        <tr>
          <td class="summary-header">👤 Prospect</td>
          <td class="summary-cell">
            <span class="summary-label">Prospect Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/Leads/${leadId}" target="_blank">${leadData.Last_Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Mobile</span>${leadData.Mobile || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">City</span>CAD ${leadData.City || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Available Date</span>${leadData.Available_Date || "N/A"
          }</td>
        </tr>
        <tr>
          <td class="summary-header">🏠 Unit</td>
          <td class="summary-cell">
            <span class="summary-label">Unit Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/CustomModule10/${unitId}" target="_blank">${unitData.Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Bathroom</span>${unitData.Bathrooms || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Bedrooms</span>${unitData.Bedrooms || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Unit Type</span>${unitData.Unit_Type || "N/A"
          }</td>
        </tr>
        <tr>
          <td class="summary-header">🏢 Building</td>
          <td class="summary-cell">
            <span class="summary-label">Building Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/CustomModule2/${buildingid}" target="_blank">${existingBuilding?.Name || building_data.Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Property Type</span>${building_data.Property_Type || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Number of Floors</span>${building_data.floor_count || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">City</span>${building_data.City || "N/A"
          }</td>
        </tr>
      </table>
    </div>
  `,
        width: 750,
        confirmButtonText: "Done",
        confirmButtonColor: "#0d6efd",
      }).then(() => {
        location.reload();
      });
    }
    catch (err) {
      document.getElementById("pageLoader2").style.display = "none";
      console.error("❌ Full Error Object:", err);

      let title = "❌ Operation Failed";
      let html = `<p>Something went wrong. Please review the message below.</p>`;

      // ✅ This will now trigger correctly:
      if (err?.module && err?.details) {
        const moduleName = err.module;
        const field = err.details.field || "Field";
        const id = err.details.id;
        const message = err.message || "Error";

        const moduleLinks = {
          Units: id ? `https://crm.zoho.com/crm/org680397761/tab/CustomModule10/${id}` : "#",
          Leads: id ? `https://crm.zoho.com/crm/org680397761/tab/Leads/${id}` : "#",
          Buildings: id ? `https://crm.zoho.com/crm/org680397761/tab/CustomModule2/${id}` : "#",
        };

        title = "🚫 Duplicate Entry or API Error";
        html = `
            <p><strong>Module:</strong> ${moduleName}</p>
            <p><strong>Field:</strong> ${field}</p>
            <p><strong>Message:</strong> ${message}</p>
            ${id ? `<p><a href="${moduleLinks[moduleName]}" target="_blank">🔗 View Record</a></p>` : ""}
        `;
      }
      // For Zoho API errors
      else if (err?.data?.[0]?.message) {
        const message = err.data[0].message;
        const reason = err.data[0]?.details?.[0]?.api_name || "Unknown Field";
        title = "⚠️ API Validation Error";
        html = `
            <p><strong>Error Message:</strong> ${message}</p>
            <p><strong>Problem Field:</strong> ${reason}</p>
        `;
      } else {
        html = `
            <p>An unexpected error occurred.</p>
            <pre>${err?.message || JSON.stringify(err)}</pre>
        `;
      }

      Swal.fire({
        icon: "error",
        title: title,
        html: html,
        confirmButtonText: "Close",
        confirmButtonColor: "#d33",
      }).then(() => {
        location.reload();
      });
    } finally {
      document.getElementById("pageLoader").style.display = "none";
      document.getElementById("pageLoader2").style.display = "none";
    }


  });


});
ZOHO.embeddedApp.init();
