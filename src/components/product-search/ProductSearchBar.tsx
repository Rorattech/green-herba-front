"use client";

import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "../ui/Input";

const SEARCH_PARAM = "q";
const FOCUS_PARAM = "focus";

export function ProductSearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get(SEARCH_PARAM) ?? "";
  const shouldFocus = searchParams.get(FOCUS_PARAM) === "search";

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
      const next = new URLSearchParams(searchParams.toString());
      next.delete(FOCUS_PARAM);
      const url = next.toString() ? `${pathname}?${next}` : pathname;
      window.history.replaceState(null, "", url);
    }
  }, [shouldFocus, pathname, searchParams]);

  const updateQuery = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      next.set(SEARCH_PARAM, value);
    } else {
      next.delete(SEARCH_PARAM);
    }
    const url = next.toString() ? `${pathname}?${next}` : pathname;
    router.replace(url, { scroll: false });
  };

  const clearSearch = () => {
    updateQuery("");
    inputRef.current?.focus();
  };

  return (
    <Input
      className="md:h-[58px]"
      ref={inputRef}
      type="search"
      placeholder="Buscar produtos..."
      value={query}
      onChange={(e) => updateQuery(e.target.value)}
      colorTheme="light"
      iconLeft={<Search size={20} strokeWidth={1.5} />}
      iconRight={
        query ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Limpar busca"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        ) : null
      }
    />
  );
}