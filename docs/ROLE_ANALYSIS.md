# Happy Baby Night Nurses - Rol Analizi ve Yetkiler

## Mevcut Roller ve Detayları

### 1. FAMILY (Aile) Rolü

#### Giriş Yetkileri:
- Email ile giriş (herhangi bir email domain)
- Varsayılan rol olarak atanır
- İlk giriş deneyimi (isFirstLogin flag)

#### Ana Özellikler:
- **Ana Sayfa (`/family/home`)**:
  - Günlük selamlama (Good Morning/Afternoon/Evening)
  - "How was last night?" özeti (uyku, beslenme, bez istatistikleri)
  - Yaklaşan vardiyalar listesi
  - Hemşire profilleri görüntüleme
  - Bildirimler (3 yeni bildirim)

#### Erişilebilir Sayfalar:
- `/family/home` - Ana sayfa
- `/family/logs` - Gece kayıtları görüntüleme
- `/family/messages` - Mesajlaşma
- `/family/messenger` - Messenger
- `/family/nurse/[id]` - Hemşire detayları
- `/family/request` - Talep oluşturma
- `/family/schedule` - Vardiya programı
- `/family/more/` - Ayarlar ve profil seçenekleri

#### Yetkiler:
- Hemşire profillerini görüntüleme
- Gece kayıtlarını görüntüleme (düzenleme yok)
- Vardiya taleplerinde bulunma
- Hemşirelerle mesajlaşma
- Kendi profilini yönetme

---

### 2. NURSE (Hemşire) Rolü

#### Giriş Yetkileri:
- Email ile giriş (mock users içinde tanımlı)
- `nurse@example.com` test hesabı

#### Ana Özellikler:
- **Ana Sayfa (`/nurse/home`)**:
  - Vardiya başlangıç/bitiş (Clock In/Out)
  - Gece kayıtları oluşturma ve görüntüleme
  - Yaklaşan vardiyalar
  - Bildirimler (acil ve hatırlatma)
  - Müsaitlik durumu güncelleme

#### Erişilebilir Sayfalar:
- `/nurse/home` - Ana sayfa
- `/nurse/availability` - Müsaitlik yönetimi
- `/nurse/family/[id]` - Aile detayları
- `/nurse/group-chat` - Grup sohbeti
- `/nurse/night-logs` - Gece kayıtları
- `/nurse/profile` - Profil yönetimi
- `/nurse/settings` - Ayarlar
- `/nurse/trainings` - Eğitimler
- `/nurse/more` - Ek seçenekler

#### Yetkiler:
- Gece kayıtlarını oluşturma ve düzenleme
- Vardiya saatlerini takip etme
- Aile bilgilerini görüntüleme
- Müsaitlik durumunu güncelleme
- Diğer hemşirelerle grup sohbeti
- Eğitimlere erişim

---

### 3. ADMIN (Yönetici) Rolü

#### Giriş Yetkileri:
- **Sadece** `@happybabynightnurses.com` domain'i ile giriş
- Şirket email'i zorunlu
- Test hesapları: `info@happybabynightnurses.com`, `admin@happybabynightnurses.com`

#### Ana Özellikler:
- **Ana Sayfa (`/admin/home`)**:
  - Kapsamlı dashboard
  - İstatistikler (toplam vardiyalar, acil mesajlar, kapsam gereken vardiyalar)
  - Tüm yönetim modüllerine erişim

#### Erişilebilir Sayfalar:
- `/admin/home` - Ana dashboard
- `/admin/families` - Aile yönetimi
- `/admin/families/` - Aile detayları
- `/admin/nurses` - Hemşire yönetimi
- `/admin/manage-shifts` - Vardiya yönetimi
- `/admin/manage-payroll` - Bordro yönetimi
- `/admin/payroll/` - Bordro detayları
- `/admin/messenger` - Hemşire messenger
- `/admin/group-chat` - Grup sohbeti
- `/admin/night-logs` - Tüm gece kayıtları
- `/admin/expense-dashboard` - Gider dashboard'u
- `/admin/profile` - Admin profili
- `/admin/settings` - Sistem ayarları
- `/admin/urgent-messages` - Acil mesajlar
- `/admin/shifts/` - Vardiya detayları

#### Yetkiler:
- **Tam sistem kontrolü**
- Aile hesaplarını yönetme (12 aktif aile)
- Hemşire atamalarını yapma
- Vardiya programlama ve atama
- Bordro hesaplama ve ödeme takibi
- Gider ve gelir analizi
- Acil mesajları yönetme
- Sistem ayarlarını değiştirme
- Tüm gece kayıtlarını görüntüleme
- Hemşire performans takibi

---

## Güvenlik Hiyerarşisi

1. **Admin** - En yüksek yetki seviyesi
   - Tüm verilere erişim
   - Sistem yönetimi
   - Kullanıcı yönetimi

2. **Nurse** - Orta seviye yetki
   - Atandığı ailelerin verilerine erişim
   - Gece kayıtları oluşturma/düzenleme
   - Kendi profil yönetimi

3. **Family** - Temel kullanıcı yetkisi
   - Sadece kendi verilerine erişim
   - Hemşire profillerini görüntüleme
   - Talep oluşturma

---

## Geliştirme Önerisi: Basitleştirilmiş Auth Sistemi

### Mevcut Durum Analizi:
- Karmaşık email domain kontrolü
- Mock user sistemi
- Şifre doğrulama
- İlk giriş deneyimi yönetimi

### Önerilen Basitleştirme:
1. **3 Buton Sistemi**:
   - "Family Olarak Giriş Yap" butonu
   - "Nurse Olarak Giriş Yap" butonu  
   - "Admin Olarak Giriş Yap" butonu

2. **Avantajları**:
   - Geliştirme sürecinde hızlı test
   - Karmaşık auth mantığı olmadan rol değiştirme
   - Her rolün özelliklerini kolayca test etme
   - Demo ve sunum için ideal

3. **Uygulama**:
   - Mevcut `AuthContext.tsx` basitleştirme
   - Yeni giriş ekranı oluşturma
   - Mock user sistemini kaldırma
   - Direkt rol ataması

### Sonuç:
Bu basitleştirme, geliştirme sürecinde çok mantıklı bir yaklaşım. Özellikle farklı rollerin özelliklerini test etmek ve demo yapmak için ideal. Production'a geçerken tekrar tam auth sistemi implement edilebilir.