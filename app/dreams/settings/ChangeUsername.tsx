import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const ChangeUsername = () => {
  const { data: session, update } = useSession();

  const [username, setUsername] = React.useState<string>("");
  const [isChanged, setIsChanged] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
      setIsChanged(false);
    }
  }, [session?.user?.name]);

  React.useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
      setIsChanged(false);
    }
  }, [session?.user?.name]);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setError(null);

    if (newUsername.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    setUsername(newUsername);
    setIsChanged(newUsername.trim() !== session?.user?.name);
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/user/ChangeUsername", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername: username }),
      });

      const data = await response.json();

      if (response.ok) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: username,
          },
        });
        setIsChanged(false);
      } else {
        setError(data.error || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr,2fr] gap-8 items-start">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Your Name</h3>
        <p className="text-slate-400 text-sm">
          Please enter a display name you are comfortable with.
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <Button
          onClick={handleSubmit}
          disabled={!isChanged || !username.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isChanged ? "Save Changes" : "Change"}
        </Button>
      </div>
    </div>
  );
};

export default ChangeUsername;
