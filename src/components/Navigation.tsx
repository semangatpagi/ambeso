import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { CartSheet } from "./CartSheet";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) {
      checkAdminRole(session.user.id);
    }
  };

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const navLinks = [
    { label: "Collection", href: "/collection", isRoute: true },
    { label: "About", href: "/about", isRoute: true },
    { label: "Blog", href: "/blog", isRoute: true },
    { label: "Projects", href: "#projects", isRoute: false },
    { label: "Charity", href: "#charity", isRoute: false },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-strong py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-foreground tracking-tight hover:text-accent transition-colors">
          AMBESO
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
          )}
          
          <CartSheet />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong mt-4 mx-4 rounded-2xl p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-base font-medium text-foreground/80 hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-foreground/80 hover:text-accent transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
