<template></template>

<script lang="ts" setup name="creator">
import Konva from "konva";
import { watch, onMounted, onUnmounted, getCurrentInstance, inject, Ref } from "vue";
import { findParentKonva, useHelper } from "../utils";
import { v4 as uuid } from "uuid";
import { IShape, TCreatorType } from "../interface";
const instance: any = getCurrentInstance();
const props = defineProps<{
  type?: TCreatorType;
}>();
const helper = useHelper();
const emit = defineEmits(["onCreateNewShape"]);

const layer: Konva.Layer = findParentKonva(instance).__konvaNode;
onMounted(() => {
  let shape: Konva.Circle | Konva.Rect | null = null;
  watch(
    () => props.type,
    () => {
      if (props.type === "circle") {
        shape = new Konva.Circle();
      } else if (props.type === "rect") {
        shape = new Konva.Rect();
      }

      if (shape) {
        layer.removeChildren();

        helper.next("按下鼠标绘制图形");

        layer.add(shape);
      }
    },
  );

  const stage = layer.getParent();

  // 记录初始的位置
  let initPosition: { x: number; y: number } | null = null;

  // 移动的时候改变图形
  const onMouseMove = ({ evt }: { evt: MouseEvent }) => {
    if (!shape || !initPosition) return;
    let x = initPosition.x;
    let y = initPosition.y;

    // 宽高永远等于初始位置和当前位置之间的差
    const width = Math.abs(initPosition.x - evt.offsetX);
    const height = Math.abs(initPosition.y - evt.offsetY);

    // 当前位置小于初始位置，代表是反向画图，x 设置为当前位置
    if (evt.offsetX < x) {
      x = evt.offsetX;
    }
    if (evt.offsetY < y) {
      y = evt.offsetY;
    }

    shape!.setAttrs({
      width,
      x: props.type === "circle" ? x + width / 2 : x,
      y: props.type === "circle" ? y + height / 2 : y,
      height,
    });

    helper.next("继续移动鼠标绘制图形... 抬起鼠标创建图形");
  };

  const onMouseUp = () => {
    // 删除监听，同时把新图形 emit 出去
    stage?.off("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    if (!shape) return;
    // 插入一个新图形
    const newShape: IShape = {
      type: props.type!,
      x: shape.getPosition().x,
      y: shape.getPosition().y,
      id: uuid(),
      width: shape.getSize().width,
      height: shape.getSize().height,
    };
    emit("onCreateNewShape", newShape);
    shape.destroy();
    shape = null;
    helper.clear();
  };

  const onMousedown = ({ evt, ...props }: { evt: MouseEvent }) => {
    if (!shape || evt.ctrlKey || evt.metaKey || evt.button !== 0) return;

    initPosition = {
      x: evt.offsetX,
      y: evt.offsetY,
    };

    // 插入一个新图形
    shape.setAttrs({ ...initPosition, fill: "red" });
    layer.add(shape);
    stage.on("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    helper.next("移动鼠标绘制图形");
  };

  stage.on("mousedown", onMousedown);

  onUnmounted(() => {
    shape?.destroy();
    window.removeEventListener("mouseup", onMouseUp);
    stage.off("mousemove", onMouseMove);
    stage.off("mousedown", onMousedown);
  });
});
</script>
