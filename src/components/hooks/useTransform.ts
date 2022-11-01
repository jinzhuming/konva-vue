import Konva from "konva";
import { findParentKonva } from "../utils";
import { computed, ComputedRef, defineEmits, getCurrentInstance, inject, onUnmounted, watch } from "vue";
import { IShape } from "../interface";

/*
 * 使 Shape 支持变形操作
 * */
export const useTransform = (konvaNode: Konva.Shape) => {
  const instance = getCurrentInstance();

  if (!instance) {
    console.error("useTransform: Can not find instance");
    return;
  }
  const emit = instance.emit;
  const props = instance.props;
  if (!emit) {
    console.error("useTransform: 组件必须定义 emit onChange 事件");
    return;
  }
  if (!emit) {
    console.error("useTransform: 组件必须定义 props config 类型");
    return;
  }
  const config = computed(() => props.config) as ComputedRef<IShape>;
  const tr = new Konva.Transformer();
  const layer: Konva.Layer = findParentKonva(instance).__konvaNode;

  layer?.add(tr);

  watch(
    () => config.value.draggable,
    () => {
      if (config.value.draggable) {
        tr.nodes([konvaNode]);
      } else {
        tr.nodes([]);
      }
    },
    { deep: true, immediate: true },
  );

  onUnmounted(() => {
    tr.destroy();
  });
  const onDragend = () => {
    emit("onChange", { ...config.value, ...konvaNode.getAttrs() });
  };
  konvaNode.on("transformend", onDragend);
  konvaNode.on("dragend", onDragend);

  onUnmounted(() => {
    konvaNode.off("transformend", onDragend);
    konvaNode.off("dragend", onDragend);
    konvaNode.destroy();
  });
};
