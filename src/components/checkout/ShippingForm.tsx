import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface LocationItem {
  id: number;
  name: string;
  type?: string;
}

interface SubdistrictItem {
  id: number;
  label: string;
  subdistrict: string;
  zip_code: string;
}

export interface ShippingFormData {
  name: string;
  email: string;
  phone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  kelurahan: string;
  address: string;
  postalCode: string;
  notes: string;
}

interface ShippingFormProps {
  formData: ShippingFormData;
  onChange: (data: ShippingFormData) => void;
}

const callRajaOngkir = async (body: Record<string, unknown>) => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rajaongkir`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return res.json();
};

export default function ShippingForm({ formData, onChange }: ShippingFormProps) {
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [subdistricts, setSubdistricts] = useState<SubdistrictItem[]>([]);
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);
  const [showKelurahanSuggestions, setShowKelurahanSuggestions] = useState(false);
  const kelurahanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadingProvinces(true);
    callRajaOngkir({ action: 'provinces' })
      .then((r) => { if (Array.isArray(r)) setProvinces(r); })
      .catch(console.error)
      .finally(() => setLoadingProvinces(false));
  }, []);

  useEffect(() => {
    if (formData.provinceId) {
      setLoadingCities(true);
      setCities([]);
      setDistricts([]);
      setSubdistricts([]);
      callRajaOngkir({ action: 'cities', province_id: formData.provinceId })
        .then((r) => { if (Array.isArray(r)) setCities(r); })
        .catch(console.error)
        .finally(() => setLoadingCities(false));
    }
  }, [formData.provinceId]);

  useEffect(() => {
    if (formData.cityId) {
      setLoadingDistricts(true);
      setDistricts([]);
      setSubdistricts([]);
      callRajaOngkir({ action: 'districts', city_id: formData.cityId })
        .then((r) => { if (Array.isArray(r)) setDistricts(r); })
        .catch(console.error)
        .finally(() => setLoadingDistricts(false));
    }
  }, [formData.cityId]);

  useEffect(() => {
    if (formData.districtName) {
      setLoadingSubdistricts(true);
      setSubdistricts([]);
      callRajaOngkir({ action: 'subdistricts', district_id: formData.districtName })
        .then((r) => {
          if (Array.isArray(r)) {
            // Filter to only subdistricts matching selected district
            const filtered = r.filter((s: SubdistrictItem) =>
              s.label?.toLowerCase().includes(formData.districtName.toLowerCase())
            );
            setSubdistricts(filtered);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingSubdistricts(false));
    }
  }, [formData.districtName]);

  // Close kelurahan suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (kelurahanRef.current && !kelurahanRef.current.contains(e.target as Node)) {
        setShowKelurahanSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSubdistricts = subdistricts.filter((s) =>
    s.subdistrict?.toLowerCase().includes(formData.kelurahan.toLowerCase())
  );

  const update = (fields: Partial<ShippingFormData>) => {
    onChange({ ...formData, ...fields });
  };

  const renderSelect = (
    id: string,
    label: string,
    value: string,
    loading: boolean,
    disabled: boolean,
    placeholder: string,
    options: { value: string; label: string }[],
    onChangeFn: (val: string) => void
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChangeFn(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 appearance-none"
        >
          <option value="">{loading ? 'Memuat...' : placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {loading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input id="name" required value={formData.name} onChange={(e) => update({ name: e.target.value })} className="bg-muted/50 border-border mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">No. Telepon *</Label>
          <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => update({ phone: e.target.value })} className="bg-muted/50 border-border mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" required value={formData.email} onChange={(e) => update({ email: e.target.value })} className="bg-muted/50 border-border mt-1.5" />
      </div>

      {renderSelect('province', 'Provinsi *', formData.provinceId, loadingProvinces, false, 'Pilih Provinsi',
        provinces.map((p) => ({ value: String(p.id), label: p.name })),
        (val) => {
          const prov = provinces.find((p) => String(p.id) === val);
          update({ provinceId: val, provinceName: prov?.name || '', cityId: '', cityName: '', districtId: '', districtName: '' });
        }
      )}

      {renderSelect('city', 'Kota / Kabupaten *', formData.cityId, loadingCities, !formData.provinceId, 'Pilih Kota / Kabupaten',
        cities.map((c) => ({ value: String(c.id), label: c.name })),
        (val) => {
          const city = cities.find((c) => String(c.id) === val);
          update({ cityId: val, cityName: city?.name || '', districtId: '', districtName: '' });
        }
      )}

      {renderSelect('district', 'Kecamatan *', formData.districtId, loadingDistricts, !formData.cityId, 'Pilih Kecamatan',
        districts.map((d) => ({ value: String(d.id), label: d.name })),
        (val) => {
          const dist = districts.find((d) => String(d.id) === val);
          update({ districtId: val, districtName: dist?.name || '', kelurahan: '', postalCode: '' });
        }
      )}

      <div ref={kelurahanRef} className="relative">
        <Label htmlFor="kelurahan">Desa / Kelurahan *</Label>
        <div className="relative mt-1.5">
          <Input
            id="kelurahan"
            required
            value={formData.kelurahan}
            onChange={(e) => {
              update({ kelurahan: e.target.value });
              setShowKelurahanSuggestions(true);
            }}
            onFocus={() => setShowKelurahanSuggestions(true)}
            className="bg-muted/50 border-border"
            placeholder={loadingSubdistricts ? 'Memuat...' : 'Ketik nama desa/kelurahan'}
            disabled={!formData.districtId}
            autoComplete="off"
          />
          {loadingSubdistricts && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        {showKelurahanSuggestions && filteredSubdistricts.length > 0 && formData.districtId && (
          <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
            {filteredSubdistricts.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  update({ kelurahan: s.subdistrict, postalCode: s.zip_code || formData.postalCode });
                  setShowKelurahanSuggestions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted/80 transition-colors"
              >
                <span className="font-medium">{s.subdistrict}</span>
                {s.zip_code && <span className="text-muted-foreground ml-2">({s.zip_code})</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="address">Alamat Lengkap *</Label>
        <Textarea id="address" required value={formData.address} onChange={(e) => update({ address: e.target.value })} className="bg-muted/50 border-border mt-1.5" rows={3} placeholder="Nama jalan, nomor rumah, RT/RW, dll." />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">Kode Pos (opsional)</Label>
          <Input id="postalCode" value={formData.postalCode} onChange={(e) => update({ postalCode: e.target.value })} className="bg-muted/50 border-border mt-1.5" placeholder="Kode pos" />
        </div>
        <div>
          <Label htmlFor="notes">Catatan (opsional)</Label>
          <Input id="notes" value={formData.notes} onChange={(e) => update({ notes: e.target.value })} className="bg-muted/50 border-border mt-1.5" placeholder="Catatan untuk kurir" />
        </div>
      </div>
    </div>
  );
}
