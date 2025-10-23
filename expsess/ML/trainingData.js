export default [

  // Battery & Power Issues
  { text: "battery drains completely overnight", mobileLabels: ["Battery Issue"] },
  { text: "phone shuts off at 20% battery", mobileLabels: ["Battery Issue", "Power Issue"] },
  { text: "phone not turning on after full charge", mobileLabels: ["Power Issue", "Battery Issue"] },
  { text: "battery temperature too high while charging", mobileLabels: ["Battery Issue", "Overheating Issue", "Charging Issue"] },
  { text: "phone dies suddenly during calls", mobileLabels: ["Power Issue", "System Stability Issue"] },

  // Charging Issues
  { text: "phone charges very slowly", mobileLabels: ["Charging Issue", "Battery Issue"] },
  { text: "charging stops randomly and battery drops", mobileLabels: ["Charging Issue", "Battery Issue", "Power Issue"] },
  { text: "phone not recognized by charger", mobileLabels: ["Charging Issue", "Hardware Issue"] },

  // Display Issues
  { text: "screen flickers when brightness changes", mobileLabels: ["Display Issue"] },
  { text: "touch screen stops responding occasionally", mobileLabels: ["Display Issue", "Hardware Issue"] },
  { text: "cracked screen after minor drop", mobileLabels: ["Display Issue", "Hardware Issue"] },
  { text: "screen shows color distortion", mobileLabels: ["Display Issue", "Hardware Issue"] },
  { text: "screen freezes randomly", mobileLabels: ["Display Issue", "System Stability Issue"] },

  // Connectivity Issues
  { text: "wifi keeps disconnecting", mobileLabels: ["Connectivity Issue"] },
  { text: "bluetooth unable to pair with headphones", mobileLabels: ["Connectivity Issue"] },
  { text: "mobile data keeps dropping", mobileLabels: ["Connectivity Issue"] },
  { text: "hotspot connection fails", mobileLabels: ["Connectivity Issue", "System Issue"] },
  { text: "slow internet even with full signal", mobileLabels: ["Connectivity Issue", "Performance Issue"] },

  // Camera & Audio Issues
  { text: "camera blurry images in daylight", mobileLabels: ["Camera Issue"] },
  { text: "camera app crashes when recording video", mobileLabels: ["Camera Issue", "App Issue"] },
  { text: "microphone not picking up sound", mobileLabels: ["Audio Issue"] },
  { text: "speaker produces low sound during calls", mobileLabels: ["Audio Issue", "Hardware Issue"] },
  { text: "video recording lags or stops unexpectedly", mobileLabels: ["Camera Issue", "Performance Issue"] },

  // Hardware & Performance Issues
  { text: "volume buttons not responding", mobileLabels: ["Hardware Issue"] },
  { text: "phone overheating while streaming", mobileLabels: ["Overheating Issue", "Performance Issue"] },
  { text: "phone freezes while switching apps", mobileLabels: ["Performance Issue", "System Stability Issue"] },
  { text: "slow system performance after update", mobileLabels: ["Performance Issue", "System Issue"] },
  { text: "fingerprint sensor not working consistently", mobileLabels: ["Hardware Issue"] },
  { text: "phone randomly restarts", mobileLabels: ["System Stability Issue", "Power Issue"] },
  { text: "device lags while opening multiple apps", mobileLabels: ["Performance Issue", "System Stability Issue"] },

  // Storage Issues
  { text: "phone memory fills up quickly", mobileLabels: ["Storage Issue", "Performance Issue"] },
  { text: "cannot install apps due to low storage", mobileLabels: ["Storage Issue", "App Issue"] },
  { text: "cached data not clearing automatically", mobileLabels: ["Storage Issue", "System Issue"] },
  { text: "storage warning appears too frequently", mobileLabels: ["Storage Issue"] },

  // Boot & System Issues
  { text: "bootloop after latest update", mobileLabels: ["Boot Issue", "System Issue", "System Stability Issue"] },
  { text: "apps crash randomly after update", mobileLabels: ["App Issue", "System Stability Issue"] },
  { text: "slow system updates", mobileLabels: ["System Issue", "Performance Issue"] },
  { text: "phone freezes on startup screen", mobileLabels: ["System Stability Issue", "Boot Issue"] },

  // Overheating Issues
  { text: "phone heats up while charging", mobileLabels: ["Overheating Issue", "Battery Issue"] },
  { text: "device temperature rises during video calls", mobileLabels: ["Overheating Issue", "Performance Issue"] },
  { text: "phone overheating during heavy apps", mobileLabels: ["Overheating Issue", "Performance Issue"] },

  // App & Multi-label Combinations
  { text: "camera app crashes and videos lag", mobileLabels: ["Camera Issue", "App Issue", "Performance Issue"] },
  { text: "battery drains quickly and phone overheats", mobileLabels: ["Battery Issue", "Overheating Issue"] },
  { text: "screen flickers and touch not responsive", mobileLabels: ["Display Issue", "Hardware Issue"] },
  { text: "bluetooth disconnects and apps freeze", mobileLabels: ["Connectivity Issue", "App Issue", "Performance Issue"] },
  { text: "phone stuck on boot logo and battery not charging", mobileLabels: ["System Stability Issue", "Boot Issue", "Battery Issue", "Charging Issue"] },
  { text: "slow performance and device heating", mobileLabels: ["Performance Issue", "Overheating Issue"] },
  { text: "apps crash after installation", mobileLabels: ["App Issue", "System Stability Issue"] },
  { text: "speaker not producing sound during calls", mobileLabels: ["Audio Issue", "Hardware Issue"] },
  { text: "phone reboots while playing games", mobileLabels: ["System Stability Issue", "Performance Issue"] },
  { text: "charging cable not recognized", mobileLabels: ["Charging Issue", "Hardware Issue"] },
  { text: "wifi not connecting and apps freeze", mobileLabels: ["Connectivity Issue", "App Issue", "Performance Issue"] },
  { text: "camera blurry and app crashes", mobileLabels: ["Camera Issue", "App Issue"] },


  // 💧 Water & Physical Damage
  { text: "Phone fell in water", label: "Hardware Issue" },
  { text: "Phone not turning on after water damage", label: "Boot Issue" },
  { text: "Charging port corrosion due to water", label: "Hardware Issue" },
  { text: "Phone dropped and screen cracked", label: "Display Issue" },
  { text: "Phone dropped and won’t power on", label: "Boot Issue" },
  { text: "Phone dropped and camera not working", label: "Camera Issue" },
  { text: "Phone body bent after fall", label: "Hardware Issue" },
  { text: "Phone buttons not working after fall", label: "Hardware Issue" },


  // 🌀 Multi-Issue Real-World Combinations
  { text: "Phone heating, battery draining and apps crashing", label: "Power Issue" },
  { text: "Screen frozen, touch not working and phone restarting", label: "Display Issue" },
  { text: "Charging port damaged, phone not charging and SIM not detected", label: "Hardware Issue" },
  { text: "Camera blurry, microphone not working and speaker issues", label: "Hardware Issue" },
  { text: "Storage full, phone slow and apps not installing", label: "Storage Issue" },
  { text: "Phone stuck on boot logo, screen flickering and touch not working", label: "Boot Issue" },
  { text: "Phone dropped in water, charging not working and sound gone", label: "Hardware Issue" },
  { text: "Phone overheating, lagging in games and battery draining fast", label: "Performance Issue" },

  { text: "Phone gets hot during charging", label: "Overheating Issue" },
  { text: "Phone gets hot while using social media apps", label: "Overheating Issue" },
  { text: "Phone heats up when playing games", label: "Overheating Issue" },
  { text: "Phone becomes very warm during video streaming", label: "Overheating Issue" },
  { text: "Vibration motor not working for notifications", label: "Hardware Issue" },
  { text: "Phone does not vibrate on incoming calls", label: "Hardware Issue" },
  { text: "Phone keeps restarting randomly", label: "System Stability Issue" },
  { text: "Phone reboots automatically during app usage", label: "System Stability Issue" },
  { text: "Phone restarts after installing updates", label: "System Stability Issue" },
  { text: "Phone overheats and restarts while gaming", label: "Overheating Issue" },

 { text: "Laptop keyboard keys are stuck", label: "Not Mobile" },
{ text: "Printer prints blank pages", label: "Not Mobile" },
{ text: "WiFi router keeps restarting", label: "Not Mobile" },
{ text: "TV screen has vertical lines", label: "Not Mobile" },
{ text: "Microwave not heating food", label: "Not Mobile" },
{ text: "Car dashboard lights are off", label: "Not Mobile" },
{ text: "Air conditioner not cooling properly", label: "Not Mobile" },
{ text: "Washing machine is leaking water", label: "Not Mobile" },
{ text: "Laptop battery not charging", label: "Not Mobile" },
{ text: "Home theater speaker produces no sound", label: "Not Mobile" },
{ text: "Electric kettle not boiling water", label: "Not Mobile" },
{ text: "Refrigerator making loud noise", label: "Not Mobile" },
{ text: "Printer jams frequently", label: "Not Mobile" },
{ text: "Laptop screen flickers when opening apps", label: "Not Mobile" },
{ text: "Router WiFi signal weak in certain rooms", label: "Not Mobile" },
{ text: "Tablet touchscreen not responding", label: "Not Mobile" },
{ text: "Smartwatch battery drains quickly", label: "Not Mobile" },
{ text: "Desktop PC overheating while gaming", label: "Not Mobile" }

]
