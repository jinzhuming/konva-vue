<template>
  <slot />
</template>

<script lang="ts" setup name="layer">
import Konva from "konva";
import { watch, onMounted, onUnmounted, getCurrentInstance, useAttrs } from "vue";
import { findParentKonva } from "./utils";
import { syncAttrs } from "./hooks/syncAttrs";

const instance: any = getCurrentInstance();

const konvaNode = new Konva.Layer();
instance.__konvaNode = konvaNode;

const parentKonvaNode: Konva.Stage = findParentKonva(instance).__konvaNode;

parentKonvaNode?.add(konvaNode);

onUnmounted(() => {
  konvaNode.destroy();
});

syncAttrs(konvaNode);
</script>
