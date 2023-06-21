// import openDatabase from './IndexDB'

// // Agregar una tarea
// export const addTask = async (task) => {
//   const db = await openDatabase()
//   const transaction = db.transaction(['tasks'], 'readwrite')
//   const objectStore = transaction.objectStore('tasks')
//   const request = objectStore.add(task)

//   request.onsuccess = () => {
//     console.log('Tarea agregada correctamente.')
//   }

//   request.onerror = (event) => {
//     console.error('Error al agregar la tarea:', event.target.error)
//   }
// }

// export const deleteTask = async (taskId) => {
//   const db = await openDatabase()
//   const transaction = db.transaction(['tasks'], 'readwrite')
//   const objectStore = transaction.objectStore('tasks')
//   const request = objectStore.delete(taskId)

//   request.onsuccess = () => {
//     console.log('Tarea eliminada correctamente.')
//   }

//   request.onerror = (event) => {
//     console.error('Error al eliminar la tarea:', event.target.error)
//   }
// }

// export const updateStatusTask = async (taskId, status) => {
//   try {
//     const db = await openDatabase()
//     const transaction = db.transaction(['tasks'], 'readwrite')
//     const objectStore = transaction.objectStore('tasks')
//     const request = objectStore.get(taskId)

//     request.onsuccess = (event) => {
//       const task = event.target.result
//       task.status = status

//       objectStore.put(task)

//       transaction.oncomplete = () => {
//         console.log('Task status updated successfully')
//       }

//       objectStore.onsuccess = () => {
//         console.log('updated')
//       }
//     }

//     request.onerror = (event) => {
//       console.error('Error al actualizar la tarea:', event.target.error)
//     }
//   } catch (error) {
//     console.error('Error al abrir la base de datos:', error)
//   }
// }

// export const getTasks = async (callback) => {
//   try {
//     const db = await openDatabase()
//     const transaction = db.transaction(['tasks'], 'readonly')
//     const objectStore = transaction.objectStore('tasks')
//     const request = objectStore.getAll()

//     request.onsuccess = (event) => {
//       callback(event.target.result)
//     }

//     request.onerror = (event) => {
//       console.error('Error al obtener las tareas:', event.target.error)
//     }
//   } catch (error) {
//     console.error('Error al abrir la base de datos:', error)
//   }
// }

// export const getTaskById = async (taskId, callback) => {
//   const db = await openDatabase()
//   const transaction = db.transaction(['tasks'], 'readonly')
//   const objectStore = transaction.objectStore('tasks')
//   const request = objectStore.get(taskId)

//   request.onsuccess = (event) => {
//     const task = event.target.result
//     if (task) {
//       callback(task)
//     } else {
//       console.log('No se encontró ninguna tarea con el ID especificado.')
//       callback(null)
//     }
//   }

//   request.onerror = (event) => {
//     console.error('Error al obtener la tarea:', event.target.error)
//     callback(null)
//   }
// }

// export const downloadIndexedDB = async () => {
//   const db = await openDatabase()

//   const exportData = {}

//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction(['tasks'], 'readonly')

//     const objectStore = transaction.objectStore('tasks')
//     const request = objectStore.getAll()

//     request.onsuccess = (event) => {
//       exportData['tasks'] = event.target.result
//     }

//     request.onerror = (event) => {
//       console.error(`Error exporting data from ${'tasks'}:`, event.target.error)
//       reject(event.target.error)
//     }

//     transaction.oncomplete = () => {
      
//       const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' })
//       const downloadLink = document.createElement('a')
//       const downloadUrl = URL.createObjectURL(blob)

//       downloadLink.href = downloadUrl
//       downloadLink.download = `${db.name}_backup.json`
//       downloadLink.click()

//       resolve()
//     }

//     transaction.onerror = (event) => {
//       console.error('Error exporting data:', event.target.error)
//       reject(event.target.error)
//     }
//   })
// }


import openDatabase from './IndexDB';

const handleRequestSuccess = (message) => {
  console.log(message);
};

const handleRequestError = (errorMessage) => {
  console.error(errorMessage);
};

const performTransaction = async (objectStoreName, mode, callback) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([objectStoreName], mode);
    const objectStore = transaction.objectStore(objectStoreName);

    callback(objectStore, transaction);
  } catch (error) {
    console.error('Error accessing the database:', error);
  }
};

export const addTask = async (task) => {
  performTransaction('tasks', 'readwrite', (objectStore) => {
    const request = objectStore.add(task);

    request.onsuccess = () => {
      handleRequestSuccess('Task added successfully.');
    };

    request.onerror = (event) => {
      handleRequestError('Error adding the task:', event.target.error);
    };
  });
};

export const deleteTask = async (taskId) => {
  performTransaction('tasks', 'readwrite', (objectStore) => {
    const request = objectStore.delete(taskId);

    request.onsuccess = () => {
      handleRequestSuccess('Task deleted successfully.');
    };

    request.onerror = (event) => {
      handleRequestError('Error deleting the task:', event.target.error);
    };
  });
};

export const updateStatusTask = async (taskId, status) => {
  performTransaction('tasks', 'readwrite', (objectStore, transaction) => {
    const request = objectStore.get(taskId);

    request.onsuccess = (event) => {
      const task = event.target.result;
      if (task) {
        task.status = status;
        const updateRequest = objectStore.put(task);

        updateRequest.onsuccess = () => {
          handleRequestSuccess('Task status updated successfully.');
        };

        updateRequest.onerror = (event) => {
          handleRequestError('Error updating the task:', event.target.error);
        };
      } else {
        handleRequestError('Task not found with the specified ID.');
      }
    };

    request.onerror = (event) => {
      handleRequestError('Error retrieving the task:', event.target.error);
    };

    transaction.onerror = (event) => {
      handleRequestError('Transaction error:', event.target.error);
    };
  });
};

export const getTasks = async (callback) => {
  performTransaction('tasks', 'readonly', (objectStore) => {
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      callback(event.target.result);
    };

    request.onerror = (event) => {
      handleRequestError('Error retrieving tasks:', event.target.error);
    };
  });
};

export const getTaskById = async (taskId, callback) => {
  performTransaction('tasks', 'readonly', (objectStore) => {
    const request = objectStore.get(taskId);

    request.onsuccess = (event) => {
      const task = event.target.result;
      if (task) {
        callback(task);
      } else {
        handleRequestError('No task found with the specified ID.');
        callback(null);
      }
    };

    request.onerror = (event) => {
      handleRequestError('Error retrieving the task:', event.target.error);
      callback(null);
    };
  });
};

export const downloadIndexedDB = async () => {
  try {
    const db = await openDatabase();
    const exportData = {};

    performTransaction('tasks', 'readonly', (objectStore, transaction) => {
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        exportData['tasks'] = event.target.result;

        const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
        const downloadLink = document.createElement('a');
        const downloadUrl = URL.createObjectURL(blob);

        downloadLink.href = downloadUrl;
        downloadLink.download = `${db.name}_backup.json`;
        downloadLink.click();

        handleRequestSuccess('IndexedDB backup downloaded successfully.');
      };

      request.onerror = (event) => {
        handleRequestError(`Error exporting data from 'tasks':`, event.target.error);
      };

      transaction.onerror = (event) => {
        handleRequestError('Transaction error:', event.target.error);
      };
    });
  } catch (error) {
    console.error('Error accessing the database:', error);
  }
};
