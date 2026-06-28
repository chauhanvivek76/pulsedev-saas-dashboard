import { logger, LOG_CATEGORIES } from '../middleware/logger';

/**
 * Custom Hook: useLogger
 * 
 * Provides easy helpers for logging interface actions inside components,
 * automatically embedding the component's context.
 * 
 * @param {string} componentName Name of the component using the hook
 */
export const useLogger = (componentName = 'Component') => {
  const logClick = (elementLabel, extraData = {}) => {
    logger.info(
      LOG_CATEGORIES.BUTTON,
      `User clicked button/link: "${elementLabel}"`,
      { component: componentName, ...extraData }
    );
  };

  const logSubmit = (formLabel, extraData = {}) => {
    logger.info(
      LOG_CATEGORIES.FORM,
      `User submitted form: "${formLabel}"`,
      { component: componentName, ...extraData }
    );
  };

  const logCrud = (operation, entityType, entityId, extraData = {}) => {
    logger.info(
      LOG_CATEGORIES.CRUD,
      `CRUD ${operation.toUpperCase()} executed on ${entityType}`,
      { component: componentName, entityId, ...extraData }
    );
  };

  const logInfo = (message, extraData = {}) => {
    logger.info(LOG_CATEGORIES.APP, message, { component: componentName, ...extraData });
  };

  const logWarn = (message, extraData = {}) => {
    logger.warn(LOG_CATEGORIES.APP, message, { component: componentName, ...extraData });
  };

  const logError = (message, errorObj, extraData = {}) => {
    logger.error(
      LOG_CATEGORIES.ERROR,
      `${message}: ${errorObj?.message || errorObj}`,
      { component: componentName, errorStack: errorObj?.stack, ...extraData }
    );
  };

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
