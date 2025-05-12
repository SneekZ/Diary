import httpClient from "../../api/axiosConfig";
import { NoteContext } from "./NoteContext";
import { type NoteModel } from "../../structures/Note";
import { type FC, useState, useCallback, type ReactNode } from "react";
import { notification } from "antd";

const NoteContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const [notes, setNotes] = useState<Map<number, NoteModel>>(
    new Map<number, NoteModel>()
  );

  const refreshNotes = useCallback(
    async (callback: () => void) => {
      httpClient
        .get("/note/")
        .then((response) => {
          const noteList = response.data as unknown as NoteModel[];
          const noteMap = new Map<number, NoteModel>();
          noteList.map((value) =>
            noteMap.set(value.id, {
              ...value,
              dateStart: new Date(value.dateStart),
              dateEnd: new Date(value.dateEnd),
            })
          );
          setNotes(noteMap);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              typeof e.response?.data?.detail === "object"
                ? JSON.stringify(e.response.data.detail)
                : e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  const addNote = useCallback(
    async (
      note: NoteModel,
      positiveCallback: () => void,
      callback: () => void
    ) => {
      httpClient
        .post("/note/", {
          ...note,
        })
        .then((response) => {
          const note = response.data as unknown as NoteModel;
          const noteMap = new Map<number, NoteModel>(notes);
          noteMap.set(note.id, {
            ...note,
            dateStart: new Date(note.dateStart),
            dateEnd: new Date(note.dateEnd),
          });
          setNotes(noteMap);
          positiveCallback();
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              typeof e.response?.data?.detail === "object"
                ? JSON.stringify(e.response.data.detail)
                : e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api, notes]
  );

  const patchNote = useCallback(
    async (
      note: NoteModel,
      positiveCallback: () => void,
      callback: () => void
    ) => {
      httpClient
        .patch("/note/", {
          ...note,
        })
        .then((response) => {
          const note = response.data as unknown as NoteModel;
          const noteMap = new Map<number, NoteModel>(notes);
          noteMap.set(note.id, {
            ...note,
            dateStart: new Date(note.dateStart),
            dateEnd: new Date(note.dateEnd),
          });
          setNotes(noteMap);
          positiveCallback();
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              typeof e.response?.data?.detail === "object"
                ? JSON.stringify(e.response.data.detail)
                : e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api, notes]
  );

  const deleteNote = useCallback(
    async (note: NoteModel, callback: () => void) => {
      httpClient
        .delete(`/note/${note.id}`)
        .then(() => {
          const noteMap = new Map<number, NoteModel>(notes);
          noteMap.delete(note.id);
          setNotes(noteMap);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              typeof e.response?.data?.detail === "object"
                ? JSON.stringify(e.response.data.detail)
                : e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api, notes]
  );

  return (
    <NoteContext
      value={{ notes, refreshNotes, addNote, patchNote, deleteNote }}
    >
      {contextHolder}
      {children}
    </NoteContext>
  );
};

export default NoteContextProvider;
