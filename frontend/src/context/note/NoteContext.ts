import { createContext } from "react";
import { type NoteModel } from "../../structures/Note";

interface NoteContextProps {
  notes: NoteModel[];
  refreshNotes: (callback: () => void) => void;
  addNote: (note: NoteModel, callback: () => void) => void;
  patchNote: (note: NoteModel, callback: () => void) => void;
  deleteNote: (note: NoteModel, callback: () => void) => void;
}

export const NoteContext = createContext<NoteContextProps>({
  notes: [],
  refreshNotes: () => {},
  addNote: () => {},
  patchNote: () => {},
  deleteNote: () => {},
});
