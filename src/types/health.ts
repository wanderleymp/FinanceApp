export interface SystemHealth {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    version: string;
    databases: {
        [key: string]: DatabaseHealth;
    };
    system: SystemMetrics;
}

export interface DatabaseHealth {
    success: boolean;
    database: string;
    responseTime: string;
    version: string;
    activeConnections: string;
}

export interface SystemMetrics {
    cpu: {
        count: number;
        model: string;
        speed: string;
        usage: CPUUsage[];
    };
    memory: {
        total: string;
        free: string;
        used: string;
        usagePercentage: string;
    };
    os: {
        platform: string;
        type: string;
        release: string;
        arch: string;
        uptime: string;
    };
    process: {
        uptime: string;
        memoryUsage: {
            rss: string;
            heapTotal: string;
            heapUsed: string;
            external: string;
            arrayBuffers: string;
        };
        version: string;
        pid: number;
    };
    app: {
        version: string;
        uptime: string;
    };
}

export interface CPUUsage {
    usage: string;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
}
