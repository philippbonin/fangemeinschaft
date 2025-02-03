export interface Asset {
  id: string;
  name: string;
  data: Buffer;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface AssetResponse {
  id: string;
  name: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}