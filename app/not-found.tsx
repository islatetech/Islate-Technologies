import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-ink px-6 pt-[var(--header-h)] text-center text-white">
      <div>
        <p className="eyebrow !text-silver">Error 404</p>
        <h1 className="display mt-5 text-[clamp(2.6rem,6vw,5rem)]">This page is not on the board.</h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-white/65">
          The link may be old or the page may have moved. Head back and keep browsing.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-light">
            Back to home
          </Link>
          <Link href="/shop" className="btn btn-outline-light">
            Shop products
          </Link>
        </div>
      </div>
    </section>
  );
}
