<template></template>

<script lang="ts" setup name="circle">
import Konva from "konva";
import { watch, onUnmounted, getCurrentInstance, useAttrs } from "vue";
import { findParentKonva } from "./utils";
import { IShape } from "./interface";
const emit = defineEmits(["onChange"]);
const attrs = useAttrs();
const instance: any = getCurrentInstance();
const props = defineProps<{
  config: IShape;
}>();

const konvaNode = new Konva.Circle(props.config);
instance.__konvaNode = konvaNode;

const tr = new Konva.Transformer();

const parentKonvaNode: Konva.Layer = findParentKonva(instance).__konvaNode;

parentKonvaNode?.add(konvaNode);
parentKonvaNode?.add(tr);

const onDragend = () => {
  emit("onChange", { ...props.config, ...konvaNode.getAttrs() });
};

konvaNode.on("dragend", onDragend);
konvaNode.on("transformend", onDragend);

onUnmounted(() => {
  //销毁
  konvaNode.off("transformend", onDragend);
  konvaNode.off("dragend", onDragend);
  konvaNode.destroy();
  tr.destroy();
});

watch(
  () => props.config,
  () => {
    konvaNode.setAttrs(props.config);
    // 拖拽模式支持缩放
    if (props.config.draggable) {
      tr.nodes([konvaNode]);
    } else {
      tr.nodes([]);
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => attrs,
  () => {
    konvaNode.setAttrs(attrs);
  },
  { deep: true },
);
</script>
