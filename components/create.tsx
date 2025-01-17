"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateDreamForm from "../app/dreams/CreateDreamForm";

const Create = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 flex items-center justify-center transition-all duration-500 group-hover:translate-x-1"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        Create Story →
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-[#0a1525] border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Create New Dream
            </DialogTitle>
          </DialogHeader>
          <CreateDreamForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Create;
