import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchUserByTitle } from "@services/api";
import type { Movie } from "@/types/Movie";
import { UserDetails } from "@components/UserDetails";
import { Spinner } from "@/components/UI/Spinner";
import { toast } from "react-toastify";

export const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchUserByTitle(Number(id))
      .then(setUser)
      .catch((err) => toast.error(`Failed to load users: ${err.message}`))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!user) return <div role="alert">User not found.</div>;

  return <UserDetails user={user} />;
};
