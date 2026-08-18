import { getDictionary } from "@/dictionaries";

export default async function SizeGuidePage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const { title, intro, clothingTitle, clothingHeaders, clothingRows, freeSizeNote, shoeTitle, shoeNote } =
    dict.pages.sizeGuide;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-4 text-[32px] font-medium text-ink">{title}</h1>
      <p className="mb-10 text-sm font-medium leading-6 text-mute">{intro}</p>

      <h2 className="mb-4 text-base font-medium text-ink">{clothingTitle}</h2>
      <div className="mb-3 overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline">
              {clothingHeaders.map((header) => (
                <th key={header} className="py-3 pr-4 font-medium text-ink">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clothingRows.map((row) => (
              <tr key={row[0]} className="border-b border-hairline">
                {row.map((cell, i) => (
                  <td key={i} className="py-3 pr-4 font-medium text-mute first:text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-10 text-xs font-medium text-mute">{freeSizeNote}</p>

      <h2 className="mb-3 text-base font-medium text-ink">{shoeTitle}</h2>
      <p className="text-sm font-medium leading-6 text-mute">{shoeNote}</p>
    </main>
  );
}
