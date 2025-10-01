// Debug script to check Ink Kit components
console.log('🔍 Debugging Ink Kit Components');

// Check if Ink Kit is loaded
try {
  const inkKit = await import('@inkonchain/ink-kit');
  console.log('✅ Ink Kit imported successfully:', Object.keys(inkKit));
  
  // Check if components exist
  if (inkKit.InkLayout) {
    console.log('✅ InkLayout component available');
  } else {
    console.log('❌ InkLayout component NOT available');
  }
  
  if (inkKit.InkPageLayout) {
    console.log('✅ InkPageLayout component available');
  } else {
    console.log('❌ InkPageLayout component NOT available');
  }
  
} catch (error) {
  console.error('❌ Error importing Ink Kit:', error);
}

// Check current page structure
console.log('📋 Current page structure:');
console.log('HTML class:', document.documentElement.className);
console.log('Body children:', document.body.children.length);

// Check for any React errors
window.addEventListener('error', (e) => {
  console.error('🚨 JavaScript Error:', e.error);
});

// Check for React errors
window.addEventListener('unhandledrejection', (e) => {
  console.error('🚨 Unhandled Promise Rejection:', e.reason);
});


