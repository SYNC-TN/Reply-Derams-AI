// components/auth/AuthDialog.tsx
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-transparent border-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0f1420]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden"
        >
          {isLogin ? (
            <SignIn onToggle={toggleMode} />
          ) : (
            <SignUp onToggle={toggleMode} />
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
