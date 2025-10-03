# AirGuard Pro API Documentation

This document outlines all the APIs required for the AirGuard Pro comprehensive air quality monitoring system. Each section corresponds to a feature implemented in the React Native app.

## Base URL
```
https://your-api-domain.com/api/v1
```

## Authentication
All requests require authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## Time-Based Predictions
All AirGuard Pro APIs now support time-based predictions. You can request data for specific future or historical timestamps by including the `predictionTime` parameter.

**Global Query Parameters:**
- `predictionTime` (ISO string, optional): Target time for prediction data. If not provided, uses current time.
  - Future times: Up to 7 days ahead
  - Historical times: Up to 24 hours back
  - Format: `2024-01-20T18:30:00Z`

**Example with Prediction Time:**
```
GET /air-quality/current?lat=37.7749&lng=-122.4194&predictionTime=2024-01-21T12:00:00Z
```

**Time-Enhanced Response Format:**
All responses will include a `timeContext` object:
```json
{
  "success": true,
  "data": {
    // ... regular response data
  },
  "timeContext": {
    "requestedTime": "2024-01-21T12:00:00Z",
    "isPrediction": true,
    "timeOffset": "+16h",
    "confidence": 0.78,
    "dataSource": "ML_PREDICTION"
  }
}
```

---

## 1. User Profile & Health Risk Management

### 1.1 Get User Profile
**Endpoint:** `GET /user/profile`

