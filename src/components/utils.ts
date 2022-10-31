export function findParentKonva(instance: any) {
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
}
