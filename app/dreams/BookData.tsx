import React, { createContext, useContext, useEffect, useState } from "react";

interface BookDataContextType {
  description: string;
  artStyle: string;
  language: string;
  colorTheme: string;
  imageStyleStrength: number;
  imageResolution: string;
  setDescription: (description: string) => void;
  setArtStyle: (artStyle: string) => void;
  setLanguage: (language: string) => void;
  setColorTheme: (colorTheme: string) => void;
  setImageStyleStrength: (imageStyleStrength: number) => void;
  setImageResolution: (imageResolution: string) => void;
}

const BookDataContext = createContext<BookDataContextType | undefined>(
  undefined
);

export function BookDataProvider({ children }: { children: React.ReactNode }) {
  const [description, setDescription] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [language, setLanguage] = useState("US");
  const [colorTheme, setColorTheme] = useState("");
  const [imageStyleStrength, setImageStyleStrength] = useState(50);
  const [imageResolution, setImageResolution] = useState("");

  useEffect(() => {
    console.log("Description:", description);
    console.log("Art Style:", artStyle);
    console.log("Language:", language);
    console.log("Color Theme:", colorTheme);
    console.log("Image Style Strength:", imageStyleStrength);
    console.log("Image Resolution:", imageResolution);
  }, [
    description,
    artStyle,
    language,
    colorTheme,
    imageStyleStrength,
    imageResolution,
  ]);

  return (
    <BookDataContext.Provider
      value={{
        description,
        artStyle,
        language,
        colorTheme,
        imageStyleStrength,
        imageResolution,
        setDescription,
        setArtStyle,
        setLanguage,
        setColorTheme,
        setImageStyleStrength,
        setImageResolution,
      }}
    >
      {children}
    </BookDataContext.Provider>
  );
}

export function useBookData() {
  const context = useContext(BookDataContext);
  if (context === undefined) {
    throw new Error("useBookData must be used within a BookDataProvider");
  }
  return context;
}
