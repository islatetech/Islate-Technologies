import Image from "next/image";
import Link from "next/link";

const RATIO = 600 / 242;

/**
 * The official iSLate wordmark. The source file has a white background, so on
 * light surfaces it is multiplied in and on dark surfaces it is inverted and
 * screened, which keeps the chrome finish without a visible box.
 */
export function Logo({ tone = "light", height = 40 }: { tone?: "light" | "dark"; height?: number }) {
  const width = Math.round(height * RATIO);
  return (
    <Link href="/" aria-label="iSLate Technologies home" className="inline-block shrink-0">
      <Image
        src="/brand/logo.webp"
        alt="iSLate"
        width={600}
        height={242}
        priority
        style={{
          width,
          height,
          mixBlendMode: tone === "light" ? "multiply" : "screen",
          filter: tone === "dark" ? "invert(1) brightness(1.15)" : undefined,
        }}
      />
    </Link>
  );
}
