let db;

export async function initializeDB() {
  return new Promise((resolve, reject) => {
    // Increase version to ensure proper upgrade
    const request = indexedDB.open('ServerSetupGuide', 3);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
    
    request.onupgradeneeded = (event) => {
      console.log('Upgrading database...');
      const db = event.target.result;
      
      // Create or verify stores
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress');
      }
      
      if (!db.objectStoreNames.contains('completedSteps')) {
        db.createObjectStore('completedSteps', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('sections')) {
        db.createObjectStore('sections');
      }
    };
    
    request.onsuccess = (event) => {
      console.log('Database initialized successfully');
      db = event.target.result;
      
      // Handle database connection loss
      db.onversionchange = () => {
        db.close();
        alert('База данных устарела. Пожалуйста, обновите страницу.');
      };
      
      db.onerror = (event) => {
        console.error('Database error:', event.target.error);
      };
      
      resolve();
    };
  });
}

export function saveProgress(data) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      
      transaction.oncomplete = () => {
        console.log('Progress saved successfully');
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.error);
        reject(event.target.error);
      };
      
      store.put(data, 'currentProgress');
    } catch (error) {
      console.error('Error in saveProgress:', error);
      reject(error);
    }
  });
}

export function getProgress() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.get('currentProgress');
      
      request.onsuccess = () => {
        console.log('Progress retrieved successfully');
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting progress:', event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      console.error('Error in getProgress:', error);
      reject(error);
    }
  });
}

export function markStepCompleted(stepId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(['completedSteps'], 'readwrite');
      const store = transaction.objectStore('completedSteps');
      
      transaction.oncomplete = () => {
        console.log('Step marked as completed successfully');
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.error);
        reject(event.target.error);
      };
      
      store.put({ id: stepId, completed: true, timestamp: Date.now() });
    } catch (error) {
      console.error('Error in markStepCompleted:', error);
      reject(error);
    }
  });
}

export function isStepCompleted(stepId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(['completedSteps'], 'readonly');
      const store = transaction.objectStore('completedSteps');
      const request = store.get(stepId);
      
      request.onsuccess = () => {
        console.log('Step completion status retrieved successfully');
        resolve(!!request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting step completion status:', event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      console.error('Error in isStepCompleted:', error);
      reject(error);
    }
  });
}

export function saveContent(sections) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(['sections'], 'readwrite');
      const store = transaction.objectStore('sections');
      
      transaction.oncomplete = () => {
        console.log('Content saved successfully');
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.error);
        reject(event.target.error);
      };
      
      store.put(sections, 'userSections');
    } catch (error) {
      console.error('Error in saveContent:', error);
      reject(error);
    }
  });
}

export function getContent() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(['sections'], 'readonly');
      const store = transaction.objectStore('sections');
      const request = store.get('userSections');
      
      request.onsuccess = () => {
        console.log('Content retrieved successfully');
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting content:', event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      console.error('Error in getContent:', error);
      reject(error);
    }
  });
}