import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ShippingForm, { ShippingFormData } from '@/components/checkout/ShippingForm';
import ShippingOptions, { SelectedShipping } from '@/components/checkout/ShippingOptions';
import { ShoppingBag, Truck, CreditCard, Minus, Plus, Trash2, ArrowLeft, Shield, Loader2 } from 'lucide-react';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function Checkout() {
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [selectedShipping, setSelectedShipping] = useState<SelectedShipping | null>(null);

  const [formData, setFormData] = useState<ShippingFormData>({
    name: '',
    email: '',
    phone: '',
    provinceId: '',
    provinceName: '',
    cityId: '',
    cityName: '',
    districtId: '',
    districtName: '',
    kelurahan: '',
    address: '',
    postalCode: '',
    notes: '',
  });

  const totalWeight = items.reduce((sum, item) => sum + (item.weight_g || 200) * item.quantity, 0);
  const shippingCost = selectedShipping?.cost || 0;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !selectedShipping) return;

    setLoading(true);

    try {
      const fullAddress = [
        formData.address,
        `Kel. ${formData.kelurahan}`,
        `Kec. ${formData.districtName}`,
        formData.cityName,
        formData.provinceName,
        formData.postalCode ? `Kode Pos ${formData.postalCode}` : '',
      ].filter(Boolean).join(', ');

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: fullAddress,
          shipping_city: formData.cityName,
          shipping_postal_code: formData.postalCode || '-',
          total_amount: grandTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const { data: invoiceData, error: invoiceError } = await supabase.functions.invoke(
        'create-xendit-invoice',
        {
          body: {
            orderId: order.id,
            amount: grandTotal,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            items: [
              ...items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              {
                name: `Ongkir ${selectedShipping.courier.toUpperCase()} ${selectedShipping.description}`,
                quantity: 1,
                price: shippingCost,
              },
            ],
          },
        }
      );

      if (invoiceError) throw invoiceError;

      clearCart();

      if (invoiceData?.invoice_url) {
        window.location.href = invoiceData.invoice_url;
      } else {
        toast.success('Order berhasil dibuat!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Gagal membuat order. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'cart', label: 'Keranjang', icon: ShoppingBag },
    { id: 'shipping', label: 'Pengiriman', icon: Truck },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
  ];

  if (items.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Keranjang Kosong</h1>
            <p className="text-muted-foreground mb-8">Belum ada produk di keranjang Anda</p>
            <Button onClick={() => navigate('/store')} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Belanja Sekarang
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.id === 'cart') setStep('cart');
                    if (s.id === 'shipping' && step !== 'cart') setStep('shipping');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    step === s.id
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </button>
                {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {step === 'cart' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Keranjang Belanja</h2>
                  {items.map((item) => (
                    <div key={item.id} className="glass rounded-2xl p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.weight_g}g</p>
                        <p className="text-accent font-bold mt-1">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2 bg-muted rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-border rounded-l-lg transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-border rounded-r-lg transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setStep('shipping')}
                    className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12"
                  >
                    Lanjut ke Pengiriman
                  </Button>
                </div>
              )}

              {step === 'shipping' && (
                <div className="space-y-6">
                  <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                  </button>
                  <h2 className="text-2xl font-bold">Informasi Pengiriman</h2>

                  <ShippingForm formData={formData} onChange={setFormData} />

                  {/* Shipping Options */}
                  {formData.districtId && (
                    <ShippingOptions
                      districtId={formData.districtId}
                      weightGrams={totalWeight}
                      selected={selectedShipping}
                      onSelect={setSelectedShipping}
                    />
                  )}

                  <Button
                    onClick={() => {
                      if (!formData.name || !formData.email || !formData.phone || !formData.provinceId || !formData.cityId || !formData.districtId || !formData.kelurahan || !formData.address) {
                        toast.error('Mohon lengkapi semua field yang wajib diisi');
                        return;
                      }
                      if (!selectedShipping) {
                        toast.error('Pilih layanan pengiriman terlebih dahulu');
                        return;
                      }
                      setStep('payment');
                    }}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12"
                  >
                    Lanjut ke Pembayaran
                  </Button>
                </div>
              )}

              {step === 'payment' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <button type="button" onClick={() => setStep('shipping')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                  </button>
                  <h2 className="text-2xl font-bold">Pembayaran</h2>
                  <div className="glass rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-5 w-5 text-accent" />
                      <p className="text-sm text-muted-foreground">Pembayaran diproses secara aman melalui Xendit</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-medium">Metode pembayaran tersedia:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>• Transfer Bank (BCA, BNI, Mandiri, dll)</span>
                        <span>• E-Wallet (OVO, DANA, GoPay)</span>
                        <span>• Kartu Kredit / Debit</span>
                        <span>• QRIS</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-14 text-lg font-semibold"
                  >
                    {loading ? (
                      <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Memproses...</>
                    ) : (
                      <>Bayar Sekarang — {formatPrice(grandTotal)}</>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 sticky top-28">
                <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkir</span>
                    {selectedShipping ? (
                      <span>{formatPrice(shippingCost)}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Pilih kurir dulu</span>
                    )}
                  </div>
                  {selectedShipping && (
                    <div className="text-xs text-muted-foreground">
                      {selectedShipping.courier.toUpperCase()} {selectedShipping.description} (est. {selectedShipping.etd} hari)
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
