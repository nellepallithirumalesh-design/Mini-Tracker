"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../lib/supabase";

export async function addTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();

  if (!title || title.length > 200) return;

  const { error } = await supabase
    .from("tasks")
    .insert({ title });

  if (error) {
    console.error("Add task error:", error.message);
    throw new Error("Could not add task.");
  }

  revalidatePath("/");
}

export async function toggleTask(formData: FormData) {
  const id = Number(formData.get("id"));
  const completed = formData.get("completed") === "true";

  if (!Number.isSafeInteger(id) || id <= 0) return;

  const { error } = await supabase
    .from("tasks")
    .update({ completed: !completed })
    .eq("id", id);

  if (error) {
    console.error("Update task error:", error.message);
    throw new Error("Could not update task.");
  }

  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isSafeInteger(id) || id <= 0) return;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete task error:", error.message);
    throw new Error("Could not delete task.");
  }

  revalidatePath("/");
}