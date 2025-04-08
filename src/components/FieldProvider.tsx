/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import Field from "../classes/Field";
import {
  FieldContext,
  IMinefield,
  SetMineFunction,
} from "../context/FieldContext";
import useUpdate from "../hooks/useUpdate";
import { Store } from "../classes/Store";
import { updaters } from "../hooks/useMine";
import { useDialogData } from "../hooks/useDialogData";
import useDialogControls from "../hooks/useDialogControls";

export default function FieldProvider({
  width,
  height,
  mines,
  children,
}: IMinefield & React.PropsWithChildren) {
  Field.width = width;
  Field.height = height;
  Field.mines = mines;
  const field = useRef(Field.instance).current;

  const [gameover, setGameover] = useState(false);
  const update = useUpdate();
  const { open } = useDialogControls();

  const set: SetMineFunction = useCallback(
    (x, y, callback) => {
      field.affected = [];
      const mine = field.at(x, y);
      if (!mine) return;

      callback.apply(mine);
      update();

      if (field.checkWin()) {
        alert("Voce Ganhou!");
        setGameover(true);
      }
    },
    [update]
  );

  useEffect(() => {
    if (!gameover) return;
    Store.set("endgame", true);
  }, [gameover]);

  const endGame = useCallback(() => {
    open(GameoverDialog);
    field.reveal();
    field.affected.forEach(([x, y]) => {
      const affected = field.at(x, y);
      if (!affected) return;
      const updater = updaters.get(affected.id);
      if (!updater) return;

      updater();
    });
    setGameover(true);
  }, []);

  return (
    <FieldContext.Provider value={{ set, gameover, endGame }}>
      {children}
    </FieldContext.Provider>
  );
}

function GameoverDialog() {
  const { close } = useDialogData();

  return (
    <div>
      "BOOM! 💣"
      <button onClick={close}>OK</button>
    </div>
  );
}
