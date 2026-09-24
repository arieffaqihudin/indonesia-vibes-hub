import type { JSONContent } from "@tiptap/core";

function children(node: JSONContent) {
  return (node.content ?? []).map((child, index) => <RenderNode key={index} node={child} />);
}

function RenderNode({ node }: { node: JSONContent }) {
  if (node.type === "text") {
    let content = <>{node.text}</>;
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") content = <strong>{content}</strong>;
      if (mark.type === "italic") content = <em>{content}</em>;
      if (mark.type === "underline") content = <u>{content}</u>;
      if (mark.type === "link") content = <a href={String(mark.attrs?.["href"] ?? "#")}>{content}</a>;
    }
    return content;
  }
  if (node.type === "heading") {
    return node.attrs?.["level"] === 3 ? <h3>{children(node)}</h3> : <h2>{children(node)}</h2>;
  }
  if (node.type === "bulletList") return <ul>{children(node)}</ul>;
  if (node.type === "orderedList") return <ol>{children(node)}</ol>;
  if (node.type === "listItem") return <li>{children(node)}</li>;
  if (node.type === "blockquote") return <blockquote>{children(node)}</blockquote>;
  if (node.type === "horizontalRule") return <hr />;
  if (node.type === "image") return <img src={String(node.attrs?.["src"] ?? "")} alt={String(node.attrs?.["alt"] ?? "")} />;
  if (node.type === "pullQuote") return <blockquote className="article-pull-quote">{children(node)}</blockquote>;
  if (node.type === "callout") return <aside className="article-callout">{children(node)}</aside>;
  if (node.type === "mediaFigure") return <figure><img src={String(node.attrs?.["src"] ?? "")} alt={String(node.attrs?.["alt"] ?? "")} /><figcaption>{String(node.attrs?.["caption"] ?? "")}{node.attrs?.["credit"] ? ` — ${node.attrs["credit"]}` : ""}</figcaption></figure>;
  if (node.type === "gallery") {
    const urls = String(node.attrs?.["images"] ?? "").split("\n").filter(Boolean);
    return <figure><div className="grid grid-cols-2 gap-2">{urls.map((url) => <img key={url} src={url} alt="" />)}</div><figcaption>{String(node.attrs?.["caption"] ?? "")}</figcaption></figure>;
  }
  if (node.type === "videoEmbed" || node.type === "externalEmbed") return <div className="article-embed"><a href={String(node.attrs?.["url"] ?? "#")}>{node.type === "videoEmbed" ? "Watch video" : "Open embedded source"}</a></div>;
  if (node.type === "table") return <div className="overflow-x-auto"><table><tbody>{children(node)}</tbody></table></div>;
  if (node.type === "tableRow") return <tr>{children(node)}</tr>;
  if (node.type === "tableHeader") return <th>{children(node)}</th>;
  if (node.type === "tableCell") return <td>{children(node)}</td>;
  return <p>{children(node)}</p>;
}

export function ArticleDocument({ document }: { document: JSONContent }) {
  return <div className="prose-editorial article-document text-ink">{children(document)}</div>;
}
