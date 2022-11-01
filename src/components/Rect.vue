<template></template>

<script lang="ts" setup name="rect">
import Konva from "konva";
import { onUnmounted, getCurrentInstance, defineEmits } from "vue";
import { findParentKonva } from "./utils";
import { IShape } from "./interface";
import { useTransform } from "./hooks/useTransform";
import { syncConfig } from "./hooks/syncConfig";
import { syncAttrs } from "./hooks/syncAttrs";

const instance: any = getCurrentInstance();

defineProps<{
  config: IShape;
}>();
defineEmits(["onChange"]);

const konvaNode = new Konva.Rect();
instance.__konvaNode = konvaNode;

const parentKonvaNode: Konva.Layer = findParentKonva(instance).__konvaNode;

parentKonvaNode?.add(konvaNode);

useTransform(konvaNode);
syncConfig(konvaNode);
syncAttrs(konvaNode);

onUnmounted(() => {
  konvaNode.destroy();
});
</script>
