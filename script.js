// TASK-P01-007: Add Thai city name mapping for major Thai cities

const cityNamesThai = {
  'Bangkok': 'กรุงเทพมหานคร',
  'Chiang Mai': 'เชียงใหม่',
  'Chiang Rai': 'เชียงราย',
  'Phuket': 'ภูเก็ต',
  'Pattaya': 'พัทยา',
  'Hat Yai': 'หาดใหญ่',
  'Nakhon Ratchasima': 'นครราชสีมา',
  'Khon Kaen': 'ขอนแก่น',
  'Udon Thani': 'อุดรธานี',
  'Songkhla': 'สงขลา',
  'Yala': 'ยะลา',
  'Narathiwat': 'นราธิวาส',
  'Pattani': 'ปัตตานี',
  'Krabi': 'กระบี่',
  'Samui': 'เกาะสมุย'
};

function getCityDisplayName(cityEn) {
  return cityNamesThai[cityEn] || cityEn;
}

// Example date formatting; adjust as needed.
function formatDate(dateObj) {
  // Assume dateObj is a JS Date; format to yyyy-mm-dd or preferred locale string
  return dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Example updateUI implementation
function updateUI(cityEn, dateObj) {
  const cityDisplay = getCityDisplayName(cityEn);
  const dateDisplay = formatDate(dateObj);
  const cityDateLine = `${cityDisplay} | ${dateDisplay}`;
  // Suppose we update an element with id 'city-date-line'
  document.getElementById('city-date-line').textContent = cityDateLine;
}

// Test example usage:
// updateUI('Bangkok', new Date()); // Should display: "กรุงเทพมหานคร | วันที่"
// updateUI('Rayong', new Date());  // Should display: "Rayong | วันที่"
