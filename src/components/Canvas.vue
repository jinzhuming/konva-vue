<template>
  <div class="canvas" style="background: rgba(0, 0, 0, 0.1)">
    <Stage backgroundColor="red" :config="canvasConfig">
      <Layer>
        <template v-for="shape in shapes">
          <Circle @onChange="onChange" v-if="shape.type === 'circle'" :config="shape" :key="shape.id" />
          <Rect @onChange="onChange" :config="shape" v-if="shape.type === 'rect'" :key="shape.id" />
          <Polygon @onChange="onChange" :config="shape" v-if="shape.type === 'polygon'" :key="shape.id" />
        </template>
      </Layer>
      <Layer>
        <!-- 一部分特殊图形单独走创建 -->
        <PolygonCreator v-if="creatorType === 'polygon'" @onCreateNewShape="onCreateNewShape" :type="creatorType" />
        <Creator v-else @onCreateNewShape="onCreateNewShape" :type="creatorType" />
      </Layer>
    </Stage>
    <Helper />
  </div>
</template>

<script setup lang="ts">
import PolygonCreator from "./creator/PolygonCreator.vue";
import Polygon from "./Polygon.vue";
import Rect from "./Rect.vue";
import Circle from "./Circle.vue";
import Layer from "./Layer.vue";
import Stage from "./Stage.vue";
import { ICanvasConfig, IShape, TCreatorType } from "./interface";
import Creator from "./creator/RectCreator.vue";
import { provide, Ref, ref } from "vue";
import Helper from "./Helper.vue";

const helperContent = ref("");
provide<Ref<string>>("helper", helperContent);

defineProps<{ shapes: IShape[]; creatorType?: TCreatorType; canvasConfig: ICanvasConfig }>();
const emit = defineEmits(["onCreateNewShape", "onChange"]);
const onCreateNewShape = (shape: IShape) => {
  emit("onCreateNewShape", shape);
};
const onChange = (shape: IShape) => {
  emit("onChange", shape);
};
</script>
