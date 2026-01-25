export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "삼활인",
    "alternateName": "Samhwalin",
    "url": "https://samhwalin.org",
    "logo": "https://samhwalin.org/logo.png",
    "description": "유한한 삶을 기억하며 주어진 삶을 사랑하고 매일의 활력을 되찾는 지역과 세대 간 네트워킹 문화를 만들어갑니다",
    "sameAs": [
      "https://www.instagram.com/samhwalin",
      "https://www.youtube.com/@samhwalin"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@samhwalin.org",
      "contactType": "customer service"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "삼활인",
    "url": "https://samhwalin.org",
    "description": "유한한 삶을 기억하며 주어진 삶을 사랑하고 매일의 활력을 되찾는 지역과 세대 간 네트워킹 문화를 만들어갑니다",
    "publisher": {
      "@type": "Organization",
      "name": "삼활인",
      "logo": {
        "@type": "ImageObject",
        "url": "https://samhwalin.org/logo.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
