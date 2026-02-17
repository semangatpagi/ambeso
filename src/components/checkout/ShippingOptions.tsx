import { useState, useEffect } from 'react';
import { Loader2, Truck } from 'lucide-react';

interface CostItem {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface SelectedShipping {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

interface ShippingOptionsProps {
  districtId: string;
  weightGrams: number;
  selected: SelectedShipping | null;
  onSelect: (option: SelectedShipping) => void;
}

const ALLOWED_SERVICES: Record<string, string[]> = {
  jne: ['REG', 'YES', 'OKE'],
  tiki: ['REG', 'ONS', 'ECO'],
};

const SERVICE_LABELS: Record<string, string> = {
  REG: 'Reguler',
  YES: 'One Night Service',
  OKE: 'Ekonomis',
  ONS: 'One Night Service',
  ECO: 'Ekonomis',
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function ShippingOptions({ districtId, weightGrams, selected, onSelect }: ShippingOptionsProps) {
  const [results, setResults] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!districtId || !weightGrams) return;
    fetchCosts();
  }, [districtId, weightGrams]);

  const fetchCosts = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const couriers = ['jne', 'tiki'];
      const allResults: CostItem[] = [];

      for (const courier of couriers) {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rajaongkir`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'cost',
              destination: districtId,
              weight: weightGrams,
              courier,
            }),
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          allResults.push(...data);
        }
      }

      setResults(allResults);
    } catch (err: any) {
      console.error('Failed to fetch shipping costs:', err);
      setError('Gagal memuat ongkir. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Menghitung ongkos kirim...</span>
      </div>
    );
  }

  if (error) {
    return <div className="glass rounded-2xl p-6 text-center text-destructive text-sm">{error}</div>;
  }

  if (results.length === 0) return null;

  const options: (SelectedShipping & { key: string })[] = [];
  for (const item of results) {
    const code = (item.code || '').toLowerCase();
    const allowed = ALLOWED_SERVICES[code] || [];
    const service = item.service || '';
    if (allowed.includes(service)) {
      options.push({
        key: `${code}-${service}`,
        courier: code,
        courierName: item.name || code.toUpperCase(),
        service,
        description: SERVICE_LABELS[service] || item.description || service,
        cost: item.cost || 0,
        etd: (item.etd || '').replace(' day', ''),
      });
    }
  }

  if (options.length === 0) {
    return <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">Tidak ada layanan pengiriman tersedia untuk tujuan ini.</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pilih Kurir & Layanan</h3>
      {options.map((opt) => {
        const isSelected = selected?.courier === opt.courier && selected?.service === opt.service;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect({ courier: opt.courier, courierName: opt.courierName, service: opt.service, description: opt.description, cost: opt.cost, etd: opt.etd })}
            className={`w-full glass rounded-xl p-4 flex items-center gap-4 text-left transition-all ${isSelected ? 'ring-2 ring-accent border-accent' : 'hover:bg-muted/50'}`}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{opt.courier.toUpperCase()} — {opt.description}</p>
              <p className="text-xs text-muted-foreground">Estimasi {opt.etd} hari</p>
            </div>
            <p className="font-bold text-accent shrink-0">{formatPrice(opt.cost)}</p>
          </button>
        );
      })}
    </div>
  );
}
