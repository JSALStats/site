import { Link } from "@nextui-org/react";
import { FaHome } from "react-icons/fa";
import { button as buttonStyles } from "@nextui-org/theme";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title({ color: "violet" })}>Whoops</span>
                    <br />
                    <span className={title()}>This page does not exist!</span>
                    <div className={subtitle({ class: "mt-4" })}>
                        Please go back home
                    </div>
                </div>

                <Link
                    isExternal
                    className={buttonStyles({
                        variant: "bordered",
                        radius: "full",
                    })}
                    href="/"
                >
                    <FaHome size={20} />
                    Go home
                </Link>
            </section>
        </DefaultLayout>
    );
}
