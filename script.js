// Assuming prayers is an array of prayer objects with { name, isCurrent }
// Assuming each prayer row has .prayer-row, and .prayer-left is the container for prayer name.

function renderPrayerRows(prayers) {
  const container = document.getElementById('prayer-rows');
  container.innerHTML = '';
  prayers.forEach(prayer => {
    const row = document.createElement('div');
    row.className = 'prayer-row';
    if (prayer.isCurrent) {
      row.classList.add('current');
    }

    const left = document.createElement('div');
    left.className = 'prayer-left';
    left.textContent = prayer.name;

    if (prayer.isCurrent) {
      const badge = document.createElement('div');
      badge.className = 'prayer-badge';
      badge.textContent = 'กำลังละหมาด';
      left.appendChild(document.createElement('br'));
      left.appendChild(badge);
    }

    row.appendChild(left);
    // ... other columns if needed ...
    container.appendChild(row);
  });
}

// Example: usage
// const prayers = [
//   { name: 'Subuh', isCurrent: false },
//   { name: 'Zuhr', isCurrent: true },
//   { name: 'Asr', isCurrent: false }
// ];
// renderPrayerRows(prayers);
