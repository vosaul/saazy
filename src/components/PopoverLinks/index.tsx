import { SvgComponent } from "@camome/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Popover from "@/components/Popover";

import styles from "./styles.module.scss";

export type PopoverLinksProps = {
  title: string;
  links: { href: string; label: string; Icon: SvgComponent }[];
};

export default function PopoverLinks({ title, links }: PopoverLinksProps) {
  return (
    <Popover
      button={
        <span className={styles.button}>
          <span>{title}</span>
          <ChevronDownIcon />
        </span>
      }
      content={({ close }) => (
        <ul className={styles.linkList}>
          {links.map(({ label, href, Icon }) => (
            <li key={href}>
              <Link href={href} onClick={close} className={styles.link}>
                <Icon />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    />
  );
}
