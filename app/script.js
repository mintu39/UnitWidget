var userId = "";
let data = {};
let scrapedDate = "";
let listingId = "";
let loggedInUserId = "";
ZOHO.embeddedApp.on("PageLoad", async function () {
  console.log("✅ Widget ready");
  const leasingSel = document.getElementById("ownerid");
  ///users data
  try {
    const leasingSel = document.getElementById("ownerid"); // Make sure it's defined first

    // Fetch users
    const resp = await ZOHO.CRM.API.getAllUsers({ Type: "ActiveUsers" });
    leasingSel.innerHTML = "";

    // Get current user
    const userInfo = await ZOHO.CRM.CONFIG.getCurrentUser();
    const loggedInUserId = userInfo.users[0].id;

    if (resp.users?.length) {
      resp.users.forEach((u) => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.text = u.full_name || u.email;

        // ✅ Auto-select current user
        if (u.id === loggedInUserId) {
          opt.selected = true;
        }

        leasingSel.appendChild(opt);
      });
    } else {
      leasingSel.innerHTML = "<option>No active users</option>";
    }

    console.log("✅ Logged-in User ID:", loggedInUserId);
    console.log("📧 Email:", userInfo.users[0].email);
    console.log("👤 Name:", userInfo.users[0].full_name);
  } catch (err) {
    console.error("❌ Error loading users or user info:", err);
    document.getElementById("ownerid").innerHTML =
      "<option>Error loading users</option>";
  }
  ZOHO.CRM.CONFIG.getCurrentUser()
    .then(function (userInfo) {
      loggedInUserId = userInfo.users[0].id;
      const userEmail = userInfo.users[0].email;
      const fullName = userInfo.users[0].full_name;

      console.log("✅ Logged-in User ID:", loggedInUserId);
      console.log("📧 Email:", userEmail);
      console.log("👤 Name:", fullName);
    })
    .catch(function (err) {
      console.error("❌ Failed to get user info:", err);
    });

  // Get First Name
  function extractFirstName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    return nameParts.length > 1 ? nameParts[0] : "";
  }
  //get Last Name
  function extractLastName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    return nameParts.length > 1
      ? nameParts.slice(1).join(" ")
      : fullName.trim();
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
        type: "Basement",
        keywords: [
          "basement",
          "basement apartment",
          "lower level",
          "basement suite",
          "walkout basement",
        ],
      },
      {
        type: "Condominium",
        keywords: [
          "condo",
          "luxury condo",
          "condominium",
          "condo unit",
          "condo apartment",
        ],
      },
      {
        type: "Townhouse",
        keywords: [
          "townhouse",
          "townhome",
          "end unit townhouse",
          "3-storey townhouse",
        ],
      },
      {
        type: "Unit - Apartment Building",
        keywords: [
          "apartment",
          "unit",
          "suite",
          "corner unit",
          "high-rise",
          "low-rise",
        ],
      },
      {
        type: "House",
        keywords: [
          "house",
          "detached",
          "bungalow",
          "single family",
          "entire house",
        ],
      },
      {
        type: "Multi Unit - Above Ground",
        keywords: [
          "triplex",
          "fourplex",
          "main floor",
          "upstairs unit",
          "upper level in house",
          "corner suite",
        ],
      },
      {
        type: "Stacked Townhouse",
        keywords: [
          "stacked townhouse",
          "stacked townhome",
          "upper stacked",
          "lower stacked",
        ],
      },
      {
        type: "Student Room",
        keywords: [
          "student room",
          "student housing",
          "room near college",
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
  // Extract city from address
  function extractCityFromAddress(address) {
    if (!address) return "";
    const parts = address.split(",");
    return parts.length >= 2 ? parts[1].trim() : address;
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
  // Extract parking spaces from vipPrimary and text content
  function extractParkingSpaces(vipPrimary = [], title = "", description = []) {
    const combinedText = (
      title +
      " " +
      (description || []).join(" ")
    ).toLowerCase();

    // Priority: extract from vipPrimary first
    for (let item of vipPrimary) {
      const match = item.match(/(\d+)\s*parking/i);
      if (match) return parseInt(match[1]);
      if (item.toLowerCase().includes("no parking")) return 0;
    }

    // Then check text content
    const textMatch = combinedText.match(/parking (for|included)?\s*(\d+)/i);
    if (textMatch) {
      return parseInt(textMatch[2]);
    }

    if (combinedText.includes("no parking")) {
      return 0;
    }

    return ""; // If no info found
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
  function detectCornerUnit(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("corner unit");
  }
  // Detect central vacuum based on description
  function detectCentralVacuum(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("central vacuum");
  }
  // Detect penthouse based on description
  function detectPenthouse(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("penthouse") || text.includes("top floor");
  }
  // Detect Common Area Fireplace based on description
  function detectFireplaceCommonArea(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("fireplace") || text.includes("living room fireplace");
  }
  // Detect Fireplace in Bedroom based on description
  function detectFireplaceBedroom(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("fireplace in bedroom");
  }
  // Detect upgraded bathrooms based on description
  function detectUpgradedBathrooms(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return text.includes("upgraded bathroom") || text.includes("modern bath");
  }
  // Detect upgraded kitchen based on description
  function detectUpgradedKitchen(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return (
      text.includes("renovated kitchen") || text.includes("modern kitchen")
    );
  }
  // Detect backsplash in kitchen based on description
  function detectBacksplashKitchen(descriptionArray = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();
    return (
      text.includes("backsplash") ||
      text.includes("tile wall behind stove") ||
      text.includes("tile wall behind sink")
    );
  }
  // Detect dishwasher included based on description and attributes
  function detectDishwasherIncluded(descriptionArray = [], attributes = []) {
    const text = (descriptionArray || []).join(" ").toLowerCase();

    const appliances = attributes
      .filter((attr) => attr.label?.toLowerCase() === "appliances")
      .flatMap((attr) => attr.values || [])
      .map((val) => val.toLowerCase());

    return (
      appliances.includes("dishwasher") ||
      text.includes("dishwasher included") ||
      text.includes("built-in dishwasher")
    );
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

  // detect View based on description
  function detectView(descriptionArray = []) {
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
  //street number, street name, postal code, province, city, unit, mailbox number
  // 1. Unit (e.g., Unit 1404, 22-136)
  function extractUnit(title = "", firstName = "") {
    const combined = `${title} ${firstName}`;
    const match = combined.match(/\b(unit\s*)?#?\s?(\d{1,4}(-\d{1,4})?)\b/i);
    return match ? match[2] : "";
  }
  // 2. Street Number (e.g., 123 in "123 King St")
  function extractStreetNumber(location = "", firstName = "", title = "") {
    const combined = `${location} ${firstName} ${title}`;
    const match = combined.match(/\b(\d{1,5})\b\s+[A-Za-z]/);
    return match ? match[1] : "";
  }
  // 3. Street Name (everything after number before city)
  function extractStreetName(location = "", firstName = "", title = "") {
    const combined = `${location} ${firstName} ${title}`.toLowerCase();

    const streetTypes = [
      "street",
      "st",
      "road",
      "rd",
      "avenue",
      "ave",
      "boulevard",
      "blvd",
      "drive",
      "dr",
      "lane",
      "ln",
      "court",
      "ct",
      "crescent",
      "cr",
      "terrace",
      "way",
      "trail",
      "place",
      "pkwy",
    ].join("|");

    // Match optional number, followed by street name + suffix
    const regex = new RegExp(
      `(?:\\d{1,5}\\s+)?([a-z\\s]+?\\s(?:${streetTypes}))\\b`,
      "i"
    );

    const match = combined.match(regex);
    return match ? capitalizeWords(match[1].trim()) : "";
  }
  // Helper function to capitalize words
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  // Capitalize first letter of each word in a string
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  // 4. City (assumed 2nd part of location)
  function extractCity(location = "") {
    const parts = location.split(",");
    return parts.length >= 2 ? parts[1].trim() : "";
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
  function detectUtilityInclusions(descriptionArray = [], attributes = []) {
    const combinedText = (descriptionArray || []).join(" ").toLowerCase();
    const attributeValues = attributes
      .flatMap((attr) => attr.values || [])
      .join(" ")
      .toLowerCase();

    const fullText = `${combinedText} ${attributeValues}`;

    return {
      AC_Inclusion: /air conditioning included|central ac|ac provided/.test(
        fullText
      ),
      Heat_Inclusion:
        /heating included|heat paid by landlord|heat included/.test(fullText),
      Internet_Inclusion: /wifi included|internet included|free internet/.test(
        fullText
      ),
      Cable_Inclusion: /cable included|tv included/.test(fullText),
      Phone_Inclusion: /phone line included|landline included/.test(fullText),
    };
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

  /* ───────── BUILDING CATEGORY ───────── */
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
  /* ───────── FULL LOCATION STRING ───────── */
  function extractLocationString() {
    const text = JSON.stringify(data); // keep case
    const match = text.match(/"location"\s*:\s*"([^"]+)"/i);
    return match ? match[1].trim() : "";
  }
  /* ───────── CONDO CORP NUMBER ───────── */
  function extractCondoCorpNumber() {
    const text = JSON.stringify(data); // keep case for corp codes

    // formats like "TSCC 1234", "MTCC123", "YCC 567", "Condo Corp #987"
    const match = text.match(/\b([A-Z]{2,4}C{0,2})\s*#?\s*(\d{3,5})\b/);
    return match ? `${match[1].replace(/\s+/, "")} ${match[2]}` : "";
  }

  /* ───────── PET RESTRICTIONS ───────── */
  function detectPetRestrictions() {
    const text = JSON.stringify(data).toLowerCase();

    if (/no pets|no dogs|cats only/.test(text)) return "Restrictions";
    if (/pet friendly|pets allowed|dogs ok/.test(text)) return "Pet Friendly";
    if (/service animals only/.test(text)) return "Service Animals Only";
    if (/breed restrictions|small pets/.test(text))
      return "Breed / Size Restrictions";

    return "";
  }

  /* ───────── BUILDING MGMT INFO ───────── */
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

  /* ───────── MGMT EMAIL ───────── */
  function extractMgmtEmail() {
    const text = JSON.stringify(data);
    const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i); // first email
    return match ? match[0] : "";
  }

  /* ───────── MGMT PHONE NUMBER ───────── */
  function extractMgmtPhone() {
    const text = JSON.stringify(data);

    // matches formats like "+1-782-414-4299", "416-555-1234", "(902) 555-1234"
    const match = text.match(
      /(\+?\d{1,2}[-\s.]*)?\(?\d{3}\)?[-\s.]*\d{3}[-\s.]*\d{4}/
    );
    return match ? match[0].trim() : "";
  }

  /* ───────── OFFICE ADDRESS (very basic) ───────── */
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

  /* ───────── DEVELOPER NAME ───────── */
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

  /* ───────── DATE OF CONSTRUCTION → ISO yyyy-mm-dd ───────── */
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
  document
    .getElementById("fetchDataBtn")
    .addEventListener("click", async () => {
      const url = document.getElementById("unitUrl").value;
      const match = url.match(/\/(\d+)(?:\/)?$/);
      const statusfc = document.getElementById("fetchDataBtn");

      if (!url) {
        Swal.fire("Enter URL", "Please enter a Kijiji listing URL.", "warning");
        return;
      }

      if (match) {
        listingId = match[1];
        console.log(listingId);
      } else {
        console.log("No ID found in URL");
      }

      // Show loader and disable button
      statusfc.disabled = true;
      document.getElementById("pageLoader").style.display = "flex";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // 120 sec
      try {
        const response = await fetch(
          "https://api.royalyorkpm.com/kijiji-ocr-new?url=" +
            encodeURIComponent(url),
          {
            signal: controller.signal,
          }
        );
        clearTimeout(timeout); // Clear the timeout on success
        data = await response.json();
        const StringData = JSON.stringify(data).toLowerCase();
        console.log("StringData", StringData);
        console.log("loggedInUserId", loggedInUserId);

        //25th June start New -
        const obj = { firstName: data.firstName || "" };
        const fullName = obj.firstName || "";
        const FirstName = extractFirstName(fullName);
        document.getElementById("First_Name").value = FirstName;
        const LastName = extractLastName(fullName);
        document.getElementById("Last_Name").value = LastName;
        scrapedDate = extractAvailableDate(data.vipAttributes?.attributes);
        document.getElementById("Available_Date").value = scrapedDate;
        const Mobile = data.phone || "";
        document.getElementById("Mobile").value = Mobile;
        const unitType = detectUnitTypeFromTitleAndDescription(
          data.title,
          data.description
        );
        document.getElementById("Unit_Type").value = unitType;
        const city = extractCityFromAddress(data.location);
        document.getElementById("City").value = city;
        const Province = extractProvince(data.location);
        document.getElementById("Province").value = Province;
        const PostalCode = extractPostalCode(data.location);
        document.getElementById("Postal_Code").value = PostalCode;
        const bedrooms = extractBedroomsSmart(
          data.vipAttributes?.primary || [],
          data.title || "",
          data.description || []
        );
        document.getElementById("Bedrooms").value = bedrooms;
        const bathrooms = extractBathroomsSmart(
          data.vipAttributes?.primary || [],
          data.title || "",
          data.description || []
        );
        document.getElementById("Bathrooms").value = bathrooms;
        const numberOfFloors = detectNumberOfFloors() || 0;
        document.getElementById("number_of_floors").value = numberOfFloors;
        const numberOfUnits = detectNumberOfUnits() || 0;
        document.getElementById("number_of_units").value = numberOfUnits;
        const backyard = detectBackyard();
        document.getElementById("Backyard").value = backyard;
        const backyardFenced = detectBackyardFenced();
        document.getElementById("Backyard_Fenced").value = backyardFenced;
        const Parkingspacs = extractParkingSpaces() || 0;
        document.getElementById("Parking_Spaces").value = Parkingspacs;
        const parkingDetails = detectParkingDetails() || "";
        document.getElementById("Parking_Details").value = parkingDetails;
        const unitName = detectUnitName() || "";
        const propertyCondition = detectPropertyCondition(data.description);
        const electricityProvider = detectElectricityProvider(
          data.description || []
        );
        const waterProvider = detectWaterProvider(data.description || []);
        const gasProvider = detectGasProvider(data.description || []);
        const hotWaterTankProvider = detectHotWaterTankProvider(
          data.description || []
        );
        const Corner_Unit = detectCornerUnit(data.description || []);
        const Central_Vacuum = detectCentralVacuum(data.description || []);
        const Penthouse = detectPenthouse(data.description || []);
        const Natural_Sunlight = detectNaturalSunlight(data.description || []);
        const Fireplace_Common_Area = detectFireplaceCommonArea(
          data.description || []
        );
        const Fireplace_Bedroom = detectFireplaceBedroom(
          data.description || []
        );
        const Upgraded_Bathrooms = detectUpgradedBathrooms(
          data.description || []
        );
        const Backsplash_Kitchen = detectBacksplashKitchen(
          data.description || []
        );
        const Upgraded_Kitchen = detectUpgradedKitchen(data.description || []);
        const Dishwasher_Included = detectDishwasherIncluded(
          data.description || [],
          data.attributes || []
        );
        const Building_AC_Incl = detectBuilding_AC_Incl();
        const Building_Heat_Incl = detectBuilding_Heat_Incl();
        const Building_Cable_Incl = detectBuilding_Cable_Incl();
        const Building_Internet_Incl = detectBuilding_Internet_Incl();
        const Building_Water_Filtration_Rental =
          detectBuilding_Water_Filtration_Rental();
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
        function correctUnitName(unitType, unitName, location = "") {
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

          // If no number in unit name, fallback to formatted location
          const fallback = location
            ? `Not Listed – ${location.trim()}`
            : "Not Listed";
          return fallback;
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
        // building type mapping based on unit type
        function mapUnitTypeToBuildingType(unitType = "") {
          const mapping = {
            condominium: "Condominium",
            "unit - apartment building": "Apartment Building",
            "single unit house": "Single Unit House",
            "multi unit - above ground": "Multi Unit House",
            "stacked townhouse": "Condo Townhouse",
            "student room": "Multi Unit House",
            basement: "Multi Unit House",
          };

          const normalized = unitType.toLowerCase().trim();
          return mapping[normalized] || "";
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
            "basement",
            "lower level",
            "shared laundry",
            "separate entrance",
            "in basement",
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
        function detectViewFromUnitType(unitType = "") {
          const type = unitType.toLowerCase();

          const typesWithCourtyardView = [
            "house",
            "multi unit - above ground",
            "stacked townhouse",
            "townhouse",
            "basement",
          ];

          if (typesWithCourtyardView.includes(type)) {
            return "Courtyard/Backyard";
          }

          return ""; // No override
        }
        // Detect if the property is verified by RYPM
        function detectVerifiedByRYPM({
          propertyCondition = "",
          electricityProvider = "",
          gasProvider = "",
          hotWaterTankProvider = "",
          waterProvider = "",
        } = {}) {
          const isVerified = propertyCondition.trim() !== "";

          return {
            verifiedByRYPM: isVerified ? "Yes" : "",
            electricityProvider:
              isVerified && !electricityProvider
                ? "To be Determined (TBD)"
                : electricityProvider,
            gasProvider:
              isVerified && !gasProvider
                ? "To be Determined (TBD)"
                : gasProvider,
            hotWaterTankProvider:
              isVerified && !hotWaterTankProvider
                ? "To be Determined (TBD)"
                : hotWaterTankProvider,
            waterProvider:
              isVerified && !waterProvider
                ? "To be Determined (TBD)"
                : waterProvider,
          };
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
        function detectPetsAllowed(
          propertyCondition = "",
          petRestrictions = ""
        ) {
          const text = JSON.stringify(data).toLowerCase();

          const keywordMatch =
            text.includes("pets allowed") ||
            text.includes("pet friendly") ||
            text.includes("pets are welcome") ||
            text.includes("small pets permitted") ||
            text.includes("cats and dogs allowed");

          const propertyConditionExists = propertyCondition.trim() !== "";
          const petRestrictionsEmpty = petRestrictions.trim() === "";

          return (
            keywordMatch || (petRestrictionsEmpty && propertyConditionExists)
          );
        }

        //Condition const here updated ones
        const UnitName = correctUnitName(unitType, Address);
        document.getElementById("Unit_name").value = UnitName || "";
        const Unitnumber = detectUnitNumber(unitType, Address);
        document.getElementById("Unit_number").value = Unitnumber;
        const lawnSnowCare = detectLawnAndSnowCare(data.description || []);
        const buildingType = mapUnitTypeToBuildingType(unitType);
        const basement = detectBasementIncluded(
          data.title || "",
          data.description || [],
          data.unitType || ""
        );
        const basementDetails = extractBasementDetails(
          data.description || [],
          data.unitType || ""
        );
        const upgradedBathroom = checkUpgradedBathroom(propertyCondition);
        const upgradedKitchen = checkUpgradedBathroom(propertyCondition);
        const lastYearRenovated =
          extractLastRenovatedYear(propertyCondition) || "";
        document.getElementById("Year_Last_Renovated").value =
          Lastyearrenovated;
        const Sunlight = true;
        const privateTerraceOrBackyard =
          detectPrivateTerraceOrBackyardFromBackyardValue(backyard);
        const view = detectViewFromUnitType(data.unitType || "");
        const numericPrice = data.price
          ? Number(data.price.replace(/[$,]/g, ""))
          : "";
        const result = detectVerifiedByRYPM({
          propertyCondition: detectPropertyCondition(data.description || []),
          electricityProvider: detectElectricityProvider(
            data.description || []
          ),
          gasProvider: detectGasProvider(data.description || []),
          hotWaterTankProvider: detectHotWaterTankProvider(
            data.description || []
          ),
          waterProvider: detectWaterProvider(data.description || []),
        });
        const BBQ_Area_Final = detectBBQ_Area_Synced();
        const Outdoor_Patio_Final = detectOutdoor_Patio_Synced();
        const Pets_Allowed = detectPetsAllowed();

        const sqFt = extractSqFt(data.vipAttributes?.primary);

        const furnished = detectFurnished(data.description || []);

        const maximumOccupants = detectMaxOccupants(data.description);

        const entranceType = detectEntranceType(
          data.title || "",
          data.description || []
        );

        const numberOfLevels = detectNumberOfLevels(
          data.description,
          data.title
        );
        const unitFacing = detectUnitFacing(data.description);

        const flooringCommonArea = detectFlooringCommonArea(
          data.description || []
        );
        const ceilingHeight = detectCeilingHeight(data.description || []);
        const windowCoveringsCommon = detectWindowCoverings(
          data.description || []
        );
        const windowCoveringsBedroom = detectWindowCoverings(
          data.description || []
        );
        const bedroomLayout = detectBedroomLayout(data.description || []);
        const denAsBedroom = detectDenAsBedroom(data.description || []);
        const closetType = detectClosetType(data.description || []);
        const enSuiteBathrooms = detectEnSuiteBathrooms(data.description || []);
        const bathroomCountertop = detectBathroomCountertop(
          data.description || []
        );
        const showerType = detectShowerType(data.description || []);
        const applianceFinish = detectApplianceFinish(data.description || []);
        const kitchenCountertops = detectKitchenCountertops(
          data.description || []
        );
        const flooringBedrooms = detectBedroomFlooring(data.description || []);
        const balconyLocation = detectBalconyLocation(data.description || []);
        const isPrivateTerrace = detectPrivateTerraceOrBackyard(
          data.description || []
        );
        const viewValue = detectView(data.description || []);

        const numberOfLockers = extractStorageUnits(data.description || []);
        const lockerDetails = extractLockerStorageDetails(
          data.description || []
        );
        const lockerLevelAndNumber = extractLockerLevelAndNumber(
          data.description || []
        );
        const utilityShare = extractUtilityResponsibility(
          data.description || []
        );
        const insuranceCompany = detectHomeInsurance(data.description || []);
        const insurancePolicyNumber = extractInsurancePolicyNumber(
          data.description || []
        );

        const utilityInclusions = detectUtilityInclusions(
          data.description || [],
          data.vipAttributes?.attributes || []
        );
        const utilityNotes = extractUtilityNotes(data.description || []);
        const buildingCategory = detectBuildingCategoryFromText(
          data.title,
          data.description
        );
        const fullLocation = extractLocationString();

        const condoCorpNumber = extractCondoCorpNumber();
        const petRestrictions = detectPetRestrictions();
        const mgmtInfo = detectBuildingMgmtInfo();
        const mgmtEmail = extractMgmtEmail();
        const mgmtPhone = extractMgmtPhone();
        const officeAddress = extractOfficeAddress();
        const developerName = detectDeveloperName();
        const dateOfConstructionISO = detectDateOfConstruction();

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
  document
    .getElementById("createRecordsBtn")
    .addEventListener("click", async () => {
      const statuscr = document.getElementById("createRecordsBtn");
      console.log("loggedInUserId", loggedInUserId);
      // ✅ Show loader and disable fetchDataBtn

      const aid = leasingSel.value;
      console.log("📝 Agent selected:", aid);
      statuscr.disabled = true;
      document.getElementById("pageLoader2").style.display = "flex";
      const leadData = {
        Last_Name: document.getElementById("Last_Name").value,
        Mobile: document.getElementById("Mobile").value,
        Phone: document.getElementById("Phone").value,
        Email: document.getElementById("Email").value,
        City: document.getElementById("City").value,
        Lead_Source: document.getElementById("Lead_Source").value,
        Asking_Price: document.getElementById("Asking_Price").value,
        Lead_Priority_Level: document.getElementById("Lead_Priority_Level")
          .value,
        URL: document.getElementById("URL").value,
        Available_Date: scrapedDate,
        Ad_ID_New: (document.getElementById("Ad_ID_New").value = listingId),
        Owner: { id: loggedInUserId },
      };

      const unitData = {
        Name: document.getElementById("Interested_Unit_Title").value,
        Unit_Type: document.getElementById("Unit_Type").value,
        Total_Area_Sq_Ft:
          parseInt(document.getElementById("Approximate_Sq_Ft").value) || null,
        Max_Occupants:
          parseInt(document.getElementById("Maximum_Occupants").value) || null,
        Property_Condition: document.getElementById("Property_Condition").value,
        Year_Built:
          parseInt(document.getElementById("Year_Last_Renovated").value) ||
          null,
        Number_of_Floors: document.getElementById("Number_of_Levels").value,
        Unit_Facing: document.getElementById("Unit_Facing").value,
        Lawn_and_Snow_Care: document.getElementById("Lawn_Snow_Care").value,
        Basement_Entrance: document.getElementById("Entrance_Type").value,
        Furnished: document.getElementById("Furnished").value,
        Basement_Included: document.getElementById("Basement_Included").value,
        Basement_Details: document.getElementById("Basement_Details").value,
        Earliest_Move_in_Date: scrapedDate,
        Flooring_Common_Area:
          document.getElementById("flooringCommonArea").value,
        Ceiling_Hight: document.getElementById("Ceiling_Height").value,
        Window_Coverings: document.getElementById("Window_Coverings_Common")
          .value,
        Window_Coverings_Common_Area: document.getElementById(
          "Window_Coverings_Bedroom"
        ).value,
        Bedrooms: document.getElementById("Bedrooms").value,
        Bedroom_Layout: document.getElementById("Bedroom_Layout").value,
        Den_can_be_used_as_a_bedroom:
          document.getElementById("Den_As_Bedroom").value,
        Closets: document.getElementById("Closet_Type").value,
        En_Suite_Bathrooms: document.getElementById("En_Suite_Bathrooms").value,
        Bathrooms: document.getElementById("Bathrooms").value,
        Countertops_Bathroom: document.getElementById("Countertops_Bathroom")
          .value,
        Shower_Type: document.getElementById("Shower_Type").value,
        Appliances: document.getElementById("Appliance_Finishes").value,
        Countertops: document.getElementById("Countertops_Kitchen").value,
        Flooring_in_Bedrooms:
          document.getElementById("Flooring_Bedrooms").value,
        Location_of_Balcony: document.getElementById("Balcony_Location").value,
        Backyard: document.getElementById("Backyard").value,
        Is_the_backyard_fenced:
          document.getElementById("Backyard_Fenced").value,
        Number_of_Parking_Spaces:
          parseInt(document.getElementById("Parking_Spaces").value) || 0,
        Parking_Details: document.getElementById("Parking_Details").value,
        parking_level_num: document.getElementById("Parking_Level_Number")
          .value,
        View: document.getElementById("View").value,
        Number_of_Lockers:
          parseInt(
            document.getElementById("Number_of_Storage_Lockers").value
          ) || null,
        Storage_Details:
          document.getElementById("Locker_Storage_Details").value || "",
        locker_level_and_number:
          document.getElementById("Locker_Level_and_Number").value || "",
        How_are_utilities_split:
          document.getElementById("Utilities_Financial_Responsibility").value ||
          "",
        Insurance_Home_Owner:
          document.getElementById("Insurance_Home_Owner").value || "",
        Insurance_Home_Owners:
          document.getElementById("Insurance_Home_Owner").value || "",
        Insurance_Policy_Number:
          document.getElementById("Insurance_Policy_Number").value || "",
        Address_Line_2: document.getElementById("Unit").value || "",
        Street_Number: document.getElementById("Street_Number").value || "",
        Address: document.getElementById("Street_Name").value || "",
        City: document.getElementById("City").value || "",
        Province: document.getElementById("Province").value || "",
        Postal_Code: document.getElementById("Postal_Code").value || "",
        Mail_Box_Number: document.getElementById("Mail_Box_Number").value || "",
        Bank_Account: document.getElementById("Country").value || "Canada",
        Hydro_Provider:
          document.getElementById("Electricity_Provider").value || "",
        Water_Provider: document.getElementById("Water_Provider").value || "",
        Gas_Provider: document.getElementById("Gas_Provider").value || "",
        Hot_Water_Tank_Provider:
          document.getElementById("Hot_Water_Tank_Provider").value || "",
        AC_Inclusion: document.getElementById("AC_Inclusion").checked,
        Heat_Inclusion: document.getElementById("Heat_Inclusion").checked,
        Internet_Inclusion:
          document.getElementById("Internet_Inclusion").checked,
        Cable_Inclusion: document.getElementById("Cable_Inclusion").checked,
        Phone_Inclusion: document.getElementById("Phone_Inclusion").checked,
        Utility_Notes: document.getElementById("Utility_Notes").value || "",
        Corner_Unit: document.getElementById("Corner_Unit").checked,
        Central_Vaccum: document.getElementById("Central_Vacuum").checked,
        Penthouse: document.getElementById("Penthouse").checked,
        Tons_of_Natural_Light:
          document.getElementById("Natural_Sunlight").checked,
        Fireplace: document.getElementById("Fireplace_Common_Area").checked,
        Fireplace_Bedroom: document.getElementById("Fireplace_Bedroom").checked,
        Upgraded_Bathrooms:
          document.getElementById("Upgraded_Bathrooms").checked,
        Upgraded_Back_Splash:
          document.getElementById("Backsplash_Kitchen").checked,
        Upgraded_Kitchen: document.getElementById("Upgraded_Kitchen").checked,
        Dishwasher: document.getElementById("Dishwasher_Included").checked,
        Huge_Private_Terrace: document.getElementById(
          "Private_Terrace_Backyard"
        ).checked,
        Private_Garage: document.getElementById("Private_Garage").checked,
        Walk_out_to_Garage:
          document.getElementById("Walkout_To_Garage").checked,
        Owner: { id: loggedInUserId },
      };
      const building_data = {
        Date_of_Construction:
          document.getElementById("Construction_Date").value,
        Developer_Name: document.getElementById("Developer_Name").value,
        Concierge_Building_Management_Info:
          document.getElementById("Mgmt_Info").value,
        Property_Management_Contact_Email:
          document.getElementById("Mgmt_Email").value,
        Office_Phone_Number: document.getElementById("Mgmt_Phone").value,
        Office_Address: document.getElementById("Mgmt_Office_Address").value,
        floor_count: document.getElementById("Building_Floors").value,
        unit_count: document.getElementById("Building_Units").value,
        Corporation_Number: document.getElementById("Condo_Corp_Number").value,
        // Pet_Restrictions: document.getElementById("Pet_Restrictions").value,
        Address: document.getElementById("Building_Address").value,
        Name: document.getElementById("Building_Name").value,
        City: document.getElementById("Building_City").value,
        Province: document.getElementById("Building_Province").value,
        Postal_Code: document.getElementById("Building_Postal_Code").value,
        ac_included: document.getElementById("Building_AC_Incl").checked,
        heat_included: document.getElementById("Building_Heat_Incl").checked,
        cable_inclusion: document.getElementById("Building_Cable_Incl").checked,
        internet_inclusion: document.getElementById("Building_Internet_Incl")
          .checked,
        Water_Filtration_Softener_Rental: document.getElementById(
          "Building_Water_Filtration_Rental"
        ).checked,
        Parking_Garage: document.getElementById("Parking_Garage").checked,
        Remote_Garage: document.getElementById("Remote_Garage").checked,
        Visitor_Parking: document.getElementById("Visitor_Parking").checked,
        Electric_Car_Charging_Stations:
          document.getElementById("EV_Charging").checked,
        Car_Wash: document.getElementById("Car_Wash").checked,
        has_subway_access: document.getElementById("Subway_Access").checked,
        Laundry_Facilities: document.getElementById("Laundry_Building").checked,
        has_lobby_lounge: document.getElementById("Lobby_Lounge").checked,
        Wheelchair_Access: document.getElementById("Wheelchair_Access").checked,
        Onsite_Staff: document.getElementById("Onsite_Staff").checked,
        has_security: document.getElementById("Concierge_24_7").checked,
        has_guest_suites: document.getElementById("Guest_Suites").checked,
        has_bicycle_storage: document.getElementById("Bicycle_Storage").checked,
        Elevators: document.getElementById("Elevators").checked,
        Enter_Phone_System: document.getElementById("Buzzer_System").checked,
        Security_Onsite: document.getElementById("Security").checked,
        Keyless_Entry: document.getElementById("Keyless_Entry").checked,
        Pet_Spa: document.getElementById("Pet_Spa").checked,
        has_bbq_terrace: document.getElementById("BBQ_Area").checked,
        has_rooftop_patio: document.getElementById("Rooftop_Patio").checked,
        has_cabana: document.getElementById("Cabanas").checked,
        has_tennis_court: document.getElementById("Tennis_Court").checked,
        Outdoor_Patio: document.getElementById("Outdoor_Patio").checked,
        has_outdoor_pool: document.getElementById("Outdoor_Pool").checked,
        Outdoor_Child_Play_Area: document.getElementById(
          "Outdoor_Child_Play_Area"
        ).checked,
        has_fitness_center: document.getElementById("Gym_Fitness").checked,
        Rec_Room: document.getElementById("Rec_Room").checked,
        has_billiards_room: document.getElementById("Billiards").checked,
        has_pool: document.getElementById("Indoor_Pool").checked,
        has_sauna: document.getElementById("Sauna").checked,
        Library: document.getElementById("Library").checked,
        has_squash_court: document.getElementById("Squash").checked,
        has_bowling_alley: document.getElementById("Bowling").checked,
        Indoor_Child_Play_Area:
          document.getElementById("Indoor_Child_Area").checked,
        has_business_centre: document.getElementById("Meeting_Room").checked,
        has_yoga_room: document.getElementById("Yoga_Room").checked,
        has_movie_theater: document.getElementById("Movie_Room").checked,
        has_game_room: document.getElementById("Games_Room").checked,
        has_whirlpool: document.getElementById("Whirlpool").checked,
        has_steam_room: document.getElementById("Steam_Room").checked,
        has_basketball_court: document.getElementById("Basketball").checked,
        has_golf_range: document.getElementById("Golf_Range").checked,
        Piano_Lounge: document.getElementById("Piano_Lounge").checked,
        Day_Care_Centre: document.getElementById("Daycare").checked,
        Category: document.getElementById("Building_Category").value,
        Property_Type: document.getElementById("Building_Type").value,
      };
      try {
        // 🔁 Reset loaders
        document.getElementById("pageLoader2").style.display = "flex";

        // 💡 Step 1: Check for building match
        let buildingid = null;
        let existingBuilding = null;
        const postalCode = document
          .getElementById("Building_Postal_Code")
          .value?.trim();
        if (postalCode) {
          const searchResp = await ZOHO.CRM.API.searchRecord({
            Entity: "Buildings",
            Type: "criteria",
            Query: `(Postal_Code:equals:${postalCode})`,
          });
          if (searchResp?.data?.length > 0) {
            existingBuilding = searchResp.data[0];
            buildingid = existingBuilding.id;
          }
        }

        // 💡 Step 2: Check unit duplicate by name
        const unitName = unitData.Name;
        const unitDupCheck = await ZOHO.CRM.API.searchRecord({
          Entity: "Units",
          Type: "criteria",
          Query: `(Name:equals:${unitName})`,
        });
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

        // 💡 Step 3: Check lead duplicate by Ad ID
        const adID = leadData.Ad_ID_New;
        if (adID) {
          const leadDupCheck = await ZOHO.CRM.API.searchRecord({
            Entity: "Leads",
            Type: "criteria",
            Query: `(Ad_ID_New:equals:${adID})`,
          });
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

        // ✅ Step 4: Create building if not found
        if (!buildingid) {
          const buildingResp = await ZOHO.CRM.API.insertRecord({
            Entity: "Buildings",
            APIData: building_data,
            Trigger: ["workflow"],
          });

          console.log("Building Response:", buildingResp);
          if (!buildingResp || buildingResp.data[0].code !== "SUCCESS")
            throw buildingResp;
          buildingid = buildingResp.data[0].details.id;
        }

        // ✅ Step 5: Create Lead
        const leadResp = await ZOHO.CRM.API.insertRecord({
          Entity: "Leads",
          APIData: leadData,
          Trigger: ["workflow"],
        });
        if (!leadResp || leadResp.data[0].code !== "SUCCESS") throw leadResp;
        const leadId = leadResp.data[0].details.id;

        // ✅ Step 6: Create Unit
        const unitResp = await ZOHO.CRM.API.insertRecord({
          Entity: "Units",
          APIData: unitData,
          Trigger: ["workflow"],
        });
        if (!unitResp || unitResp.data[0].code !== "SUCCESS") throw unitResp;
        const unitId = unitResp.data[0].details.id;

        // ✅ Step 7: Update Lead
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
        if (!updateLeadResp || updateLeadResp.data[0].code !== "SUCCESS")
          throw updateLeadResp;

        // ✅ Step 8: Update Unit
        const updateUnitResp = await ZOHO.CRM.API.updateRecord({
          Entity: "Units",
          RecordID: unitId,
          Trigger: ["workflow"],
          APIData: {
            id: unitId,
            Associated_Building: { id: buildingid },
          },
        });
        if (!updateUnitResp || updateUnitResp.data[0].code !== "SUCCESS")
          throw updateUnitResp;

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
            <span class="summary-label">Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/Leads/${leadId}" target="_blank">${
            leadData.Last_Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Mobile</span>${
            leadData.Mobile || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Price</span>CAD ${
            leadData.Asking_Price || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Available Date</span>${
            leadData.Available_Date || "N/A"
          }</td>
        </tr>
        <tr>
          <td class="summary-header">🏠 Unit</td>
          <td class="summary-cell">
            <span class="summary-label">Unit Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/CustomModule10/${unitId}" target="_blank">${
            unitData.Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Total Area</span>${
            unitData.Total_Area_Sq_Ft + " sqft" || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Type</span>${
            unitData.Unit_Type || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Facing</span>${
            unitData.Unit_Facing || "N/A"
          }</td>
        </tr>
        <tr>
          <td class="summary-header">🏢 Building</td>
          <td class="summary-cell">
            <span class="summary-label">Building Name</span>
            <a href="https://crm.zoho.com/crm/org680397761/tab/CustomModule2/${buildingid}" target="_blank">${
            existingBuilding?.Name || building_data.Name || "N/A"
          }</a>
          </td>
          <td class="summary-cell"><span class="summary-label">Type</span>${
            building_data.buildingType || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">Category</span>${
            building_data.Category || "N/A"
          }</td>
          <td class="summary-cell"><span class="summary-label">City</span>${
            building_data.City || "N/A"
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
      } catch (err) {
        document.getElementById("pageLoader2").style.display = "none";
        console.error("❌ Full Error Object:", err);

        let title = "❌ Operation Failed";
        let html = `<p>Something went wrong. Please review the message below.</p>`;

        // Duplicate record handler
        if (err?.module && err?.details?.id) {
          const moduleName = err.module;
          const field = err.details.field || "Field";
          const id = err.details.id;

          const moduleLinks = {
            Units: `https://crm.zoho.com/crm/org680397761/tab/CustomModule10/${id}`,
            Leads: `https://crm.zoho.com/crm/org680397761/tab/Leads/${id}`,
            Buildings: `https://crm.zoho.com/crm/org680397761/tab/CustomModule2/${id}`,
          };

          title = "🚫 Duplicate Entry Detected";
          html = `
      <p><strong>Module:</strong> ${moduleName}</p>
      <p><strong>Field:</strong> ${field}</p>
      <p><strong>Message:</strong> ${err.message || "Duplicate record."}</p>
      <p><strong>Existing Record:</strong> <a href="${
        moduleLinks[moduleName]
      }" target="_blank">🔗 View Record</a></p>
    `;
        }
        // Unexpected errors like 400, validation issues
        else if (err?.data?.[0]?.message) {
          const message = err.data[0].message;
          const reason = err.data[0]?.details?.[0]?.api_name || "Unknown Field";
          title = "⚠️ API Validation Error";
          html = `
      <p><strong>Error Message:</strong> ${message}</p>
      <p><strong>Problem Field:</strong> ${reason}</p>
    `;
        }
        // Fallback
        else {
          html = `
      <p>An unexpected error occurred.</p>
      <p><code>${err?.message || JSON.stringify(err)}</code></p>
    `;
        }

        // Show in popup
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
