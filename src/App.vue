<template>
  <Canvas
    :canvasConfig="{ width: 900, height: 600 }"
    :shapes="shapes"
    @onChange="onChange"
    :creatorType="creatorType"
    @onCreateNewShape="onCreateNewShape"
  />
  <button @click="creatorType = 'circle'">画圆形</button>
  <button @click="creatorType = 'rect'">画矩形</button>
  <button @click="creatorType = 'polygon'">画多边形</button>
  <button @click="setEditMode">{{ editMode ? "关闭" : "开启" }}编辑模式</button>
  <div style="position: fixed; right: 10px; bottom: 20px; color: rgba(0, 0, 0, 0.4)">12</div>
</template>

<script setup lang="ts">
import { v4 as uuid } from "uuid";
import Canvas from "./components/Canvas.vue";
import { compile, computed, ref } from "vue";
import { IShape, TCreatorType } from "./components/interface";
const creatorType = ref<TCreatorType | undefined>();
const editMode = ref<Boolean>(false);

const data = ref<IShape[]>([
  {
    type: "circle",
    id: uuid(),
    x: 120,
    y: 120,
    width: 70,
    height: 70,
    fill: "blue",
  },
  {
    type: "rect",
    id: uuid(),
    x: 20,
    y: 20,
    width: 70,
    height: 70,
    fill: "red",
  },
]);

const shapes = computed(() => data.value.map((item) => ({ ...item, draggable: !!editMode.value })));

const onCreateNewShape = (shape: IShape) => {
  creatorType.value = undefined;

  data.value.push({ ...shape, fill: "red" });
};
const onChange = (shape: IShape) => {
  data.value = data.value.map((item) => {
    if (item.id === shape.id) {
      return { ...shape };
    }
    return item;
  });
};

const setEditMode = () => {
  editMode.value = !editMode.value;
};
</script>