**Request Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "id": "user_12345",
    "age": 28,
    "healthConditions": ["asthma", "heart-disease"],
    "activityLevel": "moderate",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "address": "San Francisco, CA"
    },
    "preferences": {
      "notifications": true,
      "alertThreshold": 100,
      "preferredUnits": "metric"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
}
```

### 1.2 Update User Profile
**Endpoint:** `PUT /user/profile`

**Request Body:**
```json
{
  "age": 29,
  "healthConditions": ["asthma"],
  "activityLevel": "high",
  "preferences": {
    "notifications": true,
    "alertThreshold": 75,
    "preferredUnits": "metric"
  }
}
```

**Response Body:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_12345",
    "age": 29,
    "healthConditions": ["asthma"],
    "activityLevel": "high",
    "preferences": {
      "notifications": true,
      "alertThreshold": 75,
      "preferredUnits": "metric"
    },
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

### 1.3 Get Personalized Health Risk Assessment
**Endpoint:** `GET /health/risk-assessment`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `predictionTime` (ISO string, optional): Time for prediction (see Time-Based Predictions section)

**Request Examples:**
```
GET /health/risk-assessment?lat=37.7749&lng=-122.4194
GET /health/risk-assessment?lat=37.7749&lng=-122.4194&predictionTime=2024-01-21T14:30:00Z
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "personalRiskScore": 85,
    "riskLevel": "moderate",
    "baseAqi": 78,
    "riskFactors": {
      "age": 1.2,
      "healthConditions": 1.3,
      "activityLevel": 1.1
    },
    "recommendations": [
      "Consider limiting outdoor exercise",
      "Use your rescue inhaler if needed",
      "Wear a mask when going outside"
    ],
    "nextCheckIn": "2024-01-20T18:00:00Z"
  },
  "timeContext": {
    "requestedTime": "2024-01-21T14:30:00Z",
    "isPrediction": true,
    "timeOffset": "+18h",
    "confidence": 0.82,
    "dataSource": "ML_PREDICTION"
  }
}
```

---

## 2. Air Quality Data & Predictions

### 2.1 Get Current Air Quality
**Endpoint:** `GET /air-quality/current`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `predictionTime` (ISO string, optional): Time for prediction (see Time-Based Predictions section)

**Request Examples:**
```
GET /air-quality/current?lat=37.7749&lng=-122.4194
GET /air-quality/current?lat=37.7749&lng=-122.4194&predictionTime=2024-01-21T10:30:00Z
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "aqi": 78,
    "pm25": 35.2,
    "pm10": 42.1,
    "o3": 68.5,
    "no2": 28.3,
    "so2": 12.7,
    "co": 1.2,
    "status": "Moderate",
    "healthRisk": "moderate",
    "lastUpdated": "2024-01-20T14:30:00Z",
    "dataSource": "TEMPO_SATELLITE",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "address": "San Francisco, CA"
    }
  }
}
```

### 2.2 Get Air Quality Predictions
**Endpoint:** `GET /air-quality/predictions`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `hours` (int): Number of hours to predict (default: 24)

**Request Example:**
```
GET /air-quality/predictions?lat=37.7749&lng=-122.4194&hours=12
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "address": "San Francisco, CA"
    },
    "predictions": [
      {
        "timestamp": "2024-01-20T15:00:00Z",
        "aqi": 82,
        "confidence": 0.85,
        "status": "Moderate"
      },
      {
        "timestamp": "2024-01-20T18:00:00Z",
        "aqi": 75,
        "confidence": 0.78,
        "status": "Moderate"
      },
      {
        "timestamp": "2024-01-20T21:00:00Z",
        "aqi": 68,
        "confidence": 0.72,
        "status": "Moderate"
      }
    ],
    "summary": {
      "trend": "improving",
      "peakHour": "2024-01-20T15:00:00Z",
      "bestHour": "2024-01-20T21:00:00Z"
    }
  }
}
```

---

## 3. Smart Route Planning & Air Corridors

### 3.1 Get Optimized Routes
**Endpoint:** `POST /routes/optimize`

**Request Body:**
```json
{
  "origin": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "San Francisco, CA"
  },
  "destination": {
    "latitude": 37.7849,
    "longitude": -122.4094,
    "address": "North Beach, San Francisco, CA"
  },
  "preferences": {
    "prioritizeAirQuality": true,
    "maxDetourTime": 15,
    "avoidHighTraffic": true
  }
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "routeId": "route_abc123",
    "routes": [
      {
        "id": "route_1",
        "name": "Via Park Route",
        "path": [
          {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "address": "Origin"
          },
          {
            "latitude": 37.7799,
            "longitude": -122.4144,
            "address": "Via Golden Gate Park"
          },
          {
            "latitude": 37.7849,
            "longitude": -122.4094,
            "address": "Destination"
          }
        ],
        "avgAqi": 45,
        "duration": 25,
        "distance": 3.2,
        "exposureRisk": "low",
        "trafficLevel": "light",
        "estimatedExposure": {
          "pm25": 22.1,
          "no2": 18.5
        }
      },
      {
        "id": "route_2",
        "name": "Main Street Route",
        "path": [
          {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "address": "Origin"
          },
          {
            "latitude": 37.7774,
            "longitude": -122.4164,
            "address": "Via Main St"
          },
          {
            "latitude": 37.7849,
            "longitude": -122.4094,
            "address": "Destination"
          }
        ],
        "avgAqi": 78,
        "duration": 18,
        "distance": 2.8,
        "exposureRisk": "moderate",
        "trafficLevel": "moderate",
        "estimatedExposure": {
          "pm25": 35.2,
          "no2": 28.3
        }
      }
    ],
    "recommendation": {
      "recommendedRouteId": "route_1",
      "reason": "Lowest air pollution exposure with acceptable travel time"
    }
  }
}
```

### 3.2 Get Air Quality Heat Map Data
**Endpoint:** `GET /air-quality/heatmap`

**Query Parameters:**
- `lat` (float): Center latitude
- `lng` (float): Center longitude
- `radius` (float): Radius in kilometers (default: 10)
- `resolution` (int): Grid resolution (default: 50)

**Request Example:**
```
GET /air-quality/heatmap?lat=37.7749&lng=-122.4194&radius=5&resolution=25
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "center": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "radius": 5,
    "timestamp": "2024-01-20T14:30:00Z",
    "heatmapData": [
      {
        "latitude": 37.7700,
        "longitude": -122.4200,
        "aqi": 65,
        "color": "#ff9800",
        "radius": 500
      },
      {
        "latitude": 37.7750,
        "longitude": -122.4150,
        "aqi": 45,
        "color": "#4caf50",
        "radius": 400
      },
      {
        "latitude": 37.7800,
        "longitude": -122.4100,
        "aqi": 95,
        "color": "#f44336",
        "radius": 600
      }
    ],
    "legend": {
      "good": { "range": "0-50", "color": "#4caf50" },
      "moderate": { "range": "51-100", "color": "#ff9800" },
      "unhealthy": { "range": "101+", "color": "#f44336" }
    }
  }
}
```

---

## 4. Community Sentinel Network

### 4.1 Get Community Reports
**Endpoint:** `GET /community/reports`

**Query Parameters:**
- `lat` (float): Center latitude
- `lng` (float): Center longitude
- `radius` (float): Radius in kilometers (default: 5)
- `limit` (int): Number of reports to return (default: 20)
- `verified` (boolean): Only verified reports (optional)

**Request Example:**
```
GET /community/reports?lat=37.7749&lng=-122.4194&radius=2&limit=10&verified=true
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "report_xyz789",
        "location": {
          "latitude": 37.7751,
          "longitude": -122.4196,
          "address": "123 Main St, San Francisco"
        },
        "reportedBy": {
          "userId": "user_456",
          "username": "john_d",
          "reputation": 4.2
        },
        "type": "air-quality",
        "description": "Strong chemical smell near industrial area",
        "severity": 4,
        "timestamp": "2024-01-20T14:25:00Z",
        "verified": true,
        "verifiedBy": "moderator_123",
        "verifiedAt": "2024-01-20T14:35:00Z",
        "attachments": [
          {
            "type": "image",
            "url": "https://cdn.example.com/report_images/img123.jpg"
          }
        ],
        "votes": {
          "helpful": 12,
          "notHelpful": 2
        }
      }
    ],
    "statistics": {
      "totalReports": 45,
      "verifiedReports": 38,
      "accuracyRate": 84.4,
      "activeReporters": 28
    }
  }
}
```

### 4.2 Submit Community Report
**Endpoint:** `POST /community/reports`

**Request Body:**
```json
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "San Francisco, CA"
  },
  "type": "pollution-source",
  "description": "Heavy smoke from construction site affecting air quality",
  "severity": 3,
  "attachments": [
    {
      "type": "image",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    }
  ]
}
```

**Response Body:**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "reportId": "report_new456",
    "status": "pending_review",
    "estimatedReviewTime": "2-4 hours",
    "reputationPoints": 10
  }
}
```

