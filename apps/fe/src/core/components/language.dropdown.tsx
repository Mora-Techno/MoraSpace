'use client';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/atoms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { getLanguageName, Language } from '@/configs/i18n.config';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageDropdown({ className }: { className?: string }) {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={
            className ||
            'flex items-center gap-1 rounded-xl border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted/80 shadow-xs cursor-pointer select-none'
          }
        >
          <span>{currentLanguage.toUpperCase()}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang: Language) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            className="cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <span>{getLanguageName(lang)}</span>
            {currentLanguage === lang && (
              <span className="text-[11px] font-bold text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageDropdown;
