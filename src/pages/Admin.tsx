import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { CategoriesManagement } from "@/components/admin/CategoriesManagement";
import { TrackingCodesManagement } from "@/components/admin/TrackingCodesManagement";
import { Loader2, LayoutDashboard, ShoppingCart, Users, Package, Tag, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0 });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) { navigate("/"); return; }
      setIsAdmin(true);

      // Fetch stats
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("total_amount", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
      ]);

      const totalRevenue = (ordersRes.data || []).reduce((sum, o) => sum + Number(o.total_amount), 0);
      setStats({
        orders: ordersRes.count || 0,
        products: productsRes.count || 0,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Kelola bisnis Ambeso Anda</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="glass border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.orders}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" /> Total Produk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.products}</p>
              </CardContent>
            </Card>
            <Card className="glass border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">{formatPrice(stats.revenue)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="glass border border-border/30 h-auto p-1 flex flex-wrap gap-1 mb-8">
              <TabsTrigger value="orders" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg gap-2">
                <ShoppingCart className="h-4 w-4" /> Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg gap-2">
                <Package className="h-4 w-4" /> Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg gap-2">
                <Tag className="h-4 w-4" /> Kategori
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="tracking" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg gap-2">
                <BarChart3 className="h-4 w-4" /> Tracking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders"><OrdersManagement /></TabsContent>
            <TabsContent value="products"><ProductsManagement /></TabsContent>
            <TabsContent value="categories"><CategoriesManagement /></TabsContent>
            <TabsContent value="users"><UsersManagement /></TabsContent>
            <TabsContent value="tracking"><TrackingCodesManagement /></TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
