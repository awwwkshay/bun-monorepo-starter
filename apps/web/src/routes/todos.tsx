import { createFileRoute } from "@tanstack/react-router";
import type { ITodo } from "@bun-monorepo/core";
import { useState, useEffect, useMemo } from "react";
import { Button, Checkbox, Input } from "@/components/ui";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/todos`;

export const Route = createFileRoute("/todos")({
  component: TodosPage,
});

function TodosPage() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTodos() {
      try {
        const res = await fetch(API_BASE, { signal: controller.signal });
        const json = await res.json();
        setTodos(json.data ?? []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
    return () => controller.abort();
  }, []);

  async function createTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setCreating(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: newDescription.trim() || undefined }),
      });
      const json = await res.json();
      setTodos((prev) => [...prev, json.data]);
      setNewTitle("");
      setNewDescription("");
    } catch {
      setError("Failed to create todo.");
    } finally {
      setCreating(false);
    }
  }

  async function toggleComplete(todo: ITodo) {
    try {
      const res = await fetch(`${API_BASE}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });
      const json = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? json.data : t)));
    } catch {
      setError("Failed to update todo.");
    }
  }

  function startEdit(todo: ITodo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
  }

  async function saveEdit(id: string) {
    const title = editTitle.trim();
    if (!title) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: editDescription.trim() || undefined }),
      });
      const json = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? json.data : t)));
      setEditingId(null);
    } catch {
      setError("Failed to update todo.");
    }
  }

  async function deleteTodo(id: string) {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo.");
    }
  }

  const { pendingCount, completedCount, sortedTodos } = useMemo(() => {
    const pending: ITodo[] = [];
    const completed: ITodo[] = [];
    for (const t of todos) {
      if (t.isCompleted) completed.push(t);
      else pending.push(t);
    }
    return {
      pendingCount: pending.length,
      completedCount: completed.length,
      sortedTodos: [...pending, ...completed],
    };
  }, [todos]);

  return (
    <main className="page-wrap px-4 py-10">
      <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-8 sm:px-10 sm:py-10 mb-6">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <p className="island-kicker mb-2">Task Manager</p>
        <h1 className="display-title mb-1 text-3xl font-bold tracking-tight text-(--sea-ink) sm:text-4xl">
          Your Todos
        </h1>
        <p className="text-sm text-(--sea-ink-soft)">
          {pendingCount} pending · {completedCount} completed
        </p>
      </section>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-between">
          {error}
          <Button onClick={() => setError(null)}>Dismiss</Button>
        </div>
      )}

      <form onSubmit={createTodo} className="island-shell rise-in rounded-2xl p-5 mb-6">
        <p className="island-kicker mb-3">New Todo</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={creating || !newTitle.trim()}>
            {creating ? "Adding…" : "Add Todo"}
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="island-shell rounded-2xl p-8 text-center text-sm text-(--sea-ink-soft)">
          Loading…
        </div>
      ) : sortedTodos.length === 0 ? (
        <div className="island-shell rounded-2xl p-8 text-center text-sm text-(--sea-ink-soft)">
          No todos yet. Add one above!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedTodos.map((todo, index) => (
            <article
              key={todo.id}
              className="island-shell rise-in rounded-2xl p-4 sm:p-5"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {editingId === todo.id ? (
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <Input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => saveEdit(todo.id)}>Save</Button>
                    <Button onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={todo.isCompleted}
                    onCheckedChange={() => toggleComplete(todo)}
                    aria-label={todo.isCompleted ? "Mark incomplete" : "Mark complete"}
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold text-(--sea-ink) ${todo.isCompleted ? "line-through opacity-50" : ""}`}
                    >
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p
                        className={`mt-0.5 text-xs text-(--sea-ink-soft) ${todo.isCompleted ? "line-through opacity-40" : ""}`}
                      >
                        {todo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant={"outline"}
                      onClick={() => startEdit(todo)}
                      aria-label="Edit"
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                        <path
                          d="M11.5 2.5l2 2-9 9H2.5v-2l9-9z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="Delete"
                      className="rounded-lg p-1.5 text-(--sea-ink-soft) transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                        <path
                          d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
