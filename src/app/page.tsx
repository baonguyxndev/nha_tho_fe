
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import { auth } from "@/auth";
import HomePage from "@/components/layout/homepage";

export default async function Home() {
  const session = await auth();
  console.log(">>> session000: ", session);
  return (
    <div>
      <HomePage />
    </div>
  );
}
