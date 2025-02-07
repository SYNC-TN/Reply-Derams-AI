import React, { createContext, useContext, useEffect, useState } from "react";
interface Tag {
  id: number;
  name: string;
  label: string;
  value: string;
}
interface BookDataContextType {
  description: string;
  artStyle: string;
  language: string;
  share: boolean;
  tags: Tag[];
  soundEffect: boolean;
  bookTone: string;
  storyLength: string;
  perspective: string;
  genre: string;
  setDescription: (description: string) => void;
  setArtStyle: (artStyle: string) => void;
  setLanguage: (language: string) => void;
  setShare: (share: boolean) => void;
  setTags: (tags: Tag[]) => void;
  setSoundEffect: (soundEffect: boolean) => void;
  setBookTone: (bookTone: string) => void;
  setStoryLength: (storyLength: string) => void;
  setPerspective: (perspective: string) => void;
  setGenre: (genre: string) => void;
}

const BookDataContext = createContext<BookDataContextType | undefined>(
  undefined
);

export function BookDataProvider({ children }: { children: React.ReactNode }) {
  const [description, setDescription] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [language, setLanguage] = useState("EN");
  const [share, setShare] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [soundEffect, setSoundEffect] = useState(false);
  const [bookTone, setBookTone] = useState("");
  const [storyLength, setStoryLength] = useState("");
  const [perspective, setPerspective] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    console.log("Description:", description);
    console.log("Art Style:", artStyle);
    console.log("Language:", language);
    console.log("Share:", share);
    console.log("Tags:", tags);
    console.log("Sound Effect:", soundEffect);
    console.log("Book Tone:", bookTone);
    console.log("Story Length:", storyLength);
    console.log("Perspective:", perspective);
    console.log("Genre:", genre);
  }, [
    description,
    artStyle,
    language,
    share,
    tags,
    soundEffect,
    bookTone,
    storyLength,
    perspective,
    genre,
  ]);

  return (
    <BookDataContext.Provider
      value={{
        description,
        artStyle,
        language,
        share,
        tags,
        soundEffect,
        bookTone,
        storyLength,
        perspective,
        genre,
        setDescription,
        setArtStyle,
        setLanguage,
        setShare,
        setTags,
        setSoundEffect,
        setBookTone,
        setStoryLength,
        setPerspective,
        setGenre,
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
