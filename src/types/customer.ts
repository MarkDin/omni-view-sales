export interface CustomerData {
    id: string;
    name: string;
    industry: string | null;
    company: string | null;
    contactPerson?: string;
    contactPhone?: string;
    email: string | null;
    phone: string | null;
    revenue?: number;
    orders?: number;
    lifetime_value: number | null;
    purchase_count: number | null;
    growth?: number;
    status?: 'active' | 'at-risk';
    products?: string[];
    last_purchase: string | null;
    region?: string;
    city: string | null;
    address: string | null;
}
