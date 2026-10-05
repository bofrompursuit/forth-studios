import { motion } from "motion/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";


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
        className="group cursor-pointer"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-charcoal">
          <img
            src={image}
            alt={title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="label-caps absolute left-0 top-0 bg-sun px-2.5 py-1 text-xs">{category}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-b border-ink py-3">
          <h3 className="text-lg uppercase">{title}</h3>
          <span className="shrink-0 text-sm">View →</span>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl rounded-none border border-ink bg-sun p-0 text-ink sm:max-w-4xl">
          <div className="grid md:grid-cols-2">
            <div className="overflow-hidden bg-charcoal">
              <img src={image} alt={title} className="size-full object-cover" />
            </div>
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <p className="label-caps text-sm">{category}</p>
              <DialogTitle className="font-wide text-3xl uppercase leading-[0.95]">{title}</DialogTitle>
              <p className="leading-relaxed">{description}</p>
              {prompt && (
                <div className="border border-ink bg-paper p-4">
                  <p className="label-caps mb-2 text-xs">Prompt</p>
                  <p className="text-sm leading-relaxed">{prompt}</p>
                </div>
              )}
              <p className="mt-auto border-t border-ink pt-4 text-sm">{date}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
