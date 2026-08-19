import Link from "next/link";

// 4단 푸터 + 하단 저작권 행
export default function Footer({ dict, locale }) {
  return (
    <footer className="border-t border-hairline bg-canvas px-6 pt-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 pb-12 sm:grid-cols-4">
        {dict.footer.columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <p className="text-base font-medium text-ink">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => {
                const isExternal = link.href.startsWith("http");
                const href = link.href.startsWith("/") ? `/${locale}${link.href}` : link.href;
                return (
                  <li key={link.label}>
                    <Link
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium text-mute hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 border-t border-hairline py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[9px] font-medium text-mute">{dict.footer.copyright}</p>
        <div className="flex gap-4">
          <Link href={`/${locale}/terms`} className="text-[10px] font-medium text-mute hover:text-ink">
            {dict.footer.terms}
          </Link>
          <Link href={`/${locale}/privacy`} className="text-[10px] font-medium text-mute hover:text-ink">
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
