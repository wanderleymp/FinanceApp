import React, { useEffect, useState } from 'react';
import { SystemHealth } from '../../types/health';
import { HealthService } from '../../services/HealthService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Activity, Database, Cpu, HardDrive } from 'lucide-react';

const SystemHealthComponent: React.FC = () => {
    const [healthData, setHealthData] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealthData = async () => {
        try {
            const data = await HealthService.getSystemHealth();
            setHealthData(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch system health data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthData();
        const interval = setInterval(fetchHealthData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );
    
    if (error) return (
        <div className="flex items-center justify-center h-screen text-red-500">
            Error: {error}
        </div>
    );

    if (!healthData) return null;

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">System Health Dashboard</h1>
                <Badge variant={healthData.status === 'healthy' ? 'success' : 'destructive'}>
                    {healthData.status.toUpperCase()}
                </Badge>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="databases">Databases</TabsTrigger>
                    <TabsTrigger value="system">System Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <Activity className="h-6 w-6" />
                                    <span className="text-lg font-semibold">
                                        {healthData.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Version</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-semibold">
                                    {healthData.version}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Last Updated</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-semibold">
                                    {new Date(healthData.timestamp).toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="databases">
                    <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(healthData.databases).map(([key, db]) => (
                            <Card key={key}>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Database className="h-5 w-5" />
                                        <span>{key}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <Badge variant={db.success ? 'success' : 'destructive'}>
                                                {db.success ? 'Online' : 'Offline'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Response Time:</span>
                                            <span>{db.responseTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Active Connections:</span>
                                            <span>{db.activeConnections}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Version:</span>
                                            <span>{db.version}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="system">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Cpu className="h-5 w-5" />
                                    <span>CPU</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <div className="mb-2 flex justify-between">
                                            <span>Model:</span>
                                            <span>{healthData.system.cpu.model}</span>
                                        </div>
                                        <div className="mb-2 flex justify-between">
                                            <span>Cores:</span>
                                            <span>{healthData.system.cpu.count}</span>
                                        </div>
                                        <div className="mb-2 flex justify-between">
                                            <span>Speed:</span>
                                            <span>{healthData.system.cpu.speed}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HardDrive className="h-5 w-5" />
                                    <span>Memory</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Total:</span>
                                        <span>{healthData.system.memory.total}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Usage</span>
                                            <span>{healthData.system.memory.usagePercentage}</span>
                                        </div>
                                        <Progress 
                                            value={parseFloat(healthData.system.memory.usagePercentage)} 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SystemHealthComponent;
