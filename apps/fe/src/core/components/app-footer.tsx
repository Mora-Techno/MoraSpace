'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTheme } from '@/core/providers/theme.provider';
import { useTranslation } from '@/pkg/i18n';

export default function AppFooter() {
  const { theme } = useTheme();
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-border/60 bg-background/80 px-6 py-16 md:px-12 lg:px-16 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 mb-16">
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/home" className="inline-flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                <Image
                  src="/images/logo.png"
                  alt="Spaces Logo"
                  width={20}
                  height={20}
                  className="rounded-full aspect-square"
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base tracking-tight text-foreground">Spaces</span>
                <span className="text-xs font-medium text-muted-foreground">by Mora</span>
              </div>
            </Link>

            <h3 className="font-serif text-lg font-semibold text-foreground">
              {t('footer.tagline', { defaultValue: 'One Workspace. Better Work.' })}
            </h3>

            <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
              {t('footer.description', {
                defaultValue:
                  'Ruang kerja digital yang mengutamakan ketenangan mental, fokus literer, dan kolaborasi tanpa distraksi.',
              })}
            </p>
          </div>

          {/* Navigation Links Columns (4 columns) */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
            {/* Produk */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground">
                {t('footer.products', { defaultValue: 'Produk' })}
              </h4>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="#fitur" className="hover:text-foreground transition-colors">
                    {t('footer.featured', { defaultValue: 'Fitur Unggulan' })}
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-foreground transition-colors">
                    {t('footer.doc_editor', { defaultValue: 'Editor Dokumen' })}
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-foreground transition-colors">
                    {t('footer.calendar', { defaultValue: 'Kalender & Ritme' })}
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="hover:text-foreground transition-colors">
                    {t('footer.focus_mode', { defaultValue: 'Mode Fokus' })}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solusi */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground">
                Solusi
              </h4>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="#untuk-tim" className="hover:text-foreground transition-colors">
                    Untuk Studio Desain
                  </Link>
                </li>
                <li>
                  <Link href="#untuk-tim" className="hover:text-foreground transition-colors">
                    Untuk Penulis & Riset
                  </Link>
                </li>
                <li>
                  <Link href="#untuk-tim" className="hover:text-foreground transition-colors">
                    Untuk Tim Produk
                  </Link>
                </li>
                <li>
                  <Link href="#untuk-tim" className="hover:text-foreground transition-colors">
                    Untuk Agensi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sumber Daya */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground">
                {t('footer.resources_col', { defaultValue: 'Sumber Daya' })}
              </h4>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="#cara-kerja" className="hover:text-foreground transition-colors">
                    {t('footer.guides', { defaultValue: 'Buku Panduan' })}
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-foreground transition-colors">
                    {t('footer.help', { defaultValue: 'Pertanyaan Umum' })}
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-foreground transition-colors">
                    Jurnal Mora
                  </Link>
                </li>
                <li>
                  <Link href="/resource" className="hover:text-foreground transition-colors">
                    Status Layanan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Perusahaan */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground">
                {t('footer.company', { defaultValue: 'Perusahaan' })}
              </h4>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="/home" className="hover:text-foreground transition-colors">
                    {t('footer.about', { defaultValue: 'Tentang Kami' })}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    {t('footer.manifesto', { defaultValue: 'Manifesto' })}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    {t('footer.privacy', { defaultValue: 'Kebijakan Privasi' })}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    {t('footer.contact', { defaultValue: 'Kontak' })}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            {t('footer.copyright', {
              defaultValue: 'Spaces © 2025. Hak cipta dilindungi undang-undang.',
            })}
          </p>
          <div className="flex items-center gap-2">
            <span>Dirancang untuk ketenangan kerja di Asia Tenggara</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {theme === 'dark' ? 'Midnight Calm' : 'Botanical Light'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
