import {
  createContext,
  FunctionComponent,
  memo,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import {
  DialogControlsContext,
  DialogID,
  IDialogControls,
} from "../context/DialogControlsContext";
import useDialogControls from "../hooks/useDialogControls";

const DialogContext = createContext<
  IDialogControls & { id: DialogID; close: VoidFunction }
>({
  close() {},
  open(_component) {
    return 0;
  },
  id: 0,
});

const Dialog = memo(function Dialog({
  Component,
  id,
}: {
  Component: FunctionComponent;
  id: DialogID;
}) {
  const controls = useDialogControls();

  const close = useCallback(() => controls.close(id), [controls]);

  return (
    <DialogContext.Provider value={{ ...controls, close, id }}>
      <Component />
    </DialogContext.Provider>
  );
});

export default function DialogProvider({ children }: PropsWithChildren) {
  const [components, setComponents] = useState<
    Map<DialogID, FunctionComponent>
  >(new Map());

  const open = useCallback<IDialogControls["open"]>(
    (component: FunctionComponent) => {
      const id = Date.now() as DialogID;

      components.set(id, component);

      setComponents(new Map(components));
      return id;
    },
    [setComponents, components]
  );

  const close = useCallback<IDialogControls["close"]>(
    (id) => {
      components.delete(id);
      setComponents(new Map(components));
    },
    [setComponents, components]
  );

  return (
    <DialogControlsContext.Provider value={{ close, open }}>
      {children}
      {Array.from(components.entries()).map(([id, component]) => (
        <Dialog Component={component} id={id} key={id} />
      ))}
    </DialogControlsContext.Provider>
  );
}
