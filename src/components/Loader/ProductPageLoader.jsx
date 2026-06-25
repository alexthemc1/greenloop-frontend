import ContentLoader from "react-content-loader";

export default function ProductPageLoader() {
  return (
    <div className="md:max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
      <ContentLoader
        speed={2}
        width="100%"
        height={400}
        viewBox="0 0 400 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="10" ry="10" width="600" height="600" />
      </ContentLoader>

      <ContentLoader
        speed={2}
        width="100%"
        height={400}
        viewBox="0 0 400 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="10" rx="4" ry="4" width="120" height="15" />
        <rect x="0" y="40" rx="4" ry="4" width="250" height="25" />
        <rect x="0" y="80" rx="4" ry="4" width="180" height="20" />

        <rect x="0" y="130" rx="4" ry="4" width="350" height="10" />
        <rect x="0" y="150" rx="4" ry="4" width="320" height="10" />
        <rect x="0" y="170" rx="4" ry="4" width="300" height="10" />

        <rect x="0" y="220" rx="6" ry="6" width="150" height="40" />
      </ContentLoader>
    </div>

  );
}