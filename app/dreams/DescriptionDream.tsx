"use client";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useBookData } from "./BookData";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState } from "react";

const DescriptionDream: React.FC = () => {
  const { description, setDescription } = useBookData();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [test, setTest] = useState(true);

  useEffect(() => {
    if (transcript) {
      const newDescription = description
        ? `${description} ${transcript}`
        : transcript;
      setDescription(newDescription);
      resetTranscript();
    }
  }, [transcript, setDescription, description]);

  const record = (test: boolean) => {
    if (test) {
      SpeechRecognition.startListening({ continuous: true });
      setTest(false);
    } else {
      SpeechRecognition.stopListening();
      setTest(true);
    }
  };

  return (
    <div className="space-y-4 m-4">
      <h2 className="text-lg font-semibold text-white">Describe your dream</h2>
      <Button
        onClick={() => record(test)}
        className="flex items-center gap-2 rounded-lg bg-blue-500/20 text-blue-100 hover:bg-blue-500/40"
        type="button"
      >
        {!test ? <Mic /> : <MicOff />}{" "}
        {!SpeechRecognition.browserSupportsSpeechRecognition()
          ? "Browser doesn't support Speech Recognition"
          : ""}
      </Button>
      <Textarea
        placeholder="Describe your dream in detail..."
        className="min-h-[200px] bg-[#0c1b2d] border-blue-500/20 text-blue-100 placeholder:text-blue-300/50"
        id="prompt"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        required
      />
    </div>
  );
};

export default DescriptionDream;