### 4.3 Get Community Statistics
**Endpoint:** `GET /community/statistics`

**Query Parameters:**
- `lat` (float): Center latitude
- `lng` (float): Center longitude
- `radius` (float): Radius in kilometers (default: 10)

**Response Body:**
```json
{
  "success": true,
  "data": {
    "totalReports": 1250,
    "verifiedReports": 1063,
    "accuracyRate": 94.2,
    "activeReporters": 342,
    "monthlyGrowth": 12.5,
    "topContributors": [
      {
        "username": "eco_warrior",
        "reportsCount": 45,
        "accuracy": 98.2
      }
    ],
    "reportsByType": {
      "air-quality": 680,
      "pollution-source": 420,
      "weather": 150
    }
  }
}
```

---

## 5. Stakeholder Dashboards

### 5.1 Get Health Dashboard Data
**Endpoint:** `GET /dashboard/health`

**Query Parameters:**
- `lat` (float): Center latitude
- `lng` (float): Center longitude
- `radius` (float): Radius in kilometers (default: 5)

**Response Body:**
```json
{
  "success": true,
  "data": {
    "riskAlerts": {
      "count": 3,
      "trend": "up",
      "severity": "moderate"
    },
    "vulnerablePopulation": {
      "total": 12450,
      "children": 3200,
      "elderly": 2800,
      "chronicIllness": 6450
    },
    "healthRecommendations": [
      "Indoor air filtration recommended",
      "Limit outdoor activities for children",
      "Respiratory medication advisory active"
    ],
    "hospitalAdmissions": {
      "today": 8,
      "weeklyAverage": 5.2,
      "trend": "increasing"
    },
    "airQualityStatus": {
      "current": 78,
      "status": "Moderate",
      "trend": "stable"
    }
  }
}
```

