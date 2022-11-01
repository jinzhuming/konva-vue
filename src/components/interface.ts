import { ComponentInternalInstance } from "vue";
import Konva from "konva";

export type TCreatorType = "circle" | "rect" | "polygon";
export interface IShape {
  type: TCreatorType;
  width: number;
  height: number;
  draggable?: boolean;
  radius?: number;
  id: string;
  x: number;
  y: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  closed?: boolean;
}

export interface IInstance extends ComponentInternalInstance {
  __konvaNode: Konva.Node;
}

export interface ICanvasConfig {
  width: number;
  height: number;
}
