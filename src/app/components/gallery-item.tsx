import { motion } from "motion/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Calendar, Sparkles } from "lucide-react";

interface GalleryItemProps {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
  prompt?: string;
}

export function GalleryItem({ title, image, category, description, date, prompt }: GalleryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="group cursor-pointer overflow-hidden rounded-lg bg-neutral-900 shadow-lg"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <Badge className="mb-2">{category}</Badge>
            <h3 className="text-lg text-white">{title}</h3>
          </div>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-neutral-900 text-white border-neutral-700">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg">
              <img src={image} alt={title} className="size-full object-cover" />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Badge variant="secondary">{category}</Badge>
              </div>
              <p className="text-neutral-300">{description}</p>
              {prompt && (
                <div className="rounded-lg bg-neutral-800 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                    <Sparkles className="size-4" />
                    Prompt
                  </div>
                  <p className="text-sm text-neutral-300">{prompt}</p>
                </div>
              )}
              <div className="mt-auto flex items-center gap-2 text-sm text-neutral-400">
                <Calendar className="size-4" />
                {date}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
