const building_data = {
  /* ───────── General info ───────── */
  Date_of_Construction: document.getElementById("Construction_Date").value,
  Developer_Name:        document.getElementById("Developer_Name").value,
  Concierge_Building_Management_Info:             document.getElementById("Mgmt_Info").value,
  Property_Management_Contact_Email:            document.getElementById("Mgmt_Email").value,
  Office_Phone_Number:            document.getElementById("Mgmt_Phone").value,
  Office_Address:   document.getElementById("Mgmt_Office_Address").value,

  /* ───────── Basic stats ───────── */
  floor_count:       document.getElementById("Building_Floors").value,
  unit_count:        document.getElementById("Building_Units").value,
  Corporation_Number:     document.getElementById("Condo_Corp_Number").value,
  Pet_Restrictions:      document.getElementById("Pet_Restrictions").value,

  /* ───────── Location ───────── */
  Address:      document.getElementById("Building_Address").value,
  Name:         document.getElementById("Building_Name").value,
  City:         document.getElementById("Building_City").value,
  Province:     document.getElementById("Building_Province").value,
  Postal_Code:  document.getElementById("Building_Postal_Code").value,

  /* ───────── Utilities ───────── */
  ac_included:                 document.getElementById("Building_AC_Incl").checked,
  heat_included:               document.getElementById("Building_Heat_Incl").checked,
  cable_inclusion:              document.getElementById("Building_Cable_Incl").checked,
  internet_inclusion:           document.getElementById("Building_Internet_Incl").checked,
  Water_Filtration_Softener_Rental: document.getElementById("Building_Water_Filtration_Rental").checked,

  /* ───────── Parking / Services ───────── */
  Parking_Garage:   document.getElementById("Parking_Garage").checked,
  Remote_Garage:    document.getElementById("Remote_Garage").checked,
  Visitor_Parking:  document.getElementById("Visitor_Parking").checked,
  Electric_Car_Charging_Stations:      document.getElementById("EV_Charging").checked,
  Car_Wash:         document.getElementById("Car_Wash").checked,

  /* ───────── Access & Concierge ───────── */
  has_subway_access:     document.getElementById("Subway_Access").checked,
  Laundry_Facilities:  document.getElementById("Laundry_Building").checked,
  has_lobby_lounge:      document.getElementById("Lobby_Lounge").checked,
  Wheelchair_Access: document.getElementById("Wheelchair_Access").checked,
  Onsite_Staff:      document.getElementById("Onsite_Staff").checked,
  has_security:    document.getElementById("Concierge_24_7").checked,

  /* ───────── Guest & Storage ───────── */
  has_guest_suites:    document.getElementById("Guest_Suites").checked,
  has_bicycle_storage: document.getElementById("Bicycle_Storage").checked,
  Elevators:       document.getElementById("Elevators").checked,
  Enter_Phone_System:   document.getElementById("Buzzer_System").checked,
  Security_Onsite:        document.getElementById("Security").checked,
  Keyless_Entry:   document.getElementById("Keyless_Entry").checked,

  /* ───────── Outdoor Luxury Amenities ───────── */
  Pet_Spa:                 document.getElementById("Pet_Spa").checked,
  has_bbq_terrace:                document.getElementById("BBQ_Area").checked,
  has_rooftop_patio:           document.getElementById("Rooftop_Patio").checked,
  has_cabana:                 document.getElementById("Cabanas").checked,
  has_tennis_court:            document.getElementById("Tennis_Court").checked,
  Outdoor_Patio:           document.getElementById("Outdoor_Patio").checked,
  has_outdoor_pool:            document.getElementById("Outdoor_Pool").checked,
  Outdoor_Child_Play_Area: document.getElementById("Outdoor_Child_Play_Area").checked,

  /* ───────── Indoor Amenities ───────── */
  has_fitness_center:      document.getElementById("Gym_Fitness").checked,
  Rec_Room:         document.getElementById("Rec_Room").checked,
  has_billiards_room:        document.getElementById("Billiards").checked,
  has_pool:      document.getElementById("Indoor_Pool").checked,
  has_sauna:            document.getElementById("Sauna").checked,
  Library:          document.getElementById("Library").checked,
  has_squash_court:           document.getElementById("Squash").checked,
  has_bowling_alley:          document.getElementById("Bowling").checked,
  Indoor_Child_Play_Area:document.getElementById("Indoor_Child_Area").checked,
  has_business_centre:     document.getElementById("Meeting_Room").checked,
  has_yoga_room:        document.getElementById("Yoga_Room").checked,
  has_movie_theater:       document.getElementById("Movie_Room").checked,
  has_game_room:       document.getElementById("Games_Room").checked,
  has_whirlpool:        document.getElementById("Whirlpool").checked,
  has_steam_room:       document.getElementById("Steam_Room").checked,
  has_basketball_court:       document.getElementById("Basketball").checked,
  has_golf_range:       document.getElementById("Golf_Range").checked,
  Piano_Lounge:     document.getElementById("Piano_Lounge").checked,
  Day_Care_Centre:          document.getElementById("Daycare").checked,

  /* ───────── Classification ───────── */
  Category: document.getElementById("Building_Category").value,
  Property_Type:     document.getElementById("Building_Type").value
};
