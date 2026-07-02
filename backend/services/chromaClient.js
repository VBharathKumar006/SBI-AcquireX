import logger from "./logger.js";

export async function searchProductsVector(query, products) {
  const chromaUrl = process.env.CHROMA_URL;

  if (chromaUrl) {
    try {
      const res = await fetch(`${chromaUrl}/api/v1/collections/sbi-products/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query_texts: [query], n_results: 5 })
      });
      if (res.ok) {
        const data = await res.json();
        logger.info("ChromaDB query succeeded", { query });
        return data;
      }
    } catch (err) {
      logger.warn("ChromaDB query failed — using local fallback", { error: err.message });
    }
  }

  return localVectorSearch(query, products);
}

function tokenize(text) {
  return String(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function vectorize(text) {
  return tokenize(text).reduce((vec, tok) => { vec[tok] = (vec[tok] || 0) + 1; return vec; }, {});
}

function cosineSimilarity(a, b) {
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  let dot = 0, ma = 0, mb = 0;
  for (const k of keys) {
    const va = a[k] || 0, vb = b[k] || 0;
    dot += va * vb; ma += va * va; mb += vb * vb;
  }
  return ma && mb ? dot / (Math.sqrt(ma) * Math.sqrt(mb)) : 0;
}

function localVectorSearch(query, products) {
  const qVec = vectorize(query);
  return products
    .map((p) => {
      const text = [p.name, p.category, ...(p.goals || []), ...(p.benefits || [])].join(" ");
      return { ...p, score: Number(cosineSimilarity(qVec, vectorize(text)).toFixed(3)) };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
}
