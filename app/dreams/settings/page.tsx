"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, KeyRound } from "lucide-react";
import { KeyIcon } from "lucide-react";
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
import { ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const SettingsPage: React.FC = () => {
  const { data: session, update } = useSession();
  const [username, setUsername] = React.useState(session?.user?.name ?? "");
  const [isChanged, setIsChanged] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [passError, setPassError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [provider, setProvider] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [repeatNewPassword, setRepeatNewPassword] = React.useState("");

  React.useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
      setIsChanged(false);
    }
  }, [session?.user?.name]);

  React.useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch("/api/user/CheckProvider", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch provider information");
        }

        const data = await response.json();
        setProvider(data.isCredentialsProvider);
      } catch (error) {
        console.error("Error checking provider:", error);
      }
    };

    check();
  }, []);

  React.useEffect(() => {
    console.log("old password :", oldPassword);
    console.log("new password: ", newPassword);
    console.log("repeat new password :", repeatNewPassword);
  }, [newPassword, oldPassword, repeatNewPassword]);

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

  const handleOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const oldPassword = e.target.value;
    setOldPassword(oldPassword);
  };

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
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
        await signOut({ callbackUrl: "/" });
      } else {
        console.error("Failed to delete account:", data.error);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleEditPassword = async () => {
    setPassError(null);

    if (newPassword !== repeatNewPassword) {
      setPassError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPassError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("/api/user/ChangePassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setPassError(errorData.error || "Failed to change password");
        return;
      }
      setSuccess("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      setPassError("An unexpected error occurred");
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
        await update({
          ...session,
          user: {
            ...session?.user,
            name: username,
          },
        });
        setIsChanged(false);
      } else {
        console.error("Failed to update username:", data.error);
      }
    } catch (error) {
      console.error("Error updating username:", error);
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
            {/*edit password section*/}

            {provider ? (
              <div className="w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent hover:bg-slate-800 text-slate-200 border border-slate-700 h-14"
                    >
                      <KeyRound className="w-4 h-4" />
                      Edit Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                        <KeyRound className="w-6 h-6 text-blue-500" />
                        Change Password
                      </DialogTitle>
                      <DialogDescription className="text-slate-400 mt-2">
                        Secure your account with a strong, unique password
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid md:grid-cols-2 gap-8 py-4">
                      {/* Left Side - Password Guidelines */}
                      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                            <h3 className="text-lg font-semibold text-white">
                              Password Guidelines
                            </h3>
                          </div>
                          <ul className="text-slate-400 space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <KeyIcon className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <span>At least 8 characters long</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <KeyIcon className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <span>
                                Include a mix of uppercase and lowercase letters
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <KeyIcon className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <span>Include at least one number</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <KeyIcon className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <span>
                                Include at least one special character
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <KeyIcon className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <span>
                                Avoid using common words or personal information
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Right Side - Password Input Fields */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="oldPassword"
                            className="text-right text-white"
                          >
                            Current Password
                          </Label>
                          <Input
                            type="password"
                            id="oldPassword"
                            className="col-span-3 bg-slate-800 border-slate-700 text-white"
                            placeholder="Enter current password"
                            onChange={handleOldPassword}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="newPassword"
                            className="text-right text-white"
                          >
                            New Password
                          </Label>
                          <Input
                            type="password"
                            id="newPassword"
                            className="col-span-3 bg-slate-800 border-slate-700 text-white"
                            placeholder="Enter new password"
                            onChange={handleNewPassword}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-right text-white"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            type="password"
                            id="confirmPassword"
                            className="col-span-3 bg-slate-800 border-slate-700 text-white"
                            placeholder="Confirm new password"
                            onChange={(e) =>
                              setRepeatNewPassword(e.target.value)
                            }
                          />
                        </div>

                        {passError != null && (
                          <div className="text-red-500 text-sm mt-2 text-center">
                            {passError}
                          </div>
                        )}
                        {success != null && (
                          <div className="text-green-500 text-sm mt-2 text-center">
                            {success}
                          </div>
                        )}
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleEditPassword}
                      >
                        Save Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : null}
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
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                          onClick={handleDeleteAccount}
                        >
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

export default SettingsPage;
