import openDatabase from './IndexDB'

// Agregar una tarea
export const addTask = async (task) => {
  const db = await openDatabase()
  const transaction = db.transaction(['tasks'], 'readwrite')
  const objectStore = transaction.objectStore('tasks')
  const request = objectStore.add(task)

  request.onsuccess = () => {
    console.log('Tarea agregada correctamente.')
  }

  request.onerror = (event) => {
    console.error('Error al agregar la tarea:', event.target.error)
  }
}

// Eliminar una tarea por ID
export const deleteTask = async (taskId) => {
  const db = await openDatabase()
  const transaction = db.transaction(['tasks'], 'readwrite')
  const objectStore = transaction.objectStore('tasks')
  const request = objectStore.delete(taskId)

  request.onsuccess = () => {
    console.log('Tarea eliminada correctamente.')
  }

  request.onerror = (event) => {
    console.error('Error al eliminar la tarea:', event.target.error)
  }
}

export const updateStatusTask = async (taskId, status) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.get(taskId);

    request.onsuccess = (event) => {
      const task = event.target.result;
      task.status = status;
      
      objectStore.put(task);

      transaction.oncomplete = () => {
        console.log('Task status updated successfully');
      }

      objectStore.onsuccess = () => {
        console.log("updated");
      };
    }



    request.onerror = (event) => {
      console.error('Error al actualizar la tarea:', event.target.error)
    }
  } catch (error) {
    console.error('Error al abrir la base de datos:', error)
  }
}

// Obtener todas las tareas
export const getTasks = async (callback) => {
  try {
    const db = await openDatabase()
    const transaction = db.transaction(['tasks'], 'readonly')
    const objectStore = transaction.objectStore('tasks')
    const request = objectStore.getAll()

    request.onsuccess = (event) => {
      callback(event.target.result)
    }

    request.onerror = (event) => {
      console.error('Error al obtener las tareas:', event.target.error)
    }
  } catch (error) {
    console.error('Error al abrir la base de datos:', error)
  }
}

// Obtener una tarea por ID
export const getTaskById = async (taskId, callback) => {
  const db = await openDatabase()
  const transaction = db.transaction(['tasks'], 'readonly')
  const objectStore = transaction.objectStore('tasks')
  const request = objectStore.get(taskId)

  request.onsuccess = (event) => {
    const task = event.target.result
    if (task) {
      callback(task)
    } else {
      console.log('No se encontró ninguna tarea con el ID especificado.')
      callback(null)
    }
  }

  request.onerror = (event) => {
    console.error('Error al obtener la tarea:', event.target.error)
    callback(null)
  }
}
