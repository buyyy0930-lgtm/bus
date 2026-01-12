# BSU Chat

Bakı Dövlət Universiteti tələbələri üçün real-time mesajlaşma platforması.

## 🌐 Demo

**Sandbox URL**: https://3000-iys1lmsvwg68a6uyycuuz-2e1b9533.sandbox.novita.ai

**GitHub**: https://github.com/buyyy0930-lgtm/bus

## 📱 Xüsusiyyətlər

### İstifadəçi Funksiyaları
- ✅ @bsu.edu.az email ilə qeydiyyat
- ✅ Telefon nömrəsi validasiyası (+994)
- ✅ 16 fakültə üzrə ayrı qrup chat otaqları
- ✅ Şəxsi mesajlaşma sistemi
- ✅ Doğrulama sualları (korpus məlumatları)
- ✅ Profil şəkli yükləmə
- ✅ İstifadəçi əngəlləmə
- ✅ Şikayət sistemi
- ✅ Real-time mesajlaşma (Socket.IO)
- ✅ Avtomatik mesaj silinmə
- ✅ Profil redaktə
- ✅ Tam mobil uyğunluq

### Admin Funksiyaları
- ✅ Super admin və alt admin sistemi
- ✅ İstifadəçi idarəetməsi (aktiv/deaktiv)
- ✅ Günün mövzusu dəyişikliyi
- ✅ Qaydalar idarəetməsi
- ✅ Filtr sözləri sistemi
- ✅ Şikayət edilən hesabların görüntülənməsi (16+ şikayət)
- ✅ Mesaj silinmə vaxtı tənzimləmələri

## 🚀 Texnologiyalar

- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: In-Memory (MongoDB tələb olunmur)
- **File Upload**: Multer
- **Authentication**: bcryptjs, express-session

## 📦 Quraşdırma

### 1. Clone repository
```bash
git clone https://github.com/buyyy0930-lgtm/bus.git
cd bus
```

### 2. Dependencies yüklə
```bash
npm install
```

### 3. Serveri başlat
```bash
npm start
```

Server `http://localhost:3000` ünvanında işləyəcək.

## 🎯 İstifadə

### Admin Girişi
- **İstifadəçi adı**: 618ursamajor618
- **Şifrə**: 618ursa618

### Test İstifadəçi Qeydiyyatı
1. Qeydiyyat səhifəsinə gedin
2. Email: `test@bsu.edu.az` (istənilən email @bsu.edu.az ilə)
3. Telefon: `+994501234567` (istənilən nömrə)
4. Fakültə, dərəcə və kurs seçin
5. Şifrə təyin edin
6. 3 doğrulama sualından minimum 2-sini düzgün cavablandırın

## 📋 Doğrulama Sualları Cavabları

| Fakültə | Korpus |
|---------|--------|
| Mexanika-riyaziyyat | **3** |
| Tətbiqi riyaziyyat və kibernetika | **3** |
| Fizika | **əsas** |
| Kimya | **əsas** |
| Biologiya | **əsas** |
| Ekologiya və torpaqşünaslıq | **əsas** |
| Coğrafiya | **əsas** |
| Geologiya | **əsas** |
| Filologiya | **1** |
| Tarix | **3** |
| Beynəlxalq münasibətlər və iqtisadiyyat | **1** |
| Hüquq | **1** |
| Jurnalistika | **2** |
| İnformasiya və sənəd menecmenti | **2** |
| Şərqşünaslıq | **2** |
| Sosial elmlər və psixologiya | **2** |

## 🌐 Deploy (Render.com)

### Üstünlük: MongoDB tələb olunmur! ✨

Layihə in-memory database istifadə edir, MongoDB quraşdırmasına ehtiyac yoxdur.

1. **Render.com**-da Web Service yaradın
2. GitHub repository seçin: `buyyy0930-lgtm/bus`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Deploy edin!

**Qeyd**: Server restart olduqda məlumatlar silinir. Production üçün MongoDB əlavə edin.

## 📱 Mobil Uyğunluq

- ✅ 360-430px ekran ölçülərinə optimizasiya
- ✅ Touch-friendly interfeys
- ✅ Responsive dizayn
- ✅ Android Chrome və iOS Safari dəstəyi

## 🔧 Environment Variables (İstəyə görə)

```env
PORT=3000
```

## 📁 Layihə Strukturu

```
bus/
├── server.js           # Express və Socket.IO server
├── package.json        # Dependencies
├── public/            # Frontend faylları
│   ├── index.html     # Giriş və qeydiyyat
│   ├── chat.html      # Chat interfeysi
│   ├── admin.html     # Admin paneli
│   └── uploads/       # Profil şəkilləri
└── README.md
```

## 🛠️ Texniki Detallar

- **In-Memory Database**: Bütün məlumatlar RAM-da saxlanılır
- **Session Management**: express-session
- **Real-time Communication**: Socket.IO
- **File Storage**: Local file system (multer)
- **Password Hashing**: bcryptjs

## 📝 Lisenziya

MIT

## 👥 Əlaqə

Bakı Dövlət Universiteti - BSU Chat Platform

---

**Qeyd**: Bu layihə təhsil məqsədli demo versiyasıdır. Production üçün MongoDB və ya başqa daimi database istifadə edin.
