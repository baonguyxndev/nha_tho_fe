import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import styles from "./styles/index.module.css";

import "@/app/globals.css";
import NextAuthWrapper from "@/library/next.auth.wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giáo Xứ Tân Trang",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <div className={styles.firstHeader}>
          <div className={styles.bannerSlide}>
            <Link href="#">
              <img src="" alt="" className="img-head" style={{ width: "100%", height: "80px" }} />
            </Link>
          </div>
        </div>
        <header className={styles.header}>
          <nav>
            <ul className={styles.nav__links}>
              <li>
                <Link href="#">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="#">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="#">
                  Năm phục vụ giới trẻ
                </Link>
              </li>
              <li>
                <Link href="#">
                  Mục vụ thiếu nhi
                </Link>
              </li>
              <li>
                <Link href="#">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="#">
                  Lời Chúa
                </Link>
              </li>
              <li>
                <Link href="#">
                  Danh mục
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        {/* End of header */}
        <AntdRegistry>{children}</AntdRegistry>
        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footer__container}>
            <div className={styles.row}>
              <div className={styles.footer__col}>
                <h4>Giáo xứ Tân Trang</h4>
                <ul className={styles.ul__list}>
                  <li>
                    <a href={"#"}>
                      About
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      Our services
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      privacy policy
                    </a>
                  </li>
                  <li>
                    <a href={"#"}>
                      affilate program
                    </a>
                  </li>
                </ul>
              </div>
              <div className={styles.footer__col}>
                <h4>Địa chỉ</h4>
                <ul className={styles.ul__list}>
                  <li>
                    <a href={"#"}>
                      32 Tân Xuân, Phường 8, Quận Tân Bình, Thành phố Hồ Chí Minh
                    </a>
                  </li>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.310541418245!2d106.65006127588376!3d10.787510658987475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eb5f441514d%3A0x63828e704877011c!2zTmjDoCB0aOG7nSBUw6JuIFRyYW5n!5e0!3m2!1svi!2s!4v1722680754472!5m2!1svi!2s" width="600" height="450" loading="lazy"></iframe>
                </ul>
              </div>
              <div className={styles.footer__col}>
                <h4>Theo dõi tại nhà</h4>
                <div className={styles.social__links}>
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
              <a href={"#"} id={styles.back_to_top}>
                <i className="fas fa-arrow-up"></i>
              </a>
            </div>
          </div>
        </footer>
        {/* End of footer */}

        {/* JAVASCRIPT */}
        <Script src="https://kit.fontawesome.com/52df58e152.js" crossOrigin="anonymous"></Script>
        {/* <Script src="/js/basic.js" async defer></Script> */}
        {/* End of JAVASCRIPT */}
        <AntdRegistry>
          <NextAuthWrapper>{children}</NextAuthWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
