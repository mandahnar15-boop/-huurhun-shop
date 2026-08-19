/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ttngmmbanbabnqogjfal.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // 상품 사진을 여러 장 한 번에 업로드하는 관리자 상품 등록/수정 폼이 기본 1MB 제한을 넘어서 늘림
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
