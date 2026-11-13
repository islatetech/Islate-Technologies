"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "./Icons";

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * The site's own dropdown. It replaces the browser's built in select so every
 * list looks the same. Works with the keyboard (arrows, Home, End, Enter,
 * Escape, and typing to jump), closes when you click away, and carries a
 * hidden input so it still submits with a normal form.
 */
export function Select({
  options,
  value,
  defaultValue = "",
  onChange,
  name,
  id,
  placeholder = "Select",
  variant = "field",
  invalid,
  ariaLabel,
}: {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  variant?: "field" | "pill";
  invalid?: boolean;
  ariaLabel?: string;
}) {
  const auto = useId();
  const listId = `${id ?? auto}-list`;
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const selected = options.find((o) => o.value === current);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  }, []);

  const choose = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
    close();
  };

  const openList = () => {
    const i = options.findIndex((o) => o.value === current);
    setActive(i >= 0 ? i : 0);
    setOpen(true);
  };

  // close when the pointer goes down anywhere else
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[active]) choose(options[active].value);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const now = Date.now();
          typed.current.text = now - typed.current.at > 700 ? e.key.toLowerCase() : typed.current.text + e.key.toLowerCase();
          typed.current.at = now;
          const from = typed.current.text.length > 1 ? active : active + 1;
          const hit = [...options.slice(from), ...options.slice(0, from)].find((o) => o.label.toLowerCase().startsWith(typed.current.text));
          if (hit) setActive(options.indexOf(hit));
        }
    }
  };

  const pill = variant === "pill";

  return (
    <div ref={root} className={`relative ${pill ? "inline-block" : "block"}`}>
      {name && <input type="hidden" name={name} value={current} />}
      <button
        ref={button}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onKeyDown}
        className={
          pill
            ? `flex h-11 cursor-pointer items-center justify-between gap-4 rounded-full border bg-white pl-5 pr-4 font-medium transition-colors ${
                open ? "border-ink" : "border-ink/10 hover:border-ink"
              }`
            : `field flex cursor-pointer items-center justify-between gap-3 text-left ${open ? "!border-ink shadow-[0_0_0_4px_rgba(10,10,11,0.08)]" : ""} ${
                invalid ? "!border-[#d33]" : ""
              }`
        }
      >
        <span className={selected ? "" : "text-[#9a9da4]"}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <ul
        ref={list}
        id={listId}
        role="listbox"
        tabIndex={-1}
        className={`absolute z-40 mt-2 max-h-[17rem] min-w-full origin-top overflow-y-auto rounded-2xl border border-ink/12 bg-white p-1.5 transition-all duration-200 ${
          pill ? "right-0 w-max" : "left-0 right-0"
        } ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"}`}
      >
        {options.map((o, i) => {
          const isSelected = o.value === current;
          return (
            <li
              key={o.value}
              data-i={i}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(o.value)}
              className={`flex cursor-pointer items-center justify-between gap-6 rounded-xl px-3.5 py-2.5 text-[15px] transition-colors ${
                active === i ? "bg-mist" : ""
              } ${isSelected ? "font-semibold" : "font-medium text-ink/80"}`}
            >
              <span className="whitespace-nowrap">{o.label}</span>
              {isSelected && <Check size={16} className="shrink-0" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
