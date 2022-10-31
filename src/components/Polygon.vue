<template></template>

<script lang="ts" setup name="polygon">
import Konva from "konva";
import { watch, onUnmounted, getCurrentInstance, useAttrs } from "vue";
import { findParentKonva } from "./utils";
import { IShape } from "./interface";
const attrs = useAttrs();
const emit = defineEmits(["onChange"]);
const instance: any = getCurrentInstance();
const props = defineProps<{
  config: IShape;
}>();

const tr = new Konva.Transformer();

const konvaNode = new Konva.Line(props.config);
instance.__konvaNode = konvaNode;

const parentKonvaNode: Konva.Layer = findParentKonva(instance).__konvaNode;

parentKonvaNode?.add(konvaNode);
parentKonvaNode?.add(tr);

const onDragend = () => {
  emit("onChange", { ...props.config, ...konvaNode.getAttrs() });
};
konvaNode.on("dragend", onDragend);
konvaNode.on("transformend", onDragend);

onUnmounted(() => {
  konvaNode.off("transformend", onDragend);
  konvaNode.off("dragend", onDragend);
  tr.destroy();
  konvaNode.destroy();
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
