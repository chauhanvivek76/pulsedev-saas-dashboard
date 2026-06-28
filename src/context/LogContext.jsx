import { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToLogs, logger, LOG_CATEGORIES } from '../middleware/logger';

const LogContext = createContext(null);

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Subscribe to all logs emitted by the logger middleware
    const unsubscribe = subscribeToLogs((newLog) => {
      setLogs((prevLogs) => {
        // Keep logs capped at 250 to avoid memory bloat
        const capped = [newLog, ...prevLogs];
        if (capped.length > 250) {
          capped.pop();
        }
        return capped;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
    logger.info(LOG_CATEGORIES.APP, 'Cleared logging console history');
  };

  const exportLogs = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pulsedev_logs_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      logger.info(LOG_CATEGORIES.APP, 'Exported log file successfully');
    } catch (error) {
      logger.error(LOG_CATEGORIES.ERROR, 'Failed to export logs', { error: error.message });
    }
  };

  return (
    <LogContext.Provider value={{ logs, clearLogs, exportLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogContext must be used within a LogProvider');
  }
  return context;
};
