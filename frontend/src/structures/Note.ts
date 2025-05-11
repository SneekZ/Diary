export interface NoteModel {
  id: number;
  dateStart: Date;
  dateEnd: Date;
  text: string;
  color: string;
}

export const defaultNoteModel: NoteModel = {
  id: 0,
  dateStart: new Date(),
  dateEnd: new Date(),
  text: "",
  color: "ffffff",
};
