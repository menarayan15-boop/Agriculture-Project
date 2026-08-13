import React, { useState, useEffect } from 'react';
import { fetchProduce, addProduceListing } from '../../services/api';

export function MarketplaceTab() {
  const [produceList, setProduceList] = useState([
    { 
      id: 1, 
      name: "Premium Sharbati Wheat Grade-A", 
      category: "cereal", 
      ask_price: 2650, 
      farmer_name: "Sardar Rajesh Singh", 
      location: "Ludhiana, Punjab", 
      phone: "9811122233", 
      quantity_qtl: 50,
      posted_time: "Today, 9:30 AM"
    },
    { 
      id: 2, 
      name: "Basmati 1121 Paddy Organic Harvest", 
      category: "cereal", 
      ask_price: 4200, 
      farmer_name: "Gurpreet Singh Brar", 
      location: "Karnal, Haryana", 
      phone: "9822233344", 
      quantity_qtl: 80,
      posted_time: "Today, 11:15 AM"
    },
    { 
      id: 3, 
      name: "Organic Yellow Mustard Seed", 
      category: "oilseed", 
      ask_price: 6200, 
      farmer_name: "Mohan Lal Sharma", 
      location: "Sri Ganganagar, Rajasthan", 
      phone: "9833344455", 
      quantity_qtl: 30,
      posted_time: "Yesterday"
    },
    { 
      id: 4, 
      name: "Fresh Red Onions (Nashik Quality)", 
      category: "vegetables", 
      ask_price: 1850, 
      farmer_name: "Ramesh Pawar", 
      location: "Nashik, Maharashtra", 
      phone: "9844455566", 
      quantity_qtl: 120,
      posted_time: "Yesterday"
    },
    { 
      id: 5, 
      name: "Pusa Basmati Rice Grade A", 
      category: "cereal", 
      ask_price: 3400, 
      farmer_name: "Surender Pal Singh", 
      location: "Ambala, Haryana", 
      phone: "9872233300", 
      quantity_qtl: 65,
      posted_time: "2 days ago"
    },
    { 
      id: 6, 
      name: "Organic Desi Chickpeas (Chana)", 
      category: "cereal", 
      ask_price: 5800, 
      farmer_name: "Kailash Chand Verma", 
      location: "Indore, Madhya Pradesh", 
      phone: "9425012345", 
      quantity_qtl: 40,
      posted_time: "2 days ago"
    },
    { 
      id: 7, 
      name: "High-Oil Content Soybean Seeds", 
      category: "oilseed", 
      ask_price: 4700, 
      farmer_name: "Vilasrao Deshmukh", 
      location: "Latur, Maharashtra", 
      phone: "9890011223", 
      quantity_qtl: 150,
      posted_time: "3 days ago"
    },
    { 
      id: 8, 
      name: "Organic Groundnut in Shell", 
      category: "oilseed", 
      ask_price: 6900, 
      farmer_name: "Jethalal Patel", 
      location: "Rajkot, Gujarat", 
      phone: "9979988776", 
      quantity_qtl: 95,
      posted_time: "3 days ago"
    },
    { 
      id: 9, 
      name: "Kashmiri Dry Red Chillies", 
      category: "vegetables", 
      ask_price: 8500, 
      farmer_name: "Chuni Lal Dogra", 
      location: "Solan, Himachal Pradesh", 
      phone: "9816044321", 
      quantity_qtl: 25,
      posted_time: "4 days ago"
    },
    { 
      id: 10, 
      name: "Fresh Nashik Garlic Bulbs", 
      category: "vegetables", 
      ask_price: 9200, 
      farmer_name: "Subhash Patil", 
      location: "Nashik, Maharashtra", 
      phone: "9822133445", 
      quantity_qtl: 35,
      posted_time: "4 days ago"
    },
    { 
      id: 11, 
      name: "Premium Hybrid Maize (Makka)", 
      category: "cereal", 
      ask_price: 2150, 
      farmer_name: "Ramdeo Prasad", 
      location: "Patna, Bihar", 
      phone: "9431055667", 
      quantity_qtl: 110,
      posted_time: "5 days ago"
    },
    { 
      id: 12, 
      name: "Sugar-rich Sugarcane Stalks", 
      category: "cereal", 
      ask_price: 360, 
      farmer_name: "Amit Chaudhary", 
      location: "Meerut, Uttar Pradesh", 
      phone: "9719033445", 
      quantity_qtl: 450,
      posted_time: "5 days ago"
    },
    { 
      id: 13, 
      name: "Himachal Golden Apples (Grade-A)", 
      category: "vegetables", 
      ask_price: 8200, 
      farmer_name: "Rajeshwar Negi", 
      location: "Shimla, Himachal Pradesh", 
      phone: "9817022110", 
      quantity_qtl: 70,
      posted_time: "6 days ago"
    },
    { 
      id: 14, 
      name: "Alphonso Mangoes (Devgad Hapus)", 
      category: "vegetables", 
      ask_price: 12000, 
      farmer_name: "Anant Sawant", 
      location: "Ratnagiri, Maharashtra", 
      phone: "9869033221", 
      quantity_qtl: 45,
      posted_time: "6 days ago"
    },
    { 
      id: 15, 
      name: "Fresh Green Peas (Premium Matar)", 
      category: "vegetables", 
      ask_price: 2800, 
      farmer_name: "Sukhdev Singh", 
      location: "Amritsar, Punjab", 
      phone: "9814455660", 
      quantity_qtl: 55,
      posted_time: "1 week ago"
    },
    { 
      id: 16, 
      name: "High-curcumin Turmeric (Haldi)", 
      category: "oilseed", 
      ask_price: 7800, 
      farmer_name: "Koteswara Rao", 
      location: "Guntur, Andhra Pradesh", 
      phone: "9848011223", 
      quantity_qtl: 85,
      posted_time: "1 week ago"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'cereal',
    askPrice: 2400,
    farmerName: '',
    phone: '',
    quantity: 20,
    location: ''
  });

  useEffect(() => {
    fetchProduce().then(res => {
      if (res && res.success && res.produce && res.produce.length > 0) {
        setProduceList(res.produce);
      }
    });
  }, []);

  const handleAddProduce = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await addProduceListing(formData);
    setSaving(false);

    const newItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      ask_price: formData.askPrice,
      farmer_name: formData.farmerName || "Local Farmer",
      location: formData.location || "Farm Direct",
      phone: formData.phone,
      quantity_qtl: formData.quantity,
      posted_time: "Just now"
    };

    setProduceList([newItem, ...produceList]);
    setModalOpen(false);
    setFormData({ name: '', category: 'cereal', askPrice: 2400, farmerName: '', phone: '', quantity: 20, location: '' });
  };

  const filteredProduce = produceList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="tab-panel active">
      {/* Top Banner Card */}
      <div className="marketplace-header-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(10, 25, 16, 0.95) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '24px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <i className="fa-solid fa-handshake"></i> Direct Farmer-to-Trader Platform
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0 0 6px 0', color: 'white' }}>
            <i className="fa-solid fa-store" style={{ color: '#34d399', marginRight: '10px' }}></i> Direct Farmer Produce Marketplace
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: '0.92rem' }}>
            Sell fresh crops directly to wholesale buyers and traders across India with <strong>zero commission</strong>.
          </p>
        </div>
        
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={() => setModalOpen(true)}
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '12px 22px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
        >
          <i className="fa-solid fa-circle-plus" style={{ fontSize: '1.2rem' }}></i>
          <span>+ Post My Harvest Listing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="marketplace-controls-bar" style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="search-wrapper" style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}></i>
          <input
            type="text"
            className="form-control"
            placeholder="Search crop name, location, or farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', background: 'rgba(10, 24, 17, 0.9)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'white', height: '44px', width: '100%' }}
          />
        </div>

        <div className="category-chips" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Crops' },
            { id: 'cereal', label: 'Grains & Cereals' },
            { id: 'oilseed', label: 'Oilseeds' },
            { id: 'vegetables', label: 'Vegetables & Fruits' }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? '#10b981' : 'rgba(255,255,255,0.06)',
                color: selectedCategory === cat.id ? 'black' : 'white',
                border: selectedCategory === cat.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Cards Grid */}
      <div className="produce-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredProduce.length > 0 ? (
          filteredProduce.map((item) => (
            <div 
              key={item.id} 
              className="produce-card" 
              style={{
                background: 'rgba(10, 25, 16, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'white', margin: '0', flex: 1, paddingRight: '10px' }}>
                    {item.name}
                  </h3>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                    ₹{item.ask_price} / qtl
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-boxes-stacked" style={{ color: '#38bdf8', width: '18px' }}></i>
                    <span><strong>Quantity:</strong> {item.quantity_qtl} Quintals ({item.quantity_qtl * 100} kg)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-user-check" style={{ color: 'var(--primary-light)', width: '18px' }}></i>
                    <span><strong>Farmer:</strong> {item.farmer_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#f87171', width: '18px' }}></i>
                    <span><strong>Location:</strong> {item.location}</span>
                  </div>
                </div>
              </div>

              {/* Direct Action Call Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <a
                  href={`tel:${item.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    textAlign: 'center'
                  }}
                >
                  <i className="fa-solid fa-phone" style={{ fontSize: '1.1rem' }}></i>
                  <span>Call Farmer ({item.phone})</span>
                </a>

                <a
                  href={`https://wa.me/91${item.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'rgba(37, 211, 102, 0.15)',
                    color: '#25D366',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.88rem',
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
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'rgba(10, 24, 17, 0.8)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <i className="fa-solid fa-store-slash" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '12px' }}></i>
            <h3>No produce listings found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search query or post a new produce listing.</p>
          </div>
        )}
      </div>

      {/* Post New Produce Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#0a1910', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <h3 style={{ margin: '0', fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-seedling" style={{ color: '#34d399' }}></i> Post Harvest Produce Listing
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleAddProduce} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Crop / Commodity Title:</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="form-control" 
                  placeholder="e.g. Sharbati Wheat Grade-A" 
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Category:</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ background: '#0a1910', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                  >
                    <option value="cereal">Grains &amp; Cereals</option>
                    <option value="oilseed">Oilseeds</option>
                    <option value="vegetables">Vegetables &amp; Fruits</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Asking Price (₹ / qtl):</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.askPrice} 
                    onChange={e => setFormData({...formData, askPrice: parseInt(e.target.value) || 0})} 
                    className="form-control" 
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Quantity (Quintals):</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} 
                    className="form-control" 
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Farmer Name:</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.farmerName} 
                    onChange={e => setFormData({...formData, farmerName: e.target.value})} 
                    className="form-control" 
                    placeholder="Your name"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Phone Number:</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="form-control" 
                    placeholder="10-digit mobile"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Location / District:</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    className="form-control" 
                    placeholder="e.g. Ludhiana, Punjab"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 14px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {saving ? 'Publishing...' : 'Publish Produce Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
