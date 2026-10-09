
import { Suspense } from "react";
import { supabase } from "../lib/supabase";
import { addTask, deleteTask, toggleTask } from "./actions";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

function LoadingTasks() {
  return (
    <section className="task-section">
      <div className="section-heading">
        <h2>Your Tasks</h2>
      </div>
      <p className="empty">Loading your tasks...</p>
    </section>
  );
}

async function TaskList() {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, completed, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load tasks error:", error.message);

    return (
      <section className="task-section">
        <h2>Your Tasks</h2>
        <p className="error">
          Could not load tasks. Check your Supabase settings and database.
        </p>
      </section>
    );
  }

  const tasks = (data ?? []) as Task[];

  return (
    <section className="task-section">
      <div className="section-heading">
        <h2>Your Tasks</h2>
        <span className="count">{tasks.length} total</span>
      </div>

      {tasks.length === 0 ? (
        <p className="empty">
          No tasks yet. Add your first task above!
        </p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <div className="task-copy">
                <span
                  className={
                    task.completed ? "task-title done" : "task-title"
                  }
                >
                  {task.title}
                </span>

                <span className="task-status">
                  {task.completed ? "Completed" : "In progress"}
                </span>
              </div>

              <div className="task-buttons">
                <form action={toggleTask}>
                  <input type="hidden" name="id" value={task.id} />
                  <input
                    type="hidden"
                    name="completed"
                    value={String(task.completed)}
                  />

                  <button className="secondary" type="submit">
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                </form>

                <form action={deleteTask}>
                  <input type="hidden" name="id" value={task.id} />

                  <button className="danger" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">NEXT.JS + SUPABASE</p>
        <h1>Mini Task Tracker</h1>
        <p className="subtitle">
          Organize your work. Track your progress.
        </p>
      </header>

      <form action={addTask} className="add-form">
        <label className="sr-only" htmlFor="title">
          Task name
        </label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="What do you need to do?"
          maxLength={200}
          required
        />

        <button type="submit">Add Task +</button>
      </form>

      <Suspense fallback={<LoadingTasks />}>
        <TaskList />
      </Suspense>

      <footer>
        Built with Next.js, Server Actions and Supabase PostgreSQL.
      </footer>
    </main>
  );
}