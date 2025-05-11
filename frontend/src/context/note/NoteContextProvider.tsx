import httpClient from "../../api/axiosConfig";
import { NoteContext } from "./NoteContext";
import { type NoteModel } from "../../structures/Note";
import { type FC, useState, useCallback, type ReactNode } from "react";
import { notification } from "antd";

const NoteContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const [notes, setNotes] = useState<NoteModel[]>([]);

  const refreshNotes = useCallback(
    async (callback: () => void) => {
      httpClient
        .get("/note/")
        .then((response) => {
          setNotes(response.data as unknown as NoteModel[]);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  const addNote = useCallback(
    async (note: NoteModel, callback: () => void) => {
      httpClient
        .post("/note/", {
          ...note,
        })
        .then(() => {
          setNotes((prev) => {
            return [...prev, note];
          });
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  const patchNote = useCallback(
    async (note: NoteModel, callback: () => void) => {
      httpClient
        .patch("/note/", {
          ...note,
        })
        .then((response) => {
          setNotes((prev) => {
            return [...prev, response.data as unknown as NoteModel];
          });
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  const deleteNote = useCallback(
    async (note: NoteModel, callback: () => void) => {
      httpClient
        .delete(`/note/${note.id}`)
        .then(() => {
          setNotes((prev) => prev.filter((value) => value.id !== note.id));
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
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
