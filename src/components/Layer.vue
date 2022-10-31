<template>
  <slot />
</template>

<script lang="ts" setup name="layer">
import Konva from "konva";
import { watch, onMounted, onUnmounted, getCurrentInstance, useAttrs } from "vue";
import { findParentKonva } from "./utils";
const attrs = useAttrs();
const instance: any = getCurrentInstance();

const konvaNode = new Konva.Layer();
instance.__konvaNode = konvaNode;

const parentKonvaNode: Konva.Stage = findParentKonva(instance).__konvaNode;

parentKonvaNode?.add(konvaNode);

onUnmounted(() => {
  konvaNode.destroy();
});

watch(
  () => attrs,
  () => {
    konvaNode.setAttrs(attrs);
  },
  { deep: true },
);
</script>
