import * as fabric from "fabric"; // Fabric v6

const useObjectControls = (canvas?: fabric.Canvas) => {
  let clonedObject: fabric.Object | null = null;

  const deleteActiveObjects = () => {
    const activeObjects = canvas?.getActiveObjects();
    if (!canvas || !activeObjects?.length) return;

    activeObjects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const copy = async () => {
    const active = canvas?.getActiveObject();
    if (!active || !canvas) return;

    clonedObject = await active.clone();
    canvas.discardActiveObject();
  };

  const cut = async () => {
    const active = canvas?.getActiveObject();
    if (!active) return;

    clonedObject = await active.clone();
    deleteActiveObjects();
  };

  const paste = async () => {
    if (!canvas || !clonedObject) return;

    // reclone pour faire plusieurs copies
    const clone = await clonedObject.clone();

    canvas.discardActiveObject();
    canvas.add(clone);
    canvas.centerObjectH(clone);
    canvas.centerObjectV(clone);

    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const lock = () => {
    const activeObjects = canvas?.getActiveObjects();
    if (!canvas || !activeObjects?.length) return;

    activeObjects.forEach(obj => {
      obj.lockMovementX = !obj.lockMovementX;
      obj.lockMovementY = !obj.lockMovementY;
      obj.lockRotation = !obj.lockRotation;
      obj.lockScalingX = !obj.lockScalingX;
      obj.lockScalingY = !obj.lockScalingY;
      obj.lockSkewingX = !obj.lockSkewingX;
      obj.lockSkewingY = !obj.lockSkewingY;
    });

    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return {
    deleteActiveObjects,
    copy,
    cut,
    paste,
    lock,
  };
};

export default useObjectControls;
