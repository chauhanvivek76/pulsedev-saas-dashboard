import { useCallback } from 'react';
import { logger, LOG_CATEGORIES } from '../middleware/logger';

/**
 * Custom Hook: useLogger
 * 
 * Provides easy helpers for logging interface actions inside components,
 * automatically embedding the component's context.
 * All helpers are memoized to avoid triggering infinite rendering loops.
 * 
 * @param {string} componentName Name of the component using the hook
 */
export const useLogger = (componentName = 'Component') => {
  const logClick = useCallback((elementLabel, extraData = {}) => {
    logger.info(
      LOG_CATEGORIES.BUTTON,
      `User clicked button/link: "${elementLabel}"`,
      { component: componentName, ...extraData }
    );
  }, [componentName]);

  const logSubmit = useCallback((formLabel, extraData = {}) => {
    logger.info(
      LOG_CATEGORIES.FORM,
      `User submitted form: "${formLabel}"`,
      { component: componentName, ...extraData }
    );
  }, [componentName]);

  const logCrud = useCallback((operation, entityType, entityId, extraData = {}) => {
    logger.info(
      LOG_CATEGORIES.CRUD,
      `CRUD ${operation.toUpperCase()} executed on ${entityType}`,
      { component: componentName, entityId, ...extraData }
    );
  }, [componentName]);

  const logInfo = useCallback((message, extraData = {}) => {
    logger.info(LOG_CATEGORIES.APP, message, { component: componentName, ...extraData });
  }, [componentName]);

  const logWarn = useCallback((message, extraData = {}) => {
    logger.warn(LOG_CATEGORIES.APP, message, { component: componentName, ...extraData });
  }, [componentName]);

  const logError = useCallback((message, errorObj, extraData = {}) => {
    logger.error(
      LOG_CATEGORIES.ERROR,
      `${message}: ${errorObj?.message || errorObj}`,
      { component: componentName, errorStack: errorObj?.stack, ...extraData }
    );
  }, [componentName]);

  return {
    logger,
    logClick,
    logSubmit,
    logCrud,
    logInfo,
    logWarn,
    logError
  };
};

export default useLogger;
