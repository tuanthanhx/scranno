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
  index: number;
  imageUrl: string;
  file: File | null;
  width: number;
  height: number;
  addingRectangle: boolean;
  selections: Selection[];
}

export interface Board {
  id: string;
  title: string;
  screens: Screen[];
}
