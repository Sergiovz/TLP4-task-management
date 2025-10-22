import React, { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "completada";
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ titulo: "", descripcion: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/tasks");

      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("La respuesta no es un array:", response.data);
        setTasks([]);
        setError("La respuesta del servidor no es válida");
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
      setError(
        "No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.post("/api/tasks", newTask);
      fetchTasks();
      setNewTask({ titulo: "", descripcion: "" });
    } catch (error) {
      console.error("Error al crear tarea:", error);
      setError("Error al crear la tarea");
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const nuevoEstado =
        task.estado === "pendiente" ? "completada" : "pendiente";
      await axios.put(`/api/tasks/${task.id}`, {
        ...task,
        estado: nuevoEstado,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      setError("Error al actualizar la tarea");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setError("Error al eliminar la tarea");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-100 mb-1">
            Mis Tareas
          </h1>
          <p className="text-gray-500">Gestiona tus tareas diarias</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-gray-900 border border-gray-800 text-gray-300 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}

        {/* Layout Grid - Main content and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Form and Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-medium text-gray-100 mb-4">
                Nueva Tarea
              </h2>

              <form onSubmit={createTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Título de la tarea"
                    value={newTask.titulo}
                    onChange={(e) =>
                      setNewTask({ ...newTask, titulo: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Descripción"
                    value={newTask.descripcion}
                    onChange={(e) =>
                      setNewTask({ ...newTask, descripcion: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium py-3 px-6 rounded-lg border border-gray-700 transition duration-200"
                >
                  Agregar Tarea
                </button>
              </form>
            </div>

            {/* Tasks List Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-medium text-gray-100 mb-4">Tareas</h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mb-4"></div>
                  <p className="text-gray-500">Cargando...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay tareas</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Crea una nueva tarea arriba
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task)}
                          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            task.estado === "completada"
                              ? "bg-gray-600 border-gray-600"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          {task.estado === "completada" && (
                            <svg
                              className="w-3 h-3 text-gray-100"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium text-gray-100 ${
                              task.estado === "completada"
                                ? "line-through opacity-50"
                                : ""
                            }`}
                          >
                            {task.titulo}
                          </h3>
                          <p
                            className={`text-sm text-gray-400 mt-1 ${
                              task.estado === "completada"
                                ? "line-through opacity-50"
                                : ""
                            }`}
                          >
                            {task.descripcion}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-600 hover:text-gray-400 transition p-2 opacity-0 group-hover:opacity-100"
                          title="Eliminar"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl sticky top-6">
              <h2 className="text-lg font-medium text-gray-100 mb-6">
                Estadísticas
              </h2>

              <div className="space-y-4">
                {/* Total Tasks */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-2xl font-semibold text-gray-100">
                    {tasks.length}
                  </p>
                </div>

                {/* Pending Tasks */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Pendientes</p>
                  <p className="text-2xl font-semibold text-gray-100">
                    {tasks.filter((t) => t.estado === "pendiente").length}
                  </p>
                </div>

                {/* Completed Tasks */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Completadas</p>
                  <p className="text-2xl font-semibold text-gray-100">
                    {tasks.filter((t) => t.estado === "completada").length}
                  </p>
                </div>

                {/* Progress Bar */}
                {tasks.length > 0 && (
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-500 mb-2">Progreso</p>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gray-600 h-full transition-all duration-500"
                        style={{
                          width: `${
                            (tasks.filter((t) => t.estado === "completada")
                              .length /
                              tasks.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      {Math.round(
                        (tasks.filter((t) => t.estado === "completada").length /
                          tasks.length) *
                          100
                      )}
                      % completado
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
