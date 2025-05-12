import { createContext } from "react";
import { type NoteModel } from "../../structures/Note";

interface NoteContextProps {
  notes: Map<number, NoteModel>;
  refreshNotes: (callback: () => void) => void;
  addNote: (
    note: NoteModel,
    positiveCallback: () => void,
    callback: () => void
  ) => void;
  patchNote: (
    note: NoteModel,
    positiveCallback: () => void,
    callback: () => void
  ) => void;
  deleteNote: (note: NoteModel, callback: () => void) => void;
}

export const NoteContext = createContext<NoteContextProps>({
  notes: new Map<number, NoteModel>(),
  refreshNotes: () => {},
  addNote: () => {},
  patchNote: () => {},
  deleteNote: () => {},
});
