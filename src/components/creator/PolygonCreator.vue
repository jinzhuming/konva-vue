<template></template>

<script lang="ts" setup name="creator">
import Konva from "konva";
import { onUnmounted, getCurrentInstance } from "vue";
import { findParentKonva, useHelper } from "../utils";
import { TCreatorType } from "../interface";
import { v4 as uuid } from "uuid";
const instance: any = getCurrentInstance();
defineProps<{
  type?: TCreatorType;
}>();
const helper = useHelper();
helper.next("点击鼠标左键绘制第一个点");
const emit = defineEmits(["onCreateNewShape"]);

const layer: Konva.Layer = findParentKonva(instance).__konvaNode;
const initLine = {
  id: uuid(),
  type: "polygon",
  stroke: "black",
  strokeWidth: 5,
  fill: "red",
};
const shape: Konva.Line = new Konva.Line(initLine);

// 这个是辅助线
const auxiliaryLine: Konva.Line = new Konva.Line({
  points: [],
  stroke: "green",
  strokeWidth: 2,
  lineJoin: "round",
  dash: [10],
});

const stage = layer.getParent();

// 记录当前的路径
const path: number[] = [];

const onMouseMove = ({ evt }: { evt: MouseEvent }) => {
  const closePathX = path[0];
  const closePathY = path[1];
  const lastPathX = path[path.length - 2];
  const lastPathY = path[path.length - 1];
  const x = evt.offsetX;
  const y = evt.offsetY;

  if (!lastPathX || !lastPathY) return;

  //做个吸附效果，如果鼠标当前位置非常接近闭合点，把线移动过去
  if (Math.abs(closePathX - x) <= 5 && Math.abs(closePathY - y) <= 5) {
    auxiliaryLine.setAttrs({
      points: [lastPathX, lastPathY, closePathX, closePathY],
    });
  } else {
    //  辅助线的第一个点永远是 path 的最后一个位置，第二个点是当前鼠标所在的点
    auxiliaryLine.setAttrs({
      points: [lastPathX, lastPathY, x, y],
    });
  }
};

const onMousedown = ({ evt }: { evt: MouseEvent }) => {
  if (!shape || evt.ctrlKey || evt.metaKey || evt.button !== 0) return;

  const x = evt.offsetX;
  const y = evt.offsetY;

  // 判断有没有闭合，方便操作，当点击到起始位置的一定范围内即视为闭合
  if (Math.abs(path?.[0] - x) <= 5 && Math.abs(path?.[1] - y) <= 5) {
    const newShape = { ...initLine, points: path.concat([path[0], path[1]]), closed: true };
    emit("onCreateNewShape", newShape);
    // 结束辅助线监听
    stage.off("mousemove", onMouseMove);
    auxiliaryLine.destroy();
    shape.destroy();
    helper.clear();
    return;
  }

  path.push(...[x, y]);
  shape.setAttrs({ points: path });

  // path只有2个位置(一对x,y)就代表第一次插入，把图形放到 layer 里
  if (path.length === 2) {
    layer.add(auxiliaryLine);
    layer.add(shape);
  }

  // 开启辅助线移动监听
  stage.on("mousemove", onMouseMove);
  helper.next("移动并继续点击鼠标左键绘制下一个点... 单击起始点位闭合图形");
};

stage.on("mousedown", onMousedown);

onUnmounted(() => {
  shape?.destroy();
  auxiliaryLine?.destroy();
  stage.off("mousemove", onMouseMove);
  stage.off("mousedown", onMousedown);
});
</script>
