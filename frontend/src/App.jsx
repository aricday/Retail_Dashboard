import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import './styles.css';

const API_BASE_DEFAULT = 'http://localhost:3000';

function currency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function useFetchJson(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (active) setData(json);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to fetch data');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, loading };
}

const ACTION_COLORS = {
  REORDER: '#2563eb',
  TRANSFER: '#16a34a',
  SAME_DAY_FULFILLMENT: '#ea580c',
  MONITOR: '#64748b'
};

export default function App() {
  const [apiBase, setApiBase] = useState(API_BASE_DEFAULT);
  const [draftApiBase, setDraftApiBase] = useState(API_BASE_DEFAULT);
  const [styleFilter, setStyleFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi, I’m RETAILNEXT MERCHANDISING AI. Ask me about transfer opportunities, low-stock risk, or what to prioritize today.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const dashboard = useFetchJson(`${apiBase}/v1/dashboard/summary`, [apiBase]);
  const catalog = useFetchJson(`${apiBase}/v1/catalog/items`, [apiBase]);

  const items = catalog.data?.items || [];
  const styleOptions = useMemo(() => ['All', ...new Set(items.map((item) => item.style))], [items]);
  const categoryOptions = useMemo(() => ['All', ...new Set(items.map((item) => item.category))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStyle = styleFilter === 'All' || item.style === styleFilter;
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesAction = actionFilter === 'All' || item.pulse.recommended_action === actionFilter;
      const matchesSearch =
        !searchTerm ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.style.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStyle && matchesCategory && matchesAction && matchesSearch;
    });
  }, [items, styleFilter, categoryFilter, actionFilter, searchTerm]);

  const actionChartData = useMemo(() => {
    const counts = filteredItems.reduce((acc, item) => {
      const key = item.pulse.recommended_action;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([action, count]) => ({ action, count }));
  }, [filteredItems]);

  const styleGrowthData = useMemo(() => {
    const grouped = filteredItems.reduce((acc, item) => {
      const current = acc[item.style] || { style: item.style, totalGrowth: 0, count: 0 };
      current.totalGrowth += item.pulse.week_over_week_growth;
      current.count += 1;
      acc[item.style] = current;
      return acc;
    }, {});
    return Object.values(grouped).map((row) => ({
      styleName: row.style,
      avgGrowth: Number((row.totalGrowth / row.count).toFixed(1))
    }));
  }, [filteredItems]);

  const topTrend = useMemo(() => {
    return [...filteredItems].sort((a, b) => b.pulse.week_over_week_growth - a.pulse.week_over_week_growth)[0];
  }, [filteredItems]);

  const scoreVsStockData = useMemo(() => {
    return filteredItems.map((item) => ({
      name: item.sku,
      pulseScore: item.pulse.pulse_score,
      onHand: item.inventory.on_hand
    }));
  }, [filteredItems]);

  const detailItem = topTrend || filteredItems[0];

  const resetFilters = () => {
    setStyleFilter('All');
    setCategoryFilter('All');
    setActionFilter('All');
    setSearchTerm('');
  };

  const sendChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const nextMessages = [...chatMessages, { role: 'user', content: trimmed }];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);
    setChatError('');

    try {
      const response = await fetch(`${apiBase}/v1/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: 'Midwest',
          messages: nextMessages.slice(-10)
        })
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.detail || json.error || `Request failed: ${response.status}`);
      }

      setChatMessages((messages) => [...messages, { role: 'assistant', content: json.reply || 'No reply returned.' }]);
    } catch (error) {
      setChatError(error.message || 'Unable to connect to assistant.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <div className="eyebrow">RetailNext Pulse Demo</div>
          <h1>Merchandising command center for trend detection, stock risk, and action planning</h1>
          <p className="hero-copy">
            This React dashboard sits on top of a Node.js API layer that simulates Snowflake and BigQuery style
            warehouse queries. Pulse scoring is deterministic, grounded in sample POS, inventory, and catalog data.
          </p>
        </div>
        <div className="config-card">
          <label>API base URL</label>
          <div className="config-row">
            <input value={draftApiBase} onChange={(e) => setDraftApiBase(e.target.value)} />
            <button onClick={() => setApiBase(draftApiBase)}>Connect</button>
          </div>
          <div className="api-status">Connected to: {apiBase}</div>
        </div>
      </header>

      {dashboard.loading || catalog.loading ? (
        <div className="panel">Loading demo data…</div>
      ) : dashboard.error || catalog.error ? (
        <div className="panel error">Unable to load data. {dashboard.error || catalog.error}</div>
      ) : (
        <>
          <section className="kpi-grid">
            <div className="kpi-card">
              <span>Trending SKUs</span>
              <strong>{dashboard.data.kpis.trending_skus}</strong>
            </div>
            <div className="kpi-card">
              <span>Low Stock Risks</span>
              <strong>{dashboard.data.kpis.low_stock_risks}</strong>
            </div>
            <div className="kpi-card">
              <span>Transfer Candidates</span>
              <strong>{dashboard.data.kpis.transfer_candidates}</strong>
            </div>
            <div className="kpi-card">
              <span>Same-Day Opportunities</span>
              <strong>{dashboard.data.kpis.same_day_opportunities}</strong>
            </div>
            <div className="kpi-card accent">
              <span>Average Pulse Score</span>
              <strong>{dashboard.data.kpis.avg_pulse_score}</strong>
            </div>
          </section>

          <section className="filters panel">
            <div className="filters-header">
              <h2>Filters</h2>
              <button className="secondary" onClick={resetFilters}>Reset</button>
            </div>
            <div className="filter-row">
              <div>
                <label>Style</label>
                <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}>
                  {styleOptions.map((style) => <option key={style}>{style}</option>)}
                </select>
              </div>
              <div>
                <label>Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  {categoryOptions.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label>Recommended Action</label>
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                  {['All', 'REORDER', 'TRANSFER', 'SAME_DAY_FULFILLMENT', 'MONITOR'].map((action) => (
                    <option key={action}>{action}</option>
                  ))}
                </select>
              </div>
              <div className="grow">
                <label>Search</label>
                <input
                  placeholder="Search SKU, style, or item name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel chart-panel">
              <div className="panel-header">
                <h2>Average growth by style</h2>
                <span>{filteredItems.length} items in view</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={styleGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="styleName" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgGrowth" fill="#1d4ed8" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel chart-panel">
              <div className="panel-header">
                <h2>Action mix</h2>
                <span>Where Pulse recommends intervention</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={actionChartData} dataKey="count" nameKey="action" cx="50%" cy="50%" outerRadius={92} label>
                    {actionChartData.map((entry) => (
                      <Cell key={entry.action} fill={ACTION_COLORS[entry.action] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel">
              <div className="panel-header">
                <h2>Pulse insights</h2>
                <span>Grounded narrative from structured data</span>
              </div>
              <ul className="insight-list">
                {dashboard.data.insights.map((insight) => <li key={insight}>{insight}</li>)}
              </ul>
              <div className="trust-box">
                <strong>Trust guardrails</strong>
                <div>Deterministic score layer · Scoped API access · Grounded warehouse data</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2>Selected item detail</h2>
                <span>{detailItem ? detailItem.sku : 'No item selected'}</span>
              </div>
              {detailItem ? (
                <>
                  <div className="detail-title">{detailItem.name}</div>
                  <div className="detail-meta">
                    <span>{detailItem.style}</span>
                    <span>{detailItem.category}</span>
                    <span>{currency(detailItem.price)}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={detailItem.daily_sales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="units" stroke="#0f766e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="badge-row">
                    {detailItem.pulse.flags.map((flag) => <span className="badge" key={flag}>{flag}</span>)}
                  </div>
                  <div className="detail-copy">
                    Pulse score <strong>{detailItem.pulse.pulse_score}</strong> with {detailItem.pulse.week_over_week_growth}% growth
                    and {detailItem.inventory.on_hand} units on hand across the Midwest.
                  </div>
                </>
              ) : (
                <div>No item selected.</div>
              )}
            </div>
          </section>

          <section className="panel chat-panel">
            <div className="panel-header">
              <h2>RETAILNEXT MERCHANDISING AI</h2>
              <span>OpenAI-powered assistant embedded in the dashboard</span>
            </div>
            <div className="chat-thread">
              {chatMessages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
                  <strong>{message.role === 'assistant' ? 'Assistant' : 'You'}</strong>
                  <p>{message.content}</p>
                </div>
              ))}
              {chatLoading ? <div className="chat-loading">Thinking…</div> : null}
            </div>
            <div className="chat-input-row">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendChat();
                  }
                }}
                placeholder="Ask: What should I act on today in the Midwest?"
              />
              <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>
                Send
              </button>
            </div>
            {chatError ? <div className="chat-error">{chatError}</div> : null}
          </section>

          <section className="panel table-panel">
            <div className="panel-header">
              <h2>SKU action table</h2>
              <span>Sorted by Pulse score</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Style</th>
                    <th>Growth</th>
                    <th>On Hand</th>
                    <th>Pulse Score</th>
                    <th>Action</th>
                    <th>Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems
                    .sort((a, b) => b.pulse.pulse_score - a.pulse.pulse_score)
                    .map((item) => (
                      <tr key={item.sku}>
                        <td>{item.sku}</td>
                        <td>{item.name}</td>
                        <td>{item.style}</td>
                        <td>{item.pulse.week_over_week_growth}%</td>
                        <td>{item.inventory.on_hand}</td>
                        <td>{item.pulse.pulse_score}</td>
                        <td>
                          <span className="action-chip" style={{ backgroundColor: ACTION_COLORS[item.pulse.recommended_action] || '#64748b' }}>
                            {item.pulse.recommended_action}
                          </span>
                        </td>
                        <td>{item.pulse.flags.join(', ') || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Score vs. stock</h2>
              <span>Useful for technical validation and tuning</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scoreVsStockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pulseScore" fill="#9333ea" isAnimationActive={false} />
                <Bar dataKey="onHand" fill="#10b981" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </>
      )}
    </div>
  );
}
