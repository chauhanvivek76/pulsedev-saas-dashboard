import { useState, useEffect, useMemo, useRef } from 'react';
import { Download, Trash2, Pause, Play, Search, ChevronRight, ChevronDown, TerminalSquare } from 'lucide-react';
import { useLogContext } from '../context/LogContext';
import { useLogger } from '../hooks/useLogger';
import { formatTime } from '../utils/helpers';
import Card, { CardContent } from '../components/common/Card';
import Button from '../components/common/Button';

export const Logs = () => {
  const { logs, clearLogs, exportLogs } = useLogContext();
  const { logInfo, logClick } = useLogger('LogsConsolePage');

  // Page filters
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom states
  const [isPaused, setIsPaused] = useState(false);
  const [frozenLogs, setFrozenLogs] = useState([]);
  const [expandedLogIds, setExpandedLogIds] = useState(new Set());

  // Automatic scrolling anchor
  const logsEndRef = useRef(null);

  useEffect(() => {
    logInfo('Real-time Logs page mounted');
  }, [logInfo]);

  // Sync log array if not paused
  useEffect(() => {
    if (!isPaused) {
      // Defer state update slightly to avoid cascading renders warning
      const handle = requestAnimationFrame(() => {
        setFrozenLogs(logs);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [logs, isPaused]);

  const togglePause = () => {
    logClick(isPaused ? 'Resume live log stream' : 'Pause live log stream');
    setIsPaused(!isPaused);
  };

  const handleClearLogs = () => {
    logClick('Clear log database');
    clearLogs();
  };

  const handleExportLogs = () => {
    logClick('Download log history');
    exportLogs();
  };

  const toggleExpandLog = (id) => {
    setExpandedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter computation
  const filteredLogs = useMemo(() => {
    return frozenLogs.filter((log) => {
      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
      const matchesSearch =
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [frozenLogs, levelFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-900 pb-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TerminalSquare className="text-indigo-600 shrink-0" size={24} />
            Live Logging Console
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Visual inspection grid reflecting actions captured by the centralized logging middleware.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={togglePause}
            variant={isPaused ? 'outline' : 'secondary'}
            size="sm"
            icon={isPaused ? Play : Pause}
          >
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </Button>

          <Button
            onClick={handleClearLogs}
            variant="secondary"
            size="sm"
            icon={Trash2}
            className="text-red-500 hover:text-red-650"
          >
            Clear Screen
          </Button>

          <Button
            onClick={handleExportLogs}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
          {/* Level Badges */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => {
              const active = levelFilter === lvl;
              const classes = {
                ALL: active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350',
                INFO: active ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/20',
                WARN: active ? 'bg-amber-600 text-white' : 'bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 text-amber-650 dark:text-amber-400 border border-amber-250/50 dark:border-amber-800/20',
                ERROR: active ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-250/50 dark:border-red-800/20',
              };

              return (
                <button
                  key={lvl}
                  onClick={() => {
                    logClick(`Log Console Level filter: ${lvl}`);
                    setLevelFilter(lvl);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${classes[lvl]}`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Search Logs */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs message or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 placeholder-slate-400 text-slate-700 dark:text-slate-200 focus:outline-none"
              aria-label="Search console logs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Log Feed Display */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Live Console Feed {isPaused && '(PAUSED)'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Buffer: {filteredLogs.length} logs
          </span>
        </div>

        <div className="bg-slate-950 font-mono text-xs text-slate-300 p-2 overflow-y-auto max-h-[500px] min-h-[300px]">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 py-12 select-none">
              &gt; No active log entries match filter requirements.
            </div>
          ) : (
            <div className="divide-y divide-slate-900">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogIds.has(log.id);
                const hasMetadata = log.data && Object.keys(log.data).length > 0;

                const badgeColors = {
                  INFO: 'text-blue-400 bg-blue-950/40 border border-blue-900/40',
                  WARN: 'text-amber-400 bg-amber-950/40 border border-amber-900/40',
                  ERROR: 'text-red-400 bg-red-950/40 border border-red-900/40',
                };

                return (
                  <div key={log.id} className="py-2.5 hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-start gap-3 px-3">
                      {/* Expanded Toggle Anchor */}
                      {hasMetadata ? (
                        <button
                          onClick={() => toggleExpandLog(log.id)}
                          className="shrink-0 mt-0.5 text-slate-500 hover:text-slate-350 cursor-pointer"
                          aria-label={isExpanded ? 'Collapse log metadata' : 'Expand log metadata'}
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      ) : (
                        <div className="w-3.5 shrink-0" />
                      )}

                      {/* Log Timestamp */}
                      <span className="text-slate-500 shrink-0 select-none">
                        {formatTime(log.timestamp)}
                      </span>

                      {/* Log Level badge */}
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0 select-none ${badgeColors[log.level]}`}>
                        {log.level}
                      </span>

                      {/* Log Category badge */}
                      <span className="text-indigo-400 shrink-0 font-medium select-none">
                        [{log.category}]
                      </span>

                      {/* Log Message */}
                      <span className="text-slate-200 break-words flex-1 selection:bg-slate-800 selection:text-white">
                        {log.message}
                      </span>
                    </div>

                    {/* Metadata Drawer details */}
                    {isExpanded && hasMetadata && (
                      <div className="mt-2 ml-10 mr-4 p-3 bg-slate-900/60 border border-slate-900 rounded-lg text-slate-400 overflow-x-auto select-all">
                        <pre className="text-[10px] leading-relaxed whitespace-pre-wrap">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Logs;
