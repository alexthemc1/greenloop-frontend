import ContentLoader from "react-content-loader";

export default function ProductSkeleton() {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={300}
      viewBox="0 0 300 300"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="10" ry="10" width="300" height="180" />
      <rect x="10" y="200" rx="4" ry="4" width="200" height="15" />
      <rect x="10" y="230" rx="4" ry="4" width="100" height="15" />
      
    </ContentLoader>
  );
}