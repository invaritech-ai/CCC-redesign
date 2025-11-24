interface PullQuoteProps {
  quote: string;
}

export const PullQuote = ({ quote }: PullQuoteProps) => {
  return (
    <blockquote className="border-l-4 border-primary pl-6 md:pl-8 py-4 md:py-6 my-8 md:my-10 italic text-lg md:text-xl text-foreground leading-relaxed">
      {quote}
    </blockquote>
  );
};

