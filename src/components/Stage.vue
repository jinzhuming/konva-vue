<template>
  <div ref="container" class="konva-stage" id="konva_stage"><slot /></div>
</template>

<script lang="ts" setup name="stage">
import Konva from "Konva";
import { ref, watch, onMounted, getCurrentInstance, useAttrs, onUnmounted } from "vue";
const props = defineProps<{ config: { width: number; height: number } }>();
const instance: any = getCurrentInstance();
const attrs = useAttrs();

const container = ref<HTMLDivElement | null>(null);

const konvaNode = new Konva.Stage({
  width: props.config.width,
  height: props.config.height,
  container: document.createElement("div"),
});
konvaNode.setAttrs(attrs);
instance.__konvaNode = konvaNode;

onMounted(() => {
  konvaNode.container(container.value!);
});

onUnmounted(() => {
  konvaNode.removeChildren();
  konvaNode.destroy();
});

watch(
  () => props.config,
  () => {
    konvaNode.size({ width: props.config.width, height: props.config.height });
  },
  { deep: true },
);

watch(
  () => attrs,
  () => {
    konvaNode.setAttrs(attrs);
  },
  { deep: true },
);
</script>
