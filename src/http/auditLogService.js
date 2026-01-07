/**
 * Audit Log Service
 * Handles all interactions with the audit log API endpoints.
 * SECURITY: Requires SUPER_ADMIN role for all operations.
 */

import API from './index';
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
  const response = await API.get(AUDIT_ENDPOINTS.base, {
    params: { page, size, sortBy, sortDir }
  });
  return response.data;
};

/**
 * Get audit log by ID
 * @param {number|string} id - Log ID
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogById = async (id) => {
  const response = await API.get(AUDIT_ENDPOINTS.byId(id));
  return response.data;
};

/**
 * Get audit logs by Admin Email
 * @param {string} email - Admin email
 * @param {Object} params - Pagination params
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByAdmin = async (email, { page = 0, size = 20, sortBy = 'timestamp', sortDir = 'desc' } = {}) => {
  const response = await API.get(AUDIT_ENDPOINTS.byAdmin, {
    params: { email, page, size, sortBy, sortDir }
  });
  return response.data;
};

/**
 * Get audit logs by Action Type
 * @param {string} action - Action type
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByAction = async (action) => {
  const response = await API.get(AUDIT_ENDPOINTS.byAction, {
    params: { action }
  });
  return response.data;
};

/**
 * Get audit logs by Entity Type
 * @param {string} entityType - Entity type
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByEntity = async (entityType) => {
  const response = await API.get(AUDIT_ENDPOINTS.byEntity, {
    params: { entityType }
  });
  return response.data;
};

/**
 * Get audit logs by Date Range
 * @param {string} startDate - ISO start date
 * @param {string} endDate - ISO end date
 * @returns {Promise<Object>} Response data
 */
export const getAuditLogsByDateRange = async (startDate, endDate) => {
  const response = await API.get(AUDIT_ENDPOINTS.byDateRange, {
    params: { startDate, endDate }
  });
  return response.data;
};

/**
 * Get login attempts (security monitoring)
 * @returns {Promise<Object>} Response data
 */
export const getLoginAttempts = async () => {
  const response = await API.get(AUDIT_ENDPOINTS.loginAttempts);
  return response.data;
};

/**
 * Get available action types
 * @returns {Promise<Object>} Response data
 */
export const getAuditActions = async () => {
  const response = await API.get(AUDIT_ENDPOINTS.actions);
  return response.data;
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
