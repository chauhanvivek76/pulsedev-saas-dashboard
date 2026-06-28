import { useEffect, useState, useMemo, useCallback } from 'react';
import { Activity, ShieldAlert, Cpu, Heart, RefreshCw, PlusCircle, Search, SlidersHorizontal, User } from 'lucide-react';
import { apiService } from '../services/api';
import { useLogger } from '../hooks/useLogger';
import { useToast } from '../components/common/Toast';
import { formatDate } from '../utils/helpers';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';

const Sparkline = ({ data = [], color = '#4f46e5' }) => {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;
  
  const width = 80;
  const height = 18;
  
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80 shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const Dashboard = () => {
  const { logInfo, logClick, logCrud, logError } = useLogger('Dashboard');
  const { success, error: toastError, warn } = useToast();

  // State managers
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [simulateApiError, setSimulateApiError] = useState(false);
  const [shouldCrash, setShouldCrash] = useState(false);

  // Sparkline history buffers
  const [selectedNode, setSelectedNode] = useState('US-EAST-Primary');
  const [cpuHistory, setCpuHistory] = useState([42, 48, 45, 52, 49, 58, 55, 62, 59, 61]);
  const [memHistory, setMemHistory] = useState([71, 73, 72, 74, 73, 76, 75, 77, 76, 78]);
  const [loadHistory, setLoadHistory] = useState([205, 220, 195, 230, 215, 240, 235, 260, 240, 250]);
  const [latencyHistory, setLatencyHistory] = useState([42, 48, 45, 49, 47, 50, 48, 51, 46, 52]);

  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Trigger simulated React crash during render
  if (shouldCrash) {
    throw new Error('Simulated Uncaught UI Crash Event');
  }

  // Load telemetry metrics
  const loadMetrics = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setLoadingMetrics(true);
    }
    try {
      const data = await apiService.getMetrics();
      // Apply scaling based on selected server node
      const multipliers = {
        'US-EAST-Primary': { cpu: 1.0, mem: 1.0, load: 1.0, latency: 1.0 },
        'EU-WEST-Edge': { cpu: 0.8, mem: 0.9, load: 0.7, latency: 1.8 },
        'AP-SOUTH-Replica': { cpu: 0.6, mem: 0.75, load: 0.5, latency: 2.2 }
      };
      const mult = multipliers[selectedNode] || multipliers['US-EAST-Primary'];
      const adjustedData = {
        ...data,
        cpuUsage: Math.min(100, +(data.cpuUsage * mult.cpu).toFixed(1)),
        memoryUsage: Math.min(100, +(data.memoryUsage * mult.mem).toFixed(1)),
        requestsPerSecond: Math.floor(data.requestsPerSecond * mult.load),
        latencyMs: Math.floor(data.latencyMs * mult.latency)
      };

      setMetrics(adjustedData);
      
      // Update histories
      setCpuHistory((prev) => [...prev.slice(1), adjustedData.cpuUsage]);
      setMemHistory((prev) => [...prev.slice(1), adjustedData.memoryUsage]);
      setLoadHistory((prev) => [...prev.slice(1), adjustedData.requestsPerSecond]);
      setLatencyHistory((prev) => [...prev.slice(1), adjustedData.latencyMs]);
    } catch (err) {
      logError('Failed to fetch telemetry metrics', err);
      toastError('Could not load telemetry metrics');
    } finally {
      setLoadingMetrics(false);
    }
  }, [selectedNode, logError, toastError]);

  // Load activity feed
  const loadActivities = useCallback(async (showToast = false, isRefresh = false) => {
    if (isRefresh) {
      setLoadingActivities(true);
    }
    try {
      const data = await apiService.getActivities(simulateApiError);
      setActivities(data);
      if (showToast) {
        success('Activity logs loaded successfully');
      }
    } catch (err) {
      logError('Failed to fetch commit activities', err);
      toastError('Could not fetch server activity logs');
    } finally {
      setLoadingActivities(false);
    }
  }, [simulateApiError, logError, toastError, success]);

  // Sync data loaders
  useEffect(() => {
    logInfo(`Dashboard metrics loaded for node: ${selectedNode}`);
    loadMetrics();
  }, [selectedNode, loadMetrics, logInfo]);

  useEffect(() => {
    logInfo('Dashboard activity loaded');
    loadActivities();
  }, [loadActivities, logInfo]);

  const handleRefreshAll = () => {
    logClick('Refresh Metrics & Activity');
    loadMetrics(true);
    loadActivities(true, true);
  };

  // Trigger mock developer action (CRUD simulation)
  const handleCreateMockActivity = async () => {
    logClick('Trigger CRUD: Add Activity Log');
    try {
      const actionsList = [
        { action: 'git commit', target: 'feature/auth-guard', developer: 'Alex Mercer' },
        { action: 'redis purge', target: 'rate-limiter-redis', developer: 'Sarah Conner' },
        { action: 'cron check', target: 'billing-renewals', developer: 'System Cron' },
        { action: 'yarn build', target: 'static-site-builder', developer: 'John Doe' }
      ];
      const randomAction = actionsList[Math.floor(Math.random() * actionsList.length)];
      
      const response = await apiService.createActivity({
        ...randomAction,
        status: Math.random() > 0.15 ? 'Success' : 'Failed'
      });

      logCrud('create', 'activity', response.id, response);
      success(`Added activity: ${response.action} on ${response.target}`);
      
      // Reload activities list
      loadActivities();
    } catch (err) {
      logError('Failed to record mock activity', err);
      toastError('Could not trigger mock activity creation');
    }
  };

  // Trigger simulated API failure
  const handleSimulateApiFailure = async () => {
    logClick('Trigger Simulated API Error');
    try {
      await apiService.triggerApiError();
    } catch (err) {
      toastError(`Interception success: ${err.message}`);
    }
  };

  // Filter & Search computation
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        act.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.target.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'All' || act.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [activities, searchQuery, statusFilter]);

  // Activity columns mapping
  const columns = [
    {
      header: 'Developer',
      key: 'developer',
      render: (row) => (
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
          <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] border border-slate-200 dark:border-slate-700">
            <User size={12} />
          </div>
          {row.developer}
        </div>
      )
    },
    { header: 'Action', key: 'action' },
    {
      header: 'Target Resource',
      key: 'target',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 select-all">
          {row.target}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border ${
            row.status === 'Success'
              ? 'bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 shadow-sm shadow-emerald-500/5'
              : 'bg-red-50/50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-800/40 shadow-sm shadow-red-500/5'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {row.status}
        </span>
      )
    },
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {formatDate(row.timestamp)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Top Intro Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-900 pb-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Server Live Telemetry</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Real-time server telemetry counters and simulated developer execution events.
          </p>
        </div>
        
        {/* Node Switcher & Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Server Status Pulsing Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800/40 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-450 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>

          <select
            value={selectedNode}
            onChange={(e) => {
              logClick(`Node Switch: ${e.target.value}`);
              setSelectedNode(e.target.value);
              success(`Switched telemetry to node: ${e.target.value}`);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none transition-colors cursor-pointer text-slate-700 dark:text-slate-350"
            aria-label="Select target server node"
          >
            <option value="US-EAST-Primary">US-EAST-Primary (Main)</option>
            <option value="EU-WEST-Edge">EU-WEST-Edge (Edge)</option>
            <option value="AP-SOUTH-Replica">AP-SOUTH-Replica (Backup)</option>
          </select>

          <Button
            onClick={handleRefreshAll}
            icon={RefreshCw}
            variant="secondary"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: CPU */}
        <Card className="hover:shadow-md hover:border-indigo-400/50 dark:hover:border-indigo-800/50 transition-all duration-200 select-none">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">CPU Utilization</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block truncate">
                {loadingMetrics ? '---' : `${metrics?.cpuUsage}%`}
              </span>
              <span className="text-[10px] text-indigo-500 font-semibold mt-1 block">
                Stable Load
              </span>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Sparkline data={cpuHistory} color="#4f46e5" />
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Cpu size={16} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Memory */}
        <Card className="hover:shadow-md hover:border-emerald-400/50 dark:hover:border-emerald-800/50 transition-all duration-200 select-none">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Memory Allocation</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block truncate">
                {loadingMetrics ? '---' : `${metrics?.memoryUsage}%`}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">
                Cache Warm
              </span>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Sparkline data={memHistory} color="#10b981" />
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-450 flex items-center justify-center shrink-0">
                <Activity size={16} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: requestsPerSecond */}
        <Card className="hover:shadow-md hover:border-blue-400/50 dark:hover:border-blue-800/50 transition-all duration-200 select-none">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Request Load</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block truncate">
                {loadingMetrics ? '---' : `${metrics?.requestsPerSecond} rps`}
              </span>
              <span className="text-[10px] text-blue-500 font-semibold mt-1 block">
                Concurrent Connections
              </span>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Sparkline data={loadHistory} color="#3b82f6" />
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-650 dark:text-blue-450 flex items-center justify-center shrink-0">
                <SlidersHorizontal size={16} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4: latency */}
        <Card className="hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-800/50 transition-all duration-200 select-none">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">System Latency</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block truncate">
                {loadingMetrics ? '---' : `${metrics?.latencyMs} ms`}
              </span>
              <span className="text-[10px] text-amber-500 font-semibold mt-1 block">
                Round-Trip Delay
              </span>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Sparkline data={latencyHistory} color="#eab308" />
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-650 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Heart size={16} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logging Sandbox Simulator Panel */}
      <Card>
        <CardHeader
          title="Central Logging Middleware Sandbox Simulator"
          description="Interactive options designed to test and trigger events that route through our Logging Middleware."
        />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1 select-none">API Operations (CRUD)</span>
              <Button
                onClick={handleCreateMockActivity}
                icon={PlusCircle}
                variant="primary"
                size="sm"
                fullWidth
              >
                Record CRUD Action
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1 select-none">API Request Errors</span>
              <Button
                onClick={handleSimulateApiFailure}
                icon={ShieldAlert}
                variant="outline"
                size="sm"
                fullWidth
              >
                Fail API Call
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1 select-none">API Network Mode</span>
              <button
                onClick={() => {
                  logClick('Toggle Simulating Network Offline Mode');
                  setSimulateApiError(!simulateApiError);
                  warn(`Network offline simulation turned ${!simulateApiError ? 'ON' : 'OFF'}`);
                }}
                className={`px-4 py-2 border text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                  simulateApiError
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-300'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-205 border-slate-200 dark:border-slate-800'
                }`}
              >
                <SlidersHorizontal size={14} />
                {simulateApiError ? 'API Errors ACTIVE' : 'API Errors IDLE'}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider block mb-1 select-none">UI Crash Handling</span>
              <Button
                onClick={() => {
                  logClick('Simulate UI Crash Trigger');
                  setShouldCrash(true);
                }}
                icon={ShieldAlert}
                variant="danger"
                size="sm"
                fullWidth
              >
                Crash Rendering Frame
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main activities Table Card */}
      <Card>
        <CardHeader
          title="Recent Developer Activities"
          description="A filterable records ledger representing developer events. Actions route through the central logging system."
          action={
            <div className="flex items-center gap-2">
              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  logClick(`Status Filter selection: ${e.target.value}`);
                  setStatusFilter(e.target.value);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none transition-colors"
                aria-label="Filter activities by status"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success Only</option>
                <option value="Failed">Failed Only</option>
              </select>
            </div>
          }
        />
        
        {/* Search & Statistics Display */}
        <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search developer, action, resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 placeholder-slate-400 text-slate-700 dark:text-slate-200 focus:outline-none"
              aria-label="Search activities table"
            />
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-450 select-none">
            <span>Filtered count: {filteredActivities.length}</span>
            <span>Total rows: {activities.length}</span>
          </div>
        </div>

        {/* Activities Table */}
        <Table
          columns={columns}
          data={filteredActivities}
          isLoading={loadingActivities}
          emptyMessage="No activities match your search parameters."
        />
      </Card>
    </div>
  );
};

export default Dashboard;
