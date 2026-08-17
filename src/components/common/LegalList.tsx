import type { LegalListItem } from "@/lib/legalTypes";

function Dot() {
  return (
    <span
      className="mt-2 h-1.5 w-1.5 flex-none rounded-full"
      style={{ backgroundColor: "#4caf50" }}
    />
  );
}

export default function LegalList({ items }: { items: (string | LegalListItem)[] }) {
  return (
    <ul className="mt-2 space-y-2.5">
      {items.map((item, i) => {
        const isRich = typeof item !== "string";
        const text = isRich ? item.text : item;
        const sublist = isRich ? item.sublist : undefined;
        return (
          <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
            <Dot />
            <span>
              {text}
              {sublist && (
                <ul className="mt-2 space-y-1.5">
                  {sublist.map((sub, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-500 text-sm">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-gray-300" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
