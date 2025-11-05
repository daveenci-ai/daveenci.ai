/**
 * Database utility functions
 * This is a placeholder for when you set up your backend API
 */

export interface ArticlesSettings {
  id: number;
  topics: string[];
  schedule: string;
  auto: boolean;
  positioning?: string;
  tone?: string;
  brand_pillars?: string;
  updated_at: string;
}

/**
 * Convert frequency, day, and time to cron expression
 */
export function toCronExpression(frequency: string, day: string, time: string): string {
  const [hours, minutes] = time.split(':');
  
  switch (frequency) {
    case 'daily':
      return `${minutes} ${hours} * * *`;
    
    case 'weekly':
      const dayMap: { [key: string]: number } = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
      };
      return `${minutes} ${hours} * * ${dayMap[day.toLowerCase()]}`;
    
    case 'biweekly':
      // Run every 2 weeks on the specified day
      return `${minutes} ${hours} * * ${dayMap[day.toLowerCase()]}`;
    
    case 'monthly':
      // day parameter should be a number (1-28) for monthly
      return `${minutes} ${hours} ${day} * *`;
    
    default:
      return `${minutes} ${hours} * * 1`; // Default to Monday
  }
}

/**
 * Parse cron expression back to frequency, day, and time
 */
export function fromCronExpression(cron: string): { frequency: string; day: string; time: string } {
  const parts = cron.split(' ');
  const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;
  
  const time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  
  // Monthly (has specific day of month)
  if (dayOfMonth !== '*') {
    return {
      frequency: 'monthly',
      day: dayOfMonth,
      time
    };
  }
  
  // Daily (runs every day)
  if (dayOfWeek === '*') {
    return {
      frequency: 'daily',
      day: 'monday',
      time
    };
  }
  
  // Weekly or Biweekly (has specific day of week)
  const dayMap: { [key: number]: string } = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  
  return {
    frequency: 'weekly', // Default to weekly
    day: dayMap[parseInt(dayOfWeek)] || 'monday',
    time
  };
}

/**
 * Save settings to database (requires backend API)
 */
export async function saveSettings(settings: {
  topics: string[];
  schedule: string;
  auto: boolean;
  positioning?: string;
  tone?: string;
  brand_pillars?: string;
}): Promise<void> {
  const apiUrl = import.meta.env.API_URL;
  
  if (!apiUrl) {
    console.warn('VITE_API_URL not configured. Settings saved to localStorage only.');
    // Save to localStorage as fallback
    localStorage.setItem('articles_settings', JSON.stringify(settings));
    return;
  }
  
  try {
    const response = await fetch(`${apiUrl}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    // Fallback to localStorage
    localStorage.setItem('articles_settings', JSON.stringify(settings));
    throw error;
  }
}

/**
 * Load settings from database (requires backend API)
 */
export async function loadSettings(): Promise<ArticlesSettings | null> {
  const apiUrl = import.meta.env.API_URL;
  
  if (!apiUrl) {
    // Load from localStorage as fallback (backend not configured)
    const stored = localStorage.getItem('articles_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      return {
        id: 1,
        ...settings,
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }
  
  try {
    const response = await fetch(`${apiUrl}/settings`);
    
    if (!response.ok) {
      throw new Error('Failed to load settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading settings:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('articles_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      return {
        id: 1,
        ...settings,
        updated_at: new Date().toISOString()
      };
    }
    return null;
  }
}
