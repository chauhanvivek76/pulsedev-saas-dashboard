import { useEffect, useState, useMemo, useCallback } from 'react';
import { Activity, ShieldAlert, Cpu, Heart, RefreshCw, PlusCircle, Search, SlidersHorizontal, User } from 'lucide-react';
import { apiService } from '../services/api';
import { useLogger } from '../hooks/useLogger';
import { useToast } from '../components/common/Toast';
import { formatDate } from '../utils/helpers';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';

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
      setMetrics(data);
    } catch (err) {
      logError('Failed to fetch telemetry metrics', err);
      toastError('Could not load telemetry metrics');
    } finally {
      setLoadingMetrics(false);
    }
  }, [logError, toastError]);

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

  useEffect(() => {
    logInfo('Dashboard component loaded');
    loadMetrics();
    loadActivities();
  }, [logInfo, loadMetrics, loadActivities]);

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
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none ${
            row.status === 'Success'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-800/40'
              : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450 border border-red-250 dark:border-red-800/40'
          }`}
        >
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
    <div className="space-y-6">
      {/* Dashboard Top Intro Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-900 pb-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Server Live Telemetry</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Real-time server telemetry counters and simulated developer execution events.
          </p>
        </div>
        
        <Button
          onClick={handleRefreshAll}
          icon={RefreshCw}
          variant="secondary"
          size="sm"
        >
          Refresh Feed
        </Button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <Card className="hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CPU Utilization</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {loadingMetrics ? '---' : `${metrics?.cpuUsage}%`}
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
              <Cpu size={20} />
            </div>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card className="hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Memory Allocation</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {loadingMetrics ? '---' : `${metrics?.memoryUsage}%`}
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
          </CardContent>
        </Card>

        {/* Stat 3 */}
        <Card className="hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Request Load</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {loadingMetrics ? '---' : `${metrics?.requestsPerSecond} rps`}
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
              <Cpu size={20} />
            </div>
          </CardContent>
        </Card>

        {/* Stat 4 */}
        <Card className="hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Latency</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {loadingMetrics ? '---' : `${metrics?.latencyMs} ms`}
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
              <Heart size={20} />
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
