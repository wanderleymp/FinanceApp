import { SystemHealth } from '../types/health';
import apiService from './ApiService';
import config from '../config';
import { mockHealthData } from '../mocks/healthData';

export class HealthService {
    public static async getSystemHealth(): Promise<SystemHealth> {
        try {
            if (config.api.useMock) {
                return mockHealthData;
            }
            const response = await apiService.get<SystemHealth>('/health');
            return response;
        } catch (error) {
            console.error('Error fetching system health:', error);
            throw error;
        }
    }

    public static async getDatabasesHealth(): Promise<SystemHealth['databases']> {
        try {
            if (config.api.useMock) {
                return mockHealthData.databases;
            }
            const response = await apiService.get<SystemHealth['databases']>('/health/databases');
            return response;
        } catch (error) {
            console.error('Error fetching databases health:', error);
            throw error;
        }
    }

    public static async getSystemMetrics(): Promise<SystemHealth['system']> {
        try {
            if (config.api.useMock) {
                return mockHealthData.system;
            }
            const response = await apiService.get<SystemHealth['system']>('/health/system');
            return response;
        } catch (error) {
            console.error('Error fetching system metrics:', error);
            throw error;
        }
    }
}
