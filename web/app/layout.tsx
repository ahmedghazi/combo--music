import "./styles/index.scss";
import "./global.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import website from "./config/website";
import { PageContextProvider } from "./context/PageContext";
import { getSettings } from "./sanity-api/sanity-queries";
import { LocaleContextProvider } from "./context/LocaleContext";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import CookieConsent from "./components/ui/CookieConsent";

export const metadata = {
  metadataBase: new URL(website.url),
  title: {
    template: `%s — ${website.title}`,
  },
  description: website.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang='fr'>
      <body className={"is-loading"} data-theme='theme-xyz'>
        <LocaleContextProvider>
          <PageContextProvider>
            <div id='page'>
              <Header settings={settings} />
              <main>{children}</main>
              <Footer settings={settings} />
              {(await draftMode()).isEnabled && <VisualEditing />}
              <CookieConsent legals={settings.legalsUrl} />
            </div>
          </PageContextProvider>
        </LocaleContextProvider>
      </body>
    </html>
  );
}
