const http = require('http');
const { URL } = require('url');

const stores = [
  {
    "store_id": "MSP01",
    "name": "Minneapolis Uptown",
    "city": "Minneapolis",
    "state": "MN",
    "region": "Midwest"
  },
  {
    "store_id": "MSP02",
    "name": "St. Paul Grand",
    "city": "St. Paul",
    "state": "MN",
    "region": "Midwest"
  },
  {
    "store_id": "CHI01",
    "name": "Chicago Loop",
    "city": "Chicago",
    "state": "IL",
    "region": "Midwest"
  },
  {
    "store_id": "STL01",
    "name": "St. Louis Central West End",
    "city": "St. Louis",
    "state": "MO",
    "region": "Midwest"
  },
  {
    "store_id": "KCY01",
    "name": "Kansas City Plaza",
    "city": "Kansas City",
    "state": "MO",
    "region": "Midwest"
  },
  {
    "store_id": "IND01",
    "name": "Indianapolis North",
    "city": "Indianapolis",
    "state": "IN",
    "region": "Midwest"
  }
];

const items = [
  {
    "sku": "RN-1001",
    "name": "Heritage Cable Cardigan",
    "category": "Knitwear",
    "style": "Eclectic Grandpa",
    "price": 84.99,
    "color": "Oatmeal",
    "attributes": [
      "chunky",
      "heritage",
      "layering"
    ],
    "gender": "Unisex",
    "season": "Spring"
  },
  {
    "sku": "RN-1002",
    "name": "Patchwork Crew Sweater",
    "category": "Knitwear",
    "style": "Eclectic Grandpa",
    "price": 69.99,
    "color": "Multi",
    "attributes": [
      "patchwork",
      "soft-hand",
      "statement"
    ],
    "gender": "Unisex",
    "season": "Spring"
  },
  {
    "sku": "RN-1003",
    "name": "Relaxed Utility Chore Jacket",
    "category": "Outerwear",
    "style": "Utility Heritage",
    "price": 109.99,
    "color": "Olive",
    "attributes": [
      "utility",
      "layering",
      "canvas"
    ],
    "gender": "Unisex",
    "season": "Spring"
  },
  {
    "sku": "RN-1004",
    "name": "Wide-Leg Carpenter Jean",
    "category": "Denim",
    "style": "Workwear Revival",
    "price": 78.99,
    "color": "Indigo",
    "attributes": [
      "wide-leg",
      "utility",
      "durable"
    ],
    "gender": "Women",
    "season": "Spring"
  },
  {
    "sku": "RN-1005",
    "name": "Boxy Cropped Tee",
    "category": "Tops",
    "style": "Indie Sleaze 2.0",
    "price": 29.99,
    "color": "Black",
    "attributes": [
      "boxy",
      "cropped",
      "washed"
    ],
    "gender": "Women",
    "season": "All"
  },
  {
    "sku": "RN-1006",
    "name": "Quiet Luxe Tailored Trouser",
    "category": "Bottoms",
    "style": "Quiet Luxury",
    "price": 94.99,
    "color": "Camel",
    "attributes": [
      "tailored",
      "premium",
      "neutral"
    ],
    "gender": "Women",
    "season": "All"
  },
  {
    "sku": "RN-1007",
    "name": "Soft Touch Polo Sweater",
    "category": "Knitwear",
    "style": "Quiet Prep",
    "price": 64.99,
    "color": "Navy",
    "attributes": [
      "prep",
      "soft",
      "polished"
    ],
    "gender": "Men",
    "season": "Spring"
  },
  {
    "sku": "RN-1008",
    "name": "Oversized Barn Jacket",
    "category": "Outerwear",
    "style": "Workwear Revival",
    "price": 119.99,
    "color": "Tan",
    "attributes": [
      "oversized",
      "workwear",
      "canvas"
    ],
    "gender": "Unisex",
    "season": "Spring"
  },
  {
    "sku": "RN-1009",
    "name": "Pleated Mini Skirt",
    "category": "Bottoms",
    "style": "Quiet Prep",
    "price": 54.99,
    "color": "Stone",
    "attributes": [
      "pleated",
      "prep",
      "mini"
    ],
    "gender": "Women",
    "season": "Spring"
  },
  {
    "sku": "RN-1010",
    "name": "Washed Mesh Layer Top",
    "category": "Tops",
    "style": "Indie Sleaze 2.0",
    "price": 39.99,
    "color": "Smoke",
    "attributes": [
      "mesh",
      "layering",
      "sheer"
    ],
    "gender": "Women",
    "season": "Spring"
  },
  {
    "sku": "RN-1011",
    "name": "Chunky Wool Grandpa Cardigan",
    "category": "Knitwear",
    "style": "Eclectic Grandpa",
    "price": 89.99,
    "color": "Heather Brown",
    "attributes": [
      "chunky",
      "oversized",
      "heritage"
    ],
    "gender": "Unisex",
    "season": "Spring"
  },
  {
    "sku": "RN-1012",
    "name": "Relaxed Fit Carpenter Denim",
    "category": "Denim",
    "style": "Workwear Revival",
    "price": 74.99,
    "color": "Vintage Blue",
    "attributes": [
      "relaxed",
      "utility",
      "durable"
    ],
    "gender": "Men",
    "season": "Spring"
  },
  {
    "sku": "RN-1013",
    "name": "Minimalist Tailored Blazer",
    "category": "Outerwear",
    "style": "Quiet Luxury",
    "price": 129.99,
    "color": "Soft Black",
    "attributes": [
      "tailored",
      "neutral",
      "premium"
    ],
    "gender": "Women",
    "season": "All"
  }
];

