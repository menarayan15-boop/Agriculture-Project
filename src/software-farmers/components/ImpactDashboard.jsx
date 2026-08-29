import React from 'react';

export default function ImpactDashboard({ dbState }) {
    const metrics = dbState.impactMetrics || {};

    const progressValue = (val, max) => Math.min(100, Math.max(0, (val / max) * 100));

    return (
        <div className="impact-dash">
            <div className="impact-header-bar">
                <div>
                    <h2 className="admin-title">🌍 Social & Environmental Impact</h2>
                    <p className="admin-subtitle">SIH Live Measurement Dashboard • Real-world Outcomes</p>
                </div>
                <div className="admin-role-badge">
                    <span className="admin-role-dot" style={{ background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
                    Live SIH Metrics
                </div>
            </div>

            <div className="impact-hero-grid">
                <div className="impact-hero-card water">
                    <div className="ihc-icon">💧</div>
                    <div className="ihc-title">Water Conserved</div>
                    <div className="ihc-value">{metrics.estimatedWaterSavedL?.toLocaleString() || 0} <span>Liters</span></div>
                    <div className="ihc-subtitle">Compared to traditional flood irrigation</div>
                    <div className="ihc-bar-wrap">
                        <div className="ihc-bar" style={{ width: `${progressValue(metrics.estimatedWaterSavedL, 2000)}%`, background: '#3b82f6' }} />
                    </div>
                </div>

                <div className="impact-hero-card yield">
                    <div className="ihc-icon">🌾</div>
                    <div className="ihc-title">Optimum Recommendations</div>
                    <div className="ihc-value">{metrics.cropRecommendationsGiven || 0} <span>Crops</span></div>
                    <div className="ihc-subtitle">Accuracy: {metrics.cropRecommendationAccuracy || 0}% based on feedback</div>
                    <div className="ihc-bar-wrap">
                        <div className="ihc-bar" style={{ width: `${metrics.cropRecommendationAccuracy || 0}%`, background: '#4ade80' }} />
                    </div>
                </div>

                <div className="impact-hero-card economy">
                    <div className="ihc-icon">₹</div>
                    <div className="ihc-title">Estimated Savings</div>
                    <div className="ihc-value">₹{metrics.estimatedInputSavingsINR?.toLocaleString() || 0}</div>
                    <div className="ihc-subtitle">Saved on water, electricity & fertilizer</div>
                    <div className="ihc-bar-wrap">
                        <div className="ihc-bar" style={{ width: `${progressValue(metrics.estimatedInputSavingsINR, 10000)}%`, background: '#f59e0b' }} />
                    </div>
                </div>
            </div>

            <div className="admin-grid" style={{ marginTop: '1.5rem' }}>
                {[
                    { emoji: '⏱️', label: 'Avg Irrigation Duration', value: `${metrics.avgIrrigationDurationMin || 0} min` },
                    { emoji: '🦠', label: 'Disease Detections', value: metrics.diseaseDetections || 0 },
                    { emoji: '🎯', label: 'Detection Accuracy', value: `${metrics.diseaseDetectionAccuracy || 0}%`, color: '#4ade80' },
                    { emoji: '🗣️', label: 'Positive Feedback', value: `${metrics.farmerFeedbackPositive || 0} / ${metrics.farmerFeedbackTotal || 0}` },
                    { emoji: '⚡', label: 'System Uptime', value: `${metrics.systemUptimePercent || 0}%`, color: '#4ade80' },
                    { emoji: '📡', label: 'Sensor Uptime', value: `${metrics.sensorUptimePercent || 0}%`, color: '#4ade80' },
                ].map((card, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className="admin-stat-emoji">{card.emoji}</div>
                        <div className="admin-stat-value" style={card.color ? { color: card.color } : {}}>{card.value}</div>
                        <div className="admin-stat-label">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="impact-footer">
                <p>Data is aggregated anonymously. Metrics highlight the transition to Data-Driven Agriculture.</p>
            </div>
        </div>
    );
}
