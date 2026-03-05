import { Link2, Github } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Link2 className="h-5 w-5" />
          Shortify
        </a>
        <div className="flex items-center gap-6">
          <a href="#dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
            Dashboard
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