### 5.2 Get Policy Dashboard Data
**Endpoint:** `GET /dashboard/policy`

**Query Parameters:**
- `region` (string): Administrative region ID
- `timeframe` (string): "daily", "weekly", "monthly", "yearly"

**Response Body:**
```json
{
  "success": true,
  "data": {
    "regulatoryCompliance": {
      "currentRate": 78,
      "targetRate": 85,
      "trend": "improving",
      "nonCompliantSites": 12
    },
    "pollutionHotspots": {
      "count": 5,
      "severity": "moderate",
      "locations": [
        {
          "id": "hotspot_1",
          "name": "Industrial District",
          "aqi": 125,
          "primaryPollutant": "PM2.5"
        }
      ]
    },
    "policyImpact": {
      "improvement": "+15%",
      "timeframe": "6 months",
      "measure": "AQI reduction",
      "affectedPopulation": 250000
    },
    "economicBenefit": {
      "healthcareSavings": 2.4,
      "productivityGains": 1.8,
      "currency": "USD",
      "unit": "millions"
    }
  }
}
```

### 5.3 Get Emergency Dashboard Data
**Endpoint:** `GET /dashboard/emergency`

**Query Parameters:**
- `lat` (float): Center latitude
- `lng` (float): Center longitude
- `radius` (float): Coverage radius in kilometers

**Response Body:**
```json
{
  "success": true,
  "data": {
    "activeAlerts": [
      {
        "id": "alert_456",
        "level": "warning",
        "type": "high_pollution",
        "affectedPopulation": 25000,
        "message": "High PM2.5 levels detected",
        "issuedAt": "2024-01-20T14:00:00Z",
        "expiresAt": "2024-01-20T20:00:00Z"
      }
    ],
    "evacuationRoutes": {
      "ready": 3,
      "compromised": 0,
      "routes": [
        {
          "id": "evac_route_1",
          "name": "Highway 101 North",
          "capacity": 50000,
          "status": "clear"
        }
      ]
    },
    "responseTime": {
      "current": "8 min",
      "target": "12 min",
      "performance": "excellent"
    },
    "resourceAllocation": {
      "airPurifiers": {
        "available": 150,
        "deployed": 45
      },
      "masks": {
        "available": 10000,
        "distributed": 2500
      }
    }
  }
}
```

### 5.4 Get Economic Dashboard Data
**Endpoint:** `GET /dashboard/economic`

**Query Parameters:**
- `region` (string): Region ID
- `timeframe` (string): "daily", "monthly", "yearly"

**Response Body:**
```json
{
  "success": true,
  "data": {
    "economicImpact": {
      "healthcareCosts": 2.4,
      "productivityLoss": 1.8,
      "environmentalDamage": 0.9,
      "cleanAirBenefits": 5.2,
      "netImpact": -1.1,
      "currency": "USD",
      "unit": "millions",
      "timeframe": "monthly"
    },
    "cleanAirROI": {
      "value": "3.2x",
      "paybackPeriod": 18,
      "unit": "months"
    },
    "businessImpact": {
      "affected": 45,
      "total": 200,
      "categories": {
        "tourism": 15,
        "outdoor_recreation": 12,
        "agriculture": 8,
        "construction": 10
      }
    },
    "investmentRecommendations": [
      {
        "category": "Public Transportation",
        "potentialSavings": 2.1,
        "timeframe": "annual"
      },
      {
        "category": "Industrial Standards",
        "healthcareReduction": 25,
        "unit": "percent"
      }
    ]
  }
}
```

### 5.5 Get Community Dashboard Data
**Endpoint:** `GET /dashboard/community`

**Query Parameters:**
- `lat` (float): Center latitude
- `lng` (float): Center longitude
- `radius` (float): Community radius in kilometers

