import assert from "node:assert/strict";

import satteriRenderDiagram from "./remark-render-diagram.mjs";

const keepAlive = setInterval(() => {}, 1_000);
try {
  const plugin = satteriRenderDiagram();
  const ascii = await plugin.code({
    lang: "d2",
    meta: "ascii",
    value: 'input: "A & B"\noutput: "Result"\ninput -> output',
  });

  assert.match(ascii.rawHtml, /^<pre class="diagram-ascii"><code>/);
  assert.match(ascii.rawHtml, /┌/);
  assert.match(ascii.rawHtml, /A &amp; B/);
  assert.doesNotMatch(ascii.rawHtml, /<figure class="diagram-static">/);

  const untouched = await plugin.code({ lang: "text", value: "input -> output" });
  assert.equal(untouched, undefined);

  console.log("PASS D2 ASCII output renders as escaped plain text");
} finally {
  clearInterval(keepAlive);
}
