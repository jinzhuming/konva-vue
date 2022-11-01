<template></template>

<script lang="ts" setup name="polygon">
import Konva from "konva";
import { onUnmounted, getCurrentInstance, defineEmits } from "vue";
import { findParentKonva } from "./utils";
import { useTransform } from "./hooks/useTransform";
import { syncConfig } from "./hooks/syncConfig";
import { syncAttrs } from "./hooks/syncAttrs";
import { IShape } from "./interface";
defineEmits(["onChange"]);
defineProps<{
  config: IShape;
}>();

const instance: any = getCurrentInstance();

const konvaNode = new Konva.Line();
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
