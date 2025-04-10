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
  file?: File;
  width: number;
  height: number;
  addingRectangle: boolean;
  status: string;
  selections: Selection[];
}

export interface Board {
  id: string;
  name: string;
  screens: Screen[];
}
