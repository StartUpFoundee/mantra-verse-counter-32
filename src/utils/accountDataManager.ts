
/**
 * Account Data Manager - Ensures complete data isolation between accounts
 * Each account gets its own data namespace to prevent data mixing
 */
export class AccountDataManager {
  private static currentAccountId: string | null = null;
  
  /**
   * Set the current active account context
   */
  static setCurrentAccount(accountId: string): void {
    this.currentAccountId = accountId;
    console.log(`Account context switched to: ${accountId}`);
  }
  
  /**
   * Get the current account ID
   */
  static getCurrentAccountId(): string | null {
    return this.currentAccountId;
  }
  
  /**
   * Clear the current account context
   */
  static clearCurrentAccount(): void {
    this.currentAccountId = null;
    console.log('Account context cleared');
  }
  
  /**
   * Generate account-specific storage key
   */
  private static getAccountKey(key: string, accountId?: string): string {
    const currentId = accountId || this.currentAccountId;
    if (!currentId) {
      throw new Error('No account context set. Cannot access account-specific data.');
    }
    return `account_${currentId}_${key}`;
  }
  
  /**
   * Store data for the current account using sessionStorage for session data
   */
  static async storeAccountData(key: string, data: any, accountId?: string): Promise<void> {
    try {
      const accountKey = this.getAccountKey(key, accountId);
      
      // Store in sessionStorage for session-scoped data
      sessionStorage.setItem(accountKey, JSON.stringify({
        data,
        timestamp: Date.now(),
        accountId: accountId || this.currentAccountId
      }));
      
      // Also store in IndexedDB for persistence across sessions
      await this.storeInIndexedDB(accountKey, data);
      
      console.log(`Stored data for account ${accountId || this.currentAccountId}:`, key);
    } catch (error) {
      console.error('Failed to store account data:', error);
      throw error;
    }
  }
  
  /**
   * Retrieve data for the current account
   */
  static async getAccountData<T>(key: string, accountId?: string): Promise<T | null> {
    try {
      const accountKey = this.getAccountKey(key, accountId);
      
      // Try IndexedDB first for persistent data
      const idbData = await this.getFromIndexedDB(accountKey);
      if (idbData) {
        return idbData;
      }
      
      // Fallback to sessionStorage for session data
      const sessionData = sessionStorage.getItem(accountKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        return parsed.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get account data:', error);
      return null;
    }
  }
  
  /**
   * Delete account-specific data
   */
  static async deleteAccountData(key: string, accountId?: string): Promise<void> {
    try {
      const accountKey = this.getAccountKey(key, accountId);
      
      sessionStorage.removeItem(accountKey);
      await this.deleteFromIndexedDB(accountKey);
      
      console.log(`Deleted data for account ${accountId || this.currentAccountId}:`, key);
    } catch (error) {
      console.error('Failed to delete account data:', error);
    }
  }
  
  /**
   * Get all data keys for an account
   */
  static getAccountDataKeys(accountId?: string): string[] {
    const currentId = accountId || this.currentAccountId;
    if (!currentId) return [];
    
    const prefix = `account_${currentId}_`;
    const keys: string[] = [];
    
    // Check sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''));
      }
    }
    
