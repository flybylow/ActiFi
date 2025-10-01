// Debug script to check Morpheus theme status
console.log('🔍 ActiFi Debug Script');

function debugMorpheusTheme() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    console.log('📋 Theme Debug Info:');
    console.log('HTML class:', root.className);
    console.log('Expected: ink:morpheus-theme');
    
    console.log('🎨 CSS Variables:');
    console.log('Background:', computedStyle.getPropertyValue('--ink-background-dark'));
    console.log('Text:', computedStyle.getPropertyValue('--ink-text-default'));
    console.log('Button:', computedStyle.getPropertyValue('--ink-button-primary'));
    
    console.log('📱 Computed Styles:');
    console.log('Body background:', getComputedStyle(document.body).backgroundColor);
    console.log('Body color:', getComputedStyle(document.body).color);
    
    // Check if Ink Kit CSS is loaded
    const inkKitLink = document.querySelector('link[href*="@inkonchain/ink-kit"]');
    if (inkKitLink) {
        console.log('✅ Ink Kit CSS link found:', inkKitLink.href);
    } else {
        console.log('❌ Ink Kit CSS link NOT found');
    }
    
    // Check for any errors
    console.log('🚨 Any console errors? Check above for red error messages');
}

// Run debug when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugMorpheusTheme);
} else {
    debugMorpheusTheme();
}

// Also run after a delay to catch any async issues
setTimeout(debugMorpheusTheme, 2000);
