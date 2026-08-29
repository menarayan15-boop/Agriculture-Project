import React from 'react';
import { Terminal, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function TerminalLogs({ logs, dbState }) {
    const [activeTab, setActiveTab] = React.useState('logs'); // 'logs' or 'database'

    return (
        <div className="terminal-container">
            <div className="terminal-header">
                <div className="terminal-tabs">
                    <button
                        className={`terminal-tab ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <Terminal size={14} className="icon" />
                        <span>Central API Gateway Logs</span>
                    </button>
                    <button
                        className={`terminal-tab ${activeTab === 'db' ? 'active' : ''}`}
                        onClick={() => setActiveTab('db')}
                    >
                        <Database size={14} className="icon" />
                        <span>Live Central DB State</span>
                    </button>
                </div>
                <div className="gateway-badge">
                    <div className="pulse-indicator"></div>
                    <span>HTTP API Server (Port 80) Live</span>
                </div>
            </div>

            <div className="terminal-body">
                {activeTab === 'logs' ? (
                    <div className="logs-view font-mono">
                        {logs.map((log) => {
                            let colorClass = "log-normal";
                            if (log.type === "API") colorClass = "log-api";
                            if (log.type === "AI_ENGINE") colorClass = "log-ai";
                            if (log.type === "IOT") colorClass = "log-iot";
                            if (log.type === "SMS_GATEWAY") colorClass = "log-sms";
                            if (log.type === "IVR_GATEWAY") colorClass = "log-ivr";

                            return (
                                <div key={log.id} className={`log-entry ${colorClass}`}>
                                    <span className="log-time">[{log.time}]</span>
                                    <span className="log-tag">[{log.type}]</span>
                                    <span className="log-message">{log.message}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="db-view font-mono">
                        <pre className="json-prettify">
                            {JSON.stringify(
                                {
                                    farmer: dbState.farmer,
                                    farm: dbState.farm,
                                    weather: dbState.weather,
                                    aiRecommendationsCount: dbState.aiRecommendations.length
                                },
                                null,
                                2
                            )}
                        </pre>
                    </div>
                )}
            </div>
            <div className="terminal-footer">
                <div className="footer-item">
                    <ShieldAlert size={12} className="footer-icon" />
                    <span>API Protection: JWT Secret Enabled</span>
                </div>
                <div className="footer-item">
                    <Cpu size={12} className="footer-icon" />
                    <span>Processor: ARM Cortex-M4 (Controller) + AWS EC2 Lambda (Backend)</span>
                </div>
            </div>
        </div>
    );
}
