export interface Selection {
  id: string;
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
  msg?: string;
  reactions?: string[];
  color?: string;
}

export interface Screen {
  id: string;
  title: string;
  imageUrl: string;
  file?: File | null;
  width: number;
  height: number;
  addingRectangle: boolean;
  selections: Selection[];
}

export interface Board {
  title: string;
  screens: Screen[];
}

export interface ServerBoard extends Board {
  id: string;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
}
