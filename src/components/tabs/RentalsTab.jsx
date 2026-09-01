import React, { useState, useEffect } from 'react';
import { fetchEquipment } from '../../services/api';

const DEFAULT_20_MACHINES = [
  {
    "id": "mach-01",
    "name": "Mahindra 575 DI Tractor (45 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 450,
    "rate_daily": 3200,
    "rating": 4.9,
    "owner": "Sardar Gurdeep Singh",
    "distance_km": 3.2,
    "phone": "+91 98765 43210",
    "whatsapp": "919876543210",
    "specs": [
      "45 HP Engine",
      "Dual Clutch",
      "Heavy-Duty Hydraulics",
      "Rotavator & Trolley Hook Included"
    ],
    "description": "Heavy-duty 45HP Mahindra tractor with experienced driver. Ideal for puddling, seedbed preparation, deep cultivation, and heavy trolley haulage.",
    "img": "assets/equipment/mahindra_575_tractor.png"
  },
  {
    "id": "mach-02",
    "name": "John Deere 5310 4WD Multi-Crop Tractor (55 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 550,
    "rate_daily": 4000,
    "rating": 4.8,
    "owner": "Harpreet Singh Brar",
    "distance_km": 5.8,
    "phone": "+91 98123 45678",
    "whatsapp": "919812345678",
    "specs": [
      "4-Wheel Drive",
      "Power Steering",
      "High-Torque Turbo",
      "Reversible MB Plough Ready"
    ],
    "description": "Premium 55HP 4WD John Deere tractor with superior traction in wet muddy soils, laser land levelling, and heavy disc harrowing.",
    "img": "assets/equipment/john_deere_tractor.png"
  },
  {
    "id": "mach-03",
    "name": "Sonalika DI 745 III Rx Fuel-Saver (50 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 480,
    "rate_daily": 3500,
    "rating": 4.7,
    "owner": "Baldev Singh Sandhu",
    "distance_km": 7.1,
    "phone": "+91 98765 01234",
    "whatsapp": "919876501234",
    "specs": [
      "High Fuel Efficiency",
      "Oil Immersed Brakes",
      "Easy Towing",
      "Heavy Duty Bumper"
    ],
    "description": "Economical 50HP workhorse tractor for general farm tillage, inter-cultivation, and grain market transport.",
    "img": "assets/equipment/sonalika_tractor.png"
  },
  {
    "id": "mach-04",
    "name": "Swaraj 855 FE Heavy Duty High-Torque (52 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 500,
    "rate_daily": 3600,
    "rating": 4.9,
    "owner": "Kulwinder Dhillon",
    "distance_km": 4.5,
    "phone": "+91 98555 12345",
    "whatsapp": "919855512345",
    "specs": [
      "Legendary 3-Cylinder High-Torque Engine",
      "Multi-Speed PTO",
      "Heavy Chassis"
    ],
    "description": "Farmer-favourite heavy duty tractor for hard dry soils, laser levelling, deep ripping, and high-speed cultivation.",
    "img": "assets/equipment/swaraj_tractor.png"
  },
  {
    "id": "mach-05",
    "name": "New Holland 3630 TX Special Edition (55 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 540,
    "rate_daily": 3900,
    "rating": 4.9,
    "owner": "Gurcharan Singh Dhaliwal",
    "distance_km": 3.8,
    "phone": "+91 98144 66778",
    "whatsapp": "919814466778",
    "specs": [
      "Dual Clutch",
      "Independent PTO Clutch",
      "Lift-O-Matic Hydraulics",
      "ROPS Canopy"
    ],
    "description": "High performance 55HP tractor designed for continuous heavy rotavator operations, stubble management, and super seeder sowing.",
    "img": "assets/equipment/john_deere_tractor.png"
  },
  {
    "id": "mach-06",
    "name": "Kubota MU4501 4WD Japanese Technology (45 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 490,
    "rate_daily": 3500,
    "rating": 4.9,
    "owner": "Kailash Chand Sharma",
    "distance_km": 4.1,
    "phone": "+91 94140 88990",
    "whatsapp": "919414088990",
    "specs": [
      "Synchromesh Transmission",
      "Bevel Gear 4WD",
      "Ultra Low Noise",
      "Smooth Shifting"
    ],
    "description": "Advanced Japanese 4WD tractor with superior fuel economy and tight turning radius, ideal for puddling rice fields and horticulture orchards.",
    "img": "assets/equipment/sonalika_tractor.png"
  },
  {
    "id": "mach-07",
    "name": "Massey Ferguson 241 DI Maha Shakti (42 HP)",
    "category": "tractors",
    "category_name": "Tractor",
    "rate_hourly": 430,
    "rate_daily": 3100,
    "rating": 4.8,
    "owner": "Raghunath Reddy",
    "distance_km": 5.0,
    "phone": "+91 98480 22334",
    "whatsapp": "919848022334",
    "specs": [
      "Ultra Precision Ferguson Hydraulics",
      "High Fuel Mileage",
      "Rugged Simpson Engine"
    ],
    "description": "The golden standard for seedbed preparation, ridge making, groundnut inter-cultivation, and light haulage.",
    "img": "assets/equipment/mahindra_575_tractor.png"
  },
  {
    "id": "mach-08",
    "name": "CLAAS CROP TIGER 30 Combine Harvester",
    "category": "harvesters",
    "category_name": "Harvester",
    "rate_hourly": 1800,
    "rate_daily": 13500,
    "rating": 5.0,
    "owner": "Jaswant Singh Virk (Virk Agro)",
    "distance_km": 8.4,
    "phone": "+91 98888 22334",
    "whatsapp": "919888822334",
    "specs": [
      "Rubber Tracks for Wet Soil",
      "Wheat & Paddy Dual Cutter",
      "Grain Loss < 0.8%",
      "Clean Grain Tank"
    ],
    "description": "Self-propelled rubber-track harvester for wet paddy and wheat fields. Harvests, threshes, and cleans up to 2.2 acres per hour with zero sinking.",
    "img": "assets/equipment/claas_harvester.png"
  },
  {
    "id": "mach-09",
    "name": "Preet 987 Self-Propelled Multi-Crop Harvester",
    "category": "harvesters",
    "category_name": "Harvester",
    "rate_hourly": 1650,
    "rate_daily": 12000,
    "rating": 4.8,
    "owner": "Gurtej Singh Sidhu",
    "distance_km": 11.2,
    "phone": "+91 97777 11223",
    "whatsapp": "919777711223",
    "specs": [
      "14 Ft Cutter Bar",
      "Wheat / Mustard / Soybean / Paddy",
      "High Unloading Auger"
    ],
    "description": "Large acreage self-propelled multi-crop combine for harvesting wheat, mustard, paddy, and soybean rapidly before seasonal rains.",
    "img": "assets/equipment/preet_harvester.png"
  },
  {
    "id": "mach-10",
    "name": "Kartar 4000 Multi-Crop Heavy Combine Harvester",
    "category": "harvesters",
    "category_name": "Harvester",
    "rate_hourly": 1750,
    "rate_daily": 13000,
    "rating": 4.9,
    "owner": "Avtar Singh Kartar CHC",
    "distance_km": 14.5,
    "phone": "+91 98150 77665",
    "whatsapp": "919815077665",
    "specs": [
      "High Ground Clearance",
      "Heavy Duty Drum",
      "Air Conditioned Cabin",
      "2.5 Tons/hr"
    ],
    "description": "Heavy combine harvester for large fields, harvesting paddy, wheat, pulses, and oilseeds with high grain purity.",
    "img": "assets/equipment/preet_harvester.png"
  },
  {
    "id": "mach-11",
    "name": "Self-Propelled Walk-Behind Crop Reaper Binder (4-Stroke)",
    "category": "harvesters",
    "category_name": "Harvester",
    "rate_hourly": 320,
    "rate_daily": 2300,
    "rating": 4.8,
    "owner": "Kisan Yantra Seva",
    "distance_km": 3.0,
    "phone": "+91 94255 33445",
    "whatsapp": "919425533445",
    "specs": [
      "Cuts & Automatically Binds Crops into Bundles",
      "1 Acre in 1 Hour",
      "Low Stubble Cut"
    ],
    "description": "Harvests wheat, paddy, oats, barley, and sesame and ties them into neat sheaves/bundles using biodegradable twine in a single pass.",
    "img": "assets/equipment/power_weeder.png"
  },
  {
    "id": "mach-12",
    "name": "2-Row Automatic Potato Digger & Harvester",
    "category": "harvesters",
    "category_name": "Harvesters & Post-Harvest",
    "rate_hourly": 280,
    "rate_daily": 2100,
    "rating": 4.7,
    "owner": "Agrawal Potato Farms",
    "distance_km": 5.9,
    "phone": "+91 98370 88990",
    "whatsapp": "919837088990",
    "specs": [
      "Conveyor Rubber Chain",
      "Zero Tuber Skin Damage",
      "Unearths 1 Acre in 1.5 Hours"
    ],
    "description": "Digs deep underneath potato ridges, separates soil through vibrating rubber conveyors, and leaves clean tubers on the soil surface for easy collection.",
    "img": "assets/equipment/potato_harvester.png"
  },
  {
    "id": "mach-13",
    "name": "Groundnut Digger & Shaker Inverter",
    "category": "harvesters",
    "category_name": "Harvesters & Post-Harvest",
    "rate_hourly": 260,
    "rate_daily": 1900,
    "rating": 4.8,
    "owner": "Jayantilal Patel",
    "distance_km": 4.8,
    "phone": "+91 98250 11445",
    "whatsapp": "919825011445",
    "specs": [
      "Digs",
      "Shakes Dirt & Inverts Pods Upward for Sun Drying",
      "Zero Pod Detachment"
    ],
    "description": "Specialized groundnut digger that uproots plants, gently shakes off soil from root pods, and lays them upside down in windrows for rapid field curing.",
    "img": "assets/equipment/potato_harvester.png"
  },
  {
    "id": "mach-14",
    "name": "High-Capacity Multi-Crop Axial Flow Thresher",
    "category": "threshers",
    "category_name": "Threshers & Harvesters",
    "rate_hourly": 320,
    "rate_daily": 2400,
    "rating": 4.8,
    "owner": "Kishan Yantrik Kendra",
    "distance_km": 6.1,
    "phone": "+91 98710 77540",
    "whatsapp": "919871077540",
    "specs": [
      "Wheat / Paddy / Gram / Jowar / Maize",
      "Dual Blower Cleaning",
      "1.8 Tons/hr Throughput"
    ],
    "description": "Heavy stationary multi-crop thresher for clean grain recovery with zero seed breakage and fine chaff (bhusa) bagging.",
    "img": "assets/equipment/multicrop_thresher.png"
  },
  {
    "id": "mach-15",
    "name": "Tractor PTO Straw Reaper (Bhusa Maker)",
    "category": "threshers",
    "category_name": "Post-Harvest & Stubble",
    "rate_hourly": 380,
    "rate_daily": 2800,
    "rating": 4.9,
    "owner": "Sukhchain Singh Brar",
    "distance_km": 6.5,
    "phone": "+91 98140 99001",
    "whatsapp": "919814099001",
    "specs": [
      "Cuts Stubble & Blows Fine Wheat Straw into Trolley",
      "Recovers Leftover Grains"
    ],
    "description": "Operates after combine harvest to cut standing stubble, crush it into high-nutrition fodder (bhusa) for cattle, and pipe it directly into a trailing trolley.",
    "img": "assets/equipment/multicrop_thresher.png"
  },
  {
    "id": "mach-16",
    "name": "Square Straw Baler & Stubble Management Machine",
    "category": "balers",
    "category_name": "Harvesters & Post-Harvest",
    "rate_hourly": 400,
    "rate_daily": 3000,
    "rating": 4.8,
    "owner": "Green Fields Bio-Power Ltd",
    "distance_km": 4.2,
    "phone": "+91 98155 77889",
    "whatsapp": "919815577889",
    "specs": [
      "Compacts 300 Straw Bales/hr",
      "High-Density Twine Knotting",
      "Easy Transport Size"
    ],
    "description": "Collects loose paddy and wheat straw from the field and compresses it into dense 20kg bales ready for sale to biomass power plants and dairy farms.",
    "img": "assets/equipment/straw_baler.png"
  },
  {
    "id": "mach-17",
    "name": "Heavy-Duty High-Speed Electric Chaff Cutter (3 HP)",
    "category": "threshers",
    "category_name": "Post-Harvest & Dairy",
    "rate_hourly": 100,
    "rate_daily": 700,
    "rating": 4.9,
    "owner": "Gau-Seva Agro Implements",
    "distance_km": 2.2,
    "phone": "+91 98711 22334",
    "whatsapp": "919871122334",
    "specs": [
      "4 Carbon Steel Blades",
      "Reversible Gearbox",
      "Chops 1000kg Green/Dry Fodder/hr"
    ],
    "description": "High-speed electric fodder chopper for cutting green maize, jowar, sugarcane tops, and dry straw into 15mm bite-sized cattle feed.",
    "img": "assets/equipment/power_weeder.png"
  },
  {
    "id": "mach-18",
    "name": "Shaktiman 7-Feet Regular Smart Rotavator",
    "category": "rotavators",
    "category_name": "Rotavator",
    "rate_hourly": 200,
    "rate_daily": 1400,
    "rating": 4.9,
    "owner": "Devendra Yadav",
    "distance_km": 3.7,
    "phone": "+91 98260 11990",
    "whatsapp": "919826011990",
    "specs": [
      "48 Boron Steel L-Blades",
      "Multi-Speed Gearbox",
      "Heavy Trailing Board"
    ],
    "description": "Finest soil pulverizing rotavator for single-pass seedbed preparation in wheat, potato, sugarcane, and cotton fields.",
    "img": "assets/equipment/shaktiman_rotavator.png"
  },
  {
    "id": "mach-19",
    "name": "Maschio Gaspardo 8-Feet Heavy Duty Rotavator (C-Blades)",
    "category": "rotavators",
    "category_name": "Rotavator",
    "rate_hourly": 240,
    "rate_daily": 1700,
    "rating": 5.0,
    "owner": "Virk Agro Custom Hiring",
    "distance_km": 5.5,
    "phone": "+91 98150 44332",
    "whatsapp": "919815044332",
    "specs": [
      "54 C-Type Heavy Tillage Blades",
      "Duo Cone Oil-Sealed Bearings",
      "Side Gear Drive"
    ],
    "description": "Commercial-grade 8ft rotavator for deep residue incorporation and pulverizing hard black clayey soil.",
    "img": "assets/equipment/shaktiman_rotavator.png"
  },
  {
    "id": "mach-20",
    "name": "Trimble AG-114 Laser Land Leveller (Dual Slope)",
    "category": "levellers",
    "category_name": "Leveller",
    "rate_hourly": 400,
    "rate_daily": 3000,
    "rating": 4.9,
    "owner": "Kisan Laser Levelling Centre",
    "distance_km": 7.0,
    "phone": "+91 98120 77889",
    "whatsapp": "919812077889",
    "specs": [
      "Precision \u00b12mm Laser Transmitter",
      "Hydraulic Scraper Bucket",
      "Saves 30% Irrigation Water"
    ],
    "description": "Grading fields with precision laser eliminates high and low spots, saving 30-40% water, improving seed germination by 25%, and increasing crop yield.",
    "img": "assets/equipment/laser_land_leveller.png"
  },
  {
    "id": "mach-21",
    "name": "Lemken 2-Furrow Hydraulic Reversible MB Plough",
    "category": "ploughs",
    "category_name": "Ploughs & Cultivators",
    "rate_hourly": 220,
    "rate_daily": 1600,
    "rating": 4.8,
    "owner": "Shivaji Patil",
    "distance_km": 6.3,
    "phone": "+91 98230 66778",
    "whatsapp": "919823066778",
    "specs": [
      "Hydraulic Reversible Turnover",
      "Deep Inversion Ploughing",
      "Hardpan Buster"
    ],
    "description": "High-grade moldboard plough for deep soil turning, burying trash/crop residue, and breaking impervious hard subsurface layers.",
    "img": "assets/equipment/reversible_mb_plough.png"
  },
  {
    "id": "mach-22",
    "name": "Heavy-Duty 3-Tyne Chisel Subsoiler (Hardpan Buster)",
    "category": "ploughs",
    "category_name": "Ploughs & Cultivators",
    "rate_hourly": 250,
    "rate_daily": 1800,
    "rating": 4.8,
    "owner": "Baldev Singh Sandhu",
    "distance_km": 7.1,
    "phone": "+91 98765 01234",
    "whatsapp": "919876501234",
    "specs": [
      "Rips Soil up to 55cm (22 Inches) Deep",
      "Reversible Point Points",
      "Heavy Frame"
    ],
    "description": "Shatters impenetrable hardpan layers formed by continuous shallow tillage, allowing deep crop root penetration and ground water recharge.",
    "img": "assets/equipment/reversible_mb_plough.png"
  },
  {
    "id": "mach-23",
    "name": "Heavy 16-Disc Offset Trailed Hydraulic Harrow",
    "category": "cultivators",
    "category_name": "Ploughs & Cultivators",
    "rate_hourly": 210,
    "rate_daily": 1500,
    "rating": 4.7,
    "owner": "Guru Nanak Agro Implements",
    "distance_km": 3.4,
    "phone": "+91 98150 99887",
    "whatsapp": "919815099887",
    "specs": [
      "Boron Steel Notched Discs",
      "Heavy Gang Angle Adjustment",
      "Transport Wheels"
    ],
    "description": "Heavy disc harrow for chopping roots, clod breaking, and aerating soil after ploughing in sugarcane, cotton, and paddy fields.",
    "img": "assets/equipment/cultivator_9_tyne.png"
  },
  {
    "id": "mach-24",
    "name": "Heavy-Duty 9-Tyne Spring-Loaded Cultivator",
    "category": "cultivators",
    "category_name": "Ploughs & Cultivators",
    "rate_hourly": 150,
    "rate_daily": 1100,
    "rating": 4.6,
    "owner": "Raghuvir Singh",
    "distance_km": 3.9,
    "phone": "+91 94140 33210",
    "whatsapp": "919414033210",
    "specs": [
      "Forged Carbon Steel Tynes",
      "Dual Spring Shock Absorber for Stoney Soil"
    ],
    "description": "Dependable spring-loaded cultivator for rapid secondary tillage, eradicating weeds, and creating loose seedbed soil structure.",
    "img": "assets/equipment/cultivator_9_tyne.png"
  },
  {
    "id": "mach-25",
    "name": "VST Shakti 130 DI Power Tiller (13 HP)",
    "category": "tillers",
    "category_name": "Power Tiller",
    "rate_hourly": 220,
    "rate_daily": 1600,
    "rating": 4.8,
    "owner": "Rameshwar Patel",
    "distance_km": 2.5,
    "phone": "+91 94250 98765",
    "whatsapp": "919425098765",
    "specs": [
      "Rotary Tilling & Puddling",
      "Low Diesel Consumption (1.2 L/hr)",
      "Compact Steering"
    ],
    "description": "Compact walk-behind diesel power tiller ideal for smallholdings, orchard inter-cultivation, nursery prep, and hilly terrace farming.",
    "img": "assets/equipment/vst_power_tiller.png"
  },
  {
    "id": "mach-26",
    "name": "Kirloskar Mega T 15 Deluxe Power Tiller (15 HP)",
    "category": "tillers",
    "category_name": "Power Tiller",
    "rate_hourly": 250,
    "rate_daily": 1800,
    "rating": 4.7,
    "owner": "Anand Shinde",
    "distance_km": 6.0,
    "phone": "+91 98220 33445",
    "whatsapp": "919822033445",
    "specs": [
      "15 HP High Torque",
      "Sugarcane De-Trashing Compatible",
      "Adjustable Wheel Track"
    ],
    "description": "High-clearance power tiller specialized for sugarcane earthing-up, vineyard tilling, and vegetable bed formation.",
    "img": "assets/equipment/kirloskar_power_tiller.png"
  },
  {
    "id": "mach-27",
    "name": "Mini Power Weeder 4-Stroke Petrol (Row-Crop Weeder)",
    "category": "tillers",
    "category_name": "Power Weeder",
    "rate_hourly": 120,
    "rate_daily": 800,
    "rating": 4.6,
    "owner": "Ravi Agriculture Equipment",
    "distance_km": 1.2,
    "phone": "+91 99160 44230",
    "whatsapp": "919916044230",
    "specs": [
      "4-Stroke Petrol",
      "Blade Width 300mm",
      "Light 18kg",
      "Inter-Row Weeding"
    ],
    "description": "Lightweight power weeder for row-crop inter-cultivation, removing weeds between vegetable rows, onion, groundnut and maize fields without crop damage.",
    "img": "assets/equipment/power_weeder.png"
  },
  {
    "id": "mach-28",
    "name": "Dashmesh Happy Seeder (Direct Rice Straw Sowing)",
    "category": "seeders",
    "category_name": "Seed Drills & Planters",
    "rate_hourly": 350,
    "rate_daily": 2600,
    "rating": 4.8,
    "owner": "Jaspal Singh Mann",
    "distance_km": 5.2,
    "phone": "+91 94178 55443",
    "whatsapp": "919417855443",
    "specs": [
      "Direct Wheat Sowing into Standing Rice Stubble",
      "Zero Stubble Burning",
      "Moisture Preservation"
    ],
    "description": "Eco-friendly zero-tillage seed drill that cuts rice straw, deposits mulch, and sows wheat seeds in one pass, saving \u20b92,500/acre in field preparation.",
    "img": "assets/equipment/happy_seeder_machine.png"
  },
  {
    "id": "mach-29",
    "name": "Jagatjit All-in-One Super Seeder with Rotavator",
    "category": "seeders",
    "category_name": "Seed Drills & Planters",
    "rate_hourly": 420,
    "rate_daily": 3100,
    "rating": 5.0,
    "owner": "Amandeep Singh Sidhu",
    "distance_km": 6.2,
    "phone": "+91 98144 11223",
    "whatsapp": "919814411223",
    "specs": [
      "Mulches Paddy Straw & Sows Wheat Simultaneously",
      "Precision Seed & Fertilizer Metering"
    ],
    "description": "Combines rotavator mulching and precise seed drilling in standing paddy residue without any prior burning or ploughing.",
    "img": "assets/equipment/happy_seeder_machine.png"
  },
  {
    "id": "mach-30",
    "name": "Seed-cum-Fertilizer 11-Tyne Multi-Crop Drill",
    "category": "seeders",
    "category_name": "Seed Drills & Planters",
    "rate_hourly": 180,
    "rate_daily": 1300,
    "rating": 4.7,
    "owner": "Mahaveer Prasad",
    "distance_km": 4.8,
    "phone": "+91 98290 44321",
    "whatsapp": "919829044321",
    "specs": [
      "Dual Box for Seed & Fertilizer",
      "Adjustable Fluted Rollers",
      "Depth Control Wheels"
    ],
    "description": "Precise mechanical seed drill for uniform spacing and depth placement of wheat, gram, mustard, maize, and soybean seeds with basal fertilizer.",
    "img": "assets/equipment/seed_cum_fertilizer_drill.png"
  },
  {
    "id": "mach-31",
    "name": "Kubota 6-Row Automatic Riding Paddy Transplanter",
    "category": "seeders",
    "category_name": "Seed Drills & Planters",
    "rate_hourly": 750,
    "rate_daily": 5500,
    "rating": 5.0,
    "owner": "Kisan Puddling & Planting Services",
    "distance_km": 7.5,
    "phone": "+91 98200 44556",
    "whatsapp": "919820044556",
    "specs": [
      "Transplants 1 Acre in 45 Mins",
      "Precise 6-Row Hill Spacing",
      "Reduces Labor by 90%"
    ],
    "description": "Riding-type automatic mat nursery transplanter. Ensures uniform plant density, early tillering, and 20% higher paddy yield compared to manual labor.",
    "img": "assets/equipment/paddy_transplanter.png"
  },
  {
    "id": "mach-32",
    "name": "Automatic 2-Row Potato Planter & Fertilizer Dropper",
    "category": "seeders",
    "category_name": "Seed Drills & Planters",
    "rate_hourly": 300,
    "rate_daily": 2200,
    "rating": 4.8,
    "owner": "Agrawal Potato Farms",
    "distance_km": 5.9,
    "phone": "+91 98370 88990",
    "whatsapp": "919837088990",
    "specs": [
      "Cup-Chain Seed Elevator",
      "Adjustable Ridge Maker & Fertilizer Box",
      "Zero Seed Bruising"
    ],
    "description": "Automated planter that opens furrows, drops whole/cut seed tubers at preset distances, drops fertilizer, and forms ridges in a single trip.",
    "img": "assets/equipment/seed_cum_fertilizer_drill.png"
  },
  {
    "id": "mach-33",
    "name": "Pneumatic Precision Planter (Maize, Cotton & Sunflower)",
    "category": "seeders",
    "category_name": "Seed Drills & Planters",
    "rate_hourly": 380,
    "rate_daily": 2700,
    "rating": 4.9,
    "owner": "Modern Seed Precision Tech",
    "distance_km": 6.8,
    "phone": "+91 98450 11990",
    "whatsapp": "919845011990",
    "specs": [
      "Vacuum Suction Seed Singulation",
      "Zero Double Seeding",
      "Perfect 60cm Spacing"
    ],
    "description": "High precision pneumatic vacuum seeder for hybrid seeds like maize, cotton, sunflower, and soya, ensuring 100% singulation and zero seed waste.",
    "img": "assets/equipment/seed_cum_fertilizer_drill.png"
  },
  {
    "id": "mach-34",
    "name": "Garuda Kisan Agri Drone Pro (16L Hexacopter)",
    "category": "sprayers",
    "category_name": "Sprayers & Drones",
    "rate_hourly": 600,
    "rate_daily": 4500,
    "rating": 4.9,
    "owner": "Vikram Choudhary (Kisan Drone AI)",
    "distance_km": 4.0,
    "phone": "+91 99887 76655",
    "whatsapp": "919988776655",
    "specs": [
      "Sprays 1 Acre in 6 Mins",
      "Radar Terrain Following",
      "Ultra-Fine Micron Droplets",
      "90% Water Savings"
    ],
    "description": "Precision agricultural drone spraying for nano-urea, pesticide, and fungicide application with zero crop trampling and maximum leaf coverage.",
    "img": "assets/equipment/garuda_kisan_drone.png"
  },
  {
    "id": "mach-35",
    "name": "DJI Agras T40 Precision Spraying & Seeding Drone",
    "category": "sprayers",
    "category_name": "Sprayers & Drones",
    "rate_hourly": 950,
    "rate_daily": 7200,
    "rating": 5.0,
    "owner": "Captain Rohit Verma (AeroKisan)",
    "distance_km": 6.8,
    "phone": "+91 98112 33445",
    "whatsapp": "919811233445",
    "specs": [
      "40L Twin Atomized Spraying",
      "Active Phased Array Radar",
      "50kg Solid Fertilizer Spreader"
    ],
    "description": "Top-tier commercial agricultural drone capable of spraying up to 40 acres per day and spreading granular fertilizers/seeds across large farms.",
    "img": "assets/equipment/dji_agras_drone.png"
  },
  {
    "id": "mach-36",
    "name": "Aspee 500L Tractor-Mounted Hydraulic Boom Sprayer",
    "category": "sprayers",
    "category_name": "Sprayers & Drones",
    "rate_hourly": 320,
    "rate_daily": 2300,
    "rating": 4.8,
    "owner": "Punjab Agro Plant Protection",
    "distance_km": 3.6,
    "phone": "+91 98140 11990",
    "whatsapp": "919814011990",
    "specs": [
      "12-Metre Hydraulic Folding Boom",
      "24 Ceramic Anti-Drip Nozzles",
      "500L Chemical Tank"
    ],
    "description": "Covers wide swath widths rapidly in wheat, mustard, cotton, and soybean crops with uniform droplet distribution.",
    "img": "assets/equipment/boom_sprayer.png"
  },
  {
    "id": "mach-37",
    "name": "High-Pressure Orchard Mist Blower & Turbine Sprayer (600L)",
    "category": "sprayers",
    "category_name": "Sprayers & Drones",
    "rate_hourly": 380,
    "rate_daily": 2800,
    "rating": 4.9,
    "owner": "Sahyadri Horticulture Services",
    "distance_km": 5.4,
    "phone": "+91 98220 55667",
    "whatsapp": "919822055667",
    "specs": [
      "Radial Turbine Fan",
      "360-Degree Canopy Penetration",
      "Italian High-Pressure Pump"
    ],
    "description": "Specialized for orchards (grapes, mango, pomegranate, citrus, apples) to create dense fog-like mist that coats leaves from top to underside.",
    "img": "assets/equipment/boom_sprayer.png"
  },
  {
    "id": "mach-38",
    "name": "Manual Knapsack Power Sprayer 16L (Battery Operated)",
    "category": "sprayers",
    "category_name": "Sprayers & Drones",
    "rate_hourly": 60,
    "rate_daily": 400,
    "rating": 4.8,
    "owner": "Kisan Seva Kendra - Sharma Ji",
    "distance_km": 0.9,
    "phone": "+91 98140 33221",
    "whatsapp": "919814033221",
    "specs": [
      "Lightweight 5kg",
      "Telescopic Brass Lance",
      "Dual Speed Regulator",
      "4 Nozzle Attachments"
    ],
    "description": "Convenient backpack sprayer for small vegetable plots, flower beds, nursery care, and spot pesticide/herbicide application.",
    "img": "assets/equipment/knapsack_sprayer.png"
  },
  {
    "id": "mach-39",
    "name": "Kirloskar 7.5HP Diesel Centrifugal Water Pump",
    "category": "pumps",
    "category_name": "Water Pumps & Irrigation",
    "rate_hourly": 160,
    "rate_daily": 1100,
    "rating": 4.8,
    "owner": "Sagar Pump Centre",
    "distance_km": 2.1,
    "phone": "+91 97300 22110",
    "whatsapp": "919730022110",
    "specs": [
      "1800 LPM Discharge",
      "High Suction Lift",
      "100m Delivery Hose Included"
    ],
    "description": "High-discharge diesel pump set for lifting water from canals, farm ponds, rivers, and deep open wells during dry spells.",
    "img": "assets/equipment/kirloskar_diesel_pump.png"
  },
  {
    "id": "mach-40",
    "name": "Honda 5HP Portable High-Pressure Irrigation Pump",
    "category": "pumps",
    "category_name": "Water Pumps & Irrigation",
    "rate_hourly": 130,
    "rate_daily": 900,
    "rating": 4.9,
    "owner": "GreenField Agro Services",
    "distance_km": 1.8,
    "phone": "+91 98140 55667",
    "whatsapp": "919814055667",
    "specs": [
      "Lightweight 24kg",
      "Self-Priming",
      "High Pressure for Sprinkler Heads",
      "Easy 1-Pull Start"
    ],
    "description": "Ultra-portable 5HP water pump that one farmer can carry by hand. Ideal for sprinkler setups, micro-irrigation, and horticulture plots.",
    "img": "assets/equipment/honda_petrol_pump.png"
  },
  {
    "id": "mach-41",
    "name": "Mobile Solar Irrigation Trolley (5 HP DC Pump)",
    "category": "pumps",
    "category_name": "Water Pumps & Irrigation",
    "rate_hourly": 190,
    "rate_daily": 1400,
    "rating": 4.9,
    "owner": "SuryaKisan Green Energy",
    "distance_km": 5.0,
    "phone": "+91 98450 99112",
    "whatsapp": "919845099112",
    "specs": [
      "Trolley Mounted Foldable Solar Panels",
      "Zero Fuel / Electricity Required",
      "Automatic MPPT Controller"
    ],
    "description": "Zero-operating-cost solar pumping trolley. Hook behind a tractor or bullock cart, fold out the panels, and pump free water all day.",
    "img": "assets/equipment/solar_irrigation_trolley.png"
  },
  {
    "id": "mach-42",
    "name": "Heavy-Duty Hydraulic Tipping Farm Trolley (10-Ton)",
    "category": "tractors",
    "category_name": "Transport & Logistics",
    "rate_hourly": 150,
    "rate_daily": 1000,
    "rating": 4.8,
    "owner": "Punjab Farm Haulage Services",
    "distance_km": 2.8,
    "phone": "+91 98150 22334",
    "whatsapp": "919815022334",
    "specs": [
      "Heavy-Duty Telescopic Hydraulic Ram",
      "Dual Axle 4-Tyre Suspension",
      "10 Ton Grain Capacity"
    ],
    "description": "Heavy hydraulic tipping trolley for grain transport to Mandi, sugarcane haulage to sugar mills, and sand/gravel manure spreading.",
    "img": "assets/equipment/cultivator_9_tyne.png"
  }
];

