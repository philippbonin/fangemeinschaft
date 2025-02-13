export interface Asset {
  id: string;
  name: string;
  data: Buffer;
  mimetype: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface AssetResponse {
  id: string;
  name: string;
  data: Buffer;
  mimetype: string;
  size: number;
  created_at: string;
  updated_at: string;
}