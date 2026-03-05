import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Clock, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { ShortenedUrl } from "@/types/url";

interface ResultDisplayProps {
  result: ShortenedUrl;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-8"
    >
      <div className="container max-w-2xl">
        <div className="border border-foreground rounded-lg p-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            Your short link
          </p>
          <p className="text-2xl md:text-3xl font-bold break-all">{result.shortUrl}</p>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="border-foreground hover:bg-foreground hover:text-primary-foreground transition-all duration-150"
          >
            {copied ? (
              <><Check className="mr-2 h-4 w-4" /> Copied!</>
            ) : (
              <><Copy className="mr-2 h-4 w-4" /> Copy to Clipboard</>
            )}
          </Button>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format(new Date(result.createdAt), "PPp")}
            </span>
            <span className="flex items-center gap-1">
              <MousePointerClick className="h-3.5 w-3.5" />
              {result.clicks} clicks
            </span>
          </div>
          {result.expiresAt && (
            <p className="text-xs text-muted-foreground">
              Expires: {format(new Date(result.expiresAt), "PPP")}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ResultDisplay;
