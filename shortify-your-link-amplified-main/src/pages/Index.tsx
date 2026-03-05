import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ResultDisplay from "@/components/ResultDisplay";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MetricsPanel from "@/components/MetricsPanel";
import DeleteModal from "@/components/DeleteModal";
import Footer from "@/components/Footer";
import type { ShortenedUrl } from "@/types/url";

const API_URL = import.meta.env.VITE_API_URL || "https://url-shortener-mgz6.onrender.com";

const Index = () => {
  const { toast } = useToast();
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [latestResult, setLatestResult] = useState<ShortenedUrl | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [healthy, setHealthy] = useState(false);
  const [latencyMs, setLatencyMs] = useState(0);

  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/urls`);
      if (res.ok) {
        const data = await res.json();
        const formattedUrls = data.map((u: any) => ({
          id: u.short_code, // use short_code as id for frontend mapping
          shortUrl: `${API_URL}/${u.short_code}`,
          originalUrl: u.long_url,
          clicks: parseInt(u.click_count, 10),
          createdAt: u.created_at,
          expiresAt: u.expiry_at,
          status: (u.expiry_at && new Date(u.expiry_at) < new Date()) ? 'expired' : 'active',
        }));
        setUrls(formattedUrls);
      }
    } catch (e) {
      console.error("Failed to fetch urls", e);
    }
  };

  const fetchHealth = async () => {
    try {
      const start = Date.now();
      const res = await fetch(`${API_URL}/health`);
      setLatencyMs(Date.now() - start);
      if (res.ok) {
        const data = await res.json();
        setHealthy(data.status === 'healthy');
      } else {
        setHealthy(false);
      }
    } catch (e) {
      setHealthy(false);
    }
  };

  useEffect(() => {
    fetchUrls();
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Check health periodically
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (url: string, alias: string, expiry: Date | undefined) => {
    setIsLoading(true);
    try {
      new URL(url);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid URL.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const payload: any = { longUrl: url };
      if (alias) payload.customAlias = alias;
      if (expiry) payload.expiryDate = expiry.toISOString();

      const res = await fetch(`${API_URL}/api/v1/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMsg = data.error || "Failed to create short URL";
        if (data.details && data.details.length > 0) {
          errorMsg = `${errorMsg}: ${data.details[0].message}`;
        }
        throw new Error(errorMsg);
      }

      const newUrl: ShortenedUrl = {
        id: data.shortCode,
        shortUrl: `${API_URL}/${data.shortCode}`,
        originalUrl: url,
        alias: alias || undefined,
        clicks: 0,
        createdAt: data.createdAt,
        expiresAt: data.expiryDate,
        status: "active",
      };

      setUrls((prev) => [newUrl, ...prev]);
      setLatestResult(newUrl);
      toast({ title: "Link created!", description: "Your short URL is ready." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/${deleteTarget}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete URL");

      setUrls((prev) => prev.filter((u) => u.id !== deleteTarget));
      if (latestResult?.id === deleteTarget) setLatestResult(null);
      toast({ title: "Link deleted", description: "The short URL has been removed." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection onGenerate={handleGenerate} isLoading={isLoading} />
        {latestResult && <ResultDisplay result={latestResult} />}
        <AnalyticsDashboard urls={urls} onDelete={(id) => setDeleteTarget(id)} />
        <MetricsPanel
          totalUrls={urls.length}
          totalRedirects={totalClicks}
          cacheHitRatio={cacheHitRatioMock(urls.length)}
          latencyMs={latencyMs}
          healthy={healthy}
        />
      </main>
      <Footer />
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

// Mock calculation based on total URLs to show dynamic data
function cacheHitRatioMock(len: number) {
  if (len === 0) return 0;
  return Math.min(99.9, 85 + (len * 0.5));
}

export default Index;