const REAL_MACHINES = [
  { "id": "mach-01", "owner": "Emerging Farm Equipments (India) Pvt Ltd.", "name": "Farm equipment", "description": "Kolathur, Chennai, Tamil Nadu", "phone": "044-25561622", "website": "https://www.emergingfarm.com/?utm_source=chatgpt.com", "category": "tractors" },
  { "id": "mach-02", "owner": "Aerial Drobotics - Agriculture Drone Sprayer in India", "name": "Agricultural drones / spraying", "description": "Namakkal, Tamil Nadu", "phone": "9952469739", "website": "https://aerialdrobotics.com/?utm_source=chatgpt.com", "category": "drone" },
  { "id": "mach-03", "owner": "Agri drone sprayer-Rental", "name": "Drone spraying rental", "description": "Thenkurissi, Kerala", "phone": "9496294951", "website": "", "category": "drone" },
  { "id": "mach-04", "owner": "DRONE RAJA HEAD OFFICE", "name": "Agricultural drones", "description": "Kankipadu, Vijayawada, Andhra Pradesh", "phone": "9989838337", "website": "https://droneraja.in/?utm_source=chatgpt.com", "category": "drone" },
  { "id": "mach-05", "owner": "Marut Drones", "name": "Agricultural drones", "description": "Madhapur, Hyderabad, Telangana", "phone": "9052999365", "website": "https://marutdrones.com/?utm_source=chatgpt.com", "category": "drone" },
  { "id": "mach-06", "owner": "Bushra Impex / X1 Power", "name": "Power weeders, harvesters, water pumps, sprayers, tea harvesters", "description": "Kalasipalya, Bengaluru, Karnataka", "phone": "7624869606", "website": "", "category": "harvester" },
  { "id": "mach-07", "owner": "Kale Agri Tech", "name": "Tractors, harvesters, farm equipment, machinery hire", "description": "Shivamogga, Karnataka", "phone": "Contact through website", "website": "https://www.kaleagritech.com/", "category": "tractors" },
  { "id": "mach-08", "owner": "WhiteOx Pvt Ltd", "name": "Tractor, drone spraying, well drilling, seed sowing", "description": "Sholinganallur, Chennai, Tamil Nadu", "phone": "8111015577", "website": "https://whiteox.in/", "category": "tractors" },
  { "id": "mach-09", "owner": "Agrizone India", "name": "Agricultural machinery / dealer network", "description": "Puttur, Dakshina Kannada, Karnataka", "phone": "9108575757", "website": "https://www.agrizoneind.com/", "category": "tractors" },
  { "id": "mach-10", "owner": "GreenRider Enterprises", "name": "Agricultural & dairy machinery", "description": "Bettahalli, Kunigal, Karnataka", "phone": "9844107053", "website": "https://www.greenriderskb.com/", "category": "tractors" },
  { "id": "mach-11", "owner": "Sawbhumi Asha Agri India", "name": "Mini tractors, water pumps, power tillers, threshers, sprayers", "description": "Amta/Nowda, Murshidabad, West Bengal", "phone": "9733829216", "website": "https://www.ashaagriindia.com/", "category": "tractors" },
  { "id": "mach-12", "owner": "JFarm Services / TAFE", "name": "Tractor & farm-equipment rental", "description": "Chennai, Tamil Nadu / multiple states", "phone": "1800-4200-100", "website": "https://www.jfarmservices.in/", "category": "tractors" },
  { "id": "mach-13", "owner": "BhoomiHire", "name": "Tractor, harvester, rotavator, drone spraying", "description": "Hyderabad/Telangana", "phone": "7337291961", "website": "https://bhoomihire.in/", "category": "tractors" },
  { "id": "mach-14", "owner": "Miraitu", "name": "Machinery, drone spraying, borewell, farm services", "description": "Parappana Agrahara, Bengaluru", "phone": "9380306475", "website": "https://www.miraitu.in/", "category": "drone" },
  { "id": "mach-15", "owner": "SarvaGram Farm Services", "name": "Cultivator, rotavator, harvester and other equipment rental", "description": "India", "phone": "8101777555", "website": "https://www.sarvagram.com/farm-services/", "category": "harvester" },
  { "id": "mach-16", "owner": "GROO Agri", "name": "Tractor, harvester, rotavator, drone, JCB, borewell", "description": "India", "phone": "Contact through website", "website": "https://grooagri.com/", "category": "tractors" },
  { "id": "mach-17", "owner": "Desinganadu Farmer Producer Company", "name": "Custom hiring, agricultural drones, machinery rental", "description": "Kerala", "phone": "Contact through website", "website": "https://www.desinganadu.in/", "category": "drone" },
  { "id": "mach-18", "owner": "KisanDepot / Kerblet", "name": "Tractor, rotavator, sprayer and farm equipment rental", "description": "India", "phone": "Booking through website/WhatsApp", "website": "https://www.kerblet.com/kisan-depot", "category": "tractors" }
];

