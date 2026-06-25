import { useState } from "react";

export default function SmartImage({
  src,
  alt,
  nameSeed,
  className = "",
}) {
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(
    nameSeed || alt || "product"
  )}/600/400`;

  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(fallback)}
    />
  );
}