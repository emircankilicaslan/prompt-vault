# Prompt Vault 🗂️

AI Prompt Kayıt Sistemi — Next.js + FastAPI + Supabase

---

## Proje Yapısı

```
prompt-vault/
├── frontend/          # Next.js 14 (App Router)
├── backend/           # FastAPI (Python)
├── supabase/          # SQL migration
└── .gitignore
```

---

## 1. Supabase Kurulumu

1. [supabase.com](https://supabase.com) → **New Project** oluştur
2. Sol menüden **SQL Editor** aç
3. `supabase/migration.sql` dosyasının içeriğini yapıştır → **Run**
4. **Project Settings → API** sayfasından şunları kopyala:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

---

## 2. Backend — Lokal Çalıştırma

```bash
cd backend

# Sanal ortam oluştur
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# .env dosyasını oluştur
cp .env.example .env
# .env içini Supabase bilgilerinle doldur

# Sunucuyu başlat
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

---

## 3. Frontend — Lokal Çalıştırma

```bash
cd frontend
npm install

cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000 yaz

npm run dev
# → http://localhost:3000
```

---

## 4. Backend Deployment — Railway

Backend için Railway kullan (ücretsiz tier mevcut):

1. [railway.app](https://railway.app) → GitHub ile giriş yap
2. **New Project → Deploy from GitHub repo**
3. `backend/` klasörünü root olarak seç
4. **Environment Variables** ekle:
   ```
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy tamamlandığında Railway sana bir URL verir (örn: `https://prompt-vault-api.up.railway.app`)

---

## 5. Frontend Deployment — Vercel

1. [vercel.com](https://vercel.com) → GitHub ile giriş yap
2. **Add New Project → Import** → reponu seç
3. **Root Directory:** `frontend`
4. **Environment Variables** ekle:
   ```
   NEXT_PUBLIC_API_URL=https://prompt-vault-api.up.railway.app
   ```
5. **Deploy** → Vercel sana bir URL verir

---

## 6. GitHub Repo Oluşturma

```bash
# Proje klasöründe
git init
git add .
git commit -m "feat: initial commit - prompt vault"

# GitHub'da yeni repo aç (boş), sonra:
git remote add origin https://github.com/KULLANICI_ADIN/prompt-vault.git
git branch -M main
git push -u origin main
```

---

## Ortam Değişkenleri

### Backend (`.env`)
| Değişken | Açıklama |
|---|---|
| `SUPABASE_URL` | Supabase proje URL'i |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key |
| `FRONTEND_URL` | Vercel app URL'i (CORS için) |

### Frontend (`.env.local`)
| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_API_URL` | Railway backend URL'i |

---

## API Endpoints

| Method | URL | Açıklama |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/prompts` | Tüm promptları listele |
| `POST` | `/prompts` | Yeni prompt kaydet |

**POST `/prompts` body:**
```json
{ "content": "Bana bir Python scripti yaz..." }
```

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, Supabase Python SDK
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (frontend), Railway (backend)
- **Version Control:** GitHub
