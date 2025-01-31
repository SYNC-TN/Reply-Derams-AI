import React from "react";

import BookInfo from "./BookInfo";
// Types
interface Stats {
  likes?: number;
  views?: number;
}

interface BookData {
  title: string;
  subtitle: string;
  share: boolean;
  url: string;
  cover: string;
  stats: Stats;
}

interface BookProps {
  info: BookData;
}
const Book: React.FC<BookProps> = ({ info }) => {
  return <BookInfo {...info} />;
};
export default Book;
