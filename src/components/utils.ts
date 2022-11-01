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

export const randomNum = (maxNum: number) => {
  return parseInt(`${Math.random() * maxNum}`, 10) + 1;
};

export const randomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};