**Response Body:**
```json
{
  "success": true,
  "data": {
    "participation": {
      "activeUsers": 1250,
      "monthlyGrowth": "+12%",
      "engagementRate": 67.5
    },
    "dataQuality": {
      "score": 94,
      "trend": "stable",
      "verificationRate": 89.2
    },
    "communityInsights": [
      "School zones show 20% higher participation",
      "Evening reports are most accurate",
      "Weekend data collection is improving"
    ],
    "gamification": {
      "topContributor": "eco_champion_2024",
      "leaderboard": [
        {
          "rank": 1,
          "username": "green_guardian",
          "points": 2450,
          "reports": 87
        }
      ],
      "achievements": {
        "newThis Week": 12,
        "totalUnlocked": 156
      }
    }
  }
}
```

---

## 6. AI Assistant & Recommendations

### 6.1 Chat with AI Assistant
**Endpoint:** `POST /ai/chat`

**Request Body:**
```json
{
  "message": "What does my current AQI mean?",
  "context": {
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "userProfile": {
      "age": 28,
      "healthConditions": ["asthma"],
      "activityLevel": "moderate"
    },
    "currentAQI": 78
  },
  "conversationId": "conv_123456"
}
```

**Response Body:**
```json
{
  "success": true,
  "data": {
    "response": "Based on the current AQI of 78, your air quality is moderate. ⚠️ Since you have asthma, I recommend limiting prolonged outdoor activities and keeping your rescue inhaler accessible. The air quality should improve after 6 PM today.",
    "conversationId": "conv_123456",
    "messageId": "msg_789",
    "attachments": [
      {
        "type": "chart",
        "title": "AQI Forecast Next 12 Hours",
        "data": {
          "chartType": "line",
          "dataPoints": [78, 75, 70, 65, 60, 58]
        }
      }
    ],
    "suggestedActions": [
      "Check AQI forecast",
      "Find clean air routes",
      "Set up alerts for your area"
    ]
  }
}
```

### 6.2 Get Personalized Recommendations
**Endpoint:** `GET /ai/recommendations`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `category` (string): "health", "activity", "route", "general"

**Response Body:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "rec_001",
        "type": "health",
        "priority": "high",
        "title": "Avoid Outdoor Exercise",
        "description": "Current AQI levels may trigger asthma symptoms",
        "validUntil": "2024-01-20T18:00:00Z",
        "actionable": true,
        "actions": [
          "Use indoor gym facilities",
          "Wait until after 6 PM for outdoor activities"
        ]
      },
      {
        "id": "rec_002",
        "type": "route",
        "priority": "medium",
        "title": "Alternative Route Available",
        "description": "Park route has 30% lower pollution than main street",
        "validUntil": "2024-01-20T17:00:00Z",
        "actionable": true,
        "actions": [
          "View route details",
          "Navigate using clean air route"
        ]
      }
    ],
    "insights": [
      "Air quality typically improves in your area after 7 PM",
      "Weekends show 15% better air quality in your neighborhood"
    ]
  }
}
```

---

## 7. Emergency Alerts & Notifications

### 7.1 Get Active Emergency Alerts
**Endpoint:** `GET /emergency/alerts`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `radius` (float): Alert radius in kilometers
- `severity` (string): "warning", "alert", "emergency" (optional)

**Response Body:**
```json
{
  "success": true,
  "data": {
    "activeAlerts": [
      {
        "id": "emergency_001",
        "type": "wildfire",
        "severity": "emergency",
        "location": {
          "latitude": 37.8049,
          "longitude": -122.2711,
          "address": "Oakland Hills"
        },
        "affectedRadius": 15,
        "message": "Wildfire smoke causing hazardous air quality levels",
        "recommendations": [
          "Stay indoors with windows closed",
          "Use air purifiers if available",
          "Avoid all outdoor activities"
        ],
        "issuedAt": "2024-01-20T12:30:00Z",
        "expiresAt": "2024-01-21T12:30:00Z",
        "evacuationZones": ["zone_A", "zone_B"],
        "shelterLocations": [
          {
            "name": "Community Center East",
            "address": "456 Oak Street",
            "capacity": 500,
            "available": 320
          }
        ]
      }
    ],
    "riskLevel": "very-high",
    "lastUpdated": "2024-01-20T14:45:00Z"
  }
}
```

### 7.2 Subscribe to Push Notifications
**Endpoint:** `POST /notifications/subscribe`

**Request Body:**
```json
{
  "deviceToken": "fcm_token_xyz789",
  "platform": "ios",
  "preferences": {
    "emergencyAlerts": true,
    "dailyUpdates": true,
    "routeOptimization": false,
    "communityReports": true,
    "personalizedRecommendations": true
  },
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "radius": 5
  },
  "thresholds": {
    "aqiAlert": 100,
    "healthRiskAlert": "moderate"
  }
}
```

**Response Body:**
```json
{
  "success": true,
  "message": "Successfully subscribed to notifications",
  "data": {
    "subscriptionId": "sub_abc123",
    "status": "active",
    "createdAt": "2024-01-20T15:00:00Z"
  }
}
```

---

## 8. Data Analytics & Trends

### 8.1 Get Air Quality Trends
**Endpoint:** `GET /analytics/trends`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `period` (string): "24h", "7d", "30d", "90d", "1y"
- `metric` (string): "aqi", "pm25", "no2", "o3" (default: "aqi")

**Response Body:**
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "metric": "aqi",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "address": "San Francisco, CA"
    },
    "timeSeries": [
      {
        "timestamp": "2024-01-14T00:00:00Z",
        "value": 65,
        "status": "moderate"
      },
      {
        "timestamp": "2024-01-15T00:00:00Z",
        "value": 58,
        "status": "moderate"
      },
      {
        "timestamp": "2024-01-16T00:00:00Z",
        "value": 72,
        "status": "moderate"
      }
    ],
    "statistics": {
      "average": 67.3,
      "minimum": 45,
      "maximum": 89,
      "trend": "improving",
      "changePercent": -8.2
    },
    "insights": [
      "Air quality improved 8.2% this week",
      "Best air quality typically occurs at 6 AM",
      "Weekend pollution levels are 15% lower"
    ]
  }
}
```

