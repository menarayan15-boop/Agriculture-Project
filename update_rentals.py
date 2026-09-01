import re
import json

data = [
    {"owner": "Emerging Farm Equipments (India) Pvt Ltd.", "name": "Farm equipment", "description": "Kolathur, Chennai, Tamil Nadu", "phone": "044-25561622", "website": "https://www.emergingfarm.com/"},
    {"owner": "Aerial Drobotics", "name": "Agricultural drones / spraying", "description": "Namakkal, Tamil Nadu", "phone": "9952469739", "website": "https://aerialdrobotics.com/"},
    {"owner": "Agri drone sprayer-Rental", "name": "Drone spraying rental", "description": "Thenkurissi, Kerala", "phone": "9496294951", "website": ""},
    {"owner": "DRONE RAJA HEAD OFFICE", "name": "Agricultural drones", "description": "Kankipadu, Vijayawada, Andhra Pradesh", "phone": "9989838337", "website": "https://droneraja.in/"},
    {"owner": "Marut Drones", "name": "Agricultural drones", "description": "Madhapur, Hyderabad, Telangana", "phone": "9052999365", "website": "https://marutdrones.com/"},
    {"owner": "Bushra Impex / X1 Power", "name": "Power weeders, harvesters, pumps, sprayers", "description": "Kalasipalya, Bengaluru, Karnataka", "phone": "7624869606", "website": ""},
    {"owner": "Kale Agri Tech", "name": "Tractors, harvesters, farm equipment, machinery hire", "description": "Shivamogga, Karnataka", "phone": "", "website": "https://www.kaleagritech.com/"},
    {"owner": "WhiteOx Pvt Ltd", "name": "Tractor, drone spraying, well drilling, seed sowing", "description": "Sholinganallur, Chennai, Tamil Nadu", "phone": "8111015577", "website": "https://whiteox.in/"},
    {"owner": "Agrizone India", "name": "Agricultural machinery / dealer network", "description": "Puttur, Dakshina Kannada, Karnataka", "phone": "9108575757", "website": "https://www.agrizoneind.com/"},
    {"owner": "GreenRider Enterprises", "name": "Agricultural & dairy machinery", "description": "Bettahalli, Kunigal, Karnataka", "phone": "9844107053", "website": "https://www.greenriderskb.com/"},
    {"owner": "Sawbhumi Asha Agri India", "name": "Mini tractors, pumps, tillers, sprayers", "description": "Amta/Nowda, Murshidabad, West Bengal", "phone": "9733829216", "website": "https://www.ashaagriindia.com/"},
    {"owner": "JFarm Services / TAFE", "name": "Tractor & farm-equipment rental", "description": "Chennai, Tamil Nadu / multiple states", "phone": "1800-4200-100", "website": "https://www.jfarmservices.in/"},
    {"owner": "BhoomiHire", "name": "Tractor, harvester, rotavator, drone spraying", "description": "Hyderabad/Telangana", "phone": "7337291961", "website": "https://bhoomihire.in/"},
    {"owner": "Miraitu", "name": "Machinery, drone spraying, borewell, farm services", "description": "Parappana Agrahara, Bengaluru", "phone": "9380306475", "website": "https://www.miraitu.in/"},
    {"owner": "SarvaGram Farm Services", "name": "Cultivator, rotavator, harvester rental", "description": "India", "phone": "8101777555", "website": "https://www.sarvagram.com/farm-services/"},
    {"owner": "GROO Agri", "name": "Tractor, harvester, rotavator, drone, JCB", "description": "India", "phone": "", "website": "https://grooagri.com/"},
    {"owner": "Desinganadu Farmer Producer", "name": "Custom hiring, agricultural drones, machinery", "description": "Kerala", "phone": "", "website": "https://www.desinganadu.in/"},
    {"owner": "KisanDepot / Kerblet", "name": "Tractor, rotavator, sprayer and farm equipment", "description": "India", "phone": "", "website": "https://www.kerblet.com/kisan-depot"}
]

machines = []
for i, d in enumerate(data):
    cat = "tractors"
    name_l = d["name"].lower()
    if "drone" in name_l: cat = "drone"
    elif "harvester" in name_l: cat = "harvester"
    elif "pump" in name_l: cat = "pump"
    elif "weeder" in name_l or "tiller" in name_l: cat = "tiller"
    
    machines.append({
        "id": f"mach-{i+1}",
        "name": d["name"],
        "category": cat,
        "owner": d["owner"],
        "distance_km": round(1.0 + (i * 0.5), 1),
        "phone": d["phone"],
        "description": d["description"],
        "website": d["website"]
    })

file_path = "c:/Users/Narayan Priyadarshi/Desktop/Agriculture-Project/src/components/tabs/RentalsTab.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r'const DEFAULT_20_MACHINES = \[\n.*?\];', re.DOTALL)
replacement = f"const DEFAULT_20_MACHINES = {json.dumps(machines, indent=2)};"

# Additionally, update the UI to use 'website' property instead of 'rent' or 'price'.
# Find the button rendering and update it.
# It's currently:
#               {/* Price Row */}
#               <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: 'auto' }}>
# ...

ui_pattern = re.compile(r'\{\/\* Price Row \*\/\}.*?(?=\<\/div\>\n\n\s*?\);)', re.DOTALL)
ui_replacement = """{/* Contact & Links Row */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {item.phone && (
                    <a href={`tel:${rawPhone}`} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)',
                      borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                    }}>
                      <i className="fa-solid fa-phone"></i> Call
                    </a>
                  )}
                  {item.phone && (
                    <a href={wpLink} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: '#25D366', color: '#fff', border: 'none',
                      borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                    }}>
                      <i className="fa-brands fa-whatsapp"></i> Chat
                    </a>
                  )}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'rgba(16,185,129,0.2)', color: 'var(--primary-light)', border: '1px solid rgba(16,185,129,0.4)',
                      borderRadius: '10px', padding: '10px 0', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                    }}>
                      <i className="fa-solid fa-globe"></i> Website
                    </a>
                  )}
                </div>
              </div>
            </div>"""

new_content = pattern.sub(replacement, content)
new_content = ui_pattern.sub(ui_replacement, new_content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated RentalsTab.jsx")
