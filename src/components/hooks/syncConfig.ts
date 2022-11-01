import Konva from "konva";
import { defineProps, getCurrentInstance, watch } from "vue";
import { IShape } from "../interface";

/*
 * 同步 config 配置
 * */
export const syncConfig = (konvaNode: Konva.Shape) => {
  const instance = getCurrentInstance();
  if (!instance) {
    console.error("useTransform: Can not find instance");
    return;
  }
  const props = instance.props;
  watch(
    () => props.config,
    () => {
      konvaNode.setAttrs(props.config);
    },
    { deep: true, immediate: true },
  );
};
