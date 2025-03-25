import MarkdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import blockImage from "markdown-it-block-image";
import mdToc from "markdown-it-toc-done-right";
import footnotes from "markdown-it-footnote";

const MD = new MarkdownIt({ html: true, linkify: true, breaks: false });

MD.use(texmath, { delimiters: "dollars" });
MD.use(blockImage);
MD.use(mdToc);
MD.use(footnotes);

function todoListPlugin(md, opts) {
  const startsWithTodoSequence = (text) => {
    return text.startsWith("[ ] ") || text.startsWith("[x] ");
  };

  const isITodoInlineToken = (tokens, i) => {
    return (
      tokens[i].type === "inline" &&
      tokens[i - 1].type === "paragraph_open" &&
      tokens[i - 2].type === "list_item_open" &&
      startsWithTodoSequence(tokens[i].content)
    );
  };

  const removeMarkup = (token) => {
    let textNode = token.children[0];
    textNode.content = textNode.content.slice(4);
  };

  const closestList = (tokens, index) => {
    for (let i = index; i >= 0; i--) {
      let token = tokens[i];
      if (token.type === "bullet_list_open") {
        return token;
      }
    }
  };

  const rule = (state) => {
    let tokens = state.tokens;
    for (let i = 2; i < tokens.length; i++) {
      if (isITodoInlineToken(tokens, i)) {
        tokens[i - 2].attrSet("todo", true);
        tokens[i - 2].attrSet("checked", tokens[i].content.startsWith("[x] "));
        removeMarkup(tokens[i]);
        let container = closestList(tokens, i - 3);
        if (container) {
          container.attrSet("has-todos", true);
        }
      }
    }
  };

  md.core.ruler.after("inline", "todo-list-rule", rule);
}

MD.use(todoListPlugin);

export function tokenize(text) {
  return MD.parse(text, {});
}

export function tokenizeJSON(text) {
  return JSON.stringify(MD.parse(text, {}));
}
