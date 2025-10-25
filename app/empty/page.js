"use client";
import { useRouter } from "next/navigation";

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="empty-movie-list back">
      <h1 className="">Your movie list is empty</h1>
      <button
        onClick={() => router.push("/create")}
        className=""
      >
        Add a new movie
      </button>
    </div>
  );
}