export function RentalsTab({ onOpenBookingModal }) {
  const [equipmentList, setEquipmentList] = useState(REAL_MACHINES);

  useEffect(() => {
    fetchEquipment().then(res => {
      if (res && res.success && res.equipment && res.equipment.length > 0) {
        setEquipmentList(res.equipment);
      }
    }).catch(() => {
      setEquipmentList(REAL_MACHINES);
    });
  }, []);


  const CATEGORY_ICONS = {
    tractor: "fa-tractor", harvester: "fa-wheat-awn", drone: "fa-plane-up",
    tiller: "fa-gears", pump: "fa-faucet-drip", seeder: "fa-seedling",
    leveller: "fa-layer-group", baler: "fa-circle-notch", sprayer: "fa-spray-can-sparkles"
  };

  return (
    <div className="tab-panel active">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2><i className="fa-solid fa-tractor" style={{ color: '#f97316', marginRight: '8px' }}></i> Tool &amp; Machinery Rental Marketplace (20+ Local Machines)</h2>
          <p className="section-sub">Rent high-capacity tractors, harvesters, power tillers, pumps, seeders &amp; spraying drones directly from nearest verified owners on an hourly basis.</p>
        </div>
      </div>

      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem' }}>
        {equipmentList.map((item) => {
          const icon = item.icon || CATEGORY_ICONS[item.category] || "fa-tractor";
          const rateHr = item.rate_hourly || item.rateHourly || 500;
          const phoneStr = item.phone || "";
          const rawPhone = phoneStr.replace(/\s/g, '');
          const wpNum = item.whatsapp || rawPhone.replace(/\D/g, '');
          const hasPhone = wpNum.length >= 8;
          const wpLink = `https://wa.me/${wpNum.startsWith('91') ? wpNum : '91' + wpNum}?text=Hi,%20I%20want%20to%20rent%20${encodeURIComponent(item.name)}%20from%20your%20shop.`;

          return (
            <div key={item.id} style={{
              background: 'rgba(20,40,30,0.85)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {/* Top Row: Icon + Name + Badges */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', minWidth: '44px',
                  background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.35)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', color: 'var(--primary-light)',
                }}>
                  <i className={`fa-solid ${icon}`}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.3 }}>{item.name}</h3>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '20px', fontSize: '0.72rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                      <i className="fa-solid fa-location-dot"></i> {item.distance_km || item.distanceKm || 1.5} km away
                    </span>
                    <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--primary-light)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '20px', fontSize: '0.72rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                      <i className="fa-solid fa-circle-check"></i> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 600 }}>
                  <i className="fa-solid fa-store" style={{ color: 'var(--primary-light)', marginRight: '6px' }}></i> {item.owner}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i> {phoneStr}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>{item.description}</p>

              {/* Contact / Links Row */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: 'auto' }}>
                {rateHr !== 500 && (
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-light)' }}>₹{rateHr}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '4px' }}>/ hr</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {hasPhone && (
                    <>
                      <a href={`tel:${rawPhone}`} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)',
                        borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                      }}>
                        <i className="fa-solid fa-phone"></i> Call
                      </a>
                      <a href={wpLink} target="_blank" rel="noopener noreferrer" style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        background: '#25D366', color: '#fff', border: 'none',
                        borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                      }}>
                        <i className="fa-brands fa-whatsapp"></i> Chat
                      </a>
                    </>
                  )}
                  {item.website ? (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'rgba(16,185,129,0.2)', color: 'var(--primary-light)', border: '1px solid rgba(16,185,129,0.4)',
                      borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                    }}>
                      <i className="fa-solid fa-globe"></i> Website
                    </a>
                  ) : (
                    <button onClick={() => onOpenBookingModal(item)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: '#10b981', color: '#fff', border: 'none',
                      borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    }}>
                      <i className="fa-solid fa-handshake"></i> Rent
                    </button>
                  )}
                </div>
              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
}
