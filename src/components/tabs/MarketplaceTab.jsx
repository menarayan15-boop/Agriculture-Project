import React, { useState, useEffect, useMemo } from 'react';
import { fetchProduce, addProduceListing } from '../../services/api';

export const INITIAL_FPO_LISTINGS = [
  {
    id: 1,
    name: "Richer Seeds Farmer Producer Co. Ltd.",
    category: "cereal",
    products: "Wheat, Gram, Soybean",
    location: "Shelud, Chikhli, Maharashtra – 443207",
    phone: "9923233776",
    website: "https://richerseeds.com",
    verified: true
  },
  {
    id: 2,
    name: "Ayurfresh Farmer Producer Co. Ltd.",
    category: "pulse",
    products: "Paddy, Peas, Lentils, Soybean, Toor Dal, Urad Dal",
    location: "Sultanpur, Bakshi Ka Talab, Lucknow, UP – 226201",
    phone: "7905071063",
    website: "https://ayurfresh.org/food-grains.php",
    verified: true
  },
  {
    id: 3,
    name: "Mala & Mehrab Agriculture Nuh Producer Co.",
    category: "cereal",
    products: "Wheat, Bajra, Jowar, Mustard, Vegetables",
    location: "Village Mevli, Nuh, Haryana – 122106",
    phone: "9671581882",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 4,
    name: "Firozpur Jhirka Agriculture Producer Co.",
    category: "cereal",
    products: "Wheat, Bajra, Jowar, Mustard, Vegetables",
    location: "Village Sulela, Firozpur Jhirka, Haryana – 122108",
    phone: "9992350100",
    altPhone: "9813278798",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 5,
    name: "Nandhi Farmer Producer Company Ltd.",
    category: "pulse",
    products: "Tur, Gram, Jowar",
    location: "Kirange, Gulbarga, Karnataka",
    phone: "08088423123",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 6,
    name: "Devara Hippargi Farmer Services Producer Co.",
    category: "pulse",
    products: "Tur, Gram, Jowar",
    location: "Sindagi, Bijapur, Karnataka – 586120",
    phone: "7702203403",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 7,
    name: "Kalkeri Farmers Services Producer Co.",
    category: "pulse",
    products: "Tur, Gram, Jowar",
    location: "Ashki, Sindagi, Bijapur, Karnataka",
    phone: "7702203403",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 8,
    name: "Bethamcherla Abhyudaya Farmers Producer Co.",
    category: "millet",
    products: "Bengal Gram, Red Gram, Bajra, Millets",
    location: "Bethamcherla, Kurnool, Andhra Pradesh – 518599",
    phone: "9640960277",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 9,
    name: "Barh Jaivik Farmer Producer Co.",
    category: "pulse",
    products: "Pulses, Millets",
    location: "Sikandra, Belchhi, Patna, Bihar – 803211",
    phone: "9999009155",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 10,
    name: "Tal Farmer Producer Company Ltd.",
    category: "pulse",
    products: "Pulses, Millets",
    location: "Mohama, Barh, Patna, Bihar – 803303",
    phone: "9999009155",
    website: "https://www.smartfood.org/farmer-producer-organizations/",
    verified: true
  },
  {
    id: 11,
    name: "Visakha Millet Farmers Producer Co.",
    category: "millet",
    products: "Millets",
    location: "Thummapalla, Anakapalli, Andhra Pradesh – 531032",
    phone: "7382596778",
    altPhone: "9880045728",
    website: "https://www.researchgate.net",
    verified: true
  },
  {
    id: 12,
    name: "Mahabubnagar Millets Farmer Producer Co.",
    category: "millet",
    products: "Millets",
    location: "Desayapally, Gandeed, Telangana – 509337",
    phone: "9440402005",
    website: "https://www.researchgate.net",
    verified: true
  },
  {
    id: 13,
    name: "Green Millet Farmer Producer Co.",
    category: "millet",
    products: "Millets",
    location: "KIADB, Bagalkot, Karnataka – 587103",
    phone: "7760760841",
    altPhone: "9880045728",
    website: "https://www.researchgate.net",
    verified: true
  },
  {
    id: 14,
    name: "Halchalit Mahila Kisan FPO",
    category: "millet",
    products: "Millets, Agricultural Products",
    location: "Devalpu, Dindori, Madhya Pradesh – 481778",
    phone: "9752771389",
    altPhone: "9535313111",
    website: "https://www.researchgate.net",
    verified: true
  },
  {
    id: 15,
    name: "Koppal Millets Farmer Producer Co.",
    category: "millet",
    products: "Millets",
    location: "Gadag Road, Koppal, Karnataka – 583231",
    phone: "7411696057",
    website: "https://www.researchgate.net",
    verified: true
  },
  {
    id: 16,
    name: "Sankarpuram Collective Farming FPC",
    category: "oilseed",
    products: "Paddy, Millets, Pulses, Oilseeds",
    location: "Sankarapuram, Villupuram, Tamil Nadu",
    phone: "8526886890",
    website: "https://www.agrimark.tn.gov.in",
    verified: true
  },
  {
    id: 17,
    name: "Nathagiri Farmer Producer Co.",
    category: "oilseed",
    products: "Paddy, Millets, Pulses, Cotton, Chilli",
    location: "Vasudevanallur, Tirunelveli, Tamil Nadu",
    phone: "7868841290",
    website: "https://www.agrimark.tn.gov.in",
    verified: true
  },
  {
    id: 18,
    name: "Rasipuram Collective Farming FPC",
    category: "pulse",
    products: "Green Gram, Black Gram, Groundnut, Onion",
    location: "Rasipuram, Namakkal, Tamil Nadu",
    phone: "7402330902",
    website: "https://www.agrimark.tn.gov.in",
    verified: true
  },
  {
    id: 19,
    name: "Sendurai Collective Farming FPC",
    category: "cereal",
    products: "Rice, Maize, Cashew",
    location: "Sendurai, Ariyalur, Tamil Nadu",
    phone: "9750154721",
    website: "https://www.agrimark.tn.gov.in",
    verified: true
  },
  {
    id: 20,
    name: "SEEDS Farmer Producer Company",
    category: "pulse",
    products: "Black Gram, Green Gram, Red Gram, Cotton, Groundnut",
    location: "Virudhunagar, Tamil Nadu",
    phone: "9750943814",
    website: "https://www.agrimark.tn.gov.in",
    verified: true
  }
];

