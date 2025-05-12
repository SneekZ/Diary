import { type FC, useContext, useState, useEffect } from "react";
import { NoteContext } from "../../context/note/NoteContext";
import styles from "./Diary.module.scss";
import {
  Button,
  Input,
  DatePicker,
  Modal,
  TimePicker,
  ColorPicker,
} from "antd";
import { type NoteModel } from "../../structures/Note";
import dayjs from "dayjs";
import { UserContext } from "../../context/user/UserContext";

const DiaryPage: FC = () => {
  const { notes, refreshNotes } = useContext(NoteContext);

  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [filteredNotes, setFilteredNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    refreshNotes(() => {});
  }, [refreshNotes]);

  useEffect(() => {
    setFilteredNotes(
      Array.from(notes.values())
        .filter((value) => checkNoteDate(value, filterDate))
        .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime())
    );
    console.log(
      Array.from(notes.values())
        .filter((value) => checkNoteDate(value, filterDate))
        .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime())
    );
  }, [filterDate, notes]);

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.title_container}>
          <span>Заметки на </span>
          <DatePicker
            placeholder="Выберите дату..."
            onChange={(date) => setFilterDate(date.toDate())}
            defaultValue={dayjs(new Date())}
          />
        </div>
        <div className={styles.notes_container}>
          {filteredNotes.map((item) => (
            <NoteComponent key={item.id} note={item} />
          ))}
        </div>
        <AddNote />
        <LogoutButton />
      </div>
    </>
  );
};

const NoteComponent: FC<{ note: NoteModel }> = ({ note }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [dateStart, setDateStart] = useState<Date>(new Date(note.dateStart));
  const [dateEnd, setDateEnd] = useState<Date>(new Date(note.dateEnd));
  const [text, setText] = useState<string>(note.text);
  const [color, setColor] = useState<string>(note.color);

  const [validDates, setValidDates] = useState<boolean>(false);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { patchNote, deleteNote } = useContext(NoteContext);

  useEffect(() => {
    setDateStart(new Date(note.dateStart));
    setDateEnd(new Date(note.dateEnd));
    setText(note.text);
    setColor(note.color);
  }, [note]);

  useEffect(() => {
    if (dateStart > dateEnd) {
      setValidDates(false);
    } else {
      setValidDates(true);
    }
    console.log(dateStart > dateEnd);
  }, [dateStart, dateEnd]);

  const handleSave = () => {
    setLoadingSave(true);
    patchNote(
      {
        id: note.id,
        dateStart: dateStart,
        dateEnd: dateEnd,
        text: text,
        color: color,
      },
      () => {
        setModalOpen(false);
      },
      () => {
        setLoadingSave(false);
      }
    );
  };

  const handleDelete = () => {
    setLoadingDelete(true);
    deleteNote(
      {
        id: note.id,
        dateStart: dateStart,
        dateEnd: dateEnd,
        text: text,
        color: color,
      },
      () => {
        setLoadingDelete(false);
        setModalOpen(false);
      }
    );
  };

  useEffect(() => {
    console.log(note.id);
  }, [note]);

  return (
    <>
      <div
        className={styles.note}
        style={{ backgroundColor: `#${note.color}` }}
        onClick={() => setModalOpen(true)}
      >
        <div style={{ fontSize: "20px" }}>{shortText(note.text)}</div>
        <div>
          {normalizeTime(note.dateStart)} - {normalizeTime(note.dateEnd)}
        </div>
      </div>
      <Modal
        title="Редактировать запись"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              type="primary"
              danger
              onClick={handleDelete}
              loading={loadingDelete}
            >
              Удалить
            </Button>
            <Button
              type="primary"
              loading={loadingSave}
              disabled={!validDates}
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </>
        )}
      >
        <div className={styles.modal_container}>
          <div style={{ display: "flex", gap: "16px" }}>
            <TimePicker
              style={{ flex: 1 }}
              onChange={(time) => setDateStart(time.toDate())}
              defaultValue={dayjs(dateStart)}
            />
            <TimePicker
              style={{ flex: 1 }}
              onChange={(time) => setDateEnd(time.toDate())}
              defaultValue={dayjs(dateEnd)}
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Input
              defaultValue={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Описание записи"
              style={{ flex: 0.9 }}
            />
            <ColorPicker
              defaultValue={`#${color}`}
              onChange={(e) => setColor(e.toHex())}
              style={{ flex: 0.1 }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

const AddNote: FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [date, setDate] = useState<Date>(new Date());
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());
  const [text, setText] = useState<string>("");
  const [color, setColor] = useState<string>("000000");

  const [validDates, setValidDates] = useState<boolean>(false);

  const [loadingSave, setLoadingSave] = useState(false);

  const { addNote } = useContext(NoteContext);

  useEffect(() => {
    if (dateStart > dateEnd) {
      setValidDates(false);
    } else {
      setValidDates(true);
    }
    console.log(dateStart > dateEnd);
  }, [dateStart, dateEnd]);

  const handleSave = () => {
    setLoadingSave(true);
    addNote(
      {
        id: 0,
        dateStart: combineDates(date, dateStart),
        dateEnd: combineDates(date, dateEnd),
        text: text,
        color: color,
      },
      () => {
        setModalOpen(false);
      },
      () => {
        setLoadingSave(false);
      }
    );
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Добавить запись
      </Button>
      <Modal
        title="Добавить запись"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              type="primary"
              loading={loadingSave}
              disabled={!validDates}
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </>
        )}
      >
        <div className={styles.modal_container}>
          <DatePicker
            defaultValue={dayjs(date)}
            onChange={(date) => setDate(date.toDate())}
            placeholder="Выберите дату..."
          />
          <div style={{ display: "flex", gap: "16px" }}>
            <TimePicker
              style={{ flex: 1 }}
              onChange={(time) => setDateStart(time.toDate())}
              defaultValue={dayjs(dateStart)}
            />
            <TimePicker
              style={{ flex: 1 }}
              onChange={(time) => setDateEnd(time.toDate())}
              defaultValue={dayjs(dateEnd)}
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Input
              defaultValue={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Описание записи"
              style={{ flex: 0.9 }}
            />
            <ColorPicker
              defaultValue={`#${color}`}
              onChange={(e) => setColor(e.toHex())}
              style={{ flex: 0.1 }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

const LogoutButton: FC = () => {
  const { user, logout } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles.logout_button}>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true);
          logout(() => {
            setLoading(false);
          });
        }}
      >
        Выйти из аккаунта {user.lastName} {user.firstName}
      </Button>
    </div>
  );
};

const checkNoteDate = (note: NoteModel, targetDate: Date): boolean => {
  return (
    targetDate.getDay() >= note.dateStart.getDay() &&
    targetDate.getDay() <= note.dateEnd.getDay()
  );
};

const shortText = (text: string): string => {
  const maxLength = 12;
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const normalizeTime = (date: Date): string => {
  const splitted = date.toTimeString().split(" ")[0].split(":");
  return splitted[0] + ":" + splitted[1];
};

const combineDates = (date: Date, time: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

export default DiaryPage;
