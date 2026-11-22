import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ href = "", title, children }) =>
          href.startsWith("/") ? (
            <Link href={href} title={title}>
              {children}
            </Link>
          ) : (
            <a href={href} title={title} target={href.startsWith("#") ? undefined : "_blank"} rel="noreferrer">
              {children}
            </a>
          ),
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table>{children}</table>
          </div>
        ),
        img: ({ src, alt = "", title, width, height }) => (
          // eslint-disable-next-line @next/next/no-img-element -- repo images of unknown size, served statically
          <img src={typeof src === "string" ? src : undefined} alt={alt} title={title} width={width} height={height} loading="lazy" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
