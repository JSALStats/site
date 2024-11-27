import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body
                className={clsx(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
