// Debug script to check CSS loading
console.log('🔍 Checking CSS loading...');

// Check if Ink Kit CSS is loaded
const inkKitStyles = Array.from(document.styleSheets).find(sheet => {
  try {
    return sheet.href && sheet.href.includes('ink-kit');
  } catch (e) {
    return false;
  }
});

if (inkKitStyles) {
  console.log('✅ Ink Kit CSS loaded:', inkKitStyles.href);
} else {
  console.log('❌ Ink Kit CSS not found');
}

// Check computed styles
const body = document.body;
const computedStyle = window.getComputedStyle(body);
console.log('🎨 Body background:', computedStyle.backgroundColor);
console.log('🎨 Body color:', computedStyle.color);

// Check if light theme class is applied
const html = document.documentElement;
console.log('🎨 HTML classes:', html.className);
console.log('🎨 Has ink:light-theme:', html.classList.contains('ink:light-theme'));

// Force light theme if needed
if (computedStyle.backgroundColor === 'rgb(0, 0, 0)' || computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
  console.log('🔧 Forcing light theme...');
  html.style.setProperty('background-color', '#ffffff', 'important');
  html.style.setProperty('color', '#2c3e50', 'important');
  body.style.setProperty('background-color', '#ffffff', 'important');
  body.style.setProperty('color', '#2c3e50', 'important');
}
