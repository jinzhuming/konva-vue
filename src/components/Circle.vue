<template></template>

<script lang="ts" setup name="circle">
import Konva from "konva";
import { onUnmounted, getCurrentInstance, defineEmits } from "vue";
import { findParentKonva } from "./utils";
import { syncAttrs } from "./hooks/syncAttrs";
import { syncConfig } from "./hooks/syncConfig";
import { useTransform } from "./hooks/useTransform";
import { IShape } from "./interface";

defineEmits(["onChange"]);
defineProps<{
  config: IShape;
}>();
const instance: any = getCurrentInstance();
const konvaNode = new Konva.Circle();
instance.__konvaNode = konvaNode;

const layer: Konva.Layer = findParentKonva(instance).__konvaNode;

layer?.add(konvaNode);

useTransform(konvaNode);
syncConfig(konvaNode);
syncAttrs(konvaNode);

onUnmounted(() => {
  konvaNode.destroy();
});
</script>
