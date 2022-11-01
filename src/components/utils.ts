import { inject, Ref } from "vue";

export const findParentKonva = (instance: any) => {
  function re(instance: any): any {
    if (instance.__konvaNode) {
      return instance;
    }
    if (instance.parent) {
      return re(instance.parent);
    }
    console.error("vue-konva error: Can not find parent node");
    return {};
  }
  return re(instance.parent);
};

export const useHelper = () => {
  const h = inject<Ref<string>>("helper");
  return {
    next(content: string) {
      if (!h) return;
      h.value = content;
    },
    clear() {
      if (!h) return;
      h.value = "";
    },
  };
};
