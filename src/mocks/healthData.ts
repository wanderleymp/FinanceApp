export const mockHealthData = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  databases: {
    'Main DB': {
      success: true,
      database: 'PostgreSQL',
      responseTime: '45ms',
      version: '14.5',
      activeConnections: '12'
    },
    'Cache': {
      success: true,
      database: 'Redis',
      responseTime: '2ms',
      version: '6.2.6',
      activeConnections: '8'
    }
  },
  system: {
    cpu: {
      count: 8,
      model: 'Apple M1',
      speed: '3.2 GHz',
      usage: [
        {
          usage: '45%',
          times: {
            user: 123456,
            nice: 0,
            sys: 78901,
            idle: 234567,
            irq: 0
          }
        }
      ]
    },
    memory: {
      total: '16 GB',
      free: '8.5 GB',
      used: '7.5 GB',
      usagePercentage: '47'
    },
    os: {
      platform: 'darwin',
      type: 'Darwin',
      release: '21.6.0',
      arch: 'arm64',
      uptime: '5 days'
    },
    process: {
      uptime: '2 hours',
      memoryUsage: {
        rss: '156 MB',
        heapTotal: '64 MB',
        heapUsed: '32 MB',
        external: '12 MB',
        arrayBuffers: '2 MB'
      },
      version: 'v16.14.2',
      pid: 12345
    },
    app: {
      version: '1.0.0',
      uptime: '2 hours'
    }
  }
};
