// BookShelf component
import Book from "./Book";
import { BookIcon } from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";

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
interface BookShelfProps {
  title: string;
  profileAcces?: boolean;
  books: BookData[];
}

const BookShelf: React.FC<BookShelfProps> = ({ title, books }) => {
  const BookOpenSfx = "/book-drop.mp3";
  const [play] = useSound(BookOpenSfx, { volume: 0.05 });
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          <BookIcon className="w-5 h-5 text-blue-400" />
          {title}
        </h2>

        {/* Bookshelf container with wooden texture */}
        <div className="relative">
          {/* Books container with gradient shadow */}
          <div className="grid grid-cols-2 md:grid-cols-3 max-sm:grid-cols-2  max-md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-md:gap-16 pb-8   px-4">
            {books.map((book, index) => (
              <div key={index} className="flex justify-center ">
                <motion.div
                  onHoverStart={() => play()}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <Book info={book} />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Wooden shelf effect */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 rounded-sm shadow-lg"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookShelf;
