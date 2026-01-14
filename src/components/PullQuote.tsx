interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

export const PullQuote = ({ quote, attribution }: PullQuoteProps) => {
  return (
    <blockquote className="border-l-4 border-primary pl-6 py-4 bg-card/50 backdrop-blur-sm rounded-r-lg italic text-base md:text-lg text-foreground shadow-sm">
      {quote}
      {attribution && (
        <>
          {" "}
          <span className="font-semibold not-italic">
            — {attribution}
          </span>
        </>
      )}
    </blockquote>
  );
};

