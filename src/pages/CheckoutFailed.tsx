import { useSearchParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Pembayaran Gagal</h1>
          <p className="text-muted-foreground mb-8">
            Pembayaran tidak berhasil diproses. Silakan coba lagi.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/store">Kembali ke Store</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/checkout">Coba Lagi</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