const inventoryMap = {
  "RN-1001": {
    "MSP01": 14,
    "MSP02": 10,
    "CHI01": 16,
    "STL01": 9,
    "KCY01": 8,
    "IND01": 7
  },
  "RN-1002": {
    "MSP01": 9,
    "MSP02": 8,
    "CHI01": 11,
    "STL01": 7,
    "KCY01": 6,
    "IND01": 5
  },
  "RN-1003": {
    "MSP01": 12,
    "MSP02": 11,
    "CHI01": 10,
    "STL01": 13,
    "KCY01": 9,
    "IND01": 8
  },
  "RN-1004": {
    "MSP01": 8,
    "MSP02": 10,
    "CHI01": 12,
    "STL01": 18,
    "KCY01": 13,
    "IND01": 9
  },
  "RN-1005": {
    "MSP01": 15,
    "MSP02": 12,
    "CHI01": 14,
    "STL01": 10,
    "KCY01": 11,
    "IND01": 8
  },
  "RN-1006": {
    "MSP01": 7,
    "MSP02": 9,
    "CHI01": 10,
    "STL01": 12,
    "KCY01": 8,
    "IND01": 7
  },
  "RN-1007": {
    "MSP01": 13,
    "MSP02": 11,
    "CHI01": 9,
    "STL01": 6,
    "KCY01": 7,
    "IND01": 8
  },
  "RN-1008": {
    "MSP01": 9,
    "MSP02": 8,
    "CHI01": 10,
    "STL01": 14,
    "KCY01": 9,
    "IND01": 7
  },
  "RN-1009": {
    "MSP01": 11,
    "MSP02": 10,
    "CHI01": 9,
    "STL01": 8,
    "KCY01": 7,
    "IND01": 6
  },
  "RN-1010": {
    "MSP01": 12,
    "MSP02": 13,
    "CHI01": 11,
    "STL01": 8,
    "KCY01": 9,
    "IND01": 7
  },
  "RN-1011": {
    "MSP01": 2,
    "MSP02": 1,
    "CHI01": 5,
    "STL01": 4,
    "KCY01": 3,
    "IND01": 2
  },
  "RN-1012": {
    "MSP01": 3,
    "MSP02": 2,
    "CHI01": 7,
    "STL01": 28,
    "KCY01": 16,
    "IND01": 5
  },
  "RN-1013": {
    "MSP01": 0,
    "MSP02": 4,
    "CHI01": 12,
    "STL01": 6,
    "KCY01": 3,
    "IND01": 2
  }
};

const inTransitMap = {
  "RN-1011": {
    "MSP01": 0,
    "MSP02": 0,
    "CHI01": 2,
    "STL01": 0,
    "KCY01": 0,
    "IND01": 0
  },
  "RN-1012": {
    "MSP01": 0,
    "MSP02": 0,
    "CHI01": 0,
    "STL01": 4,
    "KCY01": 0,
    "IND01": 0
  },
  "RN-1013": {
    "MSP01": 0,
    "MSP02": 1,
    "CHI01": 0,
    "STL01": 0,
    "KCY01": 0,
    "IND01": 0
  }
};

