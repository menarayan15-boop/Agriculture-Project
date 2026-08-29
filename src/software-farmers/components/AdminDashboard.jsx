import React, { useState, useEffect } from 'react';
import { api } from '../utils/apiSimulator';
import { useLang } from '../i18n/LanguageContext';

export default function AdminDashboard({ dbState }) {
    const { lang } = useLang();
    const STR = {
        title: { en: 'Admin Control Centre', hi: 'प्रशासन नियंत्रण केंद्र', te: 'ప్రాధాన కంట్రోల్ సెంటర్' },
        subtitle: { en: 'Agricultural Officer Dashboard • Role-Based Access', hi: 'कृषि अधिकारी डैशबोर्ड', te: 'వ్యవసాయ అధికారి డాష్బోర్డ్' },
        overview: { en: 'Overview', hi: 'अवलोकन', te: 'అవలోకనం' },
        farmers: { en: 'Farmers', hi: 'किसान', te: 'రైతులు' },
        sensors: { en: 'Sensors', hi: 'सेंसर', te: 'సెన్సార్లు' },
        irrigation: { en: 'Irrigation', hi: 'सिंचाई', te: 'నీటి పారుదల' },
        alerts: { en: 'Alerts', hi: 'चेतावनी', te: 'హెచ్చరికలు' },
        comms: { en: 'Communication', hi: 'संचार', te: 'కమ్యూనికేషన్' }
    };
    const s = (k) => (STR[k] && STR[k][lang]) || (STR[k] && STR[k]['en']) || k;
    const [stats, setStats] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        api.getAdminStats().then(res => setStats(res.stats));
    }, [dbState]);

    const farmers = dbState.registeredFarmers || [];
    const sensors = dbState.sensorDevices || [];
    const events = dbState.irrigationEvents || [];
    const notifications = dbState.notifications || [];
    const diseases = dbState.diseaseAuditLog || [];
    const smsLog = dbState.smsLog || [];
    const sections = [
        { id: 'overview', emoji: '📊', label: s('overview') },
        { id: 'farmers', emoji: '👨‍🌾', label: s('farmers') },
        { id: 'sensors', emoji: '📡', label: s('sensors') },
        { id: 'irrigation', emoji: '💧', label: s('irrigation') },
        { id: 'alerts', emoji: '🔔', label: s('alerts') },
        { id: 'comms', emoji: '📞', label: s('comms') }
    ];

    const sensorStatusColor = (s) => s === 'ONLINE' ? '#4ade80' : s === 'WARNING' ? '#fbbf24' : '#f87171';

    return (
        <div className="admin-dash">
            <div className="admin-header-bar">
                <div>
                    <h2 className="admin-title">🏛️ {s('title')}</h2>
                    <p className="admin-subtitle">{s('subtitle')}</p>
                </div>
                <div className="admin-role-badge">
                    <span className="admin-role-dot" />
                    Admin: Agricultural Officer
                </div>
            </div>

            <div className="admin-section-tabs">
                {sections.map(s => (
                    <button key={s.id} className={`admin-sec-btn ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
                        <span>{s.emoji}</span> {s.label}
                    </button>
                ))}
            </div>

            {activeSection === 'overview' && (
                <div className="admin-grid">
                    {[
                        { emoji: '👨‍🌾', label: 'Registered Farmers', value: stats?.totalFarmers || farmers.length },
                        { emoji: '🌾', label: 'Active Fields', value: stats?.totalFarms || 0 },
                        { emoji: '📡', label: 'IoT Sensors', value: stats?.totalSensors || sensors.length },
                        { emoji: '✅', label: 'Sensors Online', value: stats?.sensorsOnline || 0, color: '#4ade80' },
                        { emoji: '⚠️', label: 'Sensors Warning', value: stats?.sensorsWarning || 0, color: '#fbbf24' },
                        { emoji: '❌', label: 'Sensors Offline', value: stats?.sensorsOffline || 0, color: '#f87171' },
                        { emoji: '💧', label: 'Irrigation Events', value: stats?.irrigationEvents || events.length },
                        { emoji: '🐛', label: 'Disease Alerts', value: stats?.diseaseAlerts || diseases.length },
                        { emoji: '💦', label: 'Water Consumed', value: `${((stats?.waterConsumed || 0) / 1000).toFixed(1)}K L` },
                        { emoji: '💚', label: 'Water Saved', value: `${((stats?.waterSaved || 0) / 1000).toFixed(1)}K L`, color: '#4ade80' },
                        { emoji: '🔔', label: 'Notifications', value: stats?.notifications || notifications.length },
                        { emoji: '🕐', label: 'System Uptime', value: `${dbState.impactMetrics?.systemUptimePercent || 99.2}%`, color: '#4ade80' }
                    ].map((card, i) => (
                        <div key={i} className="admin-stat-card">
                            <div className="admin-stat-emoji">{card.emoji}</div>
                            <div className="admin-stat-value" style={card.color ? { color: card.color } : {}}>{card.value}</div>
                            <div className="admin-stat-label">{card.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {activeSection === 'farmers' && (
                <div className="admin-table-wrap">
                    <h3 className="admin-section-title">👨‍🌾 Farmer Registry</h3>
                    <div className="admin-table">
                        <div className="admin-tr admin-th">
                            <span>ID</span><span>Name</span><span>Village</span><span>State</span><span>Soil</span><span>Fields</span>
                        </div>
                        {farmers.map(f => (
                            <div key={f.id} className="admin-tr">
                                <span className="admin-mono">{f.id}</span>
                                <span style={{ fontWeight: 700 }}>{f.name}</span>
                                <span>{f.village}</span>
                                <span>{f.state}</span>
                                <span>{f.soilType}</span>
                                <span>{f.fields?.length || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'sensors' && (
                <div className="admin-table-wrap">
                    <h3 className="admin-section-title">📡 Sensor Health Monitor</h3>
                    <div className="admin-table">
                        <div className="admin-tr admin-th">
                            <span>Sensor ID</span><span>Type</span><span>Field</span><span>Status</span><span>Battery</span><span>Last Reading</span>
                        </div>
                        {sensors.map(s => (
                            <div key={s.id} className="admin-tr">
                                <span className="admin-mono">{s.id}</span>
                                <span>{s.type}</span>
                                <span>{s.fieldId}</span>
                                <span style={{ color: sensorStatusColor(s.status), fontWeight: 800 }}>● {s.status}</span>
                                <span>{s.battery}%</span>
                                <span>{s.lastReading}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'irrigation' && (
                <div className="admin-table-wrap">
                    <h3 className="admin-section-title">💧 Irrigation Events Log</h3>
                    <div className="admin-table">
                        <div className="admin-tr admin-th">
                            <span>Event ID</span><span>Field</span><span>Time</span><span>Duration</span><span>Water (L)</span><span>Source</span><span>Status</span>
                        </div>
                        {events.map(e => (
                            <div key={e.id} className="admin-tr">
                                <span className="admin-mono">{e.id}</span>
                                <span>{e.fieldId}</span>
                                <span>{e.startTime}</span>
                                <span>{e.duration} min</span>
                                <span>{e.waterUsed} L</span>
                                <span className="admin-source-badge">{e.source}</span>
                                <span style={{ color: '#4ade80', fontWeight: 700 }}>{e.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'alerts' && (
                <div className="admin-table-wrap">
                    <h3 className="admin-section-title">🔔 Notification Centre</h3>
                    <div className="admin-notif-list">
                        {notifications.map(n => (
                            <div key={n.id} className={`admin-notif-card ${n.type} ${n.read ? 'read' : ''}`}>
                                <div className="admin-notif-top">
                                    <span className={`admin-notif-badge ${n.type}`}>
                                        {n.type === 'warning' ? '⚠️' : n.type === 'danger' ? '🚨' : n.type === 'success' ? '✅' : 'ℹ️'} {n.title}
                                    </span>
                                    <span className="admin-notif-time">{n.time}</span>
                                </div>
                                <p className="admin-notif-msg">{n.message}</p>
                                <div className="admin-notif-footer">
                                    <span className="admin-notif-channel">Channel: {n.channel}</span>
                                    {!n.read && <button className="admin-mark-read" onClick={() => api.markNotificationRead(n.id)}>Mark Read</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'comms' && (
                <div className="admin-table-wrap">
                    <h3 className="admin-section-title">📞 Telephony & Messaging Status</h3>

                    <div className="admin-grid mb-6">
                        <div className="admin-stat-card">
                            <div className="admin-stat-emoji">📞</div>
                            <div className="admin-stat-value" style={{ color: '#4ade80' }}>ONLINE</div>
                            <div className="admin-stat-label">IVR Service Gateway</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-emoji">📩</div>
                            <div className="admin-stat-value" style={{ color: '#4ade80' }}>ONLINE</div>
                            <div className="admin-stat-label">SMS Service Gateway</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-emoji">👨‍🌾</div>
                            <div className="admin-stat-value">{farmers.length}</div>
                            <div className="admin-stat-label">Registered Phone Numbers</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-emoji">🗣️</div>
                            <div className="admin-stat-value">EN, HI, TE</div>
                            <div className="admin-stat-label">Active Languages</div>
                        </div>
                    </div>

                    <h3 className="admin-section-title mt-4">📩 Recent SMS Activity</h3>
                    <div className="admin-table mb-6">
                        <div className="admin-tr admin-th">
                            <span>Time</span><span>Sender/Recipient</span><span>Message Extract</span><span>Status</span>
                        </div>
                        {smsLog.slice(-5).reverse().map((s, i) => (
                            <div key={i} className="admin-tr">
                                <span>{s.time}</span>
                                <span className="admin-mono">{s.sender}</span>
                                <span>{s.text.substring(0, 40)}...</span>
                                <span style={{ color: '#4ade80', fontWeight: 600 }}>Delivered</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