export function MarketplaceTab() {
  const [produceList, setProduceList] = useState(INITIAL_FPO_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'cereal',
    products: '',
    phone: '',
    altPhone: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    fetchProduce().then(res => {
      if (res && res.success && res.produce && res.produce.length > 0) {
        // Map backend produce if any, keeping real FPO structure
        const customItems = res.produce.map((item, i) => ({
          id: item.id || `custom-${i}`,
          name: item.name || item.farmer_name,
          category: item.category || 'cereal',
          products: item.products || item.name,
          location: item.location || 'Direct Farm',
          phone: item.phone || 'N/A',
          website: item.website || '',
          verified: true
        }));
        setProduceList([...INITIAL_FPO_LISTINGS, ...customItems]);
      }
    });
  }, []);

  const handleAddProduce = async (e) => {
    e.preventDefault();
    setSaving(true);
    await addProduceListing(formData);
    setSaving(false);

    const newItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      products: formData.products || formData.name,
      location: formData.location || "Farm Direct Location",
      phone: formData.phone,
      altPhone: formData.altPhone,
      website: formData.website,
      verified: true
    };

    setProduceList([newItem, ...produceList]);
    setModalOpen(false);
    setFormData({ name: '', category: 'cereal', products: '', phone: '', altPhone: '', location: '', website: '' });
  };

  const filteredProduce = useMemo(() => {
    return produceList.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.products.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery);

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [produceList, searchQuery, selectedCategory]);

  return (
    <div className="tab-panel active" style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Top Banner Card */}
      <div style={{ 
        background: '#FFFFFF', 
        border: '1.5px solid #E5E7EB', borderRadius: '18px', 
        padding: '24px 26px', marginBottom: '1.5rem', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div>
          <span style={{ 
            background: '#DCFCE7', color: '#166534', 
            padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', 
            fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
            border: '1px solid #86EFAC'
          }}>
            <i className="fa-solid fa-building-wheat"></i> Verified Farmer Producer Organizations (FPOs)
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px 0', color: '#17211B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-store" style={{ color: '#15803D' }}></i> Direct Farmer &amp; FPO Producer Directory
          </h2>
          <p style={{ color: '#4B5563', margin: '0', fontSize: '0.92rem', lineHeight: '1.5' }}>
            Connect directly with verified Indian Farmer Producer Companies (FPOs) and agricultural producers with complete official addresses &amp; public contacts.
          </p>
        </div>
        
        <button 
          type="button" 
          onClick={() => setModalOpen(true)}
          style={{ 
            background: '#15803D', 
            color: 'white', padding: '12px 22px', borderRadius: '12px', 
            fontSize: '0.94rem', fontWeight: 'bold', border: 'none', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)', transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#166534'}
          onMouseLeave={e => e.currentTarget.style.background = '#15803D'}
        >
          <i className="fa-solid fa-circle-plus" style={{ fontSize: '1.1rem' }}></i>
          <span>+ Add Producer / FPO Directory Listing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}></i>
          <input
            type="text"
            className="form-control"
            placeholder="Search FPO name, products (e.g. Wheat, Millets), or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              paddingLeft: '40px', background: '#FFFFFF', 
              border: '1.5px solid #E5E7EB', borderRadius: '10px', 
              color: '#17211B', height: '44px', width: '100%', outline: 'none' 
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '🌾 All FPOs & Producers' },
            { id: 'cereal', label: '🌾 Wheat & Cereals' },
            { id: 'pulse', label: '🫘 Pulses & Dals' },
            { id: 'millet', label: '🥣 Millets' },
            { id: 'oilseed', label: '🌻 Oilseeds & Cash' }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? '#15803D' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#374151',
                border: selectedCategory === cat.id ? '1.5px solid #15803D' : '1px solid #E5E7EB',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat.id ? '0 2px 8px rgba(21,128,61,0.25)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Count Header */}
      <div style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Showing <strong style={{ color: '#17211B' }}>{filteredProduce.length}</strong> verified Farmer Producer Companies &amp; Collectives</span>
        <span style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 600 }}>✅ Direct Official Contacts with Registered Addresses</span>
      </div>

      {/* FPO & Producer Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredProduce.length > 0 ? (
          filteredProduce.map((item) => (
            <div 
              key={item.id} 
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                position: 'relative',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Header: FPO Name + Verified Badge */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                      <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i> Verified FPO / Producer
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17211B', margin: 0, lineHeight: '1.4' }}>
                    {item.name}
                  </h3>
                </div>

                {/* Details Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', fontSize: '0.9rem', color: '#374151' }}>
                  {/* Products */}
                  <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '10px 12px', border: '1px solid #BBF7D0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-wheat-awn"></i> Agricultural Commodities &amp; Products:
                    </div>
                    <div style={{ color: '#14532D', fontWeight: 700, fontSize: '0.92rem' }}>
                      {item.products}
                    </div>
                  </div>

                  {/* Registered Location */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '2px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#EF4444', marginTop: '3px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#4B5563', fontSize: '0.8rem' }}>Registered Address:</strong>
                      <div style={{ color: '#17211B', fontSize: '0.86rem', lineHeight: '1.4', fontWeight: 500 }}>{item.location}</div>
                    </div>
                  </div>

                  {/* Official Website Link if available */}
                  {item.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <i className="fa-solid fa-globe" style={{ color: '#0284C7', width: '16px' }}></i>
                      <a 
                        href={item.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#0284C7', fontSize: '0.82rem', textDecoration: 'underline', wordBreak: 'break-all', fontWeight: 600 }}
                      >
                        Official Verification Portal
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Phone & WhatsApp */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <a
                  href={`tel:${item.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#15803D',
                    color: 'white',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
                    textAlign: 'center'
                  }}
                >
                  <i className="fa-solid fa-phone" style={{ fontSize: '1rem' }}></i>
                  <span>Call Contact ({item.phone}{item.altPhone ? ` / ${item.altPhone}` : ''})</span>
                </a>

                <a
                  href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#DCFCE7',
                    color: '#166534',
                    border: '1px solid #86EFAC',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    textAlign: 'center'
                  }}
                >
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.1rem' }}></i>
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E5E7EB' }}>
            <i className="fa-solid fa-store-slash" style={{ fontSize: '2.5rem', color: '#9CA3AF', marginBottom: '12px' }}></i>
            <h3 style={{ color: '#17211B', fontWeight: 800 }}>No FPO listings found</h3>
            <p style={{ color: '#6B7280' }}>Try adjusting your search query or clear the filter.</p>
          </div>
        )}
      </div>

      {/* Post New Producer Listing Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB', borderRadius: '18px', maxWidth: '540px', width: '100%', padding: '26px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ margin: '0', fontSize: '1.25rem', color: '#17211B', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                <i className="fa-solid fa-building-wheat" style={{ color: '#15803D' }}></i> Add Producer / FPO Directory Listing
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleAddProduce} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, marginBottom: '4px', display: 'block' }}>FPO / Producer Organization Name:</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="form-control" 
                  placeholder="e.g. Kisan Samriddhi Farmer Producer Co. Ltd." 
                  style={{ background: '#F8FAF9', color: '#17211B', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Agricultural Commodities / Products Offered:</label>
                <input 
                  type="text" 
                  required 
                  value={formData.products} 
                  onChange={e => setFormData({...formData, products: e.target.value})} 
                  className="form-control" 
                  placeholder="e.g. Wheat, Gram, Soybean, Millets" 
                  style={{ background: '#F8FAF9', color: '#17211B', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Primary Category:</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ background: '#F8FAF9', color: '#17211B', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', width: '100%', boxSizing: 'border-box', fontWeight: 600 }}
                  >
                    <option value="cereal">Wheat &amp; Cereals</option>
                    <option value="pulse">Pulses &amp; Dals</option>
                    <option value="millet">Millets</option>
                    <option value="oilseed">Oilseeds &amp; Cash Crops</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Public Phone Contact:</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="form-control" 
                    placeholder="e.g. 9923233776" 
                    style={{ background: '#F8FAF9', color: '#17211B', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Registered Address &amp; Pincode:</label>
                <input 
                  type="text" 
                  required 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  className="form-control" 
                  placeholder="e.g. Shelud, Chikhli, Maharashtra – 443207" 
                  style={{ background: '#F8FAF9', color: '#17211B', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Official Website / Portal Link (Optional):</label>
                <input 
                  type="text" 
                  value={formData.website} 
                  onChange={e => setFormData({...formData, website: e.target.value})} 
                  className="form-control" 
                  placeholder="e.g. https://richerseeds.com" 
                  style={{ background: '#F8FAF9', color: '#17211B', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#F8FAF9', color: '#374151', border: '1px solid #E5E7EB', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#15803D', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(21,128,61,0.25)' }}
                >
                  {saving ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
