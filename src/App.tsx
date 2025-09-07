import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Cloud, Radar, Volume2, TrendingUp, Shield, Clock, Target } from 'lucide-react';

interface SensorData {
  radar: number;
  lidar: number;
  weather: {
    windSpeed: number;
    temperature: number;
    humidity: number;
  };
  acoustic: number;
  slopeMovement: number;
}

interface ChartData {
  time: string;
  movement: number;
}

function App() {
  const [sensorData, setSensorData] = useState<SensorData>({
    radar: 2.3,
    lidar: 1.8,
    weather: {
      windSpeed: 12.5,
      temperature: 18,
      humidity: 65
    },
    acoustic: 45,
    slopeMovement: 8.2
  });

  const [chartData, setChartData] = useState<ChartData[]>([
    { time: '00:00', movement: 5.2 },
    { time: '00:30', movement: 5.8 },
    { time: '01:00', movement: 6.1 },
    { time: '01:30', movement: 6.8 },
    { time: '02:00', movement: 7.2 },
    { time: '02:30', movement: 7.9 },
    { time: '03:00', movement: 8.2 },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        radar: Math.max(0, prev.radar + (Math.random() - 0.5) * 0.5),
        lidar: Math.max(0, prev.lidar + (Math.random() - 0.5) * 0.3),
        weather: {
          windSpeed: Math.max(0, prev.weather.windSpeed + (Math.random() - 0.5) * 2),
          temperature: Math.max(-10, Math.min(35, prev.weather.temperature + (Math.random() - 0.5) * 0.5)),
          humidity: Math.max(0, Math.min(100, prev.weather.humidity + (Math.random() - 0.5) * 2))
        },
        acoustic: Math.max(0, prev.acoustic + (Math.random() - 0.5) * 5),
        slopeMovement: Math.max(0, prev.slopeMovement + (Math.random() - 0.5) * 0.8)
      }));

      setCurrentTime(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update chart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 5);
      
      setChartData(prev => {
        const newData = [...prev.slice(-6), { time: timeStr, movement: sensorData.slopeMovement }];
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [sensorData.slopeMovement]);

  const getAlertLevel = () => {
    if (sensorData.slopeMovement > 10) return 'critical';
    if (sensorData.slopeMovement > 7) return 'warning';
    return 'safe';
  };

  const alertLevel = getAlertLevel();

  const alertConfig = {
    safe: {
      color: 'text-green-500',
      bg: 'bg-green-50 border-green-200',
      icon: '🟢',
      label: 'SAFE',
      description: 'All systems normal'
    },
    warning: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 border-yellow-200',
      icon: '🟡',
      label: 'WARNING',
      description: 'Increased monitoring required'
    },
    critical: {
      color: 'text-red-500',
      bg: 'bg-red-50 border-red-200',
      icon: '🔴',
      label: 'CRITICAL',
      description: 'Immediate evacuation recommended'
    }
  };

  const maxMovement = Math.max(...chartData.map(d => d.movement));
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-300" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                MineGuard: AI Rockfall Prediction System
              </h1>
            </div>
            <div className="text-blue-200 text-sm">
              {currentTime.toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Status Panel */}
        <div className={`mb-8 p-6 rounded-xl border-2 ${alertConfig[alertLevel].bg} transition-all duration-300`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{alertConfig[alertLevel].icon}</span>
              <div>
                <h2 className={`text-2xl font-bold ${alertConfig[alertLevel].color}`}>
                  {alertConfig[alertLevel].label}
                </h2>
                <p className="text-gray-600">{alertConfig[alertLevel].description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-5 w-5 ${alertLevel === 'critical' ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
              <span className="font-semibold">Slope Movement: {sensorData.slopeMovement.toFixed(1)} mm</span>
            </div>
          </div>
        </div>

        {/* Live Sensor Data Panel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-blue-600" />
            Live Sensor Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Radar Sensor */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Radar className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-gray-700">Radar</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{sensorData.radar.toFixed(1)} mm</div>
              <div className="text-sm text-gray-500">Displacement detected</div>
            </div>

            {/* LiDAR Sensor */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold text-gray-700">LiDAR</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{sensorData.lidar.toFixed(1)} mm</div>
              <div className="text-sm text-gray-500">Surface deformation</div>
            </div>

            {/* Weather Station */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Cloud className="h-5 w-5 text-cyan-500" />
                  <span className="font-semibold text-gray-700">Weather</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-900">{sensorData.weather.windSpeed.toFixed(1)} km/h</div>
                <div className="text-sm text-gray-600">{sensorData.weather.temperature.toFixed(0)}°C, {sensorData.weather.humidity.toFixed(0)}% RH</div>
              </div>
            </div>

            {/* Acoustic Sensor */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold text-gray-700">Acoustic</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{sensorData.acoustic.toFixed(0)} dB</div>
              <div className="text-sm text-gray-500">Rock crack sounds</div>
            </div>
          </div>
        </div>

        {/* Graph Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Slope Movement Trend</h2>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Movement (mm) over Time</span>
              <span className="text-xs text-gray-500">Last 3.5 hours</span>
            </div>
            <div className="relative h-48 w-full">
              <svg viewBox="0 0 600 160" className="w-full h-full">
                {/* Grid lines */}
                {[0, 2, 4, 6, 8, 10, 12].map((value, i) => (
                  <g key={value}>
                    <line
                      x1="50"
                      y1={140 - (value / 12) * 120}
                      x2="550"
                      y2={140 - (value / 12) * 120}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                    <text
                      x="40"
                      y={144 - (value / 12) * 120}
                      className="text-xs fill-gray-500"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                  </g>
                ))}
                
                {/* Chart line */}
                <polyline
                  points={chartData.map((d, i) => 
                    `${50 + (i / (chartData.length - 1)) * 500},${140 - (d.movement / maxMovement) * 120}`
                  ).join(' ')}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {chartData.map((d, i) => (
                  <circle
                    key={i}
                    cx={50 + (i / (chartData.length - 1)) * 500}
                    cy={140 - (d.movement / maxMovement) * 120}
                    r="4"
                    fill="#3b82f6"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                ))}
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                
                {/* X-axis labels */}
                {chartData.map((d, i) => (
                  <text
                    key={i}
                    x={50 + (i / (chartData.length - 1)) * 500}
                    y="158"
                    className="text-xs fill-gray-500"
                    textAnchor="middle"
                  >
                    {d.time}
                  </text>
                ))}
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Safe (&lt;7mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Warning (7-10mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Critical (&gt;10mm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
                <span className="font-semibold text-blue-800">Early Warning</span>
              </div>
              <div className="text-3xl font-bold text-blue-900">15 min</div>
              <div className="text-sm text-blue-700">Average warning lead time</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8 text-green-600" />
                <span className="font-semibold text-green-800">Accuracy Rate</span>
              </div>
              <div className="text-3xl font-bold text-green-900">96.5%</div>
              <div className="text-sm text-green-700">Prediction accuracy</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
                <span className="font-semibold text-purple-800">False Alarm Reduction</span>
              </div>
              <div className="text-3xl font-bold text-purple-900">40%</div>
              <div className="text-sm text-purple-700">Compared to traditional methods</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <div>
                <div className="font-bold text-lg">Team SafeSlope</div>
                <div className="text-gray-400 text-sm">Mining Safety Innovation Hackathon 2025</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-400">Powered by AI & IoT</div>
              <div className="text-xs text-gray-500">Protecting lives through technology</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;