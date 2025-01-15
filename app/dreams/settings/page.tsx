"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Circle, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

const page = () => {
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState(session?.user?.name ?? "");
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
      setIsChanged(false); // Reset changed state when session updates
    }
  }, [session?.user?.name]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setIsChanged(newUsername.trim() !== session?.user?.name);
  };
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/user/DeleteAccount", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Sign out the user after successful deletion
        await signOut({ callbackUrl: "/" });
      } else {
        console.error("Failed to delete account:", data.error);
        // Show error to user
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      // Show error to user
    }
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
        console.log("Username updated successfully");
        // Don't modify session directly, let update() handle it
        await update(); // This will trigger a session refresh
        setIsChanged(false);
      } else {
        console.error("Failed to update username:", data.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Error updating username:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-950 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Account Settings Section */}
        <div className="bg-slate-900 rounded-xl shadow-lg p-6 md:p-8">
          <div className="border-b border-slate-800 pb-6 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Settings</h2>
            <p className="text-slate-400">
              Manage account and website settings.
            </p>
          </div>

          {/* Username Section */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-[1fr,2fr] gap-8 items-start">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  Your Name
                </h3>
                <p className="text-slate-400 text-sm">
                  Please enter a display name you are comfortable with.
                </p>
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
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-slate-900/50 rounded-xl border border-red-900/50 shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl font-semibold text-red-500">
                Danger Zone
              </h2>
            </div>

            <div className="grid md:grid-cols-[1fr,2fr] gap-8 items-start">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  Delete Account
                </h3>
                <p className="text-slate-400 text-sm">
                  Permanently remove your account and all associated data
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-red-900/20">
                <h4 className="text-lg font-medium text-white mb-2">
                  Are you sure?
                </h4>
                <p className="text-slate-400 text-sm mb-6">
                  Permanently delete your Entretien AI account and your
                  subscription. This action cannot be undone - please proceed
                  with caution.
                </p>
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        onClick={handleDeleteAccount}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-slate-900 border border-slate-800 shadow-lg max-w-md mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          Delete Account
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 mt-2 text-base">
                          <p className="mb-4">
                            Are you absolutely sure you want to delete your
                            account? This action cannot be undone.
                          </p>
                          <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 text-sm">
                            <p className="font-medium text-red-400 mb-2">
                              What will happen:
                            </p>
                            <ul className="text-slate-300 space-y-2">
                              <li className="flex items-center gap-2">
                                <Circle className="w-2 h-2 text-red-500" />
                                Your account will be permanently deleted
                              </li>
                              <li className="flex items-center gap-2">
                                <Circle className="w-2 h-2 text-red-500" />
                                All your data will be removed from our servers
                              </li>
                              <li className="flex items-center gap-2">
                                <Circle className="w-2 h-2 text-red-500" />
                                Active subscriptions will be cancelled
                              </li>
                            </ul>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="mt-6 space-x-3">
                        <AlertDialogCancel className="bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default page;
