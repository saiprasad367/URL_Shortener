import { motion } from "framer-motion";
import { Activity, Link, MousePointerClick, Zap, Heart } from "lucide-react";

interface MetricsPanelProps {
  totalUrls: number;
  totalRedirects: number;
  cacheHitRatio: number;
  latencyMs: number;
  healthy: boolean;
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="border border-foreground rounded-lg p-6 bg-background"
  >
    <div className="flex items-center gap-2 text-muted-foreground mb-3">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-3xl font-bold tabular-nums">{value}</p>
  </motion.div>
);

const MetricsPanel = ({
  totalUrls,
  totalRedirects,
  cacheHitRatio,
  latencyMs,
  healthy,
}: MetricsPanelProps) => {
  return (
    <section className="py-16 border-t border-border">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold">Real-Time Metrics</h2>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              healthy
                ? "bg-foreground text-primary-foreground"
                : "bg-danger text-primary-foreground"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                healthy ? "bg-success" : "bg-danger"
              }`}
            />
            {healthy ? "System Healthy" : "System Unhealthy"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Link} label="Total URLs" value={totalUrls} delay={0} />
          <MetricCard icon={MousePointerClick} label="Total Redirects" value={totalRedirects} delay={0.05} />
          <MetricCard icon={Zap} label="Cache Hit Ratio" value={`${cacheHitRatio}%`} delay={0.1} />
          <MetricCard icon={Activity} label="Latency" value={`${latencyMs}ms`} delay={0.15} />
        </div>
      </div>
    </section>
  );
};

export default MetricsPanel;
