// Format TON amount with proper decimals
export const formatTON = (amount: number): string => {
  return `${amount.toFixed(2)} TON`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validate TON address format
export const isValidTonAddress = (address: string): boolean => {
  return /^UQ[A-Za-z0-9_-]{46}$/.test(address);
};

// Generate unique ID
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Validate price input
export const isValidPrice = (price: string): boolean => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0 && num <= 1000;
};

// Get category display name
export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'EBOOKS': 'E-Books',
    'TUTORIALS': 'Tutorials',
    'ASSETS': 'Assets',
    'SOFTWARE': 'Software',
    'OTHER': 'Other'
  };
  return categoryMap[category] || category;
};

// Get rating stars
export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};