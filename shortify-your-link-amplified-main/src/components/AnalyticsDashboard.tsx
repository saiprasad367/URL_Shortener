import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, Search, ArrowUpDown, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import type { ShortenedUrl } from "@/types/url";

interface AnalyticsDashboardProps {
  urls: ShortenedUrl[];
  onDelete: (id: string) => void;
}

type SortField = "clicks" | "createdAt";

const AnalyticsDashboard = ({ urls, onDelete }: AnalyticsDashboardProps) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = urls.filter(
      (u) =>
        u.shortUrl.toLowerCase().includes(search.toLowerCase()) ||
        u.originalUrl.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      const aVal = sortField === "clicks" ? a.clicks : new Date(a.createdAt).getTime();
      const bVal = sortField === "clicks" ? b.clicks : new Date(b.createdAt).getTime();
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return result;
  }, [urls, search, sortField, sortDir]);

  const truncate = (s: string, max = 40) =>
    s.length > max ? s.slice(0, max) + "..." : s;

  if (urls.length === 0) return null;

  return (
    <motion.section
      id="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="py-16"
    >
      <div className="container">
        <h2 className="text-2xl font-bold mb-8">Analytics Dashboard</h2>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search URLs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 border-foreground/20 focus-visible:ring-foreground"
            />
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Short URL</TableHead>
                  <TableHead className="font-semibold">Original URL</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-semibold -ml-3 hover:bg-transparent"
                      onClick={() => toggleSort("clicks")}
                    >
                      Clicks <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-semibold -ml-3 hover:bg-transparent"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Created <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Expiry</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                        {url.shortUrl.replace("https://", "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger className="text-left text-muted-foreground">
                          {truncate(url.originalUrl)}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-all">
                          {url.originalUrl}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="tabular-nums">{url.clicks}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(url.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {url.expiresAt
                        ? format(new Date(url.expiresAt), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          url.status === "active"
                            ? "bg-foreground text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {url.status === "active" ? "Active" : "Expired"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(url.id)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No URLs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AnalyticsDashboard;
