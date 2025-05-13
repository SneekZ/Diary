# 📔 Diary

> Веб-приложение для оставления записей.

---

## ⚙️ Подготовка окружения

После клонирования проекта необходимо создать **по одному** файлу `.env` в каталогах **`backend/`** и **`frontend/`**.

### `.env` для backend

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_SCHEMA=
```

### `.env` для frontend

```env
VITE_BACKEND_URL
```

После создания файлов запустить фронтенд в тестовой среде можно командой

```bash
npm run dev -host 0.0.0.0
```

Бэкенд запускается командой

```bash
python main.py
```

Для миграций используется alembic

```bash
alembic upgrade head
```

Пусть ваши идеи находят безопасный приют в Diary и ни одна мысль не потеряется!