    return [...new Set(keys)]; // Remove duplicates
  }
  
  /**
   * Clear all data for a specific account
   */
  static async clearAccountData(accountId: string): Promise<void> {
    const keys = this.getAccountDataKeys(accountId);
    
    for (const key of keys) {
      await this.deleteAccountData(key, accountId);
    }
    
    console.log(`Cleared all data for account: ${accountId}`);
  }
  
  /**
   * Switch account data context
   */
  static async switchAccountContext(fromAccountId: string | null, toAccount: any): Promise<void> {
    console.log(`Switching account context from ${fromAccountId} to ${toAccount.id}`);
    
    // Save current session data to the previous account if there was one
    if (fromAccountId && fromAccountId !== toAccount.id) {
      await this.saveCurrentSessionToAccount(fromAccountId);
    }
    
    // Clear current session
    this.clearCurrentSession();
    
    // Set new account context
    this.setCurrentAccount(toAccount.id);
    
    // Load the new account's data into session
    await this.loadAccountDataToSession(toAccount.id);
  }
  
  /**
   * Save current session data to account storage
   */
  private static async saveCurrentSessionToAccount(accountId: string): Promise<void> {
    const sessionKeys = [
      'mantraCount',
      'dailyGoal',
      'streakCount',
      'userPreferences',
      'chantingHistory',
      'spiritualStats',
      'activeDays',
      'audioSettings',
      'themePreference',
      'lastSession'
    ];
    
    for (const key of sessionKeys) {
      const sessionData = sessionStorage.getItem(key);
      if (sessionData) {
        try {
          const data = JSON.parse(sessionData);
          await this.storeAccountData(key, data, accountId);
        } catch (error) {
          console.error(`Failed to save session data ${key}:`, error);
        }
      }
    }
  }
  
  /**
   * Load account data into current session
   */
  private static async loadAccountDataToSession(accountId: string): Promise<void> {
    const accountKeys = this.getAccountDataKeys(accountId);
    
    for (const key of accountKeys) {
      const data = await this.getAccountData(key, accountId);
      if (data !== null) {
        sessionStorage.setItem(key, JSON.stringify(data));
      }
    }
    
    console.log(`Loaded account data to session for: ${accountId}`);
  }
  
  /**
   * Clear current session data
   */
  private static clearCurrentSession(): void {
    const sessionKeys = [
      'mantraCount',
      'dailyGoal',
      'streakCount',
      'userPreferences',
      'chantingHistory',
      'spiritualStats',
      'activeDays',
      'audioSettings',
      'themePreference',
      'lastSession'
    ];
    
    sessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    console.log('Current session cleared');
  }
  
  /**
   * IndexedDB storage methods
   */
  private static async storeInIndexedDB(key: string, data: any): Promise<void> {
    try {
      const request = indexedDB.open('MantraVerseAccountDB', 1);
      
      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('accountData')) {
            db.createObjectStore('accountData', { keyPath: 'key' });
          }
        };
        
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['accountData'], 'readwrite');
          const store = transaction.objectStore('accountData');
          
          store.put({ key, data, timestamp: Date.now() });
          
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('IndexedDB storage failed:', error);
    }
  }
  
  private static async getFromIndexedDB(key: string): Promise<any> {
    try {
      const request = indexedDB.open('MantraVerseAccountDB', 1);
      
      return new Promise((resolve, reject) => {
        request.onerror = () => resolve(null);
        
        request.onsuccess = () => {
          const db = request.result;
          
          if (!db.objectStoreNames.contains('accountData')) {
            resolve(null);
            return;
          }
          
          const transaction = db.transaction(['accountData'], 'readonly');
          const store = transaction.objectStore('accountData');
          const getRequest = store.get(key);
          
          getRequest.onsuccess = () => {
            const result = getRequest.result;
            resolve(result ? result.data : null);
          };
          
          getRequest.onerror = () => resolve(null);
        };
      });
    } catch (error) {
      console.error('IndexedDB retrieval failed:', error);
      return null;
    }
  }
  
  private static async deleteFromIndexedDB(key: string): Promise<void> {
    try {
      const request = indexedDB.open('MantraVerseAccountDB', 1);
      
      return new Promise((resolve, reject) => {
        request.onerror = () => resolve();
        
        request.onsuccess = () => {
          const db = request.result;
          
          if (!db.objectStoreNames.contains('accountData')) {
            resolve();
            return;
          }
          
          const transaction = db.transaction(['accountData'], 'readwrite');
          const store = transaction.objectStore('accountData');
          
          store.delete(key);
          
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => resolve();
        };
      });
    } catch (error) {
      console.error('IndexedDB deletion failed:', error);
    }
  }
}
