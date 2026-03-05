import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";

interface HeroSectionProps {
  onGenerate: (url: string, alias: string, expiry: Date | undefined) => void;
  isLoading: boolean;
}

const HeroSection = ({ onGenerate, isLoading }: HeroSectionProps) => {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onGenerate(url.trim(), alias.trim(), expiry);
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-black leading-tight"
        >
          Simplify Your Links.
          <br />
          Amplify Your Reach.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          A scalable URL shortener with real-time analytics and monitoring.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 space-y-4"
        >
          <Input
            type="url"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 text-base px-5 border-foreground/20 focus-visible:ring-foreground"
            required
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Custom alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="h-12 text-sm px-4 border-foreground/20 focus-visible:ring-foreground"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 min-w-[180px] justify-start text-sm border-foreground/20 font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {expiry ? format(expiry, "PPP") : "Set expiry (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={expiry}
                  onSelect={setExpiry}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 w-full text-base font-semibold transition-all duration-150 hover:opacity-90"
          >
            {isLoading ? "Generating..." : "Generate Short Link"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default HeroSection;