---

## 9. Location Services

### 9.1 Reverse Geocoding
**Endpoint:** `GET /location/reverse-geocode`

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude

**Response Body:**
```json
{
  "success": true,
  "data": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "San Francisco, CA 94102, United States",
    "components": {
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "postalCode": "94102",
      "neighborhood": "SOMA"
    }
  }
}
```

### 9.2 Search Locations
**Endpoint:** `GET /location/search`

**Query Parameters:**
- `query` (string): Search query
- `lat` (float): Center latitude (optional)
- `lng` (float): Center longitude (optional)
- `limit` (int): Number of results (default: 10)

**Response Body:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "location_001",
        "name": "Golden Gate Park",
        "address": "Golden Gate Park, San Francisco, CA",
        "latitude": 37.7694,
        "longitude": -122.4862,
        "type": "park",
        "distance": 2.8,
        "currentAQI": 52
      }
    ]
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid latitude or longitude provided",
    "details": {
      "field": "lat",
      "value": "invalid_value",
      "expected": "float between -90 and 90"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token"
  }
}
```

### 429 Rate Limited
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_123456789"
  }
}
```

---

## Rate Limits

| Endpoint Category | Requests per Minute | Requests per Hour |
|------------------|-------------------|------------------|
| Air Quality Data | 60 | 1000 |
| Route Planning | 30 | 500 |
| Community Reports | 20 | 200 |
| AI Chat | 10 | 100 |
| Analytics | 30 | 500 |
| All Others | 100 | 2000 |

---

## Notes for Backend Implementation

1. **Real-time Data**: Integrate with TEMPO satellite data, OpenAQ, and other air quality data sources
2. **Machine Learning**: Implement ML models for predictions and personalized recommendations
3. **WebSocket Support**: Consider implementing WebSockets for real-time updates
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Database**: Use PostGIS for geospatial queries and time-series database for historical data
6. **Queue System**: Use job queues for processing heavy computations (ML predictions, route calculations)
7. **Monitoring**: Implement health checks and monitoring for all external data sources
8. **Security**: Implement proper authentication, rate limiting, and data validation
9. **Scalability**: Design for horizontal scaling with load balancers and microservices architecture

This comprehensive API documentation covers all features implemented in the AirGuard Pro React Native application. Each endpoint is designed to provide the exact data structure expected by the frontend components.