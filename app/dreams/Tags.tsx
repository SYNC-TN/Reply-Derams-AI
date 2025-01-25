import React, { useCallback, useState } from "react";
import { ReactTags } from "react-tag-autocomplete";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useBookData } from "./BookData";
import { Tag } from "lucide-react";
import dreamTagSuggestions from "./dreamTagSuggestions";

interface Tag {
  id: number;
  name: string;
  label: string;
  value: string;
}

const DreamTags = () => {
  const { tags, setTags } = useBookData();
  const [maxTags, setMaxTags] = useState(false);

  const onAdd = useCallback(
    (newTag: any) => {
      if (tags.length >= 5) {
        setMaxTags(true);
        return;
      }
      setTags([...tags, newTag]);
    },
    [tags, setTags]
  );

  const onDelete = useCallback(
    (tagIndex: number) => {
      setMaxTags(false);
      setTags(tags.filter((_, i) => i !== tagIndex));
    },
    [tags, setTags]
  );

  return (
    <Card className="w-full bg-gray-900 text-white">
      <CardHeader>
        <CardTitle>Add Tags to Your Story</CardTitle>
        {maxTags && (
          <p className="text-red-500 text-sm">
            You can only add up to 5 tags to your story
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ReactTags
          selected={tags}
          suggestions={dreamTagSuggestions}
          onAdd={onAdd}
          onDelete={onDelete}
          noOptionsText="No matching tags"
          classNames={{
            root: "react-tags",
            rootIsActive: "is-active",
            rootIsDisabled: "is-disabled",
            rootIsInvalid: "is-invalid",
            label: "react-tags__label",
            tagList:
              "react-tags__list grid grid-cols-3 gap-2 max-md:grid-cols-2",
            tagListItem: "react-tags__list-item",
            tag: "react-tags__tag bg-blue-600 text-white px-3 py-1 rounded-full",
            tagName: "react-tags__tag-name truncate",
            comboBox: "react-tags__combobox text-white",
            input: "react-tags__combobox-input bg-gray-800 text-white",
            listBox:
              "react-tags__listbox bg-transparent shadow-lg rounded-md overflow-hidden",
            option: "react-tags__listbox-option text-white",
            optionIsActive: "is-active bg-blue-600",
            highlight: "react-tags__listbox-option-highlight bg-sky-600",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DreamTags;