const trendSpecs = {
  "RN-1001": {
    "prev": 48,
    "curr": 62
  },
  "RN-1002": {
    "prev": 36,
    "curr": 41
  },
  "RN-1003": {
    "prev": 34,
    "curr": 46
  },
  "RN-1004": {
    "prev": 40,
    "curr": 54
  },
  "RN-1005": {
    "prev": 44,
    "curr": 39
  },
  "RN-1006": {
    "prev": 32,
    "curr": 37
  },
  "RN-1007": {
    "prev": 29,
    "curr": 33
  },
  "RN-1008": {
    "prev": 28,
    "curr": 42
  },
  "RN-1009": {
    "prev": 31,
    "curr": 29
  },
  "RN-1010": {
    "prev": 30,
    "curr": 35
  },
  "RN-1011": {
    "prev": 26,
    "curr": 36
  },
  "RN-1012": {
    "prev": 41,
    "curr": 50
  },
  "RN-1013": {
    "prev": 20,
    "curr": 23
  }
};

const dailySales = {
  "RN-1001": [
    {
      "date": "2026-03-26",
      "units": 8
    },
    {
      "date": "2026-03-27",
      "units": 8
    },
    {
      "date": "2026-03-28",
      "units": 9
    },
    {
      "date": "2026-03-29",
      "units": 9
    },
    {
      "date": "2026-03-30",
      "units": 9
    },
    {
      "date": "2026-03-31",
      "units": 9
    },
    {
      "date": "2026-04-01",
      "units": 10
    }
  ],
  "RN-1002": [
    {
      "date": "2026-03-26",
      "units": 5
    },
    {
      "date": "2026-03-27",
      "units": 5
    },
    {
      "date": "2026-03-28",
      "units": 6
    },
    {
      "date": "2026-03-29",
      "units": 6
    },
    {
      "date": "2026-03-30",
      "units": 6
    },
    {
      "date": "2026-03-31",
      "units": 6
    },
    {
      "date": "2026-04-01",
      "units": 7
    }
  ],
  "RN-1003": [
    {
      "date": "2026-03-26",
      "units": 6
    },
    {
      "date": "2026-03-27",
      "units": 6
    },
    {
      "date": "2026-03-28",
      "units": 6
    },
    {
      "date": "2026-03-29",
      "units": 6
    },
    {
      "date": "2026-03-30",
      "units": 7
    },
    {
      "date": "2026-03-31",
      "units": 7
    },
    {
      "date": "2026-04-01",
      "units": 8
    }
  ],
  "RN-1004": [
    {
      "date": "2026-03-26",
      "units": 7
    },
    {
      "date": "2026-03-27",
      "units": 7
    },
    {
      "date": "2026-03-28",
      "units": 8
    },
    {
      "date": "2026-03-29",
      "units": 8
    },
    {
      "date": "2026-03-30",
      "units": 8
    },
    {
      "date": "2026-03-31",
      "units": 8
    },
    {
      "date": "2026-04-01",
      "units": 8
    }
  ],
  "RN-1005": [
    {
      "date": "2026-03-26",
      "units": 5
    },
    {
      "date": "2026-03-27",
      "units": 5
    },
    {
      "date": "2026-03-28",
      "units": 5
    },
    {
      "date": "2026-03-29",
      "units": 5
    },
    {
      "date": "2026-03-30",
      "units": 6
    },
    {
      "date": "2026-03-31",
      "units": 6
    },
    {
      "date": "2026-04-01",
      "units": 7
    }
  ],
  "RN-1006": [
    {
      "date": "2026-03-26",
      "units": 5
    },
    {
      "date": "2026-03-27",
      "units": 5
    },
    {
      "date": "2026-03-28",
      "units": 5
    },
    {
      "date": "2026-03-29",
      "units": 5
    },
    {
      "date": "2026-03-30",
      "units": 5
    },
    {
      "date": "2026-03-31",
      "units": 6
    },
    {
      "date": "2026-04-01",
      "units": 6
    }
  ],
  "RN-1007": [
    {
      "date": "2026-03-26",
      "units": 4
    },
    {
      "date": "2026-03-27",
      "units": 4
    },
    {
      "date": "2026-03-28",
      "units": 5
    },
    {
      "date": "2026-03-29",
      "units": 5
    },
    {
      "date": "2026-03-30",
      "units": 5
    },
    {
      "date": "2026-03-31",
      "units": 5
    },
    {
      "date": "2026-04-01",
      "units": 5
    }
  ],
  "RN-1008": [
    {
      "date": "2026-03-26",
      "units": 5
    },
    {
      "date": "2026-03-27",
      "units": 6
    },
    {
      "date": "2026-03-28",
      "units": 6
    },
    {
      "date": "2026-03-29",
      "units": 6
    },
    {
      "date": "2026-03-30",
      "units": 6
    },
    {
      "date": "2026-03-31",
      "units": 6
    },
    {
      "date": "2026-04-01",
      "units": 7
    }
  ],
  "RN-1009": [
    {
      "date": "2026-03-26",
      "units": 4
    },
    {
      "date": "2026-03-27",
      "units": 4
    },
    {
      "date": "2026-03-28",
      "units": 4
    },
    {
      "date": "2026-03-29",
      "units": 4
    },
    {
      "date": "2026-03-30",
      "units": 4
    },
    {
      "date": "2026-03-31",
      "units": 4
    },
    {
      "date": "2026-04-01",
      "units": 5
    }
  ],
  "RN-1010": [
    {
      "date": "2026-03-26",
      "units": 4
    },
    {
      "date": "2026-03-27",
      "units": 5
    },
    {
      "date": "2026-03-28",
      "units": 5
    },
    {
      "date": "2026-03-29",
      "units": 5
    },
    {
      "date": "2026-03-30",
      "units": 5
    },
    {
      "date": "2026-03-31",
      "units": 5
    },
    {
      "date": "2026-04-01",
      "units": 6
    }
  ],
  "RN-1011": [
    {
      "date": "2026-03-26",
      "units": 4
    },
    {
      "date": "2026-03-27",
      "units": 5
    },
    {
      "date": "2026-03-28",
      "units": 5
    },
    {
      "date": "2026-03-29",
      "units": 5
    },
    {
      "date": "2026-03-30",
      "units": 5
    },
    {
      "date": "2026-03-31",
      "units": 6
    },
    {
      "date": "2026-04-01",
      "units": 6
    }
  ],
  "RN-1012": [
    {
      "date": "2026-03-26",
      "units": 6
    },
    {
      "date": "2026-03-27",
      "units": 7
    },
    {
      "date": "2026-03-28",
      "units": 7
    },
    {
      "date": "2026-03-29",
      "units": 7
    },
    {
      "date": "2026-03-30",
      "units": 7
    },
    {
      "date": "2026-03-31",
      "units": 8
    },
    {
      "date": "2026-04-01",
      "units": 8
    }
  ],
  "RN-1013": [
    {
      "date": "2026-03-26",
      "units": 3
    },
    {
      "date": "2026-03-27",
      "units": 3
    },
    {
      "date": "2026-03-28",
      "units": 3
    },
    {
      "date": "2026-03-29",
      "units": 3
    },
    {
      "date": "2026-03-30",
      "units": 3
    },
    {
      "date": "2026-03-31",
      "units": 4
    },
    {
      "date": "2026-04-01",
      "units": 4
    }
  ]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function inventoryBySku(sku) {
  const onHand = inventoryMap[sku] || {};
  const inTransit = inTransitMap[sku] || {};
  return stores.map((store) => {
    const on_hand = onHand[store.store_id] || 0;
    const in_transit = inTransit[store.store_id] || 0;
    return {
      ...store,
      sku,
      on_hand,
      in_transit,
      reserved: Math.max(0, Math.floor(on_hand * 0.1)),
      same_day_eligible: on_hand > 0 && ['MSP02', 'CHI01', 'STL01'].includes(store.store_id)
    };
  });
}

function aggregateInventory(sku, region = 'Midwest') {
  const records = inventoryBySku(sku).filter((row) => row.region === region);
  const on_hand = records.reduce((sum, row) => sum + row.on_hand, 0);
  const in_transit = records.reduce((sum, row) => sum + row.in_transit, 0);
  return { on_hand, in_transit, stores: records };
}

function growthPct(sku) {
  const prev = trendSpecs[sku].prev;
  const curr = trendSpecs[sku].curr;
  return round(((curr - prev) / prev) * 100, 1);
}

function nearbyStoreForSameDay(sku, preferredStore = 'MSP01') {
  const records = inventoryBySku(sku);
  const candidate = records
    .filter((r) => r.store_id !== preferredStore && r.same_day_eligible && r.on_hand > 0)
    .sort((a, b) => b.on_hand - a.on_hand)[0];
  return candidate || null;
}

function computePulse(item, region = 'Midwest') {
  const inv = aggregateInventory(item.sku, region);
  const currentWeekUnits = trendSpecs[item.sku].curr;
  const prevWeekUnits = trendSpecs[item.sku].prev;
  const growth = growthPct(item.sku);
  const totalOnHand = inv.on_hand;
  const avgOnHandPerStore = totalOnHand / Math.max(inv.stores.length, 1);
  const lowStockScore = clamp((8 - avgOnHandPerStore) / 8, 0, 1) * 100;
  const demandScore = clamp((growth + 10) / 50, 0, 1) * 100;
  const storeStocks = inv.stores.map((s) => s.on_hand);
  const maxStock = Math.max(...storeStocks);
  const minStock = Math.min(...storeStocks);
  const imbalanceScore = clamp((maxStock - minStock) / 25, 0, 1) * 100;
  const sameDayCandidate = inv.stores.some((s) => s.on_hand === 0) && inv.stores.some((s) => s.same_day_eligible && s.on_hand > 0);
  const fulfillScore = sameDayCandidate ? 100 : 35;
  const score = round(
    demandScore * 0.45 +
      lowStockScore * 0.25 +
      imbalanceScore * 0.20 +
      fulfillScore * 0.10,
    1
  );

  const flags = [];
  let recommended_action = 'MONITOR';

  if (item.sku === 'RN-1011' || (growth >= 25 && avgOnHandPerStore <= 4)) {
    flags.push('LOW_STOCK', 'TRENDING');
    recommended_action = 'REORDER';
  }

  if (item.sku === 'RN-1012' || (imbalanceScore >= 65 && growth >= 15)) {
    flags.push('TRANSFER_OPPORTUNITY');
    recommended_action = 'TRANSFER';
  }

  if (item.sku === 'RN-1013' || sameDayCandidate) {
    flags.push('SAME_DAY_ELIGIBLE');
    if (recommended_action === 'MONITOR') {
      recommended_action = 'SAME_DAY_FULFILLMENT';
    }
  }

  if (growth >= 20 && !flags.includes('TRENDING')) {
    flags.push('TRENDING');
  }

  const reasons = [];
  if (growth >= 20) reasons.push(`Demand is up ${growth}% week over week.`);
  if (avgOnHandPerStore <= 4) reasons.push('Regional stock is running lean.');
  if (imbalanceScore >= 65) reasons.push('Store inventory is unevenly distributed.');
  if (sameDayCandidate) reasons.push('Nearby stores can save the sale through same-day fulfillment.');

  const sameDay = item.sku === 'RN-1013' ? nearbyStoreForSameDay(item.sku, 'MSP01') : null;

  return {
    sku: item.sku,
    pulse_score: score,
    current_week_units: currentWeekUnits,
    previous_week_units: prevWeekUnits,
    week_over_week_growth: growth,
    on_hand_units: totalOnHand,
    avg_on_hand_per_store: round(avgOnHandPerStore, 1),
    flags,
    recommended_action,
    reasons,
    nearby_same_day_store: sameDay
      ? {
          store_id: sameDay.store_id,
          name: sameDay.name,
          on_hand: sameDay.on_hand
        }
      : null
  };
}

function enrichItem(item, region = 'Midwest') {
  return {
    ...item,
    inventory: aggregateInventory(item.sku, region),
    pulse: computePulse(item, region),
    daily_sales: dailySales[item.sku]
  };
}

function summary(region = 'Midwest') {
  const enriched = items.map((item) => enrichItem(item, region));
  const topAlerts = enriched
    .filter((item) => item.pulse.recommended_action !== 'MONITOR')
    .sort((a, b) => b.pulse.pulse_score - a.pulse.pulse_score)
    .slice(0, 5);

  const styleSummary = [...new Set(items.map((item) => item.style))]
    .map((style) => {
      const styleItems = enriched.filter((item) => item.style === style);
      const avgGrowth = styleItems.reduce((sum, item) => sum + item.pulse.week_over_week_growth, 0) / styleItems.length;
      const avgScore = styleItems.reduce((sum, item) => sum + item.pulse.pulse_score, 0) / styleItems.length;
      const totalOnHand = styleItems.reduce((sum, item) => sum + item.inventory.on_hand, 0);
      return {
        style,
        sku_count: styleItems.length,
        avg_growth: round(avgGrowth, 1),
        avg_pulse_score: round(avgScore, 1),
        total_on_hand: totalOnHand
      };
    })
    .sort((a, b) => b.avg_growth - a.avg_growth);

  const categorySummary = [...new Set(items.map((item) => item.category))].map((category) => {
    const categoryItems = enriched.filter((item) => item.category === category);
    return {
      category,
      avg_growth: round(categoryItems.reduce((sum, item) => sum + item.pulse.week_over_week_growth, 0) / categoryItems.length, 1),
      total_on_hand: categoryItems.reduce((sum, item) => sum + item.inventory.on_hand, 0),
      actions: categoryItems.reduce((sum, item) => sum + (item.pulse.recommended_action !== 'MONITOR' ? 1 : 0), 0)
    };
  });

  const kpis = {
    trending_skus: enriched.filter((item) => item.pulse.flags.includes('TRENDING')).length,
    low_stock_risks: enriched.filter((item) => item.pulse.flags.includes('LOW_STOCK')).length,
    transfer_candidates: enriched.filter((item) => item.pulse.recommended_action === 'TRANSFER').length,
    same_day_opportunities: enriched.filter((item) => item.pulse.flags.includes('SAME_DAY_ELIGIBLE')).length,
    avg_pulse_score: round(enriched.reduce((sum, item) => sum + item.pulse.pulse_score, 0) / enriched.length, 1)
  };

  const insights = [
    'Eclectic Grandpa knitwear is accelerating in Minneapolis and St. Paul, with stockout risk on RN-1011.',
    'Workwear Revival denim is overstocked in St. Louis and Kansas City relative to Minneapolis demand.',
    'Quiet Luxury blazers can recover otherwise lost sales through same-day fulfillment from nearby stores.'
  ];

  return {
    region,
    generated_at: '2026-04-01T10:00:00-05:00',
    meta: {
      source: 'simulated-snowflake-warehouse',
      model_guardrails: ['grounded-on-enterprise-data', 'deterministic-score-layer', 'scoped-api-access']
    },
    kpis,
    style_summary: styleSummary,
    category_summary: categorySummary,
    top_alerts: topAlerts,
    insights
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(payload, null, 2));
}

function notFound(res) {
  sendJson(res, 404, { error: 'Not found' });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Payload too large'));
        req.socket.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function buildAssistantPrompt(region = 'Midwest') {
  const dashboard = summary(region);
  const topAlerts = dashboard.top_alerts
    .slice(0, 3)
    .map((item) => `${item.sku} (${item.style}) -> ${item.pulse.recommended_action}, score ${item.pulse.pulse_score}`)
    .join('; ');

  return [
    'You are RETAILNEXT MERCHANDISING AI for a retail operations dashboard.',
    'Be concise, actionable, and grounded in the provided data context.',
    'When relevant, recommend one of: REORDER, TRANSFER, SAME_DAY_FULFILLMENT, MONITOR.',
    'If data is missing, state that clearly instead of guessing.',
    `Region in scope: ${region}.`,
    `Current top alerts: ${topAlerts || 'No active alerts.'}`
  ].join(' ');
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((msg) => msg && typeof msg.content === 'string')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content.trim()
    }))
    .filter((msg) => msg.content.length > 0)
    .slice(-10);
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === 'string' && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  if (!Array.isArray(responseJson.output)) return '';
  const chunks = [];
  for (const item of responseJson.output) {
    if (!Array.isArray(item.content)) continue;
    for (const part of item.content) {
      if (typeof part.text === 'string') chunks.push(part.text);
    }
  }
  return chunks.join('\n').trim();
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    });
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;

  try {
    if (req.method === 'GET' && pathname === '/v1/health') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'RetailNext Pulse Demo API',
        warehouse: 'Snowflake / BigQuery (simulated)',
        timestamp: '2026-04-01T10:00:00-05:00'
      });
    }

    if (req.method === 'GET' && pathname === '/v1/catalog/styles') {
      const styles = [...new Set(items.map((item) => item.style))].map((style) => {
        const styleItems = items.filter((item) => item.style === style);
        return {
          style,
          sku_count: styleItems.length,
          categories: [...new Set(styleItems.map((item) => item.category))]
        };
      });
      return sendJson(res, 200, { region: 'Midwest', styles });
    }

    if (req.method === 'GET' && pathname === '/v1/catalog/items') {
      const region = url.searchParams.get('region') || 'Midwest';
      const style = (url.searchParams.get('style') || '').toLowerCase();
      const category = (url.searchParams.get('category') || '').toLowerCase();
      const action = (url.searchParams.get('action') || '').toUpperCase();
      const search = (url.searchParams.get('search') || '').toLowerCase();

      let enriched = items.map((item) => enrichItem(item, region));

      if (style) enriched = enriched.filter((item) => item.style.toLowerCase() === style);
      if (category) enriched = enriched.filter((item) => item.category.toLowerCase() === category);
      if (action) enriched = enriched.filter((item) => item.pulse.recommended_action === action);
      if (search) {
        enriched = enriched.filter((item) =>
          item.sku.toLowerCase().includes(search) ||
          item.name.toLowerCase().includes(search) ||
          item.style.toLowerCase().includes(search)
        );
      }

      return sendJson(res, 200, {
        region,
        count: enriched.length,
        items: enriched.sort((a, b) => b.pulse.pulse_score - a.pulse.pulse_score)
      });
    }

    if (req.method === 'GET' && pathname === '/v1/catalog/item-detail') {
      const region = url.searchParams.get('region') || 'Midwest';
      const sku = url.searchParams.get('sku');
      const item = items.find((entry) => entry.sku === sku);
      if (!item) return sendJson(res, 404, { error: 'SKU not found' });
      return sendJson(res, 200, enrichItem(item, region));
    }

    if (req.method === 'GET' && pathname === '/v1/inventory/store') {
      const storeId = url.searchParams.get('store_id') || 'MSP01';
      const store = stores.find((entry) => entry.store_id === storeId);
      if (!store) return sendJson(res, 404, { error: 'Store not found' });

      const inventory = items.map((item) => {
        const record = inventoryBySku(item.sku).find((row) => row.store_id === storeId);
        return {
          sku: item.sku,
          name: item.name,
          category: item.category,
          style: item.style,
          on_hand: record.on_hand,
          in_transit: record.in_transit,
          pulse_score: computePulse(item).pulse_score
        };
      });

      return sendJson(res, 200, { store, inventory });
    }

    if (req.method === 'GET' && pathname === '/v1/inventory/snapshot') {
      const region = url.searchParams.get('region') || 'Midwest';
      const snapshot = items.map((item) => {
        const inv = aggregateInventory(item.sku, region);
        return {
          sku: item.sku,
          name: item.name,
          style: item.style,
          region,
          on_hand_units: inv.on_hand,
          in_transit_units: inv.in_transit,
          stores: inv.stores.map((store) => {
            return {
              store_id: store.store_id,
              city: store.city,
              on_hand: store.on_hand,
              in_transit: store.in_transit,
              same_day_eligible: store.same_day_eligible
            };
          })
        };
      });
      return sendJson(res, 200, { region, snapshot });
    }

    if (req.method === 'GET' && pathname === '/v1/sales/trends/viral') {
      const region = url.searchParams.get('region') || 'Midwest';
      const windowDays = Number(url.searchParams.get('window_days') || 7);
      const trends = items
        .map((item) => {
          const pulse = computePulse(item, region);
          return {
            sku: item.sku,
            name: item.name,
            style: item.style,
            category: item.category,
            signal: pulse.week_over_week_growth >= 20 ? 'SPIKING' : (pulse.week_over_week_growth >= 10 ? 'RISING' : 'STABLE'),
            growth: pulse.week_over_week_growth,
            velocity_score: round(clamp((pulse.current_week_units / 60) * 100, 0, 100), 1),
            window_days: windowDays
          };
        })
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 10);

      return sendJson(res, 200, { region, window_days: windowDays, trends });
    }

    if (req.method === 'POST' && pathname === '/v1/analytics/pulse/query') {
      const body = await parseBody(req);
      const region = body.region || 'Midwest';
      const question = (body.question || '').toLowerCase();
      const enriched = items.map((item) => enrichItem(item, region));

      let matches = enriched.filter((item) => item.pulse.recommended_action !== 'MONITOR');
      let narrative = 'Pulse reviewed POS sales, inventory, and catalog attributes to prioritize the highest-value actions.';

      if (question.includes('transfer')) {
        matches = enriched.filter((item) => item.pulse.recommended_action === 'TRANSFER');
        narrative = 'Transfer opportunities are concentrated where demand is stronger in Minneapolis than the current stock mix in St. Louis and Kansas City.';
      } else if (question.includes('stock') || question.includes('risk')) {
        matches = enriched.filter((item) => item.pulse.flags.includes('LOW_STOCK'));
        narrative = 'Low-stock alerts are driven by rising weekly demand paired with lean regional inventory.';
      } else if (question.includes('same day') || question.includes('fulfillment')) {
        matches = enriched.filter((item) => item.pulse.flags.includes('SAME_DAY_ELIGIBLE'));
        narrative = 'Same-day opportunities are created when a local store is out of stock but a nearby eligible store can fulfill the order.';
      } else if (question.includes('eclectic')) {
        matches = enriched.filter((item) => item.style === 'Eclectic Grandpa');
        narrative = 'Eclectic Grandpa is the fastest-moving style cluster in the Midwest sample, led by knitwear and heritage layering.';
      }

      matches = matches.sort((a, b) => b.pulse.pulse_score - a.pulse.pulse_score).slice(0, Number(body.limit || 5));

      return sendJson(res, 200, {
        region,
        question: body.question || '',
        narrative,
        insights: matches.map((item) => {
          return {
            sku: item.sku,
            name: item.name,
            style: item.style,
            pulse_score: item.pulse.pulse_score,
            action: item.pulse.recommended_action,
            why: item.pulse.reasons
          };
        }),
        trust: {
          grounded_in_data: true,
          deterministic_score_layer: true,
          source_systems: ['POS', 'Inventory', 'Product Catalog', 'Warehouse']
        }
      });
    }

    if (req.method === 'POST' && pathname === '/v1/assistant/chat') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return sendJson(res, 503, {
          error: 'OpenAI API key is not configured on the backend.',
          detail: 'Set OPENAI_API_KEY before calling /v1/assistant/chat.'
        });
      }

      const body = await parseBody(req);
      const region = body.region || 'Midwest';
      const messages = normalizeMessages(body.messages);
      if (!messages.length) {
        return sendJson(res, 400, { error: 'messages is required and must include at least one user message.' });
      }

      const model = process.env.OPENAI_MODEL || 'gpt-5.3';
      const systemPrompt = process.env.OPENAI_SYSTEM_PROMPT || buildAssistantPrompt(region);
      const input = [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }]
        },
        ...messages.map((message) => ({
          role: message.role,
          content: [{ type: 'input_text', text: message.content }]
        }))
      ];

      const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          input,
          temperature: 0.3
        })
      });

      const responseJson = await openaiResponse.json();
      if (!openaiResponse.ok) {
        return sendJson(res, openaiResponse.status, {
          error: 'OpenAI request failed',
          detail: responseJson.error?.message || 'Unknown OpenAI API error'
        });
      }

      const reply = extractOutputText(responseJson);
      return sendJson(res, 200, {
        model,
        reply: reply || 'No response text returned by model.',
        usage: responseJson.usage || null
      });
    }

    if (req.method === 'GET' && pathname === '/v1/replenishment/recommendations') {
      const region = url.searchParams.get('region') || 'Midwest';
      const enriched = items.map((item) => enrichItem(item, region));
      const recommendations = enriched
        .filter((item) => item.pulse.recommended_action !== 'MONITOR')
        .map((item) => {
          if (item.pulse.recommended_action === 'REORDER') {
            return {
              sku: item.sku,
              action: 'REORDER',
              reason: 'High demand + low stock across Midwest stores',
              recommended_units: 24
            };
          }
          if (item.pulse.recommended_action === 'TRANSFER') {
            return {
              sku: item.sku,
              action: 'TRANSFER',
              from_store: 'STL01',
              to_store: ['MSP01', 'MSP02'],
              recommended_units: 12,
              reason: 'Move excess store inventory into the strongest demand cluster'
            };
          }
          return {
            sku: item.sku,
            action: 'SAME_DAY_FULFILLMENT',
            from_store: 'MSP02',
            to_store: 'MSP01',
            recommended_units: 1,
            reason: 'Save the sale through nearby same-day fulfillment'
          };
        });
      return sendJson(res, 200, { region, recommendations });
    }

    if (req.method === 'GET' && pathname === '/v1/dashboard/summary') {
      const region = url.searchParams.get('region') || 'Midwest';
      return sendJson(res, 200, summary(region));
    }

    return notFound(res);
  } catch (error) {
    return sendJson(res, 500, {
      error: 'Internal server error',
      detail: error.message
    });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`RetailNext Pulse API listening on port ${port}`);
});
