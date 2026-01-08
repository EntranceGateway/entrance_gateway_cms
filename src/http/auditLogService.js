/**
 * Audit Log Service
 * Handles all interactions with the audit log API endpoints.
 * SECURITY: Requires SUPER_ADMIN role for all operations.
 */

import API from './index';
import { handleApiError } from "./utils/errorHandler";
import { API_ENDPOINTS } from '../auth/config/securityConfig';

// Define audit log specific endpoints if not in securityConfig yet
const AUDIT_ENDPOINTS = {
  base: '/api/v1/audit-logs',
  byId: (id) => `/api/v1/audit-logs/${id}`,
  byAdmin: '/api/v1/audit-logs/by-admin',
  byAction: '/api/v1/audit-logs/by-action',
  byEntity: '/api/v1/audit-logs/by-entity',
  byDateRange: '/api/v1/audit-logs/by-date-range',
  loginAttempts: '/api/v1/audit-logs/login-attempts',
  actions: '/api/v1/audit-logs/actions'
};

/**
 * Get all audit logs with pagination and sorting
 * @param {Object} params - Query parameters (page, size, sortBy, sortDir)
 * @returns {Promise<Object>} Response data
 */
export const getAllAuditLogs = async ({ page = 0, size = 20, sortBy = 'timestamp', sortDir = 'desc' } = {}) => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.base, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get audit log by ID
 * @param {number|string} id - Log ID
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogById = async (id) => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.byId(id));
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get audit logs by Admin Email
 * @param {string} email - Admin email
 * @param {Object} params - Pagination params
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByAdmin = async (email, { page = 0, size = 20, sortBy = 'timestamp', sortDir = 'desc' } = {}) => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.byAdmin, {
      params: { email, page, size, sortBy, sortDir }
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get audit logs by Action Type
 * @param {string} action - Action type
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByAction = async (action) => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.byAction, {
      params: { action }
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get audit logs by Entity Type
 * @param {string} entityType - Entity type
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByEntity = async (entityType) => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.byEntity, {
      params: { entityType }
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get audit logs by Date Range
 * @param {string} startDate - ISO start date
 * @param {string} endDate - ISO end date
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByDateRange = async (startDate, endDate) => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.byDateRange, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get login attempts (security monitoring)
 * @returns {Promise<Object>} Response data
 */
export const getLoginAttempts = async () => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.loginAttempts);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

/**
 * Get available action types
 * @returns {Promise<Object>} Response data
 */
export const getAuditActions = async () => {
  try {
    const response = await API.get(AUDIT_ENDPOINTS.actions);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByAdmin,
  getAuditLogsByAction,
  getAuditLogsByEntity,
  getAuditLogsByDateRange,
  getLoginAttempts,
  getAuditActions
};
