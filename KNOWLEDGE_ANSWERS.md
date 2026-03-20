
**Konu:** Re: Speed & Knowledge Test — Emircan

---

Merhaba Oney World Ekibi,

Projeyi tamamladım. Canlı link ve GitHub reposu için aşağıya bakabilirsiniz.
Knowledge sorularının cevaplarını da aşağıda bulabilirsiniz:

---

**1. Vercel/Supabase kullanarak yayına alırken en çok dikkat ettiğim güvenlik adımı:**

Environment variable yönetimi ve Supabase Row Level Security (RLS). 

API key'leri asla client-side koda gömmüyorum — `NEXT_PUBLIC_` prefix'i olmayan değişkenler sunucu tarafında kalıyor. Supabase tarafında ise `anon` key'i frontend'e vermek yerine tüm veritabanı işlemlerini `service_role` key'i taşıyan bir backend üzerinden yönlendiriyorum. RLS politikalarını da tabloların hepsinde etkinleştirerek, direkt Supabase erişimini backend dışına kapatıyorum. Bu sayede birisi network trafiğini incelese bile anlamlı bir key elde edemiyor.

Vercel tarafında ise environment variable'ları Vercel Dashboard üzerinden ekliyorum; `.env` dosyaları `.gitignore`'a eklenerek repoya asla commit'lenmiyor.

---

**2. Python otomasyon scriptini her gün belirli saatte çalıştırmak için kullandığım yöntem:**

Ortama göre iki tercihim var:

- **Sunucu varsa:** Linux `cron` servisi. `crontab -e` ile `0 9 * * * /usr/bin/python3 /home/user/script.py >> /var/log/script.log 2>&1` gibi bir satırla işi bitiriyorum. Loglama ve hata yönetimi için stdout/stderr'i bir dosyaya yönlendiriyorum.

- **Serverless/bulut ortamında:** GitHub Actions `schedule` trigger'ı (küçük projeler için ücretsiz ve repo'ya entegre) ya da Railway/Render gibi platformların built-in cron job özelliğini kullanıyorum. Büyük ölçekli ihtiyaçlar için Celery + Beat tercih ederim.

---

**3. App Store / Play Store yükleme sürecindeki en büyük zorluk:**

Uygulama store süreçlerinde bizzat karşılaştığım en kritik engel Apple'ın review gecikmesi ve code signing karmaşasıdır. Provisioning profile, certificate ve entitlement uyumsuzlukları build aşamasını beklenmedik şekilde durdurabilir.

Bu süreci yönetmek için şu yaklaşımı benimsiyorum:
- **CI/CD pipeline** (Fastlane veya Expo EAS) kurarak signing sürecini otomatikleştiriyorum, manuel hata payını sıfıra indiriyorum.
- Store'a göndermeden önce **TestFlight / Internal Test** üzerinde kapsamlı test yapıyorum.
- Review kriterlerini baştan okuyup privacy manifest, permission açıklamaları ve screenshot gereksinimlerini eksiksiz hazırlıyorum — bu adım reddi ciddi ölçüde azaltıyor.
- Timeline'a en az **5-7 iş günü** review buffer'ı ekliyorum.

---

**Proje Linkleri:**

- 🌐 Canlı Uygulama: `https://prompt-vault.vercel.app`
- 💻 GitHub Repo: `https://github.com/emircan/prompt-vault`

Hızlı geri dönüş için teşekkürler, iyi çalışmalar!

Emircan
