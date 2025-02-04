import React, { useState } from "react";
import { useBookData } from "./BookData";
import dreamTagSuggestions from "./dreamTagSuggestions";
import Select, { MultiValue } from "react-select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Tag {
  id: number;
  name: string;
  label: string;
  value: string;
}

const DreamTags = () => {
  const { tags, setTags } = useBookData();
  const [maxTags, setMaxTags] = useState(false);

  const handleTagChange = (newTags: MultiValue<Tag>) => {
    if (newTags.length <= 5) {
      setTags(newTags as Tag[]);
      setMaxTags(false);
    } else {
      setMaxTags(true);
    }
  };

  return (
    <Card className="w-full bg-[#0c1b2d] text-white">
      <CardHeader>
        <CardTitle>Add Tags to Your Story</CardTitle>
        {maxTags && (
          <p className="text-red-500 text-sm">
            You can only add up to 5 tags to your story
          </p>
        )}
      </CardHeader>
      <CardContent className="bg-[#0c1b2d] ">
        <Select
          isMulti
          name="DreamTags"
          options={dreamTagSuggestions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleTagChange}
          value={tags}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "transparent",
              borderColor: "transparent",
            }),
            valueContainer: (provided) => ({
              ...provided,
              backgroundColor: "transparent",
              color: "white",
            }),
            input: (provided) => ({
              ...provided,
              color: "white",
            }),
            option: (provided) => ({
              ...provided,
              backgroundColor: "transparent",
              color: "white",
              ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }),

            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }),

            multiValueLabel: (provided) => ({
              ...provided,
              color: "white",
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#0C1B2D",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "white",
              ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
            }),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DreamTags;
