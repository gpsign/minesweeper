import {
  createContext,
  FunctionComponent,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  DialogControlsContext,
  DialogID,
  IDialogControls,
} from "../context/DialogControlsContext";

enum DialogStatus {
  open,
  closed,
}

interface IDialog<T = any> {
  status: DialogStatus;
  id: DialogID;
  Component: FunctionComponent;
  confirm: (value: T) => void;
  close: VoidFunction;
}

const DialogDataContext = createContext<IDialog | null>(null);

const Dialog = memo(function Dialog({ dialog }: { dialog: IDialog }) {
  return (
    <DialogDataContext.Provider value={{ ...dialog }}>
      <div className="dialog-background" style={{ zIndex: dialog.id }}>
        <dialog open={dialog.status === DialogStatus.open}>
          <dialog.Component />
        </dialog>
      </div>
    </DialogDataContext.Provider>
  );
});

export function useDialogData() {
  const data = useContext(DialogDataContext);
  if (data === null) throw "Deve ser usado em um Dialog!";
  return data;
}

export default function DialogProvider({ children }: PropsWithChildren) {
  const [dialogs, setDialogs] = useState<Map<DialogID, IDialog>>(new Map());

  const open = useCallback<IDialogControls["open"]>(
    (component: FunctionComponent) => {
      return new Promise((resolve) => {
        const id = Date.now() as DialogID;

        const dialog: IDialog = {
          Component: component,
          id,
          status: DialogStatus.open,
          close: () => {
            resolve(null);
            close(id);
          },
          confirm: (value: any) => {
            resolve(value);
            close(id);
          },
        };

        dialogs.set(id, dialog);

        setDialogs(new Map(dialogs));
      });
    },
    [setDialogs, dialogs]
  );

  const close = useCallback<IDialogControls["close"]>(
    (id) => {
      dialogs.delete(id);
      setDialogs(new Map(dialogs));
    },
    [setDialogs, dialogs]
  );

  return (
    <DialogControlsContext.Provider value={{ close, open }}>
      {children}
      {Array.from(dialogs.entries()).map(([id, dialog]) => (
        <Dialog dialog={dialog} key={id} />
      ))}
    </DialogControlsContext.Provider>
  );
}
