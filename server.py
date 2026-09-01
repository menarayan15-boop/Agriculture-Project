"""
Krishi Jal - Standard Stable Server v3.8 (ThreadingHTTPServer + SQLite API Backend)
Comprehensive Tools & Machinery Rental Module ("Uber for Farm Machinery")
"""

import http.server
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import json
import sqlite3
import os
import urllib.parse
import urllib.request
import mimetypes
import sys
import base64
sys.stdout.reconfigure(encoding='utf-8')
import math
import time

PORT = 8000
DB_FILE = "krishi_jal.db"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ALL_MACHINES = [
    {
        "id": "mach-01",
        "name": "Mahindra 575 DI Tractor (45 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "45 HP",
        "rate_hourly": 450,
        "rate_daily": 3200,
        "rate_weekly": 19000,
        "deposit": 2000,
        "rating": 4.9,
        "reviews_count": 48,
        "owner_name": "Sardar Gurdeep Singh",
        "owner_phone": "+91 98765 43210",
        "owner_whatsapp": "919876543210",
        "location": "Ludhiana Rural, Punjab",
        "lat": 30.901,
        "lon": 75.8573,
        "distance_km": 3.2,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Renter pays fuel / includes 1st hour",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "45 HP Engine, Dual Clutch, Heavy-Duty Hydraulics, Rotavator & Trolley Hook Included",
        "description": "Heavy-duty 45HP Mahindra tractor with experienced driver. Ideal for puddling, seedbed preparation, deep cultivation, and heavy trolley haulage.",
        "img": "assets/equipment/mahindra_575_tractor.png",
        "available": 1
    },
    {
        "id": "mach-02",
        "name": "John Deere 5310 4WD Multi-Crop Tractor (55 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "55 HP 4WD Turbo",
        "rate_hourly": 550,
        "rate_daily": 4000,
        "rate_weekly": 24000,
        "deposit": 2500,
        "rating": 4.8,
        "reviews_count": 36,
        "owner_name": "Harpreet Singh Brar",
        "owner_phone": "+91 98123 45678",
        "owner_whatsapp": "919812345678",
        "location": "Moga Road, Punjab",
        "lat": 30.8165,
        "lon": 75.1715,
        "distance_km": 5.8,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes 1st tank fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 30,
        "features": "4-Wheel Drive, Power Steering, High-Torque Turbo, Reversible MB Plough Ready",
        "description": "Premium 55HP 4WD John Deere tractor with superior traction in wet muddy soils, laser land levelling, and heavy disc harrowing.",
        "img": "assets/equipment/john_deere_tractor.png",
        "available": 1
    },
    {
        "id": "mach-03",
        "name": "Sonalika DI 745 III Rx Fuel-Saver (50 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "50 HP",
        "rate_hourly": 480,
        "rate_daily": 3500,
        "rate_weekly": 21000,
        "deposit": 2000,
        "rating": 4.7,
        "reviews_count": 29,
        "owner_name": "Baldev Singh Sandhu",
        "owner_phone": "+91 98765 01234",
        "owner_whatsapp": "919876501234",
        "location": "Jalandhar Mandi, Punjab",
        "lat": 31.326,
        "lon": 75.5762,
        "distance_km": 7.1,
        "condition": "Good",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter provides fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "High Fuel Efficiency, Oil Immersed Brakes, Easy Towing, Heavy Duty Bumper",
        "description": "Economical 50HP workhorse tractor for general farm tillage, inter-cultivation, and grain market transport.",
        "img": "assets/equipment/sonalika_tractor.png",
        "available": 1
    },
    {
        "id": "mach-04",
        "name": "Swaraj 855 FE Heavy Duty High-Torque (52 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "52 HP",
        "rate_hourly": 500,
        "rate_daily": 3600,
        "rate_weekly": 22000,
        "deposit": 2000,
        "rating": 4.9,
        "reviews_count": 52,
        "owner_name": "Kulwinder Dhillon",
        "owner_phone": "+91 98555 12345",
        "owner_whatsapp": "919855512345",
        "location": "Bathinda Bypass, Punjab",
        "lat": 30.211,
        "lon": 74.9455,
        "distance_km": 4.5,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Legendary 3-Cylinder High-Torque Engine, Multi-Speed PTO, Heavy Chassis",
        "description": "Farmer-favourite heavy duty tractor for hard dry soils, laser levelling, deep ripping, and high-speed cultivation.",
        "img": "assets/equipment/swaraj_tractor.png",
        "available": 1
    },
    {
        "id": "mach-05",
        "name": "New Holland 3630 TX Special Edition (55 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "55 HP FPT Engine",
        "rate_hourly": 540,
        "rate_daily": 3900,
        "rate_weekly": 23500,
        "deposit": 2500,
        "rating": 4.9,
        "reviews_count": 41,
        "owner_name": "Gurcharan Singh Dhaliwal",
        "owner_phone": "+91 98144 66778",
        "owner_whatsapp": "919814466778",
        "location": "Ludhiana GT Road, Punjab",
        "lat": 30.915,
        "lon": 75.832,
        "distance_km": 3.8,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Driver Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Dual Clutch, Independent PTO Clutch, Lift-O-Matic Hydraulics, ROPS Canopy",
        "description": "High performance 55HP tractor designed for continuous heavy rotavator operations, stubble management, and super seeder sowing.",
        "img": "assets/equipment/john_deere_tractor.png",
        "available": 1
    },
    {
        "id": "mach-06",
        "name": "Kubota MU4501 4WD Japanese Technology (45 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "45 HP 4WD E-CDIS",
        "rate_hourly": 490,
        "rate_daily": 3500,
        "rate_weekly": 21000,
        "deposit": 2000,
        "rating": 4.9,
        "reviews_count": 38,
        "owner_name": "Kailash Chand Sharma",
        "owner_phone": "+91 94140 88990",
        "owner_whatsapp": "919414088990",
        "location": "Jaipur Agro Hub, Rajasthan",
        "lat": 26.92,
        "lon": 75.79,
        "distance_km": 4.1,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Synchromesh Transmission, Bevel Gear 4WD, Ultra Low Noise, Smooth Shifting",
        "description": "Advanced Japanese 4WD tractor with superior fuel economy and tight turning radius, ideal for puddling rice fields and horticulture orchards.",
        "img": "assets/equipment/sonalika_tractor.png",
        "available": 1
    },
    {
        "id": "mach-07",
        "name": "Massey Ferguson 241 DI Maha Shakti (42 HP)",
        "category": "tractors",
        "category_name": "Tractor",
        "power": "42 HP Simpson Engine",
        "rate_hourly": 430,
        "rate_daily": 3100,
        "rate_weekly": 18500,
        "deposit": 1800,
        "rating": 4.8,
        "reviews_count": 45,
        "owner_name": "Raghunath Reddy",
        "owner_phone": "+91 98480 22334",
        "owner_whatsapp": "919848022334",
        "location": "Guntur Bypass, Andhra Pradesh",
        "lat": 16.31,
        "lon": 80.44,
        "distance_km": 5.0,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Driver Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Ultra Precision Ferguson Hydraulics, High Fuel Mileage, Rugged Simpson Engine",
        "description": "The golden standard for seedbed preparation, ridge making, groundnut inter-cultivation, and light haulage.",
        "img": "assets/equipment/mahindra_575_tractor.png",
        "available": 1
    },
    {
        "id": "mach-08",
        "name": "CLAAS CROP TIGER 30 Combine Harvester",
        "category": "harvesters",
        "category_name": "Harvester",
        "power": "76 HP Rubber Track",
        "rate_hourly": 1800,
        "rate_daily": 13500,
        "rate_weekly": 80000,
        "deposit": 5000,
        "rating": 5.0,
        "reviews_count": 64,
        "owner_name": "Jaswant Singh Virk (Virk Agro)",
        "owner_phone": "+91 98888 22334",
        "owner_whatsapp": "919888822334",
        "location": "Karnal Sector 12, Haryana",
        "lat": 29.6857,
        "lon": 76.9905,
        "distance_km": 8.4,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes 2 Expert Operators",
        "delivery_available": 1,
        "delivery_rate_per_km": 40,
        "features": "Rubber Tracks for Wet Soil, Wheat & Paddy Dual Cutter, Grain Loss < 0.8%, Clean Grain Tank",
        "description": "Self-propelled rubber-track harvester for wet paddy and wheat fields. Harvests, threshes, and cleans up to 2.2 acres per hour with zero sinking.",
        "img": "assets/equipment/claas_harvester.png",
        "available": 1
    },
    {
        "id": "mach-09",
        "name": "Preet 987 Self-Propelled Multi-Crop Harvester",
        "category": "harvesters",
        "category_name": "Harvester",
        "power": "101 HP Heavy",
        "rate_hourly": 1650,
        "rate_daily": 12000,
        "rate_weekly": 72000,
        "deposit": 5000,
        "rating": 4.8,
        "reviews_count": 33,
        "owner_name": "Gurtej Singh Sidhu",
        "owner_phone": "+91 97777 11223",
        "owner_whatsapp": "919777711223",
        "location": "Sangrur Rural, Punjab",
        "lat": 30.2458,
        "lon": 75.8421,
        "distance_km": 11.2,
        "condition": "Good",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes Certified Operator",
        "delivery_available": 1,
        "delivery_rate_per_km": 35,
        "features": "14 Ft Cutter Bar, Wheat / Mustard / Soybean / Paddy, High Unloading Auger",
        "description": "Large acreage self-propelled multi-crop combine for harvesting wheat, mustard, paddy, and soybean rapidly before seasonal rains.",
        "img": "assets/equipment/preet_harvester.png",
        "available": 1
    },
    {
        "id": "mach-10",
        "name": "Kartar 4000 Multi-Crop Heavy Combine Harvester",
        "category": "harvesters",
        "category_name": "Harvester",
        "power": "101 HP Ashok Leyland Turbo",
        "rate_hourly": 1750,
        "rate_daily": 13000,
        "rate_weekly": 78000,
        "deposit": 5000,
        "rating": 4.9,
        "reviews_count": 55,
        "owner_name": "Avtar Singh Kartar CHC",
        "owner_phone": "+91 98150 77665",
        "owner_whatsapp": "919815077665",
        "location": "Ambala Road, Haryana",
        "lat": 30.37,
        "lon": 76.77,
        "distance_km": 14.5,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "2 Operators Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 35,
        "features": "High Ground Clearance, Heavy Duty Drum, Air Conditioned Cabin, 2.5 Tons/hr",
        "description": "Heavy combine harvester for large fields, harvesting paddy, wheat, pulses, and oilseeds with high grain purity.",
        "img": "assets/equipment/preet_harvester.png",
        "available": 1
    },
    {
        "id": "mach-11",
        "name": "Self-Propelled Walk-Behind Crop Reaper Binder (4-Stroke)",
        "category": "harvesters",
        "category_name": "Harvester",
        "power": "10 HP Diesel",
        "rate_hourly": 320,
        "rate_daily": 2300,
        "rate_weekly": 13500,
        "deposit": 1500,
        "rating": 4.8,
        "reviews_count": 31,
        "owner_name": "Kisan Yantra Seva",
        "owner_phone": "+91 94255 33445",
        "owner_whatsapp": "919425533445",
        "location": "Indore Agri Zone, MP",
        "lat": 22.72,
        "lon": 75.86,
        "distance_km": 3.0,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "Cuts & Automatically Binds Crops into Bundles, 1 Acre in 1 Hour, Low Stubble Cut",
        "description": "Harvests wheat, paddy, oats, barley, and sesame and ties them into neat sheaves/bundles using biodegradable twine in a single pass.",
        "img": "assets/equipment/power_weeder.png",
        "available": 1
    },
    {
        "id": "mach-12",
        "name": "2-Row Automatic Potato Digger & Harvester",
        "category": "harvesters",
        "category_name": "Harvesters & Post-Harvest",
        "power": "Tractor 45+ HP",
        "rate_hourly": 280,
        "rate_daily": 2100,
        "rate_weekly": 12500,
        "deposit": 1200,
        "rating": 4.7,
        "reviews_count": 26,
        "owner_name": "Agrawal Potato Farms",
        "owner_phone": "+91 98370 88990",
        "owner_whatsapp": "919837088990",
        "location": "Agra Expressway Hub, UP",
        "lat": 27.1767,
        "lon": 78.0081,
        "distance_km": 5.9,
        "condition": "Good",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Conveyor Rubber Chain, Zero Tuber Skin Damage, Unearths 1 Acre in 1.5 Hours",
        "description": "Digs deep underneath potato ridges, separates soil through vibrating rubber conveyors, and leaves clean tubers on the soil surface for easy collection.",
        "img": "assets/equipment/potato_harvester.png",
        "available": 1
    },
    {
        "id": "mach-13",
        "name": "Groundnut Digger & Shaker Inverter",
        "category": "harvesters",
        "category_name": "Harvesters & Post-Harvest",
        "power": "Tractor 35-50 HP",
        "rate_hourly": 260,
        "rate_daily": 1900,
        "rate_weekly": 11000,
        "deposit": 1200,
        "rating": 4.8,
        "reviews_count": 24,
        "owner_name": "Jayantilal Patel",
        "owner_phone": "+91 98250 11445",
        "owner_whatsapp": "919825011445",
        "location": "Rajkot Mandi, Gujarat",
        "lat": 22.3,
        "lon": 70.8,
        "distance_km": 4.8,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 18,
        "features": "Digs, Shakes Dirt & Inverts Pods Upward for Sun Drying, Zero Pod Detachment",
        "description": "Specialized groundnut digger that uproots plants, gently shakes off soil from root pods, and lays them upside down in windrows for rapid field curing.",
        "img": "assets/equipment/potato_harvester.png",
        "available": 1
    },
    {
        "id": "mach-14",
        "name": "High-Capacity Multi-Crop Axial Flow Thresher",
        "category": "threshers",
        "category_name": "Threshers & Harvesters",
        "power": "Tractor PTO 35+ HP / 15 HP Motor",
        "rate_hourly": 320,
        "rate_daily": 2400,
        "rate_weekly": 14000,
        "deposit": 1500,
        "rating": 4.8,
        "reviews_count": 27,
        "owner_name": "Kishan Yantrik Kendra",
        "owner_phone": "+91 98710 77540",
        "owner_whatsapp": "919871077540",
        "location": "Rohtak Mandi, Haryana",
        "lat": 28.8955,
        "lon": 76.6066,
        "distance_km": 6.1,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes 1 Experienced Feeding Operator",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Wheat / Paddy / Gram / Jowar / Maize, Dual Blower Cleaning, 1.8 Tons/hr Throughput",
        "description": "Heavy stationary multi-crop thresher for clean grain recovery with zero seed breakage and fine chaff (bhusa) bagging.",
        "img": "assets/equipment/multicrop_thresher.png",
        "available": 1
    },
    {
        "id": "mach-15",
        "name": "Tractor PTO Straw Reaper (Bhusa Maker)",
        "category": "threshers",
        "category_name": "Post-Harvest & Stubble",
        "power": "Tractor PTO 50-65 HP",
        "rate_hourly": 380,
        "rate_daily": 2800,
        "rate_weekly": 16500,
        "deposit": 1800,
        "rating": 4.9,
        "reviews_count": 42,
        "owner_name": "Sukhchain Singh Brar",
        "owner_phone": "+91 98140 99001",
        "owner_whatsapp": "919814099001",
        "location": "Faridkot Road, Punjab",
        "lat": 30.67,
        "lon": 74.75,
        "distance_km": 6.5,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Driver Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Cuts Stubble & Blows Fine Wheat Straw into Trolley, Recovers Leftover Grains",
        "description": "Operates after combine harvest to cut standing stubble, crush it into high-nutrition fodder (bhusa) for cattle, and pipe it directly into a trailing trolley.",
        "img": "assets/equipment/multicrop_thresher.png",
        "available": 1
    },
    {
        "id": "mach-16",
        "name": "Square Straw Baler & Stubble Management Machine",
        "category": "balers",
        "category_name": "Harvesters & Post-Harvest",
        "power": "Tractor PTO 50-70 HP",
        "rate_hourly": 400,
        "rate_daily": 3000,
        "rate_weekly": 18000,
        "deposit": 2000,
        "rating": 4.8,
        "reviews_count": 35,
        "owner_name": "Green Fields Bio-Power Ltd",
        "owner_phone": "+91 98155 77889",
        "owner_whatsapp": "919815577889",
        "location": "Ludhiana Bypass, Punjab",
        "lat": 30.885,
        "lon": 75.845,
        "distance_km": 4.2,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes Operator",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Compacts 300 Straw Bales/hr, High-Density Twine Knotting, Easy Transport Size",
        "description": "Collects loose paddy and wheat straw from the field and compresses it into dense 20kg bales ready for sale to biomass power plants and dairy farms.",
        "img": "assets/equipment/straw_baler.png",
        "available": 1
    },
    {
        "id": "mach-17",
        "name": "Heavy-Duty High-Speed Electric Chaff Cutter (3 HP)",
        "category": "threshers",
        "category_name": "Post-Harvest & Dairy",
        "power": "3 HP Single/Three Phase Motor",
        "rate_hourly": 100,
        "rate_daily": 700,
        "rate_weekly": 4000,
        "deposit": 800,
        "rating": 4.9,
        "reviews_count": 39,
        "owner_name": "Gau-Seva Agro Implements",
        "owner_phone": "+91 98711 22334",
        "owner_whatsapp": "919871122334",
        "location": "Karnal Mandi, Haryana",
        "lat": 29.69,
        "lon": 76.985,
        "distance_km": 2.2,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Electric Motor / Low Electricity Use",
        "delivery_available": 1,
        "delivery_rate_per_km": 12,
        "features": "4 Carbon Steel Blades, Reversible Gearbox, Chops 1000kg Green/Dry Fodder/hr",
        "description": "High-speed electric fodder chopper for cutting green maize, jowar, sugarcane tops, and dry straw into 15mm bite-sized cattle feed.",
        "img": "assets/equipment/power_weeder.png",
        "available": 1
    },
    {
        "id": "mach-18",
        "name": "Shaktiman 7-Feet Regular Smart Rotavator",
        "category": "rotavators",
        "category_name": "Rotavator",
        "power": "Tractor PTO 40-55 HP",
        "rate_hourly": 200,
        "rate_daily": 1400,
        "rate_weekly": 8400,
        "deposit": 1000,
        "rating": 4.9,
        "reviews_count": 43,
        "owner_name": "Devendra Yadav",
        "owner_phone": "+91 98260 11990",
        "owner_whatsapp": "919826011990",
        "location": "Bhopal MP Nagar, MP",
        "lat": 23.2599,
        "lon": 77.4126,
        "distance_km": 3.7,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only (Attached to renter's tractor)",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "48 Boron Steel L-Blades, Multi-Speed Gearbox, Heavy Trailing Board",
        "description": "Finest soil pulverizing rotavator for single-pass seedbed preparation in wheat, potato, sugarcane, and cotton fields.",
        "img": "assets/equipment/shaktiman_rotavator.png",
        "available": 1
    },
    {
        "id": "mach-19",
        "name": "Maschio Gaspardo 8-Feet Heavy Duty Rotavator (C-Blades)",
        "category": "rotavators",
        "category_name": "Rotavator",
        "power": "Tractor PTO 55-75 HP",
        "rate_hourly": 240,
        "rate_daily": 1700,
        "rate_weekly": 10200,
        "deposit": 1200,
        "rating": 5.0,
        "reviews_count": 37,
        "owner_name": "Virk Agro Custom Hiring",
        "owner_phone": "+91 98150 44332",
        "owner_whatsapp": "919815044332",
        "location": "Patiala Rural, Punjab",
        "lat": 30.34,
        "lon": 76.39,
        "distance_km": 5.5,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 18,
        "features": "54 C-Type Heavy Tillage Blades, Duo Cone Oil-Sealed Bearings, Side Gear Drive",
        "description": "Commercial-grade 8ft rotavator for deep residue incorporation and pulverizing hard black clayey soil.",
        "img": "assets/equipment/shaktiman_rotavator.png",
        "available": 1
    },
    {
        "id": "mach-20",
        "name": "Trimble AG-114 Laser Land Leveller (Dual Slope)",
        "category": "levellers",
        "category_name": "Leveller",
        "power": "Tractor 45-60 HP",
        "rate_hourly": 400,
        "rate_daily": 3000,
        "rate_weekly": 18000,
        "deposit": 2000,
        "rating": 4.9,
        "reviews_count": 51,
        "owner_name": "Kisan Laser Levelling Centre",
        "owner_phone": "+91 98120 77889",
        "owner_whatsapp": "919812077889",
        "location": "Kurukshetra GT Road, Haryana",
        "lat": 29.9695,
        "lon": 76.8783,
        "distance_km": 7.0,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes Certified Laser Operator",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Precision \u00b12mm Laser Transmitter, Hydraulic Scraper Bucket, Saves 30% Irrigation Water",
        "description": "Grading fields with precision laser eliminates high and low spots, saving 30-40% water, improving seed germination by 25%, and increasing crop yield.",
        "img": "assets/equipment/laser_land_leveller.png",
        "available": 1
    },
    {
        "id": "mach-21",
        "name": "Lemken 2-Furrow Hydraulic Reversible MB Plough",
        "category": "ploughs",
        "category_name": "Ploughs & Cultivators",
        "power": "Tractor 45-60 HP",
        "rate_hourly": 220,
        "rate_daily": 1600,
        "rate_weekly": 9500,
        "deposit": 1000,
        "rating": 4.8,
        "reviews_count": 31,
        "owner_name": "Shivaji Patil",
        "owner_phone": "+91 98230 66778",
        "owner_whatsapp": "919823066778",
        "location": "Kolhapur Bypass, Maharashtra",
        "lat": 16.705,
        "lon": 74.2433,
        "distance_km": 6.3,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 18,
        "features": "Hydraulic Reversible Turnover, Deep Inversion Ploughing, Hardpan Buster",
        "description": "High-grade moldboard plough for deep soil turning, burying trash/crop residue, and breaking impervious hard subsurface layers.",
        "img": "assets/equipment/reversible_mb_plough.png",
        "available": 1
    },
    {
        "id": "mach-22",
        "name": "Heavy-Duty 3-Tyne Chisel Subsoiler (Hardpan Buster)",
        "category": "ploughs",
        "category_name": "Ploughs & Cultivators",
        "power": "Tractor 55+ HP",
        "rate_hourly": 250,
        "rate_daily": 1800,
        "rate_weekly": 10800,
        "deposit": 1200,
        "rating": 4.8,
        "reviews_count": 22,
        "owner_name": "Baldev Singh Sandhu",
        "owner_phone": "+91 98765 01234",
        "owner_whatsapp": "919876501234",
        "location": "Jalandhar Mandi, Punjab",
        "lat": 31.326,
        "lon": 75.5762,
        "distance_km": 7.1,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Rips Soil up to 55cm (22 Inches) Deep, Reversible Point Points, Heavy Frame",
        "description": "Shatters impenetrable hardpan layers formed by continuous shallow tillage, allowing deep crop root penetration and ground water recharge.",
        "img": "assets/equipment/reversible_mb_plough.png",
        "available": 1
    },
    {
        "id": "mach-23",
        "name": "Heavy 16-Disc Offset Trailed Hydraulic Harrow",
        "category": "cultivators",
        "category_name": "Ploughs & Cultivators",
        "power": "Tractor 45-60 HP",
        "rate_hourly": 210,
        "rate_daily": 1500,
        "rate_weekly": 9000,
        "deposit": 1000,
        "rating": 4.7,
        "reviews_count": 28,
        "owner_name": "Guru Nanak Agro Implements",
        "owner_phone": "+91 98150 99887",
        "owner_whatsapp": "919815099887",
        "location": "Ludhiana Link Road, Punjab",
        "lat": 30.9,
        "lon": 75.85,
        "distance_km": 3.4,
        "condition": "Good",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 18,
        "features": "Boron Steel Notched Discs, Heavy Gang Angle Adjustment, Transport Wheels",
        "description": "Heavy disc harrow for chopping roots, clod breaking, and aerating soil after ploughing in sugarcane, cotton, and paddy fields.",
        "img": "assets/equipment/cultivator_9_tyne.png",
        "available": 1
    },
    {
        "id": "mach-24",
        "name": "Heavy-Duty 9-Tyne Spring-Loaded Cultivator",
        "category": "cultivators",
        "category_name": "Ploughs & Cultivators",
        "power": "Tractor 35-50 HP",
        "rate_hourly": 150,
        "rate_daily": 1100,
        "rate_weekly": 6500,
        "deposit": 800,
        "rating": 4.6,
        "reviews_count": 25,
        "owner_name": "Raghuvir Singh",
        "owner_phone": "+91 94140 33210",
        "owner_whatsapp": "919414033210",
        "location": "Alwar Rural, Rajasthan",
        "lat": 27.553,
        "lon": 76.6346,
        "distance_km": 3.9,
        "condition": "Good",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "Forged Carbon Steel Tynes, Dual Spring Shock Absorber for Stoney Soil",
        "description": "Dependable spring-loaded cultivator for rapid secondary tillage, eradicating weeds, and creating loose seedbed soil structure.",
        "img": "assets/equipment/cultivator_9_tyne.png",
        "available": 1
    },
    {
        "id": "mach-25",
        "name": "VST Shakti 130 DI Power Tiller (13 HP)",
        "category": "tillers",
        "category_name": "Power Tiller",
        "power": "13 HP Diesel",
        "rate_hourly": 220,
        "rate_daily": 1600,
        "rate_weekly": 9500,
        "deposit": 1000,
        "rating": 4.8,
        "reviews_count": 47,
        "owner_name": "Rameshwar Patel",
        "owner_phone": "+91 94250 98765",
        "owner_whatsapp": "919425098765",
        "location": "Indore Agri Market, MP",
        "lat": 22.7196,
        "lon": 75.8577,
        "distance_km": 2.5,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "Rotary Tilling & Puddling, Low Diesel Consumption (1.2 L/hr), Compact Steering",
        "description": "Compact walk-behind diesel power tiller ideal for smallholdings, orchard inter-cultivation, nursery prep, and hilly terrace farming.",
        "img": "assets/equipment/vst_power_tiller.png",
        "available": 1
    },
    {
        "id": "mach-26",
        "name": "Kirloskar Mega T 15 Deluxe Power Tiller (15 HP)",
        "category": "tillers",
        "category_name": "Power Tiller",
        "power": "15 HP High Torque",
        "rate_hourly": 250,
        "rate_daily": 1800,
        "rate_weekly": 10800,
        "deposit": 1000,
        "rating": 4.7,
        "reviews_count": 22,
        "owner_name": "Anand Shinde",
        "owner_phone": "+91 98220 33445",
        "owner_whatsapp": "919822033445",
        "location": "Nashik Agri Hub, Maharashtra",
        "lat": 19.9975,
        "lon": 73.7898,
        "distance_km": 6.0,
        "condition": "Good",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 18,
        "features": "15 HP High Torque, Sugarcane De-Trashing Compatible, Adjustable Wheel Track",
        "description": "High-clearance power tiller specialized for sugarcane earthing-up, vineyard tilling, and vegetable bed formation.",
        "img": "assets/equipment/kirloskar_power_tiller.png",
        "available": 1
    },
    {
        "id": "mach-27",
        "name": "Mini Power Weeder 4-Stroke Petrol (Row-Crop Weeder)",
        "category": "tillers",
        "category_name": "Power Weeder",
        "power": "4-Stroke 5.5 HP Petrol",
        "rate_hourly": 120,
        "rate_daily": 800,
        "rate_weekly": 4800,
        "deposit": 800,
        "rating": 4.6,
        "reviews_count": 28,
        "owner_name": "Ravi Agriculture Equipment",
        "owner_phone": "+91 99160 44230",
        "owner_whatsapp": "919916044230",
        "location": "Ludhiana Focal Point, Punjab",
        "lat": 30.89,
        "lon": 75.86,
        "distance_km": 1.2,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays petrol",
        "delivery_available": 1,
        "delivery_rate_per_km": 12,
        "features": "4-Stroke Petrol, Blade Width 300mm, Light 18kg, Inter-Row Weeding",
        "description": "Lightweight power weeder for row-crop inter-cultivation, removing weeds between vegetable rows, onion, groundnut and maize fields without crop damage.",
        "img": "assets/equipment/power_weeder.png",
        "available": 1
    },
    {
        "id": "mach-28",
        "name": "Dashmesh Happy Seeder (Direct Rice Straw Sowing)",
        "category": "seeders",
        "category_name": "Seed Drills & Planters",
        "power": "Tractor PTO 50-65 HP",
        "rate_hourly": 350,
        "rate_daily": 2600,
        "rate_weekly": 15000,
        "deposit": 1500,
        "rating": 4.8,
        "reviews_count": 39,
        "owner_name": "Jaspal Singh Mann",
        "owner_phone": "+91 94178 55443",
        "owner_whatsapp": "919417855443",
        "location": "Patiala Road, Punjab",
        "lat": 30.3398,
        "lon": 76.3869,
        "distance_km": 5.2,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Direct Wheat Sowing into Standing Rice Stubble, Zero Stubble Burning, Moisture Preservation",
        "description": "Eco-friendly zero-tillage seed drill that cuts rice straw, deposits mulch, and sows wheat seeds in one pass, saving \u20b92,500/acre in field preparation.",
        "img": "assets/equipment/happy_seeder_machine.png",
        "available": 1
    },
    {
        "id": "mach-29",
        "name": "Jagatjit All-in-One Super Seeder with Rotavator",
        "category": "seeders",
        "category_name": "Seed Drills & Planters",
        "power": "Tractor PTO 55-75 HP",
        "rate_hourly": 420,
        "rate_daily": 3100,
        "rate_weekly": 18500,
        "deposit": 2000,
        "rating": 5.0,
        "reviews_count": 48,
        "owner_name": "Amandeep Singh Sidhu",
        "owner_phone": "+91 98144 11223",
        "owner_whatsapp": "919814411223",
        "location": "Moga Rural, Punjab",
        "lat": 30.82,
        "lon": 75.18,
        "distance_km": 6.2,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes Operator",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Mulches Paddy Straw & Sows Wheat Simultaneously, Precision Seed & Fertilizer Metering",
        "description": "Combines rotavator mulching and precise seed drilling in standing paddy residue without any prior burning or ploughing.",
        "img": "assets/equipment/happy_seeder_machine.png",
        "available": 1
    },
    {
        "id": "mach-30",
        "name": "Seed-cum-Fertilizer 11-Tyne Multi-Crop Drill",
        "category": "seeders",
        "category_name": "Seed Drills & Planters",
        "power": "Tractor 35+ HP",
        "rate_hourly": 180,
        "rate_daily": 1300,
        "rate_weekly": 7500,
        "deposit": 1000,
        "rating": 4.7,
        "reviews_count": 28,
        "owner_name": "Mahaveer Prasad",
        "owner_phone": "+91 98290 44321",
        "owner_whatsapp": "919829044321",
        "location": "Kota Agri Mandi, Rajasthan",
        "lat": 25.2138,
        "lon": 75.8648,
        "distance_km": 4.8,
        "condition": "Good",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "Dual Box for Seed & Fertilizer, Adjustable Fluted Rollers, Depth Control Wheels",
        "description": "Precise mechanical seed drill for uniform spacing and depth placement of wheat, gram, mustard, maize, and soybean seeds with basal fertilizer.",
        "img": "assets/equipment/seed_cum_fertilizer_drill.png",
        "available": 1
    },
    {
        "id": "mach-31",
        "name": "Kubota 6-Row Automatic Riding Paddy Transplanter",
        "category": "seeders",
        "category_name": "Seed Drills & Planters",
        "power": "18 HP Diesel 4WD",
        "rate_hourly": 750,
        "rate_daily": 5500,
        "rate_weekly": 32000,
        "deposit": 3000,
        "rating": 5.0,
        "reviews_count": 49,
        "owner_name": "Kisan Puddling & Planting Services",
        "owner_phone": "+91 98200 44556",
        "owner_whatsapp": "919820044556",
        "location": "Karnal Rice Belt, Haryana",
        "lat": 29.69,
        "lon": 76.98,
        "distance_km": 7.5,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Includes Certified Machine Driver",
        "delivery_available": 1,
        "delivery_rate_per_km": 30,
        "features": "Transplants 1 Acre in 45 Mins, Precise 6-Row Hill Spacing, Reduces Labor by 90%",
        "description": "Riding-type automatic mat nursery transplanter. Ensures uniform plant density, early tillering, and 20% higher paddy yield compared to manual labor.",
        "img": "assets/equipment/paddy_transplanter.png",
        "available": 1
    },
    {
        "id": "mach-32",
        "name": "Automatic 2-Row Potato Planter & Fertilizer Dropper",
        "category": "seeders",
        "category_name": "Seed Drills & Planters",
        "power": "Tractor 40+ HP",
        "rate_hourly": 300,
        "rate_daily": 2200,
        "rate_weekly": 13000,
        "deposit": 1500,
        "rating": 4.8,
        "reviews_count": 33,
        "owner_name": "Agrawal Potato Farms",
        "owner_phone": "+91 98370 88990",
        "owner_whatsapp": "919837088990",
        "location": "Agra Expressway Hub, UP",
        "lat": 27.1767,
        "lon": 78.0081,
        "distance_km": 5.9,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Cup-Chain Seed Elevator, Adjustable Ridge Maker & Fertilizer Box, Zero Seed Bruising",
        "description": "Automated planter that opens furrows, drops whole/cut seed tubers at preset distances, drops fertilizer, and forms ridges in a single trip.",
        "img": "assets/equipment/seed_cum_fertilizer_drill.png",
        "available": 1
    },
    {
        "id": "mach-33",
        "name": "Pneumatic Precision Planter (Maize, Cotton & Sunflower)",
        "category": "seeders",
        "category_name": "Seed Drills & Planters",
        "power": "Tractor 50+ HP",
        "rate_hourly": 380,
        "rate_daily": 2700,
        "rate_weekly": 16000,
        "deposit": 1800,
        "rating": 4.9,
        "reviews_count": 27,
        "owner_name": "Modern Seed Precision Tech",
        "owner_phone": "+91 98450 11990",
        "owner_whatsapp": "919845011990",
        "location": "Bellary Road, Karnataka",
        "lat": 15.14,
        "lon": 76.92,
        "distance_km": 6.8,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Operator Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "Vacuum Suction Seed Singulation, Zero Double Seeding, Perfect 60cm Spacing",
        "description": "High precision pneumatic vacuum seeder for hybrid seeds like maize, cotton, sunflower, and soya, ensuring 100% singulation and zero seed waste.",
        "img": "assets/equipment/seed_cum_fertilizer_drill.png",
        "available": 1
    },
    {
        "id": "mach-34",
        "name": "Garuda Kisan Agri Drone Pro (16L Hexacopter)",
        "category": "sprayers",
        "category_name": "Sprayers & Drones",
        "power": "Battery 16L Tank",
        "rate_hourly": 600,
        "rate_daily": 4500,
        "rate_weekly": 26000,
        "deposit": 3000,
        "rating": 4.9,
        "reviews_count": 58,
        "owner_name": "Vikram Choudhary (Kisan Drone AI)",
        "owner_phone": "+91 99887 76655",
        "owner_whatsapp": "919988776655",
        "location": "Jaipur Ring Road, Rajasthan",
        "lat": 26.9124,
        "lon": 75.7873,
        "distance_km": 4.0,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "DGCA Pilot & 4 Battery Sets Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Sprays 1 Acre in 6 Mins, Radar Terrain Following, Ultra-Fine Micron Droplets, 90% Water Savings",
        "description": "Precision agricultural drone spraying for nano-urea, pesticide, and fungicide application with zero crop trampling and maximum leaf coverage.",
        "img": "assets/equipment/garuda_kisan_drone.png",
        "available": 1
    },
    {
        "id": "mach-35",
        "name": "DJI Agras T40 Precision Spraying & Seeding Drone",
        "category": "sprayers",
        "category_name": "Sprayers & Drones",
        "power": "40L Spray / 50kg Granule",
        "rate_hourly": 950,
        "rate_daily": 7200,
        "rate_weekly": 42000,
        "deposit": 5000,
        "rating": 5.0,
        "reviews_count": 71,
        "owner_name": "Captain Rohit Verma (AeroKisan)",
        "owner_phone": "+91 98112 33445",
        "owner_whatsapp": "919811233445",
        "location": "Meerut Bypass, UP",
        "lat": 28.9845,
        "lon": 77.7064,
        "distance_km": 6.8,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 1,
        "fuel_policy": "Certified Pilot + High-Speed Generator Included",
        "delivery_available": 1,
        "delivery_rate_per_km": 25,
        "features": "40L Twin Atomized Spraying, Active Phased Array Radar, 50kg Solid Fertilizer Spreader",
        "description": "Top-tier commercial agricultural drone capable of spraying up to 40 acres per day and spreading granular fertilizers/seeds across large farms.",
        "img": "assets/equipment/dji_agras_drone.png",
        "available": 1
    },
    {
        "id": "mach-36",
        "name": "Aspee 500L Tractor-Mounted Hydraulic Boom Sprayer",
        "category": "sprayers",
        "category_name": "Sprayers & Drones",
        "power": "Tractor PTO 35+ HP",
        "rate_hourly": 320,
        "rate_daily": 2300,
        "rate_weekly": 13500,
        "deposit": 1500,
        "rating": 4.8,
        "reviews_count": 36,
        "owner_name": "Punjab Agro Plant Protection",
        "owner_phone": "+91 98140 11990",
        "owner_whatsapp": "919814011990",
        "location": "Ludhiana Agro Zone, Punjab",
        "lat": 30.91,
        "lon": 75.84,
        "distance_km": 3.6,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "12-Metre Hydraulic Folding Boom, 24 Ceramic Anti-Drip Nozzles, 500L Chemical Tank",
        "description": "Covers wide swath widths rapidly in wheat, mustard, cotton, and soybean crops with uniform droplet distribution.",
        "img": "assets/equipment/boom_sprayer.png",
        "available": 1
    },
    {
        "id": "mach-37",
        "name": "High-Pressure Orchard Mist Blower & Turbine Sprayer (600L)",
        "category": "sprayers",
        "category_name": "Sprayers & Drones",
        "power": "Tractor PTO 45+ HP",
        "rate_hourly": 380,
        "rate_daily": 2800,
        "rate_weekly": 16500,
        "deposit": 1800,
        "rating": 4.9,
        "reviews_count": 30,
        "owner_name": "Sahyadri Horticulture Services",
        "owner_phone": "+91 98220 55667",
        "owner_whatsapp": "919822055667",
        "location": "Nashik Grape City, Maharashtra",
        "lat": 20.0,
        "lon": 73.79,
        "distance_km": 5.4,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Implement only",
        "delivery_available": 1,
        "delivery_rate_per_km": 22,
        "features": "Radial Turbine Fan, 360-Degree Canopy Penetration, Italian High-Pressure Pump",
        "description": "Specialized for orchards (grapes, mango, pomegranate, citrus, apples) to create dense fog-like mist that coats leaves from top to underside.",
        "img": "assets/equipment/boom_sprayer.png",
        "available": 1
    },
    {
        "id": "mach-38",
        "name": "Manual Knapsack Power Sprayer 16L (Battery Operated)",
        "category": "sprayers",
        "category_name": "Sprayers & Drones",
        "power": "12V 12Ah Rechargeable Battery",
        "rate_hourly": 60,
        "rate_daily": 400,
        "rate_weekly": 2200,
        "deposit": 400,
        "rating": 4.8,
        "reviews_count": 65,
        "owner_name": "Kisan Seva Kendra - Sharma Ji",
        "owner_phone": "+91 98140 33221",
        "owner_whatsapp": "919814033221",
        "location": "Ludhiana Village Centre, Punjab",
        "lat": 30.905,
        "lon": 75.85,
        "distance_km": 0.9,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Includes Charger (Full Battery gives 6 hrs spray)",
        "delivery_available": 1,
        "delivery_rate_per_km": 10,
        "features": "Lightweight 5kg, Telescopic Brass Lance, Dual Speed Regulator, 4 Nozzle Attachments",
        "description": "Convenient backpack sprayer for small vegetable plots, flower beds, nursery care, and spot pesticide/herbicide application.",
        "img": "assets/equipment/knapsack_sprayer.png",
        "available": 1
    },
    {
        "id": "mach-39",
        "name": "Kirloskar 7.5HP Diesel Centrifugal Water Pump",
        "category": "pumps",
        "category_name": "Water Pumps & Irrigation",
        "power": "7.5 HP Diesel",
        "rate_hourly": 160,
        "rate_daily": 1100,
        "rate_weekly": 6500,
        "deposit": 1000,
        "rating": 4.8,
        "reviews_count": 41,
        "owner_name": "Sagar Pump Centre",
        "owner_phone": "+91 97300 22110",
        "owner_whatsapp": "919730022110",
        "location": "Amravati Market, Maharashtra",
        "lat": 20.9374,
        "lon": 77.7796,
        "distance_km": 2.1,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "1800 LPM Discharge, High Suction Lift, 100m Delivery Hose Included",
        "description": "High-discharge diesel pump set for lifting water from canals, farm ponds, rivers, and deep open wells during dry spells.",
        "img": "assets/equipment/kirloskar_diesel_pump.png",
        "available": 1
    },
    {
        "id": "mach-40",
        "name": "Honda 5HP Portable High-Pressure Irrigation Pump",
        "category": "pumps",
        "category_name": "Water Pumps & Irrigation",
        "power": "5 HP Petrol/Kerosene",
        "rate_hourly": 130,
        "rate_daily": 900,
        "rate_weekly": 5200,
        "deposit": 800,
        "rating": 4.9,
        "reviews_count": 53,
        "owner_name": "GreenField Agro Services",
        "owner_phone": "+91 98140 55667",
        "owner_whatsapp": "919814055667",
        "location": "Ludhiana GT Road, Punjab",
        "lat": 30.912,
        "lon": 75.834,
        "distance_km": 1.8,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Renter pays fuel",
        "delivery_available": 1,
        "delivery_rate_per_km": 12,
        "features": "Lightweight 24kg, Self-Priming, High Pressure for Sprinkler Heads, Easy 1-Pull Start",
        "description": "Ultra-portable 5HP water pump that one farmer can carry by hand. Ideal for sprinkler setups, micro-irrigation, and horticulture plots.",
        "img": "assets/equipment/honda_petrol_pump.png",
        "available": 1
    },
    {
        "id": "mach-41",
        "name": "Mobile Solar Irrigation Trolley (5 HP DC Pump)",
        "category": "pumps",
        "category_name": "Water Pumps & Irrigation",
        "power": "5 HP Solar Array (3.5 kW)",
        "rate_hourly": 190,
        "rate_daily": 1400,
        "rate_weekly": 8200,
        "deposit": 1500,
        "rating": 4.9,
        "reviews_count": 34,
        "owner_name": "SuryaKisan Green Energy",
        "owner_phone": "+91 98450 99112",
        "owner_whatsapp": "919845099112",
        "location": "Gwalior Bypass, MP",
        "lat": 26.2183,
        "lon": 78.1828,
        "distance_km": 5.0,
        "condition": "Like New",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "100% Free Solar Power (Zero Fuel Cost)",
        "delivery_available": 1,
        "delivery_rate_per_km": 20,
        "features": "Trolley Mounted Foldable Solar Panels, Zero Fuel / Electricity Required, Automatic MPPT Controller",
        "description": "Zero-operating-cost solar pumping trolley. Hook behind a tractor or bullock cart, fold out the panels, and pump free water all day.",
        "img": "assets/equipment/solar_irrigation_trolley.png",
        "available": 1
    },
    {
        "id": "mach-42",
        "name": "Heavy-Duty Hydraulic Tipping Farm Trolley (10-Ton)",
        "category": "tractors",
        "category_name": "Transport & Logistics",
        "power": "10 Ton Capacity Dual Axle",
        "rate_hourly": 150,
        "rate_daily": 1000,
        "rate_weekly": 6000,
        "deposit": 1000,
        "rating": 4.8,
        "reviews_count": 39,
        "owner_name": "Punjab Farm Haulage Services",
        "owner_phone": "+91 98150 22334",
        "owner_whatsapp": "919815022334",
        "location": "Ludhiana Mandi Gate 2, Punjab",
        "lat": 30.9,
        "lon": 75.85,
        "distance_km": 2.8,
        "condition": "Excellent",
        "verified": 1,
        "operator_included": 0,
        "fuel_policy": "Trolley Only (Hooks to any 45+ HP tractor)",
        "delivery_available": 1,
        "delivery_rate_per_km": 15,
        "features": "Heavy-Duty Telescopic Hydraulic Ram, Dual Axle 4-Tyre Suspension, 10 Ton Grain Capacity",
        "description": "Heavy hydraulic tipping trolley for grain transport to Mandi, sugarcane haulage to sugar mills, and sand/gravel manure spreading.",
        "img": "assets/equipment/cultivator_9_tyne.png",
        "available": 1
    }
]

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # 1. Equipment Rentals Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS equipment_rentals (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            category_name TEXT NOT NULL,
            power TEXT,
            rate_hourly REAL NOT NULL,
            rate_daily REAL NOT NULL,
            rate_weekly REAL NOT NULL,
            deposit REAL DEFAULT 0,
            rating REAL DEFAULT 4.8,
            reviews_count INTEGER DEFAULT 10,
            owner_name TEXT NOT NULL,
            owner_phone TEXT NOT NULL,
            owner_whatsapp TEXT NOT NULL,
            location TEXT NOT NULL,
            lat REAL DEFAULT 30.9010,
            lon REAL DEFAULT 75.8573,
            distance_km REAL DEFAULT 3.0,
            condition TEXT DEFAULT 'Excellent',
            verified INTEGER DEFAULT 1,
            operator_included INTEGER DEFAULT 1,
            fuel_policy TEXT,
            delivery_available INTEGER DEFAULT 1,
            delivery_rate_per_km REAL DEFAULT 20,
            features TEXT,
            description TEXT,
            img TEXT NOT NULL,
            available INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Bookings Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS equipment_bookings (
            booking_id TEXT PRIMARY KEY,
            machine_id TEXT NOT NULL,
            machine_name TEXT NOT NULL,
            farmer_name TEXT NOT NULL,
            farmer_phone TEXT NOT NULL,
            duration_type TEXT NOT NULL,
            duration_count INTEGER NOT NULL,
            start_date TEXT NOT NULL,
            start_time TEXT,
            fulfillment_type TEXT NOT NULL,
            delivery_address TEXT,
            rental_cost REAL NOT NULL,
            delivery_fee REAL DEFAULT 0,
            platform_fee REAL DEFAULT 50,
            deposit_amount REAL DEFAULT 0,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'Confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed equipment if table is empty
    c.execute('SELECT COUNT(*) FROM equipment_rentals')
    count = c.fetchone()[0]
    if count == 0:
        for m in ALL_MACHINES:
            c.execute('''
                INSERT INTO equipment_rentals (
                    id, name, category, category_name, power, rate_hourly, rate_daily, rate_weekly,
                    deposit, rating, reviews_count, owner_name, owner_phone, owner_whatsapp,
                    location, lat, lon, distance_km, condition, verified, operator_included,
                    fuel_policy, delivery_available, delivery_rate_per_km, features, description, img, available
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                m["id"], m["name"], m["category"], m["category_name"], m["power"],
                m["rate_hourly"], m["rate_daily"], m["rate_weekly"], m["deposit"],
                m["rating"], m["reviews_count"], m["owner_name"], m["owner_phone"], m["owner_whatsapp"],
                m["location"], m["lat"], m["lon"], m["distance_km"], m["condition"],
                m["verified"], m["operator_included"], m["fuel_policy"], m["delivery_available"],
                m["delivery_rate_per_km"], m["features"], m["description"], m["img"], m["available"]
            ))
        conn.commit()
        print(f"[DB] Seeded {len(ALL_MACHINES)} verified farm machinery rental records.")

    # 3. Farmer Profiles Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS farmer_profiles (
            user_id TEXT PRIMARY KEY,
            name TEXT,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            village TEXT,
            primary_crop TEXT,
            farm_size TEXT,
            farming_type TEXT,
            completed INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Haversine distance calculator in km
def calc_haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

class KrishiJalHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            query = urllib.parse.parse_qs(parsed.query)

            # 1. API: Server Health Status
            if path == "/api/status":
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "healthy",
                    "service": "Krishi Jal Farming & Machinery Rental Platform",
                    "version": "3.9.0",
                    "port": PORT
                }).encode('utf-8'))
                return

            # 1b. API: Live Mandi Rates
            if path == "/api/mandi":
                import random
                search_q = query.get("search", [""])[0].lower().strip()
                state_f  = query.get("state",  ["all"])[0].lower()
                crop_f   = query.get("crop",   ["all"])[0].lower()

                # Seed random with date so prices are stable within a day but change daily
                seed = int(time.time() // 86400)
                rng = random.Random(seed)

                BASE_RATES = [
                    # Cereals
                    {"crop": "Wheat", "hi": "गेहूं",    "icon": "🌾", "category": "Cereal",    "msp": 2425, "state": "Punjab",      "mandi": "Ludhiana Grain Market",    "base": 2580},
                    {"crop": "Wheat", "hi": "गेहूं",    "icon": "🌾", "category": "Cereal",    "msp": 2425, "state": "Haryana",     "mandi": "Karnal Grain Mandi",       "base": 2550},
                    {"crop": "Wheat", "hi": "गेहूं",    "icon": "🌾", "category": "Cereal",    "msp": 2425, "state": "Uttar Pradesh","mandi": "Kanpur Azadpur Mandi",    "base": 2490},
                    {"crop": "Wheat", "hi": "गेहूं",    "icon": "🌾", "category": "Cereal",    "msp": 2425, "state": "Madhya Pradesh","mandi": "Bhopal Krishi Upaj Mandi","base": 2510},
                    {"crop": "Wheat", "hi": "गेहूं",    "icon": "🌾", "category": "Cereal",    "msp": 2425, "state": "Rajasthan",   "mandi": "Sri Ganganagar APMC",      "base": 2535},

                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "Punjab",      "mandi": "Amritsar Paddy Market",    "base": 2350},
                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "Haryana",     "mandi": "Kurukshetra Mandi",        "base": 2320},
                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "Uttar Pradesh","mandi": "Varanasi APMC",           "base": 2290},
                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "West Bengal", "mandi": "Bardhaman Dhaan Mandi",    "base": 2275},
                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "Andhra Pradesh","mandi": "Guntur APMC",            "base": 2310},
                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "Tamil Nadu",  "mandi": "Thanjavur Rice Market",    "base": 2340},
                    {"crop": "Paddy (Common)", "hi": "धान","icon": "🌾","category": "Cereal",  "msp": 2300, "state": "Telangana",   "mandi": "Nizamabad Dhaan Mandi",    "base": 2295},

                    {"crop": "Basmati 1121",  "hi": "बासमती","icon":"🌾","category":"Cereal",  "msp": 2320, "state": "Punjab",      "mandi": "Jalandhar Basmati Mandi",  "base": 4250},
                    {"crop": "Basmati 1121",  "hi": "बासमती","icon":"🌾","category":"Cereal",  "msp": 2320, "state": "Haryana",     "mandi": "Kaithal Mandi",            "base": 4180},

                    {"crop": "Maize",   "hi": "मक्का",   "icon": "🌽", "category": "Cereal",   "msp": 2225, "state": "Karnataka",   "mandi": "Davangere Maize Mandi",    "base": 2190},
                    {"crop": "Maize",   "hi": "मक्का",   "icon": "🌽", "category": "Cereal",   "msp": 2225, "state": "Andhra Pradesh","mandi": "Nizamabad APMC",         "base": 2210},
                    {"crop": "Maize",   "hi": "मक्का",   "icon": "🌽", "category": "Cereal",   "msp": 2225, "state": "Bihar",        "mandi": "Patna Sabji Mandi",       "base": 2170},
                    {"crop": "Maize",   "hi": "मक्का",   "icon": "🌽", "category": "Cereal",   "msp": 2225, "state": "Rajasthan",    "mandi": "Kota Grain Mandi",        "base": 2200},

                    {"crop": "Barley",  "hi": "जौ",      "icon": "🌾", "category": "Cereal",   "msp": 1735, "state": "Rajasthan",   "mandi": "Bikaner Mandi",            "base": 1810},
                    {"crop": "Barley",  "hi": "जौ",      "icon": "🌾", "category": "Cereal",   "msp": 1735, "state": "Haryana",     "mandi": "Hisar APMC",               "base": 1795},

                    # Pulses
                    {"crop": "Tur Dal", "hi": "तूर दाल", "icon": "🫘", "category": "Pulses",   "msp": 7550, "state": "Maharashtra", "mandi": "Latur Tur Dal Market",     "base": 7850},
                    {"crop": "Tur Dal", "hi": "तूर दाल", "icon": "🫘", "category": "Pulses",   "msp": 7550, "state": "Karnataka",   "mandi": "Gulbarga Tur Market",      "base": 7780},
                    {"crop": "Tur Dal", "hi": "तूर दाल", "icon": "🫘", "category": "Pulses",   "msp": 7550, "state": "Telangana",   "mandi": "Adilabad Mandi",           "base": 7700},
                    {"crop": "Tur Dal", "hi": "तूर दाल", "icon": "🫘", "category": "Pulses",   "msp": 7550, "state": "Andhra Pradesh","mandi": "Guntur Pulses Mandi",    "base": 7650},

                    {"crop": "Gram (Chana)","hi":"चना",   "icon": "🫛", "category": "Pulses",   "msp": 5440, "state": "Madhya Pradesh","mandi": "Indore Chana Mandi",     "base": 5600},
                    {"crop": "Gram (Chana)","hi":"चना",   "icon": "🫛", "category": "Pulses",   "msp": 5440, "state": "Rajasthan",   "mandi": "Jaipur Grain Mandi",       "base": 5550},
                    {"crop": "Gram (Chana)","hi":"चना",   "icon": "🫛", "category": "Pulses",   "msp": 5440, "state": "Maharashtra", "mandi": "Akola Chana Market",       "base": 5480},

                    {"crop": "Moong",   "hi": "मूंग",    "icon": "🫛", "category": "Pulses",   "msp": 8682, "state": "Rajasthan",   "mandi": "Jaipur Moong Mandi",       "base": 8900},
                    {"crop": "Moong",   "hi": "मूंग",    "icon": "🫛", "category": "Pulses",   "msp": 8682, "state": "Madhya Pradesh","mandi": "Vidisha Mandi",           "base": 8820},

                    {"crop": "Urad",    "hi": "उड़द",   "icon": "🫘", "category": "Pulses",   "msp": 7400, "state": "Madhya Pradesh","mandi": "Sagar Urad Mandi",        "base": 7600},
                    {"crop": "Urad",    "hi": "उड़द",   "icon": "🫘", "category": "Pulses",   "msp": 7400, "state": "Uttar Pradesh","mandi": "Kanpur Daalmandi",        "base": 7480},

                    {"crop": "Masur (Lentil)","hi":"मसूर","icon":"🫘", "category": "Pulses",   "msp": 6700, "state": "Uttar Pradesh","mandi": "Hapur Masur Market",      "base": 6900},
                    {"crop": "Masur (Lentil)","hi":"मसूर","icon":"🫘", "category": "Pulses",   "msp": 6700, "state": "Madhya Pradesh","mandi": "Sehore Mandi",            "base": 6850},

                    # Oilseeds
                    {"crop": "Mustard", "hi": "सरसों",   "icon": "🌼", "category": "Oilseeds", "msp": 5950, "state": "Rajasthan",   "mandi": "Sri Ganganagar Mustard Market","base": 6200},
                    {"crop": "Mustard", "hi": "सरसों",   "icon": "🌼", "category": "Oilseeds", "msp": 5950, "state": "Haryana",     "mandi": "Sirsa Mustard Mandi",      "base": 6100},
                    {"crop": "Mustard", "hi": "सरसों",   "icon": "🌼", "category": "Oilseeds", "msp": 5950, "state": "Madhya Pradesh","mandi": "Morena Sarson Mandi",     "base": 6050},
                    {"crop": "Mustard", "hi": "सरसों",   "icon": "🌼", "category": "Oilseeds", "msp": 5950, "state": "Uttar Pradesh","mandi": "Agra Sarson Mandi",       "base": 6000},
                    {"crop": "Mustard", "hi": "सरसों",   "icon": "🌼", "category": "Oilseeds", "msp": 5950, "state": "Punjab",      "mandi": "Bathinda Mandi",           "base": 6080},

                    {"crop": "Soybean", "hi": "सोयाबीन", "icon": "🫘", "category": "Oilseeds", "msp": 4892, "state": "Madhya Pradesh","mandi": "Indore Soybean Mandi",   "base": 5050},
                    {"crop": "Soybean", "hi": "सोयाबीन", "icon": "🫘", "category": "Oilseeds", "msp": 4892, "state": "Maharashtra", "mandi": "Latur Soybean Market",     "base": 4980},
                    {"crop": "Soybean", "hi": "सोयाबीन", "icon": "🫘", "category": "Oilseeds", "msp": 4892, "state": "Rajasthan",   "mandi": "Kota APMC",               "base": 4920},

                    {"crop": "Groundnut","hi": "मूंगफली","icon": "🥜", "category": "Oilseeds", "msp": 6783, "state": "Gujarat",     "mandi": "Rajkot Groundnut Market",  "base": 7200},
                    {"crop": "Groundnut","hi": "मूंगफली","icon": "🥜", "category": "Oilseeds", "msp": 6783, "state": "Andhra Pradesh","mandi": "Kurnool Oil Seed Market", "base": 7050},
                    {"crop": "Groundnut","hi": "मूंगफली","icon": "🥜", "category": "Oilseeds", "msp": 6783, "state": "Karnataka",   "mandi": "Bellary APMC",             "base": 6980},

                    {"crop": "Sunflower","hi": "सूरजमुखी","icon":"🌻","category": "Oilseeds",  "msp": 7280, "state": "Karnataka",   "mandi": "Bellary Sunflower Market", "base": 7400},
                    {"crop": "Sunflower","hi": "सूरजमुखी","icon":"🌻","category": "Oilseeds",  "msp": 7280, "state": "Andhra Pradesh","mandi": "Kurnool Sunflower Mandi", "base": 7350},

                    {"crop": "Sesamum (Til)","hi":"तिल",  "icon": "🌿","category": "Oilseeds",  "msp": 9267, "state": "Rajasthan",   "mandi": "Jodhpur Til Market",       "base": 9500},
                    {"crop": "Sesamum (Til)","hi":"तिल",  "icon": "🌿","category": "Oilseeds",  "msp": 9267, "state": "Gujarat",     "mandi": "Amreli Mandi",             "base": 9420},

                    # Cash Crops
                    {"crop": "Cotton",  "hi": "कपास",    "icon": "☁️", "category": "Cash Crop", "msp": 7121, "state": "Punjab",      "mandi": "Abohar Cotton Market",     "base": 7400},
                    {"crop": "Cotton",  "hi": "कपास",    "icon": "☁️", "category": "Cash Crop", "msp": 7121, "state": "Haryana",     "mandi": "Sirsa Cotton Mandi",       "base": 7350},
                    {"crop": "Cotton",  "hi": "कपास",    "icon": "☁️", "category": "Cash Crop", "msp": 7121, "state": "Maharashtra", "mandi": "Akola Cotton Market",      "base": 7200},
                    {"crop": "Cotton",  "hi": "कपास",    "icon": "☁️", "category": "Cash Crop", "msp": 7121, "state": "Gujarat",     "mandi": "Surendranagar Cotton Mandi","base": 7500},
                    {"crop": "Cotton",  "hi": "कपास",    "icon": "☁️", "category": "Cash Crop", "msp": 7121, "state": "Telangana",   "mandi": "Warangal Cotton Market",   "base": 7250},
                    {"crop": "Cotton",  "hi": "कपास",    "icon": "☁️", "category": "Cash Crop", "msp": 7121, "state": "Andhra Pradesh","mandi": "Guntur Cotton Mandi",    "base": 7300},

                    {"crop": "Sugarcane","hi": "गन्ना",  "icon": "🎋", "category": "Cash Crop", "msp": 355,  "state": "Uttar Pradesh","mandi": "Meerut Sugar Mill Yard",  "base": 370},
                    {"crop": "Sugarcane","hi": "गन्ना",  "icon": "🎋", "category": "Cash Crop", "msp": 355,  "state": "Maharashtra", "mandi": "Kolhapur Sugar Mill",      "base": 360},
                    {"crop": "Sugarcane","hi": "गन्ना",  "icon": "🎋", "category": "Cash Crop", "msp": 355,  "state": "Karnataka",   "mandi": "Belgaum Sugar Factory",    "base": 358},

                    # Vegetables
                    {"crop": "Onion",   "hi": "प्याज",   "icon": "🧅", "category": "Vegetable", "msp": None, "state": "Maharashtra", "mandi": "Nashik Onion Market (Lasalgaon)","base": 1800},
                    {"crop": "Onion",   "hi": "प्याज",   "icon": "🧅", "category": "Vegetable", "msp": None, "state": "Madhya Pradesh","mandi": "Mandsaur APMC",           "base": 1650},
                    {"crop": "Onion",   "hi": "प्याज",   "icon": "🧅", "category": "Vegetable", "msp": None, "state": "Karnataka",   "mandi": "Gadag Onion Mandi",        "base": 1720},
                    {"crop": "Onion",   "hi": "प्याज",   "icon": "🧅", "category": "Vegetable", "msp": None, "state": "Rajasthan",   "mandi": "Alwar Sabji Mandi",        "base": 1580},

                    {"crop": "Potato",  "hi": "आलू",     "icon": "🥔", "category": "Vegetable", "msp": None, "state": "Uttar Pradesh","mandi": "Agra Aloo Mandi",         "base": 1200},
                    {"crop": "Potato",  "hi": "आलू",     "icon": "🥔", "category": "Vegetable", "msp": None, "state": "Punjab",      "mandi": "Jalandhar Vegetable Market","base": 1350},
                    {"crop": "Potato",  "hi": "आलू",     "icon": "🥔", "category": "Vegetable", "msp": None, "state": "West Bengal", "mandi": "Hooghly Aloo Mandi",       "base": 1150},
                    {"crop": "Potato",  "hi": "आलू",     "icon": "🥔", "category": "Vegetable", "msp": None, "state": "Madhya Pradesh","mandi": "Indore Sabji Mandi",      "base": 1280},

                    {"crop": "Tomato",  "hi": "टमाटर",   "icon": "🍅", "category": "Vegetable", "msp": None, "state": "Karnataka",   "mandi": "Kolar Tomato Market",      "base": 2200},
                    {"crop": "Tomato",  "hi": "टमाटर",   "icon": "🍅", "category": "Vegetable", "msp": None, "state": "Andhra Pradesh","mandi": "Madanapalle APMC",       "base": 2100},
                    {"crop": "Tomato",  "hi": "टमाटर",   "icon": "🍅", "category": "Vegetable", "msp": None, "state": "Himachal Pradesh","mandi": "Solan Tomato Mandi",    "base": 2500},
                    {"crop": "Tomato",  "hi": "टमाटर",   "icon": "🍅", "category": "Vegetable", "msp": None, "state": "Maharashtra", "mandi": "Pune Sabji Market",        "base": 1950},

                    {"crop": "Garlic",  "hi": "लहसुन",   "icon": "🧄", "category": "Vegetable", "msp": None, "state": "Madhya Pradesh","mandi": "Neemuch Lahsun Mandi",   "base": 10000},
                    {"crop": "Garlic",  "hi": "लहसुन",   "icon": "🧄", "category": "Vegetable", "msp": None, "state": "Rajasthan",   "mandi": "Barmer Mandi",             "base": 9500},
                    {"crop": "Garlic",  "hi": "लहसुन",   "icon": "🧄", "category": "Vegetable", "msp": None, "state": "Gujarat",     "mandi": "Gondal Mandi",             "base": 9800},

                    {"crop": "Green Chilli","hi":"हरी मिर्च","icon":"🌶️","category":"Vegetable","msp": None, "state": "Andhra Pradesh","mandi": "Guntur Mirchi Yard",     "base": 5500},
                    {"crop": "Green Chilli","hi":"हरी मिर्च","icon":"🌶️","category":"Vegetable","msp": None, "state": "Karnataka",   "mandi": "Hubli APMC",               "base": 4800},
                    {"crop": "Green Chilli","hi":"हरी मिर्च","icon":"🌶️","category":"Vegetable","msp": None, "state": "Telangana",   "mandi": "Khammam Mirchi Mandi",     "base": 5200},

                    # Fruits
                    {"crop": "Mango",   "hi": "आम",      "icon": "🥭", "category": "Fruit",     "msp": None, "state": "Andhra Pradesh","mandi": "Krishnapatnam Port APMC","base": 4500},
                    {"crop": "Mango",   "hi": "आम",      "icon": "🥭", "category": "Fruit",     "msp": None, "state": "Maharashtra", "mandi": "Ratnagiri Hapus Market",   "base": 8000},
                    {"crop": "Mango",   "hi": "आम",      "icon": "🥭", "category": "Fruit",     "msp": None, "state": "Uttar Pradesh","mandi": "Lucknow Aam Mandi",       "base": 3800},

                    {"crop": "Banana",  "hi": "केला",    "icon": "🍌", "category": "Fruit",     "msp": None, "state": "Maharashtra", "mandi": "Jalgaon Banana Market",    "base": 1800},
                    {"crop": "Banana",  "hi": "केला",    "icon": "🍌", "category": "Fruit",     "msp": None, "state": "Karnataka",   "mandi": "Davangere APMC",           "base": 1650},
                    {"crop": "Banana",  "hi": "केला",    "icon": "🍌", "category": "Fruit",     "msp": None, "state": "Tamil Nadu",  "mandi": "Trichy Banana Market",     "base": 2000},

                    {"crop": "Pomegranate","hi":"अनार",   "icon": "🍎", "category": "Fruit",     "msp": None, "state": "Maharashtra", "mandi": "Solapur Anar Mandi",       "base": 6000},
                    {"crop": "Pomegranate","hi":"अनार",   "icon": "🍎", "category": "Fruit",     "msp": None, "state": "Rajasthan",   "mandi": "Pali APMC",                "base": 5500},
                ]

                results = []
                for i, r in enumerate(BASE_RATES):
                    # Simulate real-time price fluctuation: ±3% from base
                    variation = rng.uniform(-0.03, 0.03)
                    modal_price = round(r["base"] * (1 + variation), -1)
                    min_price   = round(modal_price * rng.uniform(0.92, 0.97), -1)
                    max_price   = round(modal_price * rng.uniform(1.02, 1.08), -1)
                    prev_price  = round(r["base"] * (1 + rng.uniform(-0.04, 0.04)), -1)
                    change_pct  = round((modal_price - prev_price) / prev_price * 100, 2)

                    msp_val = r.get("msp")
                    if msp_val:
                        vs_msp_pct = round((modal_price - msp_val) / msp_val * 100, 1)
                    else:
                        vs_msp_pct = None

                    item = {
                        "id": f"mandi-{i:03d}",
                        "crop": r["crop"],
                        "crop_hi": r["hi"],
                        "icon": r["icon"],
                        "category": r["category"],
                        "mandi": r["mandi"],
                        "state": r["state"],
                        "modal_price": modal_price,
                        "min_price": min_price,
                        "max_price": max_price,
                        "prev_price": prev_price,
                        "change_pct": change_pct,
                        "msp": msp_val,
                        "vs_msp_pct": vs_msp_pct,
                        "unit": "₹/Quintal",
                        "updated": time.strftime("%d %b %Y, %I:%M %p")
                    }

                    # Filter by state
                    if state_f != "all" and state_f not in r["state"].lower():
                        continue
                    # Filter by crop category
                    if crop_f != "all" and crop_f not in r["category"].lower() and crop_f not in r["crop"].lower():
                        continue
                    # Filter by search
                    if search_q and search_q not in r["crop"].lower() and search_q not in r["mandi"].lower() and search_q not in r["state"].lower() and search_q not in r["hi"]:
                        continue

                    results.append(item)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "count": len(results),
                    "as_of": time.strftime("%d %b %Y"),
                    "rates": results
                }).encode('utf-8'))
                return



            # 2. API: Equipment Rental Discovery
            if path == "/api/equipment":
                category = query.get("category", ["all"])[0]
                search = query.get("search", [""])[0].lower().strip()
                max_price = float(query.get("max_price", [999999])[0])
                radius_km = float(query.get("radius_km", [9999])[0])
                user_lat = float(query.get("lat", [30.9010])[0])
                user_lon = float(query.get("lon", [75.8573])[0])
                sort_by = query.get("sort", ["distance"])[0]

                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("SELECT * FROM equipment_rentals ORDER BY rating DESC")
                rows = c.fetchall()
                conn.close()

                results = []
                for r in rows:
                    item = dict(r)
                    m_lat = float(item.get("lat") or 30.9010)
                    m_lon = float(item.get("lon") or 75.8573)
                    dist = calc_haversine(user_lat, user_lon, m_lat, m_lon)
                    item["distance_km"] = dist

                    # Apply category filter
                    if category != "all" and item.get("category") != category:
                        continue

                    # Apply search filter
                    if search and (search not in str(item.get("name","")).lower() and search not in str(item.get("features","")).lower() and search not in str(item.get("description","")).lower() and search not in str(item.get("category_name","")).lower()):
                        continue

                    # Apply radius filter
                    if dist > radius_km:
                        continue

                    # Apply price filter
                    if float(item.get("rate_hourly", 0)) > max_price:
                        continue

                    results.append(item)

                # Sort results
                if sort_by == "distance":
                    results.sort(key=lambda x: x["distance_km"])
                elif sort_by == "price_low":
                    results.sort(key=lambda x: float(x.get("rate_hourly", 0)))
                elif sort_by == "price_high":
                    results.sort(key=lambda x: float(x.get("rate_hourly", 0)), reverse=True)
                elif sort_by == "rating":
                    results.sort(key=lambda x: float(x.get("rating", 0)), reverse=True)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "count": len(results),
                    "equipment": results,
                    "user_lat": user_lat,
                    "user_lon": user_lon
                }).encode('utf-8'))
                return

            # 3. API: My Bookings
            if path == "/api/equipment/my-bookings":
                phone = query.get("phone", [""])[0]
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                if phone:
                    c.execute("SELECT * FROM equipment_bookings WHERE farmer_phone = ? ORDER BY created_at DESC", (phone,))
                else:
                    c.execute("SELECT * FROM equipment_bookings ORDER BY created_at DESC LIMIT 50")
                rows = c.fetchall()
                conn.close()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "count": len(rows),
                    "bookings": [dict(r) for r in rows]
                }).encode('utf-8'))
                return

            # 4. API: Owner Dashboard Metrics
            if path == "/api/equipment/owner-dashboard":
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("SELECT COUNT(*) as total_machines FROM equipment_rentals")
                total_machines = c.fetchone()["total_machines"]

                c.execute("SELECT COUNT(*) as total_bookings, COALESCE(SUM(total_amount), 0) as total_earnings FROM equipment_bookings")
                book_stat = c.fetchone()

                c.execute("SELECT * FROM equipment_bookings ORDER BY created_at DESC LIMIT 10")
                recent_bookings = [dict(r) for r in c.fetchall()]
                conn.close()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "total_machines": total_machines,
                    "total_bookings": book_stat["total_bookings"],
                    "total_earnings": book_stat["total_earnings"],
                    "recent_bookings": recent_bookings
                }).encode('utf-8'))
                return

            # 5. API: Single Equipment Detail
            if path.startswith("/api/equipment/") and not path.endswith("/book") and not path.endswith("/list") and not path.endswith("/my-bookings") and not path.endswith("/owner-dashboard"):
                eq_id = path.replace("/api/equipment/", "").strip()
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("SELECT * FROM equipment_rentals WHERE id = ?", (eq_id,))
                row = c.fetchone()
                conn.close()

                if row:
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"equipment": dict(row)}).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Equipment machine not found"}).encode('utf-8'))
                return

            # 6. API: Get Farmer Profile
            if path == "/api/farmer/profile":
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("SELECT * FROM farmer_profiles WHERE user_id = 'default_farmer'")
                row = c.fetchone()
                conn.close()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                if row:
                    self.wfile.write(json.dumps({"profile": dict(row)}).encode('utf-8'))
                else:
                    self.wfile.write(json.dumps({"profile": None}).encode('utf-8'))
                return

            # Fallback to static file serving
            return super().do_GET()
        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_POST(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            length = int(self.headers.get('content-length', 0))
            body = self.rfile.read(length).decode('utf-8') if length > 0 else "{}"

            try:
                data = json.loads(body)
            except Exception:
                data = {}

            # --- SOIL IMAGE AI ANALYSIS (Gemini Vision) ---
            if path == "/api/soillab/analyze-image":
                image_b64 = data.get("image_base64", "")
                image_mime = data.get("mime_type", "image/jpeg")
                api_key = data.get("api_key", "").strip()

                if not image_b64:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "No image data provided"}).encode('utf-8'))
                    return

                if not api_key:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Gemini API key is required. Get one free at https://aistudio.google.com/apikey"}).encode('utf-8'))
                    return

                # Build Gemini 1.5 Flash Vision API request
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"

                prompt = """You are an expert soil scientist and agronomist specializing in Indian agriculture. Carefully analyze this soil image and provide a comprehensive soil health report.

Please analyze the soil and return a JSON response with EXACTLY this structure (no markdown, just raw JSON):
{
  "soil_type": "Name of soil type (e.g., Alluvial, Black Cotton, Red Laterite, Sandy Loam, Clay, Silty)",
  "color_analysis": "Detailed description of soil color and what it indicates",
  "texture": "Soil texture assessment (Sandy/Loamy/Clayey/Silty/combination)",
  "estimated_ph": "Estimated pH range (e.g., 6.0-7.0)",
  "organic_matter": "Low/Moderate/High - with explanation",
  "moisture_content": "Dry/Moderate/Moist/Wet",
  "nitrogen_status": "Deficient/Low/Adequate/High with % estimate",
  "phosphorus_status": "Deficient/Low/Adequate/High with brief reason",
  "potassium_status": "Deficient/Low/Adequate/High with brief reason",
  "drainage": "Poor/Moderate/Well-drained",
  "compaction": "None/Low/Moderate/High",
  "visible_deficiencies": ["List any visible nutrient deficiency signs"],
  "suitable_crops": ["List 5-8 crops best suited for this soil"],
  "improvements_needed": ["List 3-5 specific soil improvement recommendations"],
  "fertilizer_advice": "Specific NPK fertilizer recommendation for this soil",
  "irrigation_advice": "Irrigation frequency and method recommendation",
  "overall_health_score": 75,
  "health_label": "Good/Fair/Poor/Excellent",
  "summary": "2-3 sentence overall assessment of the soil suitable for a farmer"
}"""

                request_body = json.dumps({
                    "contents": [{
                        "parts": [
                            {"text": prompt},
                            {
                                "inline_data": {
                                    "mime_type": image_mime,
                                    "data": image_b64
                                }
                            }
                        ]
                    }],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 2048,
                        "responseMimeType": "application/json"
                    }
                }).encode('utf-8')

                try:
                    req = urllib.request.Request(
                        gemini_url,
                        data=request_body,
                        headers={"Content-Type": "application/json"},
                        method="POST"
                    )
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        gemini_response = json.loads(resp.read().decode('utf-8'))

                    # Extract the JSON content from Gemini response
                    candidates = gemini_response.get("candidates", [])
                    if not candidates:
                        raise ValueError("No response from Gemini AI")

                    raw_text = candidates[0]["content"]["parts"][0]["text"]

                    # Parse the soil analysis JSON
                    try:
                        soil_data = json.loads(raw_text)
                    except Exception:
                        # Try to extract JSON from text if wrapped in markdown
                        import re
                        match = re.search(r'\{[\s\S]*\}', raw_text)
                        if match:
                            soil_data = json.loads(match.group(0))
                        else:
                            soil_data = {"raw_analysis": raw_text, "error": "Could not parse structured data"}

                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "success": True,
                        "analysis": soil_data
                    }).encode('utf-8'))

                except urllib.error.HTTPError as e:
                    err_body = e.read().decode('utf-8')
                    self.send_response(e.code)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    err_msg = "Invalid API key" if e.code == 400 or e.code == 403 else f"Gemini API error: {err_body[:200]}"
                    self.wfile.write(json.dumps({"error": err_msg}).encode('utf-8'))
                except Exception as ex:
                    self.send_response(500)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": f"AI analysis failed: {str(ex)}"}).encode('utf-8'))
                return
            # --- END SOIL AI ANALYSIS ---

            # 1. API: Book Equipment
            if path == "/api/equipment/book":
                machine_id = data.get("machine_id", "")
                farmer_name = data.get("farmer_name", "Farmer").strip()
                farmer_phone = data.get("farmer_phone", "").strip()
                duration_type = data.get("duration_type", "hourly")
                duration_count = int(data.get("duration_count", 1))
                start_date = data.get("start_date", time.strftime("%Y-%m-%d"))
                start_time = data.get("start_time", "08:00 AM")
                fulfillment_type = data.get("fulfillment_type", "delivery")
                delivery_address = data.get("delivery_address", "")

                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("SELECT * FROM equipment_rentals WHERE id = ?", (machine_id,))
                machine = c.fetchone()

                if not machine:
                    conn.close()
                    self.send_response(404)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Selected machine not found"}).encode('utf-8'))
                    return

                machine = dict(machine)

                # Compute Price
                rate_hourly = float(machine.get("rate_hourly", 400))
                rate_daily = float(machine.get("rate_daily", rate_hourly * 8))
                rate_weekly = float(machine.get("rate_weekly", rate_daily * 6))

                if duration_type == "hourly":
                    base_rental = rate_hourly * duration_count
                elif duration_type == "daily":
                    base_rental = rate_daily * duration_count
                elif duration_type == "weekly":
                    base_rental = rate_weekly * duration_count
                else:
                    base_rental = rate_daily * duration_count

                del_rate = float(machine.get("delivery_rate_per_km", 20))
                dist = float(machine.get("distance_km", 3.0))
                delivery_fee = (del_rate * dist) if fulfillment_type == "delivery" else 0
                delivery_fee = round(max(100, delivery_fee) if fulfillment_type == "delivery" else 0)
                platform_fee = 50.0
                deposit_amount = float(machine.get("deposit", 1000))
                total_amount = base_rental + delivery_fee + platform_fee

                booking_id = f"KRISHI-RENT-{int(time.time() * 1000) % 1000000:06d}"

                c.execute('''
                    INSERT INTO equipment_bookings (
                        booking_id, machine_id, machine_name, farmer_name, farmer_phone,
                        duration_type, duration_count, start_date, start_time,
                        fulfillment_type, delivery_address, rental_cost, delivery_fee,
                        platform_fee, deposit_amount, total_amount, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
                ''', (
                    booking_id, machine_id, machine["name"], farmer_name, farmer_phone,
                    duration_type, duration_count, start_date, start_time,
                    fulfillment_type, delivery_address, base_rental, delivery_fee,
                    platform_fee, deposit_amount, total_amount
                ))
                conn.commit()
                conn.close()

                self.send_response(201)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": f"Machinery booking confirmed successfully! Reference ID: {booking_id}",
                    "booking_id": booking_id,
                    "machine_name": machine["name"],
                    "owner_name": machine["owner_name"],
                    "owner_phone": machine["owner_phone"],
                    "owner_whatsapp": machine["owner_whatsapp"],
                    "start_date": start_date,
                    "start_time": start_time,
                    "rental_cost": base_rental,
                    "delivery_fee": delivery_fee,
                    "platform_fee": platform_fee,
                    "deposit_amount": deposit_amount,
                    "total_amount": total_amount,
                    "fulfillment_type": fulfillment_type
                }).encode('utf-8'))
                return

            # 2. API: List / Register New Machine
            if path == "/api/equipment/list":
                name = data.get("name", "").strip()
                category = data.get("category", "tractors")
                power = data.get("power", "45 HP").strip()
                rate_hourly = float(data.get("rate_hourly", 400))
                rate_daily = float(data.get("rate_daily", rate_hourly * 8))
                rate_weekly = float(data.get("rate_weekly", rate_daily * 6))
                deposit = float(data.get("deposit", 1000))
                owner_name = data.get("owner_name", "Local Farm Owner").strip()
                owner_phone = data.get("owner_phone", "+91 98765 00000").strip()
                owner_whatsapp = data.get("owner_whatsapp", owner_phone.replace("+", "").replace(" ", "")).strip()
                location = data.get("location", "District Farm Centre").strip()
                lat = float(data.get("lat", 30.9010))
                lon = float(data.get("lon", 75.8573))
                operator_included = int(data.get("operator_included", 1))
                features = data.get("features", "Fully serviced, ready for field operations").strip()
                description = data.get("description", "High quality farming equipment for rent").strip()
                img = data.get("img", "assets/equipment/mahindra_575_tractor.png")

                if not name:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Machine name is required"}).encode('utf-8'))
                    return

                new_id = f"mach-{int(time.time() * 1000) % 1000000}"
                category_names = {
                    "tractors": "Tractor",
                    "harvesters": "Harvester",
                    "tillers": "Power Tiller",
                    "rotavators": "Rotavator",
                    "seeders": "Seed Drills & Planters",
                    "sprayers": "Sprayers & Drones",
                    "ploughs": "Ploughs & Cultivators",
                    "pumps": "Water Pumps & Irrigation",
                    "threshers": "Threshers & Harvesters",
                    "transplanters": "Seed Drills & Planters",
                    "balers": "Harvesters & Post-Harvest",
                    "cultivators": "Ploughs & Cultivators"
                }
                cat_name = category_names.get(category, "Farming Machine")

                conn = sqlite3.connect(DB_FILE)
                c = conn.cursor()
                c.execute('''
                    INSERT INTO equipment_rentals (
                        id, name, category, category_name, power, rate_hourly, rate_daily, rate_weekly,
                        deposit, rating, reviews_count, owner_name, owner_phone, owner_whatsapp,
                        location, lat, lon, distance_km, condition, verified, operator_included,
                        fuel_policy, delivery_available, delivery_rate_per_km, features, description, img, available
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    new_id, name, category, cat_name, power, rate_hourly, rate_daily, rate_weekly,
                    deposit, 5.0, 1, owner_name, owner_phone, owner_whatsapp,
                    location, lat, lon, 2.5, "Excellent", 1, operator_included,
                    "Standard Farm Agreement", 1, 20, features, description, img, 1
                ))
                conn.commit()
                conn.close()

                self.send_response(201)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": "Your machine has been listed successfully on Krishi Jal Marketplace!",
                    "machine_id": new_id
                }).encode('utf-8'))
                return

            # 3. API: Save/Update Farmer Profile
            if path == "/api/farmer/profile":
                name = data.get("name", "").strip()
                state = data.get("state", "").strip()
                district = data.get("district", "").strip()
                village = data.get("village", "").strip()
                primary_crop = data.get("primary_crop", "").strip()
                farm_size = data.get("farm_size", "").strip()
                farming_type = data.get("farming_type", "").strip()
                completed = int(data.get("completed", 1))

                if not state or not district:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "State and District location details are required."}).encode('utf-8'))
                    return

                conn = sqlite3.connect(DB_FILE)
                c = conn.cursor()
                c.execute('''
                    INSERT INTO farmer_profiles (
                        user_id, name, state, district, village, primary_crop, farm_size, farming_type, completed
                    ) VALUES ('default_farmer', ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(user_id) DO UPDATE SET
                        name=excluded.name,
                        state=excluded.state,
                        district=excluded.district,
                        village=excluded.village,
                        primary_crop=excluded.primary_crop,
                        farm_size=excluded.farm_size,
                        farming_type=excluded.farming_type,
                        completed=excluded.completed
                ''', (name, state, district, village, primary_crop, farm_size, farming_type, completed))
                conn.commit()
                
                # Fetch updated profile to return
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("SELECT * FROM farmer_profiles WHERE user_id = 'default_farmer'")
                updated_row = dict(c.fetchone())
                conn.close()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": "Farming profile updated successfully!",
                    "profile": updated_row
                }).encode('utf-8'))
                return

            self.send_response(404)
            self.end_headers()
        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

def run_server():
    init_db()
    server_address = ('', PORT)
    ThreadingHTTPServer.allow_reuse_address = True
    httpd = ThreadingHTTPServer(server_address, KrishiJalHandler)
    print(f"=========================================================================")
    print(f" 🚀 Krishi Jal Machinery Rental & Agro Server running on http://localhost:{PORT}")
    print(f"=========================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
