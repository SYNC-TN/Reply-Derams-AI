"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBookData } from "./BookData";

interface Language {
  code: string;
  apiCode: string; // Add this new field for Gemini API
  name: string;
  greeting: string;
}

const languages: Language[] = [
  { code: "EN", apiCode: "EN", name: "ENGLISH", greeting: "Hello" },
  { code: "FR", apiCode: "FR", name: "FRENCH", greeting: "Bonjour" },
  { code: "ES", apiCode: "ES", name: "SPANISH", greeting: "Hola" },
  { code: "DE", apiCode: "DE", name: "GERMAN", greeting: "Hallo" },
  { code: "AR", apiCode: "AR", name: "ARABIC", greeting: "مرحبا" },
];

const LanguageSelect: React.FC = () => {
  const { language, setLanguage } = useBookData();

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="absolute top-0 right-0 mt-10 mr-10 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 border border-blue-700/50 hover:border-blue-600/50 shadow-lg transition-all duration-300 max-sm:top-0 max-sm:left-0 max-sm:mt-6 max-sm:ml-4 max-sm:mr-0 max-sm:w-12 max-sm:h-10 max-sm:px-7"
          >
            <Languages className="size-4 mr-2 max-sm:mr-0 " />
            <span id="lg-prefix" className="font-semibold ">
              {language}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-blue-500/20">
          <div className="max-w-6xl mx-auto w-full p-6">
            <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Select Your Language
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {languages.map((lang) => (
                <DrawerClose key={lang.code}>
                  <Button
                    className="w-full p-0 h-auto bg-transparent hover:bg-transparent"
                    onClick={() => setLanguage(lang.code)}
                  >
                    <Card
                      className={cn(
                        "w-full transition-all duration-300",
                        "bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-900 hover:to-indigo-900",
                        "border border-blue-500/20 hover:border-blue-400/50",
                        language === lang.code &&
                          "from-blue-800 to-indigo-900 border-blue-400/80 shadow-lg shadow-blue-500/20"
                      )}
                    >
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader>
                          <CardTitle className="text-center text-gray-200 group-hover:text-white">
                            {lang.code}
                          </CardTitle>
                          <CardDescription className="text-center text-gray-400 group-hover:text-blue-200">
                            {lang.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-center text-sm text-blue-400">
                            {lang.greeting}
                          </p>
                        </CardContent>
                      </div>
                    </Card>
                  </Button>
                </DrawerClose>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default LanguageSelect;
