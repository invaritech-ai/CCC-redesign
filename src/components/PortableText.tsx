import type { SanityPortableTextBlock } from "@/lib/sanity.types";

interface PortableTextProps {
  blocks: SanityPortableTextBlock[];
  className?: string;
}

export const PortableText = ({ blocks, className = "" }: PortableTextProps) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map((block, index: number) => {
        if (block._type === "block") {
          const text =
            block.children?.map((child) => child.text).join("") || "";

          switch (block.style) {
            case "h1":
              return (
                <h3 key={index} className="text-xl font-semibold mb-2">
                  {text}
                </h3>
              );
            case "h2":
              return (
                <h4 key={index} className="text-lg font-semibold mb-2">
                  {text}
                </h4>
              );
            case "h3":
              return (
                <h5 key={index} className="text-base font-semibold mb-1">
                  {text}
                </h5>
              );
            case "normal":
            default:
              return (
                <p key={index} className="text-base leading-relaxed">
                  {text}
                </p>
              );
          }
        }
        return null;
      })}
    </div>
  );
};

