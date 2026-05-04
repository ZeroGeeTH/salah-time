const prayerConfigs = [
  { key: 'Fajr', name: 'ศุบฮิ', icon: '🌅' },
  { key: 'Sunrise', name: 'ซุรูก', icon: '🌄' },
  { key: 'Dhuhr', name: 'ซุฮฺริ', icon: '☀️' },
  { key: 'Asr', name: 'อัศริ', icon: '🌤️' },
  { key: 'Maghrib', name: 'มัฆริบ', icon: '🌇' },
  { key: 'Isha', name: 'อิชาอ์', icon: '🌙' },
];

const hijriMonthsThai = {
  'Muharram': 'มุฮัรรอม',
  'Safar': 'ซอฟัร',
  'Rabi al-awwal': 'รอบีอุลเอาวัล',
  'Rabi al-thani': 'รอบีอุษษานี',
  'Jumada al-awwal': 'ญุมาดัลอูลา',
  'Jumada al-thani': 'ญุมาดัษษานียะฮ์',
  'Rajab': 'รอญับ',
  'Shaban': 'ชะอ์บาน',
  'Ramadan': 'รอมะฎอน',
  'Shawwal': 'เชาวาล',
  'Dhul-Qidah': 'ชุลเกาะอุดะฮ์',
  'Dhul-Hijjah': 'ชุลฮิจญะฮ์',
};

const thaiMonths = [
  '',
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

function toThaiDigits(input) {
  return input.replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
}

function zeroPad(n) {
  return n < 10 ? '0' + n : n;
}

function getThaiBuddhistDate(d) {
  let yyyy = d.getFullYear() + 543;
  let mm = d.getMonth() + 1;
  let dd = d.getDate();
  let label = `${zeroPad(dd)} ${thaiMonths[mm]} ${yyyy}`;
  return label;
}

function fetchSalahData(city) {
  return fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Thailand&method=1&school=1`)
    .then(resp => resp.json());
}

function updateUI(prayerData, hijriData, city) {
  // Render dates
  const hijriMonthThai = hijriMonthsThai[hijriData.month.en] || hijriData.month.en;
  const hijriLabel = `${toThaiDigits(hijriData.day)} ${hijriMonthThai} ${toThaiDigits(hijriData.year)}`;
  document.getElementById('hijri-date').textContent = hijriLabel;

  const now = new Date();
  const cityLabel = `${city === 'Bangkok' ? 'กรุงเทพมหานคร' : city} | ${toThaiDigits(getThaiBuddhistDate(now))}`;
  document.getElementById('city-date').textContent = cityLabel;

  // Parse prayer times into Date objects, assuming local time
  const times = prayerConfigs.map(p => {
    // time format is 'HH:MM' (24h)
    let [h, m] = prayerData[p.key].split(':').map(Number);
    let t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    return { ...p, raw: prayerData[p.key], date: t };
  });

  // Detect current prayer and next prayer
  let current = -1, next = null;
  for (let i=0; i<times.length; ++i) {
    if (now >= times[i].date) current = i;
  }
  next = (current+1 < times.length) ? current+1 : 0;

  // Render prayers
  const prayerList = document.getElementById('prayer-list');
  prayerList.innerHTML = '';
  times.forEach((item, i) => {
    let row = document.createElement('div');
    row.className = 'prayer-row' + (i === current ? ' current' : '');
    let left = document.createElement('div');
    left.className = 'prayer-left';
    let emoji = document.createElement('span');
    emoji.className = 'prayer-emoji';
    emoji.textContent = item.icon;
    let tname = document.createElement('span');
    tname.textContent = item.name;
    left.appendChild(emoji);
    left.appendChild(tname);
    let timebox = document.createElement('span');
    timebox.className = 'prayer-time';
    timebox.textContent = toThaiDigits(item.raw.substr(0,5));
    row.appendChild(left);
    row.appendChild(timebox);
    prayerList.appendChild(row);
  });

  countDownToNext(times, current, next);

  // Attach times to global so countdown can re-use
  window._salahTimes = { times, current, next };
  window._salahTimesFetchedAt = +now;
}

function countDownToNext(times, current, next) {
  clearInterval(window._countdownInterval);

  function updateCountdown() {
    const now = new Date();
    let tTarget = times[next].date;
    // In case after last prayer (Isha), show countdown to next day's Fajr
    if (current === 5 && now > tTarget) {
      tTarget = new Date(times[0].date.getTime());
      tTarget.setDate(tTarget.getDate() + 1);
    }
    let diff = tTarget - now;
    if (diff < 0) diff = 0;
    let hd = Math.floor(diff/1000/60/60);
    let md = Math.floor((diff/1000/60) % 60);
    let label = `ถึง${times[next].name}`;
    document.getElementById('countdown-label').textContent = label;
    document.getElementById('countdown-timer').textContent = `${toThaiDigits(zeroPad(hd))}:${toThaiDigits(zeroPad(md))}`;
  }
  updateCountdown();
  window._countdownInterval = setInterval(updateCountdown, 1000);
}

function saveCity(city) {
  localStorage.setItem('salah_city', city);
}
function loadCity() {
  return localStorage.getItem('salah_city') || 'Bangkok';
}

// Settings modal handlers
let settingsBtn = document.getElementById('settings-btn');
let modal = document.getElementById('settings-modal');
let backdrop = document.getElementById('modal-backdrop');
let cityInput = document.getElementById('city-input');
let cancelBtn = document.getElementById('cancel-settings');

function openModal() {
  modal.classList.remove('hide');
  backdrop.classList.remove('hide');
  cityInput.value = loadCity();
  setTimeout(() => cityInput.focus(), 200);
}
function closeModal() {
  modal.classList.add('hide');
  backdrop.classList.add('hide');
}
settingsBtn.addEventListener('click', openModal);
backdrop.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

document.getElementById('city-form').addEventListener('submit', function(e){
  e.preventDefault();
  let city = cityInput.value.trim();
  if (!city) return;
  saveCity(city);
  closeModal();
  loadAndRender(city, true);
});

function loadAndRender(city, focus=false) {
  fetchSalahData(city)
    .then(res => {
      if(res.code !== 200) throw new Error('City not found');
      updateUI(res.data.timings, res.data.date.hijri, city);
    })
    .catch(err => {
      alert('ขออภัย ไม่พบเมืองหรือ API ขัดข้อง');
      if (focus) openModal();
    });
}

// On load
window.addEventListener('DOMContentLoaded', () => {
  loadAndRender(loadCity());
});