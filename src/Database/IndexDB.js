const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('todoDB', 1)
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        const objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true })
        objectStore.createIndex('id', 'id', { unique: true })
      }
  
      request.onsuccess = (event) => {
        const db = event.target.result
        console.log('La base de datos está lista.')
        resolve(db)
      }
  
      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', event.target.error)
        reject(event.target.error)
      }
    })
  }

export default openDatabase

