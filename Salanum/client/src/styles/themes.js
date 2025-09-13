export const lightTheme = {
  colors: {
    // Primary colors
    primary: '#007AFF',
    primaryHover: '#0056CC',
    primaryLight: '#E3F2FD',
    
    // Secondary colors
    secondary: '#5856D6',
    secondaryHover: '#3D3BCC',
    secondaryLight: '#F3F2FF',
    
    // Accent colors
    accent: '#FF9500',
    accentHover: '#E6850E',
    accentLight: '#FFF4E6',
    
    // Status colors
    success: '#34C759',
    successHover: '#2FB04A',
    successLight: '#E8F5E8',
    
    warning: '#FF9500',
    warningHover: '#E6850E',
    warningLight: '#FFF4E6',
    
    error: '#FF3B30',
    errorHover: '#E6342A',
    errorLight: '#FFEBEA',
    
    info: '#007AFF',
    infoHover: '#0056CC',
    infoLight: '#E3F2FD',
    
    // Neutral colors
    background: '#FFFFFF',
    surface: '#F2F2F7',
    surfaceHover: '#E5E5EA',
    surfaceLight: '#FAFAFA',
    
    text: '#000000',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',
    textInverse: '#FFFFFF',
    
    border: '#C7C7CC',
    borderLight: '#E5E5EA',
    borderDark: '#8E8E93',
    
    // Special colors
    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    
    // Chat specific colors
    messageBackground: '#FFFFFF',
    messageBackgroundOwn: '#007AFF',
    messageText: '#000000',
    messageTextOwn: '#FFFFFF',
    messageBorder: '#E5E5EA',
    
    // Online status
    online: '#34C759',
    offline: '#8E8E93',
    away: '#FF9500',
    busy: '#FF3B30',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
    secondary: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
    accent: 'linear-gradient(135deg, #FF9500 0%, #FF3B30 100%)',
    surface: 'linear-gradient(135deg, #F2F2F7 0%, #E5E5EA 100%)',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

export const darkTheme = {
  colors: {
    // Primary colors
    primary: '#0A84FF',
    primaryHover: '#0056CC',
    primaryLight: '#1C1C1E',
    
    // Secondary colors
    secondary: '#5E5CE6',
    secondaryHover: '#3D3BCC',
    secondaryLight: '#1C1C1E',
    
    // Accent colors
    accent: '#FF9F0A',
    accentHover: '#E6850E',
    accentLight: '#1C1C1E',
    
    // Status colors
    success: '#30D158',
    successHover: '#2FB04A',
    successLight: '#1C1C1E',
    
    warning: '#FF9F0A',
    warningHover: '#E6850E',
    warningLight: '#1C1C1E',
    
    error: '#FF453A',
    errorHover: '#E6342A',
    errorLight: '#1C1C1E',
    
    info: '#0A84FF',
    infoHover: '#0056CC',
    infoLight: '#1C1C1E',
    
    // Neutral colors
    background: '#000000',
    surface: '#1C1C1E',
    surfaceHover: '#2C2C2E',
    surfaceLight: '#1C1C1E',
    
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
    textInverse: '#000000',
    
    border: '#38383A',
    borderLight: '#2C2C2E',
    borderDark: '#48484A',
    
    // Special colors
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    
    // Chat specific colors
    messageBackground: '#1C1C1E',
    messageBackgroundOwn: '#0A84FF',
    messageText: '#FFFFFF',
    messageTextOwn: '#FFFFFF',
    messageBorder: '#38383A',
    
    // Online status
    online: '#30D158',
    offline: '#8E8E93',
    away: '#FF9F0A',
    busy: '#FF453A',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
    secondary: 'linear-gradient(135deg, #5E5CE6 0%, #BF5AF2 100%)',
    accent: 'linear-gradient(135deg, #FF9F0A 0%, #FF453A 100%)',
    surface: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};
